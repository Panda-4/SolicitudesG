package com.MVP.proto.controller;

import com.MVP.proto.model.ProcedimientoAdquisitivo;
import com.MVP.proto.repository.ProcedimientoRepository;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // PUT — Editar (Solo ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> editarProcedimiento(@PathVariable Long id, @RequestBody ProcedimientoAdquisitivo datosNuevos) {
        return procedimientoRepo.findById(id).map(existente -> {
            Map<String, Object> antes = clonarParaAudit(existente);

            if (datosNuevos.getNoProcedimiento() != null) existente.setNoProcedimiento(datosNuevos.getNoProcedimiento());
            if (datosNuevos.getModalidadProcedimiento() != null) existente.setModalidadProcedimiento(datosNuevos.getModalidadProcedimiento());
            if (datosNuevos.getMontoAdjudicado() != null) existente.setMontoAdjudicado(datosNuevos.getMontoAdjudicado());
            if (datosNuevos.getFechaFallo() != null) existente.setFechaFallo(datosNuevos.getFechaFallo());
            if (datosNuevos.getEstatusProcedimiento() != null) existente.setEstatusProcedimiento(datosNuevos.getEstatusProcedimiento());

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
