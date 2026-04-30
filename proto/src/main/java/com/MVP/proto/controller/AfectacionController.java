package com.MVP.proto.controller;

import com.MVP.proto.model.AfectacionPresupuestal;
import com.MVP.proto.repository.AfectacionRepository;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/afectaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AfectacionController {

    @Autowired
    private AfectacionRepository afectacionRepo;

    @Autowired
    private AuditService auditService;

    // POST — Guardar
    @PostMapping
    public ResponseEntity<AfectacionPresupuestal> guardarAfectacion(@RequestBody AfectacionPresupuestal afectacion) {
        if (afectacion.getFechaRegistro() == null || afectacion.getFechaRegistro().isEmpty()) {
            afectacion.setFechaRegistro(LocalDate.now().toString());
        }
        AfectacionPresupuestal nueva = afectacionRepo.save(afectacion);

        auditService.registrar("CREATE", "AFECTACION", nueva.getId(),
                nueva.getFolioCa(), null, nueva,
                "Nueva afectación presupuestal registrada");

        return ResponseEntity.ok(nueva);
    }

    // GET — Lista
    @GetMapping("/lista")
    public List<AfectacionPresupuestal> getListaAfectaciones() {
        return afectacionRepo.findAllByOrderByFechaRegistroDesc();
    }

    // GET — Por ID
    @GetMapping("/{id}")
    public ResponseEntity<AfectacionPresupuestal> getAfectacionById(@PathVariable Long id) {
        return afectacionRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT — Editar (Solo ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> editarAfectacion(@PathVariable Long id, @RequestBody AfectacionPresupuestal datosNuevos) {
        return afectacionRepo.findById(id).map(existente -> {
            Object antes = clonarParaAudit(existente);

            if (datosNuevos.getFolioCa() != null) existente.setFolioCa(datosNuevos.getFolioCa());
            if (datosNuevos.getOficioSuficiencia() != null) existente.setOficioSuficiencia(datosNuevos.getOficioSuficiencia());
            if (datosNuevos.getMontoAfectado() != null) existente.setMontoAfectado(datosNuevos.getMontoAfectado());
            if (datosNuevos.getPartidaPresupuestal() != null) existente.setPartidaPresupuestal(datosNuevos.getPartidaPresupuestal());
            if (datosNuevos.getEstatusSuficiencia() != null) existente.setEstatusSuficiencia(datosNuevos.getEstatusSuficiencia());
            if (datosNuevos.getFechaSuficiencia() != null) existente.setFechaSuficiencia(datosNuevos.getFechaSuficiencia());
            if (datosNuevos.getObservaciones() != null) existente.setObservaciones(datosNuevos.getObservaciones());

            AfectacionPresupuestal actualizado = afectacionRepo.save(existente);

            auditService.registrar("UPDATE", "AFECTACION", id,
                    existente.getFolioCa(), antes, actualizado,
                    "Afectación presupuestal editada");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE — Eliminar (Solo ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAfectacion(@PathVariable Long id) {
        return afectacionRepo.findById(id).map(afectacion -> {
            auditService.registrar("DELETE", "AFECTACION", id,
                    afectacion.getFolioCa(), afectacion, null,
                    "Afectación presupuestal eliminada: " + afectacion.getFolioCa());

            afectacionRepo.delete(afectacion);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private java.util.Map<String, Object> clonarParaAudit(AfectacionPresupuestal a) {
        java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", a.getId());
        map.put("folioCa", a.getFolioCa());
        map.put("oficioSuficiencia", a.getOficioSuficiencia());
        map.put("montoAfectado", a.getMontoAfectado());
        map.put("partidaPresupuestal", a.getPartidaPresupuestal());
        map.put("estatusSuficiencia", a.getEstatusSuficiencia());
        map.put("observaciones", a.getObservaciones());
        return map;
    }
}
