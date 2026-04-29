package com.MVP.proto.controller; // ⚠️ IMPORTANTE

import com.MVP.proto.model.Tarea;
import com.MVP.proto.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:5173") // Permite conexión desde React
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @GetMapping
    public List<Tarea> getAllTareas() {
        return tareaRepository.findAll();
    }

    @PostMapping
    public Tarea createTarea(@RequestBody Tarea tarea) {
        return tareaRepository.save(tarea);
    }
}