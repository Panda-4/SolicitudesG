package com.MVP.proto.controller;

import com.MVP.proto.model.Adjudicacion;
import com.MVP.proto.repository.AdjudicacionRepository;
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
@RequestMapping("/api/adjudicaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdjudicacionController {

    @Autowired
    private AdjudicacionRepository adjudicacionRepo;

    @Autowired
    private AuditService auditService;

    @PostMapping
    public ResponseEntity<Adjudicacion> guardarAdjudicacion(@RequestBody Adjudicacion adjudicacion) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            adjudicacion.setCreadorUsername(auth.getName());
        }
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        String currentUsername = auth != null ? auth.getName() : "";

        return adjudicacionRepo.findById(id).map(existente -> {
            
            if (!isAdmin) {
                if (!currentUsername.equals(existente.getCreadorUsername())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para editar este registro.");
                }
            }

            Map<String, Object> antes = clonarParaAudit(existente);

            if (isAdmin) {
                if (datosNuevos.getFolioInterno() != null) existente.setFolioInterno(datosNuevos.getFolioInterno());
                if (datosNuevos.getNombreRazonSocial() != null) existente.setNombreRazonSocial(datosNuevos.getNombreRazonSocial());
                if (datosNuevos.getRfc() != null) existente.setRfc(datosNuevos.getRfc());
                if (datosNuevos.getMontoTotalConIva() != null) existente.setMontoTotalConIva(datosNuevos.getMontoTotalConIva());
                if (datosNuevos.getNumeroContrato() != null) existente.setNumeroContrato(datosNuevos.getNumeroContrato());
                if (datosNuevos.getVigenciaInicio() != null) existente.setVigenciaInicio(datosNuevos.getVigenciaInicio());
                if (datosNuevos.getVigenciaFin() != null) existente.setVigenciaFin(datosNuevos.getVigenciaFin());
                if (datosNuevos.getMontoMaximo() != null) existente.setMontoMaximo(datosNuevos.getMontoMaximo());
                if (datosNuevos.getEstatusAdjudicacion() != null) existente.setEstatusAdjudicacion(datosNuevos.getEstatusAdjudicacion());
                if (datosNuevos.getInstrumentoNotarial() != null) existente.setInstrumentoNotarial(datosNuevos.getInstrumentoNotarial());
                if (datosNuevos.getTerminoVigencia() != null) existente.setTerminoVigencia(datosNuevos.getTerminoVigencia());
                if (datosNuevos.getPublicacionTestigoUrl() != null) existente.setPublicacionTestigoUrl(datosNuevos.getPublicacionTestigoUrl());
                if (datosNuevos.getRemanenteSuficiencia() != null) existente.setRemanenteSuficiencia(datosNuevos.getRemanenteSuficiencia());
                if (datosNuevos.getNombreResponsable() != null) existente.setNombreResponsable(datosNuevos.getNombreResponsable());
                if (datosNuevos.getComentarios() != null) existente.setComentarios(datosNuevos.getComentarios());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
                if (datosNuevos.getReprogramacion() != null) existente.setReprogramacion(datosNuevos.getReprogramacion());
            } else {
                if (datosNuevos.getPublicacionTestigoUrl() != null) existente.setPublicacionTestigoUrl(datosNuevos.getPublicacionTestigoUrl());
                if (datosNuevos.getNumeroContrato() != null) existente.setNumeroContrato(datosNuevos.getNumeroContrato());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
            }

            Adjudicacion actualizado = adjudicacionRepo.save(existente);

            auditService.registrar("UPDATE", "ADJUDICACION", id,
                    existente.getFolioInterno(), antes, actualizado,
                    "Adjudicación editada");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAdjudicacion(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un Administrador puede eliminar registros.");
        }

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
