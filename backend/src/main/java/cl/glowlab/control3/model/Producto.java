package cl.glowlab.control3.model;

import jakarta.persistence.*;

@Entity
@Table(name = "producto")
public class Producto {
    @Id @Column(length = 20) public String codigo;
    @Column(nullable = false, length = 100) public String nombre;
    @Column(nullable = false, length = 800) public String descripcion;
    @Column(nullable = false) public long precio;
    @Column(nullable = false) public int stock;
    @Column(nullable = false) public int stockCritico;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false) public Categoria categoria;
    @Column(length = 200) public String imagen = "";
    @Column(nullable = false, length = 10) public String estado = "Activo";
    @Column(nullable = false, length = 20) public String ofertaTipo = "ninguna";
    public int descuentoPorcentaje;
}
