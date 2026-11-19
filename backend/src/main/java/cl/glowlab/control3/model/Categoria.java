package cl.glowlab.control3.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria")
public class Categoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable = false, unique = true, length = 50) public String nombre;
}
