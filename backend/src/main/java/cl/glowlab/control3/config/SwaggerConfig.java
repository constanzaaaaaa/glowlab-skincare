package cl.glowlab.control3.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info=@Info(title="GlowLab API REST",version="v1",description="Control 3 - Spring Boot, MySQL, JWT y CRUD. La sesión utiliza cookies HttpOnly."))
public class SwaggerConfig {}
