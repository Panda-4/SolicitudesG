package com.MVP.proto.controller;

import com.MVP.proto.model.ProcedimientoAdquisitivo;
import com.MVP.proto.repository.ProcedimientoRepository;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/procedimientos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProcedimientoController {

    @Autowired
    private ProcedimientoRepository procedimientoRepo;

    @Autowired
    private AuditService auditService;

    // POST — Guardar
    @PostMapping
    public ResponseEntity<ProcedimientoAdquisitivo> guardarProcedimiento(@RequestBody ProcedimientoAdquisitivo procedimiento) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            procedimiento.setCreadorUsername(auth.getName());
        }
        if (procedimiento.getFechaRegistro() == null || procedimiento.getFechaRegistro().isEmpty()) {
            procedimiento.setFechaRegistro(LocalDate.now().toString());
        }
        ProcedimientoAdquisitivo nuevo = procedimientoRepo.save(procedimiento);

        auditService.registrar("CREATE", "PROCEDIMIENTO", nuevo.getId(),
                nuevo.getNoProcedimiento(), null, nuevo,
                "Nuevo procedimiento adquisitivo registrado");

        return ResponseEntity.ok(nuevo);
    }

    // GET — Lista
    @GetMapping("/lista")
    public List<ProcedimientoAdquisitivo> getListaProcedimientos() {
        return procedimientoRepo.findAllByOrderByFechaRegistroDesc();
    }

    // GET — Por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProcedimientoAdquisitivo> getProcedimientoById(@PathVariable Long id) {
        return procedimientoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT — Editar
    @PutMapping("/{id}")
    public ResponseEntity<?> editarProcedimiento(@PathVariable Long id, @RequestBody ProcedimientoAdquisitivo datosNuevos) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        String currentUsername = auth != null ? auth.getName() : "";

        return procedimientoRepo.findById(id).map(existente -> {
            
            if (!isAdmin) {
                // Verificar pertenencia
                if (!currentUsername.equals(existente.getCreadorUsername())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para editar este registro.");
                }
            }

            Map<String, Object> antes = clonarParaAudit(existente);

            if (isAdmin) {
                if (datosNuevos.getNoProcedimiento() != null) existente.setNoProcedimiento(datosNuevos.getNoProcedimiento());
                if (datosNuevos.getModalidadProcedimiento() != null) existente.setModalidadProcedimiento(datosNuevos.getModalidadProcedimiento());
                if (datosNuevos.getConvocatoriaUrl() != null) existente.setConvocatoriaUrl(datosNuevos.getConvocatoriaUrl());
                if (datosNuevos.getMedioPublicacion() != null) existente.setMedioPublicacion(datosNuevos.getMedioPublicacion());
                
                if (datosNuevos.getFechaJuntaAclaracion() != null) existente.setFechaJuntaAclaracion(datosNuevos.getFechaJuntaAclaracion());
                if (datosNuevos.getHoraJuntaAclaracion() != null) existente.setHoraJuntaAclaracion(datosNuevos.getHoraJuntaAclaracion());
                if (datosNuevos.getFechaPresentacionApertura() != null) existente.setFechaPresentacionApertura(datosNuevos.getFechaPresentacionApertura());
                if (datosNuevos.getHoraPresentacionApertura() != null) existente.setHoraPresentacionApertura(datosNuevos.getHoraPresentacionApertura());
                if (datosNuevos.getFechaSesionComite() != null) existente.setFechaSesionComite(datosNuevos.getFechaSesionComite());
                if (datosNuevos.getHoraSesionComite() != null) existente.setHoraSesionComite(datosNuevos.getHoraSesionComite());
                if (datosNuevos.getFechaContraOferta() != null) existente.setFechaContraOferta(datosNuevos.getFechaContraOferta());
                if (datosNuevos.getHoraContraOferta() != null) existente.setHoraContraOferta(datosNuevos.getHoraContraOferta());
                if (datosNuevos.getFechaDictaminacion() != null) existente.setFechaDictaminacion(datosNuevos.getFechaDictaminacion());
                if (datosNuevos.getHoraDictaminacion() != null) existente.setHoraDictaminacion(datosNuevos.getHoraDictaminacion());
                if (datosNuevos.getFechaSesionSubcomite() != null) existente.setFechaSesionSubcomite(datosNuevos.getFechaSesionSubcomite());
                if (datosNuevos.getHoraSesionSubcomite() != null) existente.setHoraSesionSubcomite(datosNuevos.getHoraSesionSubcomite());
                if (datosNuevos.getFechaFallo() != null) existente.setFechaFallo(datosNuevos.getFechaFallo());
                if (datosNuevos.getHoraFallo() != null) existente.setHoraFallo(datosNuevos.getHoraFallo());

                if (datosNuevos.getMontoAdjudicado() != null) existente.setMontoAdjudicado(datosNuevos.getMontoAdjudicado());
                if (datosNuevos.getEstatusProcedimiento() != null) existente.setEstatusProcedimiento(datosNuevos.getEstatusProcedimiento());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
            } else {
                if (datosNuevos.getFechaJuntaAclaracion() != null) existente.setFechaJuntaAclaracion(datosNuevos.getFechaJuntaAclaracion());
                if (datosNuevos.getHoraJuntaAclaracion() != null) existente.setHoraJuntaAclaracion(datosNuevos.getHoraJuntaAclaracion());
                if (datosNuevos.getFechaPresentacionApertura() != null) existente.setFechaPresentacionApertura(datosNuevos.getFechaPresentacionApertura());
                if (datosNuevos.getHoraPresentacionApertura() != null) existente.setHoraPresentacionApertura(datosNuevos.getHoraPresentacionApertura());
                if (datosNuevos.getFechaSesionComite() != null) existente.setFechaSesionComite(datosNuevos.getFechaSesionComite());
                if (datosNuevos.getHoraSesionComite() != null) existente.setHoraSesionComite(datosNuevos.getHoraSesionComite());
                if (datosNuevos.getFechaContraOferta() != null) existente.setFechaContraOferta(datosNuevos.getFechaContraOferta());
                if (datosNuevos.getHoraContraOferta() != null) existente.setHoraContraOferta(datosNuevos.getHoraContraOferta());
                if (datosNuevos.getFechaDictaminacion() != null) existente.setFechaDictaminacion(datosNuevos.getFechaDictaminacion());
                if (datosNuevos.getHoraDictaminacion() != null) existente.setHoraDictaminacion(datosNuevos.getHoraDictaminacion());
                if (datosNuevos.getFechaSesionSubcomite() != null) existente.setFechaSesionSubcomite(datosNuevos.getFechaSesionSubcomite());
                if (datosNuevos.getHoraSesionSubcomite() != null) existente.setHoraSesionSubcomite(datosNuevos.getHoraSesionSubcomite());
                if (datosNuevos.getFechaFallo() != null) existente.setFechaFallo(datosNuevos.getFechaFallo());
                if (datosNuevos.getHoraFallo() != null) existente.setHoraFallo(datosNuevos.getHoraFallo());
                
                if (datosNuevos.getEstatusProcedimiento() != null) existente.setEstatusProcedimiento(datosNuevos.getEstatusProcedimiento());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
            }

            ProcedimientoAdquisitivo actualizado = procedimientoRepo.save(existente);

            auditService.registrar("UPDATE", "PROCEDIMIENTO", id,
                    existente.getNoProcedimiento(), antes, actualizado,
                    "Procedimiento adquisitivo editado");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE — Eliminar (Solo ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProcedimiento(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un Administrador puede eliminar registros.");
        }

        return procedimientoRepo.findById(id).map(procedimiento -> {
            auditService.registrar("DELETE", "PROCEDIMIENTO", id,
                    procedimiento.getNoProcedimiento(), procedimiento, null,
                    "Procedimiento adquisitivo eliminado: " + procedimiento.getNoProcedimiento());

            procedimientoRepo.delete(procedimiento);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> clonarParaAudit(ProcedimientoAdquisitivo p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", p.getId());
        map.put("noProcedimiento", p.getNoProcedimiento());
        map.put("modalidadProcedimiento", p.getModalidadProcedimiento());
        map.put("montoAdjudicado", p.getMontoAdjudicado());
        map.put("fechaFallo", p.getFechaFallo());
        map.put("estatusProcedimiento", p.getEstatusProcedimiento());
        return map;
    }
}
