package com.MVP.proto.controller;

import com.MVP.proto.model.EstudioMercado;
import com.MVP.proto.model.Expediente;
import com.MVP.proto.repository.EstudioRepository;
import com.MVP.proto.repository.ExpedienteRepository;
import com.MVP.proto.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EstudioController {

    @Autowired
    private EstudioRepository estudioRepo;

    @Autowired
    private ExpedienteRepository expedienteRepo;

    @Autowired
    private AuditService auditService;

    // Endpoint para GUARDAR (POST) - Auto-crea Expediente
    @PostMapping
    public ResponseEntity<EstudioMercado> guardarEstudio(@RequestBody EstudioMercado estudio) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            estudio.setCreadorUsername(auth.getName());
        }

        // 1. Crear el Expediente maestro automáticamente
        Expediente expediente = new Expediente();
        expediente.setEstatusGeneral("Activo");
        expediente.setFechaCreacion(LocalDate.now().toString());
        expediente.setDependencia(estudio.getDependencia());
        expediente.setDescripcionBreve("Estudio de Mercado - " + (estudio.getDependencia() != null ? estudio.getDependencia() : "Sin dependencia"));
        
        // Guardar expediente para obtener el ID
        Expediente expedienteGuardado = expedienteRepo.save(expediente);
        
        // Generar folio del expediente con el ID
        expedienteGuardado.setFolioExpediente("EXP-2026-" + expedienteGuardado.getId());
        expedienteRepo.save(expedienteGuardado);

        // 2. Asignar el expediente al estudio
        estudio.setExpediente(expedienteGuardado);
        
        // 3. Guardar el estudio
        EstudioMercado nuevoEstudio = estudioRepo.save(estudio);
        
        // 4. Generar folio del estudio si no tiene
        if (nuevoEstudio.getFolio() == null || nuevoEstudio.getFolio().isEmpty()) {
             nuevoEstudio.setFolio("EM-2026-" + nuevoEstudio.getId());
             estudioRepo.save(nuevoEstudio);
        }

        // 5. Auditoría
        auditService.registrar("CREATE", "ESTUDIO", nuevoEstudio.getId(),
                nuevoEstudio.getFolio(), null, nuevoEstudio,
                "Nuevo estudio de mercado registrado");
        
        return ResponseEntity.ok(nuevoEstudio);
    }

    // Endpoint para CONSULTAR (GET)
    @GetMapping("/lista")
    public List<EstudioMercado> getListaEstudios() {
        return estudioRepo.findAllByOrderByFechaIngresoDesc();
    }

    // Endpoint para EDITAR (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> editarEstudio(@PathVariable Long id, @RequestBody EstudioMercado datosNuevos) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        String currentUsername = auth != null ? auth.getName() : "";

        return estudioRepo.findById(id).map(existente -> {
            
            if (!isAdmin) {
                // Verificar pertenencia
                if (!currentUsername.equals(existente.getCreadorUsername())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para editar este registro.");
                }
            }

            // Snapshot antes
            EstudioMercado antes = new EstudioMercado();
            antes.setId(existente.getId());
            antes.setFolio(existente.getFolio());
            antes.setDependencia(existente.getDependencia());
            antes.setCentroCosto(existente.getCentroCosto());
            antes.setOrigenRecurso(existente.getOrigenRecurso());
            antes.setCapitulo(existente.getCapitulo());
            antes.setPartida(existente.getPartida());
            antes.setGiro(existente.getGiro());
            antes.setValorEstudio(existente.getValorEstudio());
            antes.setEstatus(existente.getEstatus());
            antes.setMontoSabys(existente.getMontoSabys());
            antes.setDescripcionBien(existente.getDescripcionBien());
            antes.setContratacionPlurianual(existente.getContratacionPlurianual());

            // Aplicar cambios según el rol
            if (isAdmin) {
                if (datosNuevos.getDependencia() != null) existente.setDependencia(datosNuevos.getDependencia());
                if (datosNuevos.getCentroCosto() != null) existente.setCentroCosto(datosNuevos.getCentroCosto());
                if (datosNuevos.getOrigenRecurso() != null) existente.setOrigenRecurso(datosNuevos.getOrigenRecurso());
                if (datosNuevos.getCapitulo() != null) existente.setCapitulo(datosNuevos.getCapitulo());
                if (datosNuevos.getPartida() != null) existente.setPartida(datosNuevos.getPartida());
                if (datosNuevos.getGiro() != null) existente.setGiro(datosNuevos.getGiro());
                if (datosNuevos.getValorEstudio() != null) existente.setValorEstudio(datosNuevos.getValorEstudio());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
                if (datosNuevos.getMontoSabys() != null) existente.setMontoSabys(datosNuevos.getMontoSabys());
                if (datosNuevos.getDescripcionBien() != null) existente.setDescripcionBien(datosNuevos.getDescripcionBien());
                if (datosNuevos.getContratacionPlurianual() != null) existente.setContratacionPlurianual(datosNuevos.getContratacionPlurianual());
            } else {
                // ESTUDIO_MERCADO solo actualiza campos permitidos
                if (datosNuevos.getValorEstudio() != null) existente.setValorEstudio(datosNuevos.getValorEstudio());
                if (datosNuevos.getEstatus() != null) existente.setEstatus(datosNuevos.getEstatus());
                if (datosNuevos.getMontoSabys() != null) existente.setMontoSabys(datosNuevos.getMontoSabys());
            }

            EstudioMercado actualizado = estudioRepo.save(existente);

            auditService.registrar("UPDATE", "ESTUDIO", id,
                    existente.getFolio(), antes, actualizado,
                    "Estudio de mercado editado");

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para ELIMINAR (DELETE) — Solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEstudio(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un Administrador puede eliminar registros.");
        }

        return estudioRepo.findById(id).map(estudio -> {
            auditService.registrar("DELETE", "ESTUDIO", id,
                    estudio.getFolio(), estudio, null,
                    "Estudio de mercado eliminado: " + estudio.getFolio());

            estudioRepo.delete(estudio);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}