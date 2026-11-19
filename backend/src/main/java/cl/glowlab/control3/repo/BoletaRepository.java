package cl.glowlab.control3.repo;

import cl.glowlab.control3.model.Boleta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findByUsuarioRunOrderByFechaDesc(String run);
    List<Boleta> findAllByOrderByFechaDesc();
}
