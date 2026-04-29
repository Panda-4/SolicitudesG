package com.MVP.proto.controller;

import com.MVP.proto.model.ProcedimientoAdquisitivo;
import com.MVP.proto.repository.ProcedimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/procedimientos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProcedimientoController {

    @Autowired
    private ProcedimientoRepository procedimientoRepo;

    // Endpoint para GUARDAR (POST)
    @PostMapping
    public ResponseEntity<ProcedimientoAdquisitivo> guardarProcedimiento(@RequestBody ProcedimientoAdquisitivo procedimiento) {
        if (procedimiento.getFechaRegistro() == null || procedimiento.getFechaRegistro().isEmpty()) {
            procedimiento.setFechaRegistro(LocalDate.now().toString());
        }
        ProcedimientoAdquisitivo nuevo = procedimientoRepo.save(procedimiento);
        return ResponseEntity.ok(nuevo);
    }

    // Endpoint para CONSULTAR (GET)
    @GetMapping("/lista")
    public List<ProcedimientoAdquisitivo> getListaProcedimientos() {
        return procedimientoRepo.findAllByOrderByFechaRegistroDesc();
    }

    // Endpoint para obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProcedimientoAdquisitivo> getProcedimientoById(@PathVariable Long id) {
        return procedimientoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
