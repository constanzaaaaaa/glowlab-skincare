package cl.glowlab.control3.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boleta")
public class Boleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable = false) public Instant fecha = Instant.now();
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_run", nullable = false) public Usuario usuario;
    @Column(nullable = false) public long total;
    @Column(nullable = false, length = 40) public String estado = "Pedido registrado";
    @Column(nullable = false, length = 50) public String recibeNombre;
    @Column(nullable = false, length = 100) public String recibeApellidos;
    @Column(nullable = false, length = 100) public String recibeCorreo;
    @Column(nullable = false, length = 30) public String recibeTelefono;
    @Column(nullable = false, length = 200) public String recibeDireccion;
    @Column(length = 50) public String departamento;
    public Integer regionId;
    @Column(length = 100) public String region;
    public Integer comunaId;
    @Column(length = 100) public String comuna;
    @Column(length = 300) public String referencia;
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<DetalleBoleta> detalles = new ArrayList<>();
}
