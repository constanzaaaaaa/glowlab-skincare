package cl.glowlab.control3.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id @Column(length = 12) public String run;
    @Column(nullable = false, length = 50) public String nombre;
    @Column(nullable = false, length = 100) public String apellidos;
    @Column(nullable = false, unique = true, length = 100) public String correo;
    @Column(name = "clave_hash", length = 100) public String claveHash;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) public Rol rol = Rol.CLIENTE;
    @Column(nullable = false, length = 10) public String estado = "Activo";
    public LocalDate fechaNacimiento;
    public Integer regionId;
    public Integer comunaId;
    @Column(length = 300) public String direccion;
}
