package cl.glowlab.control3.api;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracionRestTest {
    @Autowired MockMvc mvc;

    @Test
    void catalogoPublicoYEdicionProtegida() throws Exception {
        mvc.perform(get("/api/v1/productos")).andExpect(status().isOk());
        mvc.perform(get("/api/v1/categorias")).andExpect(status().isOk());
        mvc.perform(post("/api/v1/categorias").contentType(MediaType.APPLICATION_JSON)
            .content("{\"nombre\":\"Kits\"}")).andExpect(status().isUnauthorized());
    }

    @Test
    void registroSesionYPermisosCliente() throws Exception {
        String registro="{\"run\":\"112223339\",\"nombre\":\"Camila\",\"apellidos\":\"Soto\","
          + "\"correo\":\"camila@gmail.com\",\"password\":\"ClaveControl3Cliente\","
          + "\"direccion\":\"Av. Ejemplo 123\",\"regionId\":1,\"comunaId\":1}";
        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON)
          .content(registro)).andExpect(status().isCreated())
          .andExpect(jsonPath("$.rolId").value(3));
        String cabecera=mvc.perform(post("/api/v1/auth/login")
          .contentType(MediaType.APPLICATION_JSON)
          .content("{\"correo\":\"camila@gmail.com\",\"password\":\"ClaveControl3Cliente\"}"))
          .andExpect(status().isOk()).andReturn().getResponse()
          .getHeaders("Set-Cookie").stream()
          .filter(s->s.startsWith("glowlab_access=")).findFirst().orElseThrow();
        String token=cabecera.substring("glowlab_access=".length(),cabecera.indexOf(';'));
        Cookie cookie=new Cookie("glowlab_access",token);
        mvc.perform(get("/api/v1/auth/me").cookie(cookie)).andExpect(status().isOk())
          .andExpect(jsonPath("$.correo").value("camila@gmail.com"));
        mvc.perform(get("/api/v1/usuarios").cookie(cookie)).andExpect(status().isForbidden());
    }
}
