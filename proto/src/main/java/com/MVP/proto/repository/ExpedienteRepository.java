package com.MVP.proto.repository;

import com.MVP.proto.model.Expediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpedienteRepository extends JpaRepository<Expediente, Long> {
    List<Expediente> findAllByOrderByFechaCreacionDesc();
    Optional<Expediente> findByFolioExpediente(String folioExpediente);
}
