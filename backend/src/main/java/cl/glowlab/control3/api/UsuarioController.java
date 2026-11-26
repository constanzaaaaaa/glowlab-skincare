package cl.glowlab.control3.api;

import cl.glowlab.control3.service.UsuariosService;
import java.net.URI;
import java.security.Principal;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {
    private final UsuariosService servicio;
    public UsuarioController(UsuariosService servicio){this.servicio=servicio;}
    @GetMapping
    public List<Map<String,Object>> listar(){return servicio.listar();}
    @GetMapping("/{run}")
    public Map<String,Object> uno(@PathVariable String run){return servicio.obtener(run);}
    @PostMapping
    public ResponseEntity<Map<String,Object>> crear(@RequestBody UsuariosService.Datos d){
        Map<String,Object> u=servicio.crearAdmin(d);
        return ResponseEntity.created(URI.create("/api/v1/usuarios/"+u.get("run"))).body(u);
    }
    @PutMapping("/{run}")
    public Map<String,Object> editar(@PathVariable String run,@RequestBody UsuariosService.Datos d){
        return servicio.editarAdmin(run,d);
    }
    @DeleteMapping("/{run}")
    public ResponseEntity<Void> borrar(@PathVariable String run,Principal principal){
        servicio.eliminar(run,principal.getName());return ResponseEntity.noContent().build();
    }
}
