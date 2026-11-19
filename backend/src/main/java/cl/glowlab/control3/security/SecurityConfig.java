package cl.glowlab.control3.security;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    PasswordEncoder encoder(){return new BCryptPasswordEncoder();}
    // El filtro JWT solo debe ejecutarse dentro de Spring Security, no dos veces.
    @Bean
    FilterRegistrationBean<JwtCookieFilter> noRegistrarDosVeces(JwtCookieFilter filtro) {
        FilterRegistrationBean<JwtCookieFilter> registro=new FilterRegistrationBean<>(filtro);
        registro.setEnabled(false);
        return registro;
    }
    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.frontend-origin}") String origen){
        CorsConfiguration config=new CorsConfiguration();
        config.setAllowedOrigins(List.of(origen));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type","X-Requested-With","Accept"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**",config);
        return source;
    }
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,JwtCookieFilter jwt) throws Exception {
        http
          .cors(Customizer.withDefaults())
          // Cookie SameSite=Strict y origen CORS limitado. Para producción agregar protección CSRF explícita.
          .csrf(csrf->csrf.disable())
          .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .httpBasic(basic->basic.disable())
          .formLogin(form->form.disable())
          .logout(logout->logout.disable())
          .authorizeHttpRequests(auth->auth
            .requestMatchers("/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/error").permitAll()
            .requestMatchers(HttpMethod.GET,"/api/v1/productos","/api/v1/productos/**","/api/v1/categorias","/api/v1/categorias/**").permitAll()
            .requestMatchers(HttpMethod.POST,"/api/v1/auth/login","/api/v1/auth/registro","/api/v1/auth/refresh").permitAll()
            .anyRequest().authenticated()
          )
          .exceptionHandling(ex->ex
            .authenticationEntryPoint((req,resp,e)->{
                resp.setStatus(401);resp.setContentType("application/json;charset=UTF-8");
                resp.getWriter().write("{\"message\":\"Debes iniciar sesión.\"}");
            })
            .accessDeniedHandler((req,resp,e)->{
                resp.setStatus(403);resp.setContentType("application/json;charset=UTF-8");
                resp.getWriter().write("{\"message\":\"No tienes permisos para realizar esta acción.\"}");
            })
          )
          .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
