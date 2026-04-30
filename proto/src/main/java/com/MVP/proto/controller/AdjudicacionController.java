package com.MVP.proto.controller;

import com.MVP.proto.model.Adjudicacion;
import com.MVP.proto.repository.AdjudicacionRepository;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/adjudicaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdjudicacionController {

    @Autowired
    private AdjudicacionRepository adjudicacionRepo;

    @Autowired
    private AuditService auditService;

    @PostMapping
    public ResponseEntity<Adjudicacion> guardarAdjudicacion(@RequestBody Adjudicacion adjudicacion) {
        if (adjudicacion.getFechaRegistro() == null || adjudicacion.getFechaRegistro().isEmpty()) {
            adjudicacion.setFechaRegistro(LocalDate.now().toString());
        }
        Adjudicacion nueva = adjudicacionRepo.save(adjudicacion);

        auditService.registrar("CREATE", "ADJUDICACION", nueva.getId(),
                nueva.getFolioInterno(), null, nueva,
                "Nueva adjudicación registrada");

        return ResponseEntity.ok(nueva);
    }

    @GetMapping("/lista")
    public List<Adjudicacion> getListaAdjudicaciones() {
        return adjudicacionRepo.findAllByOrderByFechaRegistroDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adjudicacion> getAdjudicacionById(@PathVariable Long id) {
        return adjudicacionRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarAdjudicacion(@PathVariable Long id, @RequestBody Adjudicacion datosNuevos) {
        return adjudicacionRepo.findById(id).map(existente -> {
            Map<String, Object> antes = clonarParaAudit(existente);

            if (datosNuevos.getFolioInterno() != null) existente.setFolioInterno(datosNuevos.getFolioInterno());
            if (datosNuevos.getNombreRazonSocial() != null) existente.setNombreRazonSocial(datosNuevos.getNombreRazonSocial());
            if (datosNuevos.getRfc() != null) existente.setRfc(datosNuevos.getRfc());
            if (datosNuevos.getNumeroContrato() != null) existente.setNumeroContrato(datosNuevos.getNumeroContrato());
            if (datosNuevos.getVigenciaInicio() != null) existente.setVigenciaInicio(datosNuevos.getVigenciaInicio());
            if (datosNuevos.getVigenciaFin() != null) existente.setVigenciaFin(datosNuevos.getVigenciaFin());
            if (datosNuevos.getMontoMaximo() != null) existente.setMontoMaximo(datosNuevos.getMontoMaximo());
            if (datosNuevos.getEstatusAdjudicacion() != null) existente.setEstatusAdjudicacion(datosNuevos.getEstatusAdjudicacion());
            if (datosNuevos.getInstrumentoNotarial() != null) existente.setInstrumentoNotarial(datosNuevos.getInstrumentoNotarial());

            Adjudicacion actualizado = adjudicacionRepo.save(existente);

            auditService.registrar("UPDATE", "ADJUDICACION", id,
                    existente.getFolioInterno(), antes, actualizado,
                    "Adjudicación editada");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAdjudicacion(@PathVariable Long id) {
        return adjudicacionRepo.findById(id).map(adjudicacion -> {
            auditService.registrar("DELETE", "ADJUDICACION", id,
                    adjudicacion.getFolioInterno(), adjudicacion, null,
                    "Adjudicación eliminada: " + adjudicacion.getFolioInterno());

            adjudicacionRepo.delete(adjudicacion);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> clonarParaAudit(Adjudicacion a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", a.getId());
        map.put("folioInterno", a.getFolioInterno());
        map.put("nombreRazonSocial", a.getNombreRazonSocial());
        map.put("rfc", a.getRfc());
        map.put("numeroContrato", a.getNumeroContrato());
        map.put("vigenciaInicio", a.getVigenciaInicio());
        map.put("vigenciaFin", a.getVigenciaFin());
        map.put("montoMaximo", a.getMontoMaximo());
        map.put("estatusAdjudicacion", a.getEstatusAdjudicacion());
        map.put("instrumentoNotarial", a.getInstrumentoNotarial());
        return map;
    }
}
