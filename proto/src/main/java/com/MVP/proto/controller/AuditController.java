package com.MVP.proto.controller;

import com.MVP.proto.model.AuditLog;
import com.MVP.proto.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepo;

    // Obtener todo el historial de auditoría
    @GetMapping
    public List<AuditLog> getHistorial() {
        return auditLogRepo.findAllByOrderByFechaHoraDesc();
    }

    // Obtener historial por entidad e ID (ej. ESTUDIO 5)
    @GetMapping("/entidad/{entidad}/{id}")
    public List<AuditLog> getHistorialPorEntidad(@PathVariable String entidad, @PathVariable Long id) {
        return auditLogRepo.findByEntidadAndEntidadIdOrderByFechaHoraDesc(entidad, id);
    }

    // Obtener historial por usuario
    @GetMapping("/usuario/{username}")
    public List<AuditLog> getHistorialPorUsuario(@PathVariable String username) {
        return auditLogRepo.findByUsuarioOrderByFechaHoraDesc(username);
    }
}
