package cl.glowlab.control3.api;

import cl.glowlab.control3.model.Usuario;
import cl.glowlab.control3.repo.UsuarioRepository;
import cl.glowlab.control3.security.JwtService;
import cl.glowlab.control3.service.*;
import jakarta.servlet.http.*;
import java.security.Principal;
import java.time.Duration;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UsuariosService usuarios;
    private final UsuarioRepository repositorio;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final boolean secure;
    public AuthController(UsuariosService usuarios,UsuarioRepository repositorio,PasswordEncoder encoder,
            JwtService jwt,@Value("${app.security.cookie-secure}") boolean secure){
        this.usuarios=usuarios;this.repositorio=repositorio;this.encoder=encoder;this.jwt=jwt;this.secure=secure;
    }
    public record Login(String correo,String password){}
    private ResponseCookie cookie(String nombre,String valor,Duration duracion){
        return ResponseCookie.from(nombre,valor).httpOnly(true).secure(secure)
          .sameSite("Strict").path("/api/v1").maxAge(duracion).build();
    }
    private ResponseEntity<Map<String,Object>> sesion(Usuario u){
        return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE,cookie("glowlab_access",jwt.crear(u.correo,"access"),Duration.ofMinutes(30)).toString())
          .header(HttpHeaders.SET_COOKIE,cookie("glowlab_refresh",jwt.crear(u.correo,"refresh"),Duration.ofDays(7)).toString())
          .body(Map.of("usuario",Vistas.usuario(u)));
    }
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> registro(@RequestBody UsuariosService.Datos datos) {return usuarios.registro(datos);}
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody Login datos){
        if(datos==null || datos.correo()==null || datos.password()==null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Completa correo y contraseña.");
        Usuario u=repositorio.findByCorreoIgnoreCase(datos.correo().trim())
          .orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales incorrectas."));
        if(!"Activo".equals(u.estado)||u.claveHash==null||!encoder.matches(datos.password(),u.claveHash))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales incorrectas.");
        return sesion(u);
    }
    @PostMapping("/refresh")
    public ResponseEntity<Map<String,Object>> renovar(HttpServletRequest req){
        String token=Arrays.stream(req.getCookies()==null?new Cookie[0]:req.getCookies())
            .filter(c->"glowlab_refresh".equals(c.getName())).map(Cookie::getValue)
            .findFirst().orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sesión vencida."));
        String correo;
        try{correo=jwt.validar(token,"refresh");}
        catch(Exception ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sesión vencida.");}
        Usuario u=usuarios.usuarioPorCorreo(correo);
        if(!"Activo".equals(u.estado)||u.claveHash==null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sesión vencida.");
        return sesion(u);
    }
    @PostMapping("/logout")
    public ResponseEntity<Map<String,Object>> salir(){
        return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE,cookie("glowlab_access","",Duration.ZERO).toString())
          .header(HttpHeaders.SET_COOKIE,cookie("glowlab_refresh","",Duration.ZERO).toString())
          .body(Map.of("ok",true));
    }
    @GetMapping("/me")
    public Map<String,Object> actual(Principal principal){
        return Vistas.usuario(usuarios.usuarioPorCorreo(principal.getName()));
    }
    @PutMapping("/perfil")
    public Map<String,Object> perfil(@RequestBody UsuariosService.Datos datos,Principal principal){
        return usuarios.editarPerfil(principal.getName(),datos);
    }
}
