package cl.glowlab.control3.api;

import cl.glowlab.control3.model.Rol;
import cl.glowlab.control3.model.Usuario;
import cl.glowlab.control3.repo.UsuarioRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntegracionRestTest {
    @Autowired MockMvc mvc;
    @Autowired UsuarioRepository usuarios;
    @Autowired PasswordEncoder encoder;

    @BeforeEach
    void cuentasParaProbarRoles() {
        crearCuenta("123456785", "admin@gmail.com", Rol.ADMINISTRADOR);
        crearCuenta("987654325", "vendedor@gmail.com", Rol.VENDEDOR);
    }

    private void crearCuenta(String run, String correo, Rol rol) {
        if(usuarios.existsById(run)) return;
        Usuario u = new Usuario();
        u.run=run;
        u.nombre="Prueba";
        u.apellidos="GlowLab";
        u.correo=correo;
        u.rol=rol;
        u.estado="Activo";
        u.direccion="Calle de prueba";
        u.claveHash=encoder.encode("ClaveDePruebas2026");
        usuarios.saveAndFlush(u);
    }

    private Cookie cookie(String correo, String tipo) throws Exception {
        MockHttpServletResponse response=mvc.perform(post("/api/v1/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"correo\":\""+correo+"\",\"password\":\"ClaveDePruebas2026\"}"))
            .andExpect(status().isOk()).andReturn().getResponse();
        return extraerCookie(response, tipo);
    }

    private Cookie extraerCookie(MockHttpServletResponse response, String nombre) {
        String header=response.getHeaders("Set-Cookie").stream()
            .filter(v -> v.startsWith(nombre+"=")).findFirst().orElseThrow();
        String valor=header.substring((nombre+"=").length(),header.indexOf(';'));
        return new Cookie(nombre,valor);
    }

    @Test
    void catalogoPublicoYEdicionProtegida() throws Exception {
        mvc.perform(get("/api/v1/productos")).andExpect(status().isOk())
            .andExpect(jsonPath("$[0].codigo").exists());
        mvc.perform(get("/api/v1/categorias")).andExpect(status().isOk());
        mvc.perform(post("/api/v1/categorias").contentType(MediaType.APPLICATION_JSON)
            .content("{\"nombre\":\"Kits sin autenticacion\"}"))
            .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void registroJwtYPermisosDeCliente() throws Exception {
        String registro="{\"run\":\"112223339\",\"nombre\":\"Camila\",\"apellidos\":\"Soto\","
          + "\"correo\":\"camila@gmail.com\",\"password\":\"ClaveDePruebas2026\","
          + "\"rolId\":1,\"direccion\":\"Av. Ejemplo 123\",\"regionId\":1,\"comunaId\":1}";
        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON)
          .content(registro)).andExpect(status().isCreated())
          .andExpect(jsonPath("$.rolId").value(3));
        Cookie cliente=cookie("camila@gmail.com","glowlab_access");
        mvc.perform(get("/api/v1/auth/me").cookie(cliente)).andExpect(status().isOk())
          .andExpect(jsonPath("$.correo").value("camila@gmail.com"))
          .andExpect(jsonPath("$.rolId").value(3));
        mvc.perform(get("/api/v1/usuarios").cookie(cliente)).andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/boletas").cookie(cliente)).andExpect(status().isForbidden());

        Cookie refresco=cookie("camila@gmail.com","glowlab_refresh");
        mvc.perform(post("/api/v1/auth/refresh").cookie(refresco))
          .andExpect(status().isOk())
          .andExpect(header().exists("Set-Cookie"));
    }

    @Test
    void administradorHaceCrudYVendedorSoloConsulta() throws Exception {
        Cookie admin=cookie("admin@gmail.com","glowlab_access");
        Cookie vendedor=cookie("vendedor@gmail.com","glowlab_access");

        String categoria=mvc.perform(post("/api/v1/categorias").cookie(admin)
          .contentType(MediaType.APPLICATION_JSON).content("{\"nombre\":\"Kits de prueba\"}"))
          .andExpect(status().isCreated()).andExpect(jsonPath("$.nombre").value("Kits de prueba"))
          .andReturn().getResponse().getContentAsString();
        long id=new com.fasterxml.jackson.databind.ObjectMapper().readTree(categoria).get("id").asLong();

        String producto="{\"codigo\":\"PRUEBA-C3\",\"nombre\":\"Kit de prueba\","
          + "\"descripcion\":\"Producto de prueba de integracion\","
          + "\"precio\":12000,\"stock\":3,\"stockCritico\":1,"
          + "\"categoriaId\":"+id+",\"estado\":\"Activo\",\"ofertaTipo\":\"ninguna\"}";
        mvc.perform(post("/api/v1/productos").cookie(admin)
          .contentType(MediaType.APPLICATION_JSON).content(producto))
          .andExpect(status().isCreated());

        mvc.perform(get("/api/v1/productos/PRUEBA-C3").cookie(vendedor))
          .andExpect(status().isOk()).andExpect(jsonPath("$.precio").value(12000));
        mvc.perform(get("/api/v1/boletas").cookie(vendedor)).andExpect(status().isOk());
        mvc.perform(get("/api/v1/usuarios").cookie(vendedor)).andExpect(status().isForbidden());
        mvc.perform(put("/api/v1/productos/PRUEBA-C3").cookie(vendedor)
          .contentType(MediaType.APPLICATION_JSON).content(producto))
          .andExpect(status().isForbidden());
        mvc.perform(delete("/api/v1/productos/PRUEBA-C3").cookie(admin))
          .andExpect(status().isNoContent());
        mvc.perform(delete("/api/v1/categorias/"+id).cookie(admin))
          .andExpect(status().isNoContent());
    }

    @Test
    void compraRecalculaTotalYDescuentaStock() throws Exception {
        String registro="{\"run\":\"123123123\",\"nombre\":\"Ana\",\"apellidos\":\"Mora\","
          + "\"correo\":\"ana@gmail.com\",\"password\":\"ClaveDePruebas2026\","
          + "\"direccion\":\"Calle 123\",\"regionId\":1,\"comunaId\":1}";
        mvc.perform(post("/api/v1/auth/registro").contentType(MediaType.APPLICATION_JSON)
          .content(registro)).andExpect(status().isCreated());
        Cookie cliente=cookie("ana@gmail.com","glowlab_access");
        String compra="{\"items\":[{\"codigo\":\"GL-001\",\"cantidad\":2}],\"entrega\":{"
          + "\"nombre\":\"Ana\",\"apellidos\":\"Mora\",\"correo\":\"ana@gmail.com\","
          + "\"telefono\":\"912345678\",\"direccion\":\"Calle 123\","
          + "\"regionId\":1,\"region\":\"Metropolitana\","
          + "\"comunaId\":1,\"comuna\":\"Santiago\"},\"total\":1}";
        mvc.perform(post("/api/v1/boletas").cookie(cliente)
          .contentType(MediaType.APPLICATION_JSON).content(compra))
          .andExpect(status().isCreated()).andExpect(jsonPath("$.total").value(31980))
          .andExpect(jsonPath("$.items[0].cantidad").value(2));
        mvc.perform(get("/api/v1/boletas/mis").cookie(cliente))
          .andExpect(status().isOk()).andExpect(jsonPath("$[0].clienteRun").value("123123123"));
        mvc.perform(get("/api/v1/productos/GL-001"))
          .andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(16));
        mvc.perform(post("/api/v1/boletas").cookie(cliente)
          .contentType(MediaType.APPLICATION_JSON)
          .content(compra.replace("\"cantidad\":2", "\"cantidad\":500")))
          .andExpect(status().isConflict());
        mvc.perform(get("/api/v1/productos/GL-001"))
          .andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(16));
    }
}
