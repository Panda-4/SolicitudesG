package com.MVP.proto.repository;

import com.MVP.proto.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByFechaHoraDesc();
    List<AuditLog> findByEntidadAndEntidadIdOrderByFechaHoraDesc(String entidad, Long entidadId);
    List<AuditLog> findByUsuarioOrderByFechaHoraDesc(String usuario);
    List<AuditLog> findByAccionOrderByFechaHoraDesc(String accion);
}
