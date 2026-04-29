package com.MVP.proto.controller;

import com.MVP.proto.model.EstudioMercado;
import com.MVP.proto.model.Expediente;
import com.MVP.proto.repository.EstudioRepository;
import com.MVP.proto.repository.ExpedienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Endpoint para GUARDAR (POST) - Ahora auto-crea Expediente
    @PostMapping
    public ResponseEntity<EstudioMercado> guardarEstudio(@RequestBody EstudioMercado estudio) {
        
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
        
        return ResponseEntity.ok(nuevoEstudio);
    }

    // Endpoint para CONSULTAR (GET)
    @GetMapping("/lista")
    public List<EstudioMercado> getListaEstudios() {
        return estudioRepo.findAllByOrderByFechaIngresoDesc();
    }
}