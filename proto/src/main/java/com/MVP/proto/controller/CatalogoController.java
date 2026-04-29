package com.MVP.proto.controller;

import com.MVP.proto.model.Dependencia;
import com.MVP.proto.model.Giro;
import com.MVP.proto.model.Partida;
import com.MVP.proto.model.Capitulo; // Asegúrate de importar la clase Capitulo
import com.MVP.proto.repository.DependenciaRepository;
import com.MVP.proto.repository.GiroRepository;
import com.MVP.proto.repository.PartidaRepository;
import com.MVP.proto.repository.CapituloRepository; // Asegúrate de importar el repositorio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "*") // Permite acceso desde React (CORS)
public class CatalogoController {

    @Autowired
    private DependenciaRepository dependenciaRepo;

    @Autowired
    private CapituloRepository capituloRepo;

    @Autowired
    private PartidaRepository partidaRepo; //

    @Autowired
    private GiroRepository giroRepo;

    @GetMapping("/giros")
    public List<Giro> getGiros() {
        return giroRepo.findAll();
    }

    // Endpoint para obtener todas las Dependencias
    @GetMapping("/dependencias")
    public List<Dependencia> getDependencias() {
        return dependenciaRepo.findAll();
    }

    // Endpoint para obtener todos los Capítulos Presupuestales
    @GetMapping("/capitulos")
    public List<Capitulo> getCapitulos() {
        return capituloRepo.findAll();
    }

        // Endpoint para obtener Partidas Presupuestales
    @GetMapping("/partidas")
    public List<Partida> getPartidas() {
        return partidaRepo.findAll();
    }

}
