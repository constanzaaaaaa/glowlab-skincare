package cl.glowlab.control3.repo;

import cl.glowlab.control3.model.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleBoletaRepository extends JpaRepository<DetalleBoleta, Long> {
    boolean existsByProductoCodigo(String codigo);
}
