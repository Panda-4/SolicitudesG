package com.MVP.proto.controller;

import com.MVP.proto.model.Adjudicacion;
import com.MVP.proto.repository.AdjudicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/adjudicaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdjudicacionController {

    @Autowired
    private AdjudicacionRepository adjudicacionRepo;

    @PostMapping
    public ResponseEntity<Adjudicacion> guardarAdjudicacion(@RequestBody Adjudicacion adjudicacion) {
        if (adjudicacion.getFechaRegistro() == null || adjudicacion.getFechaRegistro().isEmpty()) {
            adjudicacion.setFechaRegistro(LocalDate.now().toString());
        }
        Adjudicacion nueva = adjudicacionRepo.save(adjudicacion);
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
}
