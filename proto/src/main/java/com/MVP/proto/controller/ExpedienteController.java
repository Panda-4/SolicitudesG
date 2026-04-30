package com.MVP.proto.controller;

import com.MVP.proto.model.*;
import com.MVP.proto.repository.*;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expedientes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ExpedienteController {

    @Autowired
    private ExpedienteRepository expedienteRepo;
    @Autowired
    private EstudioRepository estudioRepo;
    @Autowired
    private AfectacionRepository afectacionRepo;
    @Autowired
    private ProcedimientoRepository procedimientoRepo;
    @Autowired
    private AdjudicacionRepository adjudicacionRepo;
    @Autowired
    private AuditService auditService;

    // Listar todos los expedientes (para dropdowns en otros módulos)
    @GetMapping
    public List<Expediente> getAllExpedientes() {
        return expedienteRepo.findAllByOrderByFechaCreacionDesc();
    }

    // Obtener un expediente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Expediente> getExpedienteById(@PathVariable Long id) {
        return expedienteRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT — Editar Expediente (Solo ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> editarExpediente(@PathVariable Long id, @RequestBody Expediente datosNuevos) {
        return expedienteRepo.findById(id).map(existente -> {
            Map<String, Object> antes = clonarParaAudit(existente);

            if (datosNuevos.getEstatusGeneral() != null) existente.setEstatusGeneral(datosNuevos.getEstatusGeneral());
            if (datosNuevos.getDependencia() != null) existente.setDependencia(datosNuevos.getDependencia());
            if (datosNuevos.getDescripcionBreve() != null) existente.setDescripcionBreve(datosNuevos.getDescripcionBreve());

            Expediente actualizado = expedienteRepo.save(existente);

            auditService.registrar("UPDATE", "EXPEDIENTE", id,
                    existente.getFolioExpediente(), antes, actualizado,
                    "Expediente editado");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE — Eliminar Expediente (Solo ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarExpediente(@PathVariable Long id) {
        return expedienteRepo.findById(id).map(expediente -> {
            // Verificar si tiene registros hijos
            boolean tieneEstudios = estudioRepo.findAll().stream().anyMatch(e -> e.getExpediente() != null && e.getExpediente().getId().equals(id));
            boolean tieneAfectaciones = afectacionRepo.findAll().stream().anyMatch(a -> a.getExpediente() != null && a.getExpediente().getId().equals(id));
            boolean tieneProcedimientos = procedimientoRepo.findAll().stream().anyMatch(p -> p.getExpediente() != null && p.getExpediente().getId().equals(id));
            boolean tieneAdjudicaciones = adjudicacionRepo.findAll().stream().anyMatch(a -> a.getExpediente() != null && a.getExpediente().getId().equals(id));

            if (tieneEstudios || tieneAfectaciones || tieneProcedimientos || tieneAdjudicaciones) {
                return ResponseEntity.badRequest().body("No se puede eliminar el expediente porque tiene registros hijos vinculados. Elimine primero los registros individuales.");
            }

            auditService.registrar("DELETE", "EXPEDIENTE", id,
                    expediente.getFolioExpediente(), expediente, null,
                    "Expediente eliminado: " + expediente.getFolioExpediente());

            expedienteRepo.delete(expediente);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // === TRAZABILIDAD COMPLETA ===
    @GetMapping("/trazabilidad")
    public List<Map<String, Object>> getTrazabilidad() {
        List<Expediente> expedientes = expedienteRepo.findAllByOrderByFechaCreacionDesc();
        List<EstudioMercado> estudios = estudioRepo.findAllByOrderByFechaIngresoDesc();
        List<AfectacionPresupuestal> afectaciones = afectacionRepo.findAllByOrderByFechaRegistroDesc();
        List<ProcedimientoAdquisitivo> procedimientos = procedimientoRepo.findAllByOrderByFechaRegistroDesc();
        List<Adjudicacion> adjudicaciones = adjudicacionRepo.findAllByOrderByFechaRegistroDesc();

        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Expediente exp : expedientes) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("expediente", exp);

            // Estudios vinculados
            List<EstudioMercado> estudiosDel = estudios.stream()
                    .filter(e -> e.getExpediente() != null && e.getExpediente().getId().equals(exp.getId()))
                    .collect(Collectors.toList());
            item.put("estudios", estudiosDel);
            item.put("totalEstudios", estudiosDel.size());

            // Afectaciones vinculadas
            List<AfectacionPresupuestal> afectacionesDel = afectaciones.stream()
                    .filter(a -> a.getExpediente() != null && a.getExpediente().getId().equals(exp.getId()))
                    .collect(Collectors.toList());
            item.put("afectaciones", afectacionesDel);
            item.put("totalAfectaciones", afectacionesDel.size());

            // Procedimientos vinculados
            List<ProcedimientoAdquisitivo> procedimientosDel = procedimientos.stream()
                    .filter(p -> p.getExpediente() != null && p.getExpediente().getId().equals(exp.getId()))
                    .collect(Collectors.toList());
            item.put("procedimientos", procedimientosDel);
            item.put("totalProcedimientos", procedimientosDel.size());

            // Adjudicaciones vinculadas
            List<Adjudicacion> adjudicacionesDel = adjudicaciones.stream()
                    .filter(adj -> adj.getExpediente() != null && adj.getExpediente().getId().equals(exp.getId()))
                    .collect(Collectors.toList());
            item.put("adjudicaciones", adjudicacionesDel);
            item.put("totalAdjudicaciones", adjudicacionesDel.size());

            // Etapa actual (la más avanzada)
            String etapa = "Estudio de Mercado";
            if (adjudicacionesDel.size() > 0) etapa = "Adjudicación";
            else if (procedimientosDel.size() > 0) etapa = "Adquisiciones";
            else if (afectacionesDel.size() > 0) etapa = "Afectación Presupuestal";
            item.put("etapaActual", etapa);

            // Progreso (0-100)
            int progreso = 25;
            if (afectacionesDel.size() > 0) progreso = 50;
            if (procedimientosDel.size() > 0) progreso = 75;
            if (adjudicacionesDel.size() > 0) progreso = 100;
            item.put("progreso", progreso);

            resultado.add(item);
        }

        return resultado;
    }

    private Map<String, Object> clonarParaAudit(Expediente e) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", e.getId());
        map.put("folioExpediente", e.getFolioExpediente());
        map.put("dependencia", e.getDependencia());
        map.put("estatusGeneral", e.getEstatusGeneral());
        map.put("descripcionBreve", e.getDescripcionBreve());
        return map;
    }
}
