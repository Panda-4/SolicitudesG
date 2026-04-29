package com.MVP.proto.repository;

import com.MVP.proto.model.EstudioMercado; // Ajusta el nombre de tu entidad
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstudioRepository extends JpaRepository<EstudioMercado, Long> {
    // Puedes añadir métodos personalizados aquí si necesitas filtros específicos
    List<EstudioMercado> findAllByOrderByFechaIngresoDesc();
}