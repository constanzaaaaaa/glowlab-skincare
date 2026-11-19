package cl.glowlab.control3.service;

import cl.glowlab.control3.model.*;
import cl.glowlab.control3.repo.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BoletasService {
    private final BoletaRepository boletas;
    private final ProductoRepository productos;
    private final UsuariosService usuarios;
    public BoletasService(BoletaRepository boletas,ProductoRepository productos,UsuariosService usuarios){
        this.boletas=boletas;this.productos=productos;this.usuarios=usuarios;
    }
    public record Item(String codigo,Integer cantidad){}
    public record Entrega(String nombre,String apellidos,String correo,String telefono,
        String direccion,String departamento,Integer regionId,String region,
        Integer comunaId,String comuna,String referencia){}
    public record Compra(List<Item> items,Entrega entrega){}
    private ResponseStatusException error(HttpStatus code,String msg){return new ResponseStatusException(code,msg);}
    private String requerido(String s,String nombre,int max){
        if(s==null || s.isBlank() || s.trim().length()>max)throw error(HttpStatus.BAD_REQUEST,"Campo de despacho inválido: "+nombre);
        return s.trim();
    }
    @Transactional
    public Map<String,Object> comprar(String correoUsuario,Compra datos) {
        if(datos==null || datos.items()==null || datos.items().isEmpty() || datos.entrega()==null)
            throw error(HttpStatus.BAD_REQUEST,"Faltan productos o datos de despacho.");
        Usuario usuario=usuarios.usuarioPorCorreo(correoUsuario);
        if(usuario.rol==Rol.VENDEDOR)throw error(HttpStatus.FORBIDDEN,"El vendedor solo puede consultar.");
        Entrega e=datos.entrega();
        Boleta boleta=new Boleta();boleta.usuario=usuario;
        boleta.recibeNombre=requerido(e.nombre(),"nombre",50);
        boleta.recibeApellidos=requerido(e.apellidos(),"apellidos",100);
        boleta.recibeCorreo=requerido(e.correo(),"correo",100);
        boleta.recibeTelefono=requerido(e.telefono(),"teléfono",30);
        boleta.recibeDireccion=requerido(e.direccion(),"dirección",200);
        if(e.regionId()==null || e.comunaId()==null || e.regionId()<1 || e.comunaId()<1)
            throw error(HttpStatus.BAD_REQUEST,"Faltan la región o la comuna.");
        boleta.regionId=e.regionId();boleta.comunaId=e.comunaId();
        boleta.region=requerido(e.region(),"región",100);
        boleta.comuna=requerido(e.comuna(),"comuna",100);
        boleta.departamento=e.departamento()==null?"":e.departamento().strip();
        boleta.referencia=e.referencia()==null?"":e.referencia().strip();
        if(boleta.departamento.length()>50 || boleta.referencia.length()>300)
            throw error(HttpStatus.BAD_REQUEST,"Referencia o departamento demasiado largo.");
        Map<String,Integer> cantidades=new TreeMap<>();
        for(Item item:datos.items()) {
            if(item==null || item.codigo()==null || item.cantidad()==null || item.cantidad()<1)
                throw error(HttpStatus.BAD_REQUEST,"Cantidad o producto inválido.");
            cantidades.merge(item.codigo(),item.cantidad(),(a,b)->{
                try{return Math.addExact(a,b);}catch(ArithmeticException ex){throw error(HttpStatus.BAD_REQUEST,"Cantidad excesiva.");}
            });
        }
        long total=0;
        for(var entrada:cantidades.entrySet()){
            Producto p=productos.bloquearPorCodigo(entrada.getKey())
                .orElseThrow(()->error(HttpStatus.NOT_FOUND,"Producto no encontrado: "+entrada.getKey()));
            int n=entrada.getValue();
            if(!"Activo".equals(p.estado)||p.stock<n)throw error(HttpStatus.CONFLICT,"Stock insuficiente de "+p.nombre);
            long original;
            try{original=Math.multiplyExact(p.precio,n);}catch(ArithmeticException ex){throw error(HttpStatus.BAD_REQUEST,"Monto inválido.");}
            long subtotal=original;
            String oferta="";
            if("2x1".equals(p.ofertaTipo)){
                subtotal=p.precio*((n+1L)/2L); oferta="2x1";
            }else if("porcentaje".equals(p.ofertaTipo) && p.descuentoPorcentaje>=1 && p.descuentoPorcentaje<=90){
                long unitario=Math.round(p.precio*(100-p.descuentoPorcentaje)/100.0);
                subtotal=Math.multiplyExact(unitario,n);oferta="-"+p.descuentoPorcentaje+"%";
            }
            try{total=Math.addExact(total,subtotal);}catch(ArithmeticException ex){throw error(HttpStatus.BAD_REQUEST,"Monto inválido.");}
            DetalleBoleta d=new DetalleBoleta();
            d.boleta=boleta;d.producto=p;d.codigo=p.codigo;d.nombre=p.nombre;
            d.cantidad=n;d.precioUnitario=p.precio;d.subtotal=subtotal;d.descuento=original-subtotal;d.oferta=oferta;
            boleta.detalles.add(d);
            p.stock-=n;
        }
        boleta.total=total;
        Boleta guardada=boletas.saveAndFlush(boleta);
        return Vistas.boleta(guardada);
    }
    @Transactional(readOnly=true)
    public List<Map<String,Object>> listar(){return boletas.findAllByOrderByFechaDesc().stream().map(Vistas::boleta).toList();}
    @Transactional(readOnly=true)
    public List<Map<String,Object>> propias(String correo){
        Usuario u=usuarios.usuarioPorCorreo(correo);
        return boletas.findByUsuarioRunOrderByFechaDesc(u.run).stream().map(Vistas::boleta).toList();
    }
    @Transactional(readOnly=true)
    public Map<String,Object> obtener(Long id){
        return Vistas.boleta(boletas.findById(id).orElseThrow(()->error(HttpStatus.NOT_FOUND,"Boleta no encontrada.")));
    }
}
