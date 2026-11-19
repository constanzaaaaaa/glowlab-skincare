package cl.glowlab.control3.config;

import cl.glowlab.control3.model.*;
import cl.glowlab.control3.repo.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatosIniciales {
    @Bean
    CommandLineRunner iniciarCatalogo(CategoriaRepository categorias,ProductoRepository productos,
            UsuarioRepository usuarios,PasswordEncoder encoder,
            @Value("${app.bootstrap.admin-email}") String adminEmail,
            @Value("${app.bootstrap.admin-password}") String adminPassword,
            @Value("${app.bootstrap.admin-run}") String adminRun,
            @Value("${app.bootstrap.vendedor-email}") String vendedorEmail,
            @Value("${app.bootstrap.vendedor-password}") String vendedorPassword,
            @Value("${app.bootstrap.vendedor-run}") String vendedorRun) {
        return args->{
            String[] nombres={"Limpiadores","Sueros","Hidratantes","Protector Solar",
              "Exfoliantes","Mascarillas","Contorno de Ojos"};
            Map<String,Categoria> c=new HashMap<>();
            for(String nombre:nombres){
                Categoria categoria=categorias.findByNombreIgnoreCase(nombre).orElseGet(()->{
                    Categoria nueva=new Categoria();nueva.nombre=nombre;return categorias.save(nueva);
                });
                c.put(nombre,categoria);
            }
            Object[][] catalogo={
                {"GL-001","Hydra Glow Serum","Sérum concentrado en ácido hialurónico para hidratar la piel.",15990L,18,4,"Sueros","productos/hidratante1.webp","ninguna",0},
                {"GL-002","Pure Clay Cleanser","Limpiador facial con arcilla blanca que remueve impurezas.",9990L,25,5,"Limpiadores","productos/limpiador1.jpg","2x1",0},
                {"GL-003","Velvet Repair Cream","Crema reparadora para restaurar la barrera cutánea.",18990L,14,3,"Hidratantes","productos/crema.webp","ninguna",0},
                {"GL-004","Sun Shield SPF50","Protector solar facial de amplio espectro.",13990L,20,5,"Protector Solar","productos/bloqueador1.jpg","ninguna",0},
                {"GL-005","Gentle Glow Scrub","Exfoliante suave que renueva la piel.",11990L,16,4,"Exfoliantes","productos/exfoliante1.jpg","ninguna",0},
                {"GL-006","Rose Clay Mask","Mascarilla purificante de arcilla rosada.",12990L,12,3,"Mascarillas","productos/mascarilla.jfif","ninguna",0},
                {"GL-007","Bright Eye Contour","Contorno de ojos con cafeína y vitamina E.",14990L,3,4,"Contorno de Ojos","productos/contorno1.webp","ninguna",0},
                {"GL-008","Vitamin C Radiance Serum","Sérum antioxidante con vitamina C.",16990L,9,3,"Sueros","productos/suero1.webp","porcentaje",20}
            };
            for(Object[] fila:catalogo){
                String codigo=(String)fila[0];
                if(productos.existsById(codigo))continue;
                Producto p=new Producto();
                p.codigo=codigo;p.nombre=(String)fila[1];p.descripcion=(String)fila[2];
                p.precio=(Long)fila[3];p.stock=(Integer)fila[4];p.stockCritico=(Integer)fila[5];
                p.categoria=c.get((String)fila[6]);p.imagen=(String)fila[7];
                p.ofertaTipo=(String)fila[8];p.descuentoPorcentaje=(Integer)fila[9];
                productos.save(p);
            }
            if(!vendedorEmail.isBlank() && !vendedorPassword.isBlank()) {
                if(vendedorPassword.length()<8) throw new IllegalArgumentException("VENDEDOR_PASSWORD debe tener al menos 8 caracteres.");
                if(!usuarios.existsById(vendedorRun) && !usuarios.existsByCorreoIgnoreCase(vendedorEmail)){
                    Usuario vendedor=new Usuario();vendedor.run=vendedorRun;vendedor.nombre="Vendedor";
                    vendedor.apellidos="GlowLab";vendedor.correo=vendedorEmail.trim().toLowerCase(Locale.ROOT);
                    vendedor.claveHash=encoder.encode(vendedorPassword);vendedor.rol=Rol.VENDEDOR;
                    vendedor.estado="Activo";vendedor.direccion="Por configurar";
                    usuarios.save(vendedor);
                }
            }
            if(!adminEmail.isBlank() && !adminPassword.isBlank()){
                if(adminPassword.length()<8)throw new IllegalArgumentException("ADMIN_PASSWORD debe tener al menos 8 caracteres.");
                if(!usuarios.existsById(adminRun) && !usuarios.existsByCorreoIgnoreCase(adminEmail)){
                    Usuario u=new Usuario();u.run=adminRun;u.nombre="Administrador";
                    u.apellidos="GlowLab";u.correo=adminEmail.trim().toLowerCase(Locale.ROOT);
                    u.claveHash=encoder.encode(adminPassword);u.rol=Rol.ADMINISTRADOR;
                    u.estado="Activo";u.direccion="Por configurar";
                    usuarios.save(u);
                }
            }
        };
    }
}
