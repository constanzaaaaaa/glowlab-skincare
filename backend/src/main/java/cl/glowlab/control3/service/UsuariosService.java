package cl.glowlab.control3.service;

import cl.glowlab.control3.model.*;
import cl.glowlab.control3.repo.*;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuariosService {
    private final UsuarioRepository usuarios;
    private final BoletaRepository boletas;
    private final PasswordEncoder encoder;
    public UsuariosService(UsuarioRepository usuarios, BoletaRepository boletas, PasswordEncoder encoder) {
        this.usuarios=usuarios;this.boletas=boletas;this.encoder=encoder;
    }
    public record Datos(String run,String nombre,String apellidos,String correo,String password,
                        String fechaNacimiento,Integer rolId,Integer regionId,Integer comunaId,
                        String direccion,String estado) {}
    private ResponseStatusException error(HttpStatus code,String msg){return new ResponseStatusException(code,msg);}
    private String required(String val,String label,int max) {
        if(val==null || val.isBlank() || val.trim().length()>max) throw error(HttpStatus.BAD_REQUEST,"Campo inválido: "+label);
        return val.trim();
    }
    private static Rol rol(Integer id){return switch(id==null?3:id){case 1->Rol.ADMINISTRADOR;case 2->Rol.VENDEDOR;case 3->Rol.CLIENTE;default->throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Rol inválido.");};}
    private Usuario aplicar(Usuario u,Datos d,boolean admin) {
        u.nombre=required(d.nombre(),"nombre",50);
        u.apellidos=required(d.apellidos(),"apellidos",100);
        String correo=required(d.correo(),"correo",100).toLowerCase(Locale.ROOT);
        if(!correo.matches("^[A-Za-z0-9._%+\\-]+@(gmail\\.com|duocuc\\.cl)$"))
            throw error(HttpStatus.BAD_REQUEST,"El correo debe ser @gmail.com o @duocuc.cl.");
        if(usuarios.findByCorreoIgnoreCase(correo).filter(otro->!otro.run.equals(u.run)).isPresent())
            throw error(HttpStatus.CONFLICT,"Correo ya registrado.");
        u.correo=correo;
        if(d.password()!=null && !d.password().isEmpty()) {
            if(d.password().length()<8 || d.password().length()>72)
                throw error(HttpStatus.BAD_REQUEST,"La contraseña debe tener entre 8 y 72 caracteres.");
            u.claveHash=encoder.encode(d.password());
        }
        if(admin){
            u.rol=rol(d.rolId());
            u.estado=d.estado()==null?"Activo":d.estado();
            if(!Set.of("Activo","Inactivo").contains(u.estado))throw error(HttpStatus.BAD_REQUEST,"Estado inválido.");
        }
        if(d.fechaNacimiento()!=null && !d.fechaNacimiento().isBlank()) {
            try {u.fechaNacimiento=LocalDate.parse(d.fechaNacimiento());}
            catch(Exception ex){throw error(HttpStatus.BAD_REQUEST,"Fecha de nacimiento inválida.");}
        }
        u.regionId=d.regionId();u.comunaId=d.comunaId();
        u.direccion=required(d.direccion(),"dirección",300);
        return u;
    }
    private String validarRun(String run){
        String s=required(run,"RUN",12).toUpperCase(Locale.ROOT);
        if(!s.matches("\\d{6,8}[0-9K]"))throw error(HttpStatus.BAD_REQUEST,"RUN inválido.");
        int suma=0,m=2;for(int i=s.length()-2;i>=0;i--){suma+=Character.digit(s.charAt(i),10)*m;m=m==7?2:m+1;}
        int resto=11-suma%11;String dv=resto==11?"0":resto==10?"K":String.valueOf(resto);
        if(!s.endsWith(dv))throw error(HttpStatus.BAD_REQUEST,"RUN inválido.");
        return s;
    }
    @Transactional
    public Map<String,Object> registro(Datos d){
        String run=validarRun(d.run());
        if(usuarios.existsById(run))throw error(HttpStatus.CONFLICT,"RUN ya registrado.");
        if(d.password()==null || d.password().isBlank())throw error(HttpStatus.BAD_REQUEST,"Contraseña obligatoria.");
        Usuario u=new Usuario();u.run=run;u.rol=Rol.CLIENTE;u.estado="Activo";
        return Vistas.usuario(usuarios.save(aplicar(u,d,false)));
    }
    @Transactional(readOnly=true)
    public List<Map<String,Object>> listar(){return usuarios.findAll().stream().map(Vistas::usuario).toList();}
    @Transactional(readOnly=true)
    public Map<String,Object> obtener(String run){return Vistas.usuario(usuarios.findById(run).orElseThrow(()->error(HttpStatus.NOT_FOUND,"Usuario no encontrado.")));}
    @Transactional
    public Map<String,Object> crearAdmin(Datos d){
        String run=validarRun(d.run());
        if(usuarios.existsById(run))throw error(HttpStatus.CONFLICT,"RUN ya registrado.");
        if(d.password()==null || d.password().isBlank())
            throw error(HttpStatus.BAD_REQUEST,"Indica una contraseña inicial para la nueva cuenta.");
        Usuario u=new Usuario();u.run=run;
        return Vistas.usuario(usuarios.save(aplicar(u,d,true)));
    }
    @Transactional
    public Map<String,Object> editarAdmin(String run,Datos d){
        Usuario u=usuarios.findById(run).orElseThrow(()->error(HttpStatus.NOT_FOUND,"Usuario no encontrado."));
        if(d.run()!=null && !run.equalsIgnoreCase(d.run())) throw error(HttpStatus.BAD_REQUEST,"El RUN no puede cambiar.");
        return Vistas.usuario(usuarios.save(aplicar(u,d,true)));
    }
    @Transactional
    public Map<String,Object> editarPerfil(String correo,Datos d){
        Usuario u=usuarios.findByCorreoIgnoreCase(correo).orElseThrow(()->error(HttpStatus.NOT_FOUND,"Usuario no encontrado."));
        Datos seguro=new Datos(u.run,d.nombre(),d.apellidos(),u.correo,null,
            u.fechaNacimiento==null?null:u.fechaNacimiento.toString(),null,
            u.regionId,u.comunaId,d.direccion(),null);
        return Vistas.usuario(usuarios.save(aplicar(u,seguro,false)));
    }
    @Transactional
    public void eliminar(String run,String actualCorreo){
        Usuario u=usuarios.findById(run).orElseThrow(()->error(HttpStatus.NOT_FOUND,"Usuario no encontrado."));
        if(u.correo.equalsIgnoreCase(actualCorreo))throw error(HttpStatus.CONFLICT,"No puedes eliminar tu propia cuenta.");
        if(!boletas.findByUsuarioRunOrderByFechaDesc(run).isEmpty())
            throw error(HttpStatus.CONFLICT,"Usuario con boletas históricas; desactiva la cuenta.");
        usuarios.delete(u);
    }
    @Transactional(readOnly=true)
    public Usuario usuarioPorCorreo(String correo){
        return usuarios.findByCorreoIgnoreCase(correo).orElseThrow(()->error(HttpStatus.UNAUTHORIZED,"Sesión no válida."));
    }
}
