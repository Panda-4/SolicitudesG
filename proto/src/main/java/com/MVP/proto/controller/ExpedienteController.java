package com.MVP.proto.controller;

import com.MVP.proto.model.Expediente;
import com.MVP.proto.repository.ExpedienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expedientes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ExpedienteController {

    @Autowired
    private ExpedienteRepository expedienteRepo;

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
}
