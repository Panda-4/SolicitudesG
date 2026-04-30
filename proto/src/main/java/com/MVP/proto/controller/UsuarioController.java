package com.MVP.proto.controller;

import com.MVP.proto.model.Rol;
import com.MVP.proto.model.Usuario;
import com.MVP.proto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos los usuarios (sin exponer passwords)
    @GetMapping
    public List<Map<String, Object>> listarUsuarios() {
        return usuarioRepo.findAll().stream().map(u -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("nombreCompleto", u.getNombreCompleto());
            map.put("rol", u.getRol().name());
            map.put("activo", u.getActivo());
            map.put("fechaCreacion", u.getFechaCreacion());
            return map;
        }).toList();
    }

    // Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String nombre = body.get("nombreCompleto");
        String rolStr = body.get("rol");

        if (username == null || password == null || rolStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Campos requeridos: username, password, rol"));
        }

        if (usuarioRepo.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya existe"));
        }

        try {
            Usuario nuevo = new Usuario();
            nuevo.setUsername(username);
            nuevo.setPassword(passwordEncoder.encode(password));
            nuevo.setNombreCompleto(nombre != null ? nombre : username);
            nuevo.setRol(Rol.valueOf(rolStr));
            nuevo.setActivo(true);
            nuevo.setFechaCreacion(LocalDate.now().toString());

            usuarioRepo.save(nuevo);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario creado exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rol no válido: " + rolStr));
        }
    }

    // Actualizar un usuario (sin cambiar password a menos que se envíe)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return usuarioRepo.findById(id).map(usuario -> {
            if (body.containsKey("nombreCompleto")) {
                usuario.setNombreCompleto(body.get("nombreCompleto"));
            }
            if (body.containsKey("rol")) {
                try {
                    usuario.setRol(Rol.valueOf(body.get("rol")));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body((Object) Map.of("error", "Rol no válido"));
                }
            }
            if (body.containsKey("activo")) {
                usuario.setActivo(Boolean.parseBoolean(body.get("activo")));
            }
            if (body.containsKey("password") && !body.get("password").isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(body.get("password")));
            }

            usuarioRepo.save(usuario);
            return ResponseEntity.ok((Object) Map.of("mensaje", "Usuario actualizado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Desactivar/Activar un usuario (toggle)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleUsuario(@PathVariable Long id) {
        return usuarioRepo.findById(id).map(usuario -> {
            usuario.setActivo(!usuario.getActivo());
            usuarioRepo.save(usuario);
            return ResponseEntity.ok(Map.of(
                    "mensaje", usuario.getActivo() ? "Usuario activado" : "Usuario desactivado",
                    "activo", usuario.getActivo()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
