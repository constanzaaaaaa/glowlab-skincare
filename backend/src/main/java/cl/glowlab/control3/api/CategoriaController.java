package cl.glowlab.control3.api;

import cl.glowlab.control3.service.CatalogoService;
import java.net.URI;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    private final CatalogoService servicio;
    public CategoriaController(CatalogoService servicio) { this.servicio=servicio; }
    @GetMapping
    public List<Map<String,Object>> listar() { return servicio.listarCategorias(); }
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String,Object>> crear(@RequestBody CatalogoService.CategoriaDatos datos) {
        Map<String,Object> categoria=servicio.crearCategoria(datos);
        return ResponseEntity.created(URI.create("/api/v1/categorias/"+categoria.get("id"))).body(categoria);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Map<String,Object> editar(@PathVariable Long id,@RequestBody CatalogoService.CategoriaDatos datos) {
        return servicio.editarCategoria(id,datos);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> borrar(@PathVariable Long id) { servicio.eliminarCategoria(id);return ResponseEntity.noContent().build(); }
}
