package com.MVP.proto.repository;

import com.MVP.proto.model.Adjudicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdjudicacionRepository extends JpaRepository<Adjudicacion, Long> {
    List<Adjudicacion> findAllByOrderByFechaRegistroDesc();
}
