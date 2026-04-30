package com.MVP.proto.service;

import com.MVP.proto.model.AuditLog;
import com.MVP.proto.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepo;

    private final ObjectMapper objectMapper;

    public AuditService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }

    /**
     * Registra una acción en el log de auditoría.
     *
     * @param accion       CREATE, UPDATE, DELETE
     * @param entidad      ESTUDIO, AFECTACION, PROCEDIMIENTO, ADJUDICACION, EXPEDIENTE
     * @param entidadId    ID del registro afectado
     * @param folioRef     Folio visible del registro (puede ser null)
     * @param valorAnterior Objeto antes del cambio (null en CREATE)
     * @param valorNuevo   Objeto después del cambio (null en DELETE)
     * @param descripcion  Descripción legible
     */
    public void registrar(String accion, String entidad, Long entidadId,
                          String folioRef, Object valorAnterior, Object valorNuevo,
                          String descripcion) {
        try {
            AuditLog log = new AuditLog();
            log.setAccion(accion);
            log.setEntidad(entidad);
            log.setEntidadId(entidadId);
            log.setFolioReferencia(folioRef != null ? folioRef : "—");
            log.setDescripcion(descripcion);
            log.setFechaHora(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            // Extraer usuario del SecurityContext
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                log.setUsuario(auth.getName());
                String rol = auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst()
                        .orElse("UNKNOWN");
                log.setRolUsuario(rol.replace("ROLE_", ""));
            } else {
                log.setUsuario("SISTEMA");
                log.setRolUsuario("SISTEMA");
            }

            // Serializar valores a JSON
            if (valorAnterior != null) {
                log.setValorAnterior(objectMapper.writeValueAsString(valorAnterior));
            }
            if (valorNuevo != null) {
                log.setValorNuevo(objectMapper.writeValueAsString(valorNuevo));
            }

            auditLogRepo.save(log);
        } catch (Exception e) {
            // No queremos que un error de auditoría rompa la operación principal
            System.err.println("Error registrando auditoría: " + e.getMessage());
        }
    }
}
