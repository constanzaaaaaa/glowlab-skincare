package cl.glowlab.control3.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_boleta")
public class DetalleBoleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "boleta_id", nullable = false) public Boleta boleta;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_codigo", nullable = false) public Producto producto;
    @Column(nullable = false, length = 20) public String codigo;
    @Column(nullable = false, length = 100) public String nombre;
    @Column(nullable = false) public int cantidad;
    @Column(nullable = false) public long precioUnitario;
    @Column(nullable = false) public long subtotal;
    @Column(nullable = false) public long descuento;
    @Column(length = 25) public String oferta;
}
