package cl.glowlab.control3.service;

import cl.glowlab.control3.model.*;
import cl.glowlab.control3.repo.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CatalogoService {
    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final DetalleBoletaRepository detalles;

    public CatalogoService(CategoriaRepository categorias, ProductoRepository productos, DetalleBoletaRepository detalles) {
        this.categorias = categorias; this.productos = productos; this.detalles = detalles;
    }
    public record CategoriaDatos(String nombre) {}
    public record ProductoDatos(String codigo, String nombre, String descripcion, Long precio,
        Integer stock, Integer stockCritico, Long categoriaId, String imagen,
        String estado, String ofertaTipo, Integer descuentoPorcentaje) {}

    private ResponseStatusException error(HttpStatus status, String mensaje) {
        return new ResponseStatusException(status, mensaje);
    }
    private String requerido(String campo, String nombre, int maximo) {
        if (campo == null || campo.trim().isEmpty() || campo.trim().length() > maximo)
            throw error(HttpStatus.BAD_REQUEST, "Campo obligatorio o demasiado largo: "+nombre);
        return campo.trim();
    }
    @Transactional(readOnly = true)
    public List<Map<String,Object>> listarCategorias() {
        return categorias.findAll().stream().sorted(Comparator.comparing(c -> c.id)).map(Vistas::categoria).toList();
    }
    @Transactional
    public Map<String,Object> crearCategoria(CategoriaDatos data) {
        String nombre = requerido(data.nombre(), "nombre", 50);
        if(categorias.findByNombreIgnoreCase(nombre).isPresent()) throw error(HttpStatus.CONFLICT,"La categoría ya existe.");
        Categoria c = new Categoria(); c.nombre = nombre;
        return Vistas.categoria(categorias.save(c));
    }
    @Transactional
    public Map<String,Object> editarCategoria(Long id, CategoriaDatos data) {
        Categoria c = categorias.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Categoría no encontrada."));
        String nombre = requerido(data.nombre(),"nombre",50);
        if(categorias.findByNombreIgnoreCase(nombre).filter(v -> !v.id.equals(id)).isPresent())
            throw error(HttpStatus.CONFLICT,"La categoría ya existe.");
        c.nombre = nombre; return Vistas.categoria(categorias.save(c));
    }
    @Transactional
    public void eliminarCategoria(Long id) {
        if(!categorias.existsById(id)) throw error(HttpStatus.NOT_FOUND,"Categoría no encontrada.");
        if(productos.existsByCategoriaId(id)) throw error(HttpStatus.CONFLICT,"No se puede eliminar una categoría con productos.");
        categorias.deleteById(id);
    }
    @Transactional(readOnly = true)
    public List<Map<String,Object>> listarProductos(String search, Long categoriaId) {
        String texto = search == null ? "" : search.strip().toLowerCase(Locale.ROOT);
        return productos.findAll().stream()
          .filter(p -> texto.isEmpty() || p.nombre.toLowerCase(Locale.ROOT).contains(texto))
          .filter(p -> categoriaId == null || p.categoria.id.equals(categoriaId))
          .sorted(Comparator.comparing(p -> p.codigo)).map(Vistas::producto).toList();
    }
    @Transactional(readOnly = true)
    public Map<String,Object> obtenerProducto(String codigo) {
        return Vistas.producto(productos.findById(codigo).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Producto no encontrado.")));
    }
    private Producto aplicar(Producto p, ProductoDatos d) {
        p.nombre = requerido(d.nombre(),"nombre",100);
        p.descripcion = requerido(d.descripcion(),"descripción",800);
        if(d.precio() == null || d.precio() < 1) throw error(HttpStatus.BAD_REQUEST,"El precio debe ser mayor que cero.");
        if(d.stock() == null || d.stock() < 0 || d.stockCritico() == null || d.stockCritico() < 0)
            throw error(HttpStatus.BAD_REQUEST,"El stock debe ser igual o mayor que cero.");
        p.precio=d.precio();p.stock=d.stock();p.stockCritico=d.stockCritico();
        p.categoria=categorias.findById(d.categoriaId()==null ? -1L : d.categoriaId())
          .orElseThrow(() -> error(HttpStatus.BAD_REQUEST,"La categoría seleccionada no existe."));
        p.imagen=d.imagen()==null?"":d.imagen().strip();
        if(p.imagen.length()>200) throw error(HttpStatus.BAD_REQUEST,"La ruta de la imagen es demasiado larga.");
        p.estado=d.estado()==null?"Activo":d.estado();
        if(!Set.of("Activo","Inactivo").contains(p.estado)) throw error(HttpStatus.BAD_REQUEST,"Estado inválido.");
        p.ofertaTipo=d.ofertaTipo()==null?"ninguna":d.ofertaTipo();
        if(!Set.of("ninguna","2x1","porcentaje").contains(p.ofertaTipo)) throw error(HttpStatus.BAD_REQUEST,"Oferta inválida.");
        p.descuentoPorcentaje="porcentaje".equals(p.ofertaTipo) ? (d.descuentoPorcentaje()==null?0:d.descuentoPorcentaje()) : 0;
        if("porcentaje".equals(p.ofertaTipo) && (p.descuentoPorcentaje<1 || p.descuentoPorcentaje>90))
            throw error(HttpStatus.BAD_REQUEST,"El descuento debe estar entre 1 y 90 %.");
        return p;
    }
    @Transactional
    public Map<String,Object> crearProducto(ProductoDatos d) {
        String codigo=requerido(d.codigo(),"código",20);
        if(productos.existsById(codigo)) throw error(HttpStatus.CONFLICT,"El código del producto ya existe.");
        Producto p=new Producto(); p.codigo=codigo;
        return Vistas.producto(productos.save(aplicar(p,d)));
    }
    @Transactional
    public Map<String,Object> editarProducto(String codigo,ProductoDatos d) {
        Producto p=productos.findById(codigo).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Producto no encontrado."));
        if(d.codigo()!=null && !codigo.equals(d.codigo())) throw error(HttpStatus.BAD_REQUEST,"No se puede cambiar el código.");
        return Vistas.producto(productos.save(aplicar(p,d)));
    }
    @Transactional
    public void eliminarProducto(String codigo) {
        if(!productos.existsById(codigo)) throw error(HttpStatus.NOT_FOUND,"Producto no encontrado.");
        if(detalles.existsByProductoCodigo(codigo)) throw error(HttpStatus.CONFLICT,"Producto asociado a ventas; desactívalo para conservar el historial.");
        productos.deleteById(codigo);
    }
}
