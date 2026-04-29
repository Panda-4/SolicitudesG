package com.MVP.proto.repository;

import com.MVP.proto.model.AfectacionPresupuestal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AfectacionRepository extends JpaRepository<AfectacionPresupuestal, Long> {
    List<AfectacionPresupuestal> findAllByOrderByFechaRegistroDesc();
}
