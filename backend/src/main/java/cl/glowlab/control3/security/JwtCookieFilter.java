package cl.glowlab.control3.security;

import cl.glowlab.control3.model.Usuario;
import cl.glowlab.control3.repo.UsuarioRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtCookieFilter extends OncePerRequestFilter {
    private final JwtService jwt;
    private final UsuarioRepository usuarios;
    public JwtCookieFilter(JwtService jwt,UsuarioRepository usuarios){this.jwt=jwt;this.usuarios=usuarios;}
    @Override
    protected void doFilterInternal(HttpServletRequest req,HttpServletResponse resp,FilterChain chain)
      throws ServletException,IOException {
        Cookie[] cookies=req.getCookies();
        if(cookies!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            for(Cookie cookie:cookies){
                if(!"glowlab_access".equals(cookie.getName()))continue;
                try {
                    String correo=jwt.validar(cookie.getValue(),"access");
                    Optional<Usuario> u=usuarios.findByCorreoIgnoreCase(correo);
                    if(u.isPresent() && "Activo".equals(u.get().estado) && u.get().claveHash!=null){
                        UsernamePasswordAuthenticationToken auth=
                            new UsernamePasswordAuthenticationToken(
                              u.get().correo,null,
                              List.of(new SimpleGrantedAuthority("ROLE_"+u.get().rol.name())));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }catch(JwtException | IllegalArgumentException ex){
                    SecurityContextHolder.clearContext();
                }
                break;
            }
        }
        chain.doFilter(req,resp);
    }
}
