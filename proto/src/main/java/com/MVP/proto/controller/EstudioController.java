package com.MVP.proto.controller;

import com.MVP.proto.model.EstudioMercado;
import com.MVP.proto.repository.EstudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EstudioController {

    @Autowired
    private EstudioRepository estudioRepo;

    // Endpoint para GUARDAR (POST)
    @PostMapping
    public ResponseEntity<EstudioMercado> guardarEstudio(@RequestBody EstudioMercado estudio) {
        
        // Guardamos primero para obtener el ID generado por la BD
        EstudioMercado nuevoEstudio = estudioRepo.save(estudio);
        
        // Opcional: Si quieres actualizar el folio con el ID real después de guardar
        if (nuevoEstudio.getFolio() == null || nuevoEstudio.getFolio().isEmpty()) {
             nuevoEstudio.setFolio("EM-2026-" + nuevoEstudio.getId());
             estudioRepo.save(nuevoEstudio); // Guardamos de nuevo para actualizar el folio
        }
        
        return ResponseEntity.ok(nuevoEstudio);
    }

    // Endpoint para CONSULTAR (GET)
    @GetMapping("/lista")
    public List<EstudioMercado> getListaEstudios() {
        // Asegúrate que este método exista en tu EstudioRepository
        return estudioRepo.findAllByOrderByFechaIngresoDesc();
    }
}