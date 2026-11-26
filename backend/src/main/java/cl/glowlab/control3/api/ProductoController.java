package cl.glowlab.control3.api;

import cl.glowlab.control3.service.CatalogoService;
import java.net.URI;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    private final CatalogoService servicio;
    public ProductoController(CatalogoService servicio) { this.servicio=servicio; }

    @GetMapping
    public List<Map<String,Object>> listar(@RequestParam(required=false) String search,
            @RequestParam(required=false) Long categoriaId) { return servicio.listarProductos(search,categoriaId); }

    @GetMapping("/{codigo}")
    public Map<String,Object> uno(@PathVariable String codigo) { return servicio.obtenerProducto(codigo); }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String,Object>> crear(@RequestBody CatalogoService.ProductoDatos datos) {
        Map<String,Object> producto=servicio.crearProducto(datos);
        return ResponseEntity.created(URI.create("/api/v1/productos/"+producto.get("codigo"))).body(producto);
    }
    @PutMapping("/{codigo}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Map<String,Object> editar(@PathVariable String codigo,@RequestBody CatalogoService.ProductoDatos datos) {
        return servicio.editarProducto(codigo,datos);
    }
    @DeleteMapping("/{codigo}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> borrar(@PathVariable String codigo) {
        servicio.eliminarProducto(codigo); return ResponseEntity.noContent().build();
    }
}
