package cl.glowlab.control3.api;

import cl.glowlab.control3.service.BoletasService;
import java.security.Principal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/boletas")
public class BoletaController {
    private final BoletasService servicio;
    public BoletaController(BoletasService servicio){this.servicio=servicio;}
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','CLIENTE')")
    public Map<String,Object> comprar(@RequestBody BoletasService.Compra datos,Principal principal){
        return servicio.comprar(principal.getName(),datos);
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','VENDEDOR')")
    public List<Map<String,Object>> listar(){return servicio.listar();}
    @GetMapping("/mis")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','CLIENTE')")
    public List<Map<String,Object>> propias(Principal principal){return servicio.propias(principal.getName());}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','VENDEDOR')")
    public Map<String,Object> una(@PathVariable Long id){return servicio.obtener(id);}
}
