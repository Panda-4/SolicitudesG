package com.MVP.proto.repository;

import com.MVP.proto.model.ProcedimientoAdquisitivo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProcedimientoRepository extends JpaRepository<ProcedimientoAdquisitivo, Long> {
    List<ProcedimientoAdquisitivo> findAllByOrderByFechaRegistroDesc();
}
