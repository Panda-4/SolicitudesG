package com.MVP.proto.controller;

import com.MVP.proto.model.AfectacionPresupuestal;
import com.MVP.proto.repository.AfectacionRepository;
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

    // Endpoint para GUARDAR (POST)
    @PostMapping
    public ResponseEntity<AfectacionPresupuestal> guardarAfectacion(@RequestBody AfectacionPresupuestal afectacion) {
        
        // Establecer fecha de registro si no viene
        if (afectacion.getFechaRegistro() == null || afectacion.getFechaRegistro().isEmpty()) {
            afectacion.setFechaRegistro(LocalDate.now().toString());
        }

        // Guardar para obtener el ID
        AfectacionPresupuestal nueva = afectacionRepo.save(afectacion);
        
        // Generar folio CA automático si no tiene
        if (nueva.getFolioCa() == null || nueva.getFolioCa().isEmpty()) {
            nueva.setFolioCa("CA-2026-" + nueva.getId());
            afectacionRepo.save(nueva);
        }

        return ResponseEntity.ok(nueva);
    }

    // Endpoint para CONSULTAR (GET)
    @GetMapping("/lista")
    public List<AfectacionPresupuestal> getListaAfectaciones() {
        return afectacionRepo.findAllByOrderByFechaRegistroDesc();
    }

    // Endpoint para obtener una afectación por ID
    @GetMapping("/{id}")
    public ResponseEntity<AfectacionPresupuestal> getAfectacionById(@PathVariable Long id) {
        return afectacionRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
