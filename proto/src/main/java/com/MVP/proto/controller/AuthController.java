package com.MVP.proto.controller;

import com.MVP.proto.model.Rol;
import com.MVP.proto.model.Usuario;
import com.MVP.proto.repository.UsuarioRepository;
import com.MVP.proto.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // === LOGIN ===
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario y contraseña son requeridos"));
        }

        return usuarioRepo.findByUsername(username)
                .map(usuario -> {
                    if (!usuario.getActivo()) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body((Object) Map.of("error", "Usuario desactivado. Contacte al administrador."));
                    }

                    if (passwordEncoder.matches(password, usuario.getPassword())) {
                        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name());

                        Map<String, Object> response = new LinkedHashMap<>();
                        response.put("token", token);
                        response.put("username", usuario.getUsername());
                        response.put("nombreCompleto", usuario.getNombreCompleto());
                        response.put("rol", usuario.getRol().name());
                        response.put("id", usuario.getId());

                        return ResponseEntity.ok((Object) response);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body((Object) Map.of("error", "Contraseña incorrecta"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no encontrado")));
    }

    // === REGISTRO (público solo para crear el primer usuario, después se usa /api/usuarios) ===
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String nombre = body.get("nombreCompleto");
        String rolStr = body.get("rol");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Campos requeridos: username, password"));
        }

        if (usuarioRepo.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El usuario ya existe"));
        }

        Usuario nuevo = new Usuario();
        nuevo.setUsername(username);
        nuevo.setPassword(passwordEncoder.encode(password));
        nuevo.setNombreCompleto(nombre != null ? nombre : username);
        nuevo.setRol(rolStr != null ? Rol.valueOf(rolStr) : Rol.CONSULTOR);
        nuevo.setActivo(true);
        nuevo.setFechaCreacion(LocalDate.now().toString());

        usuarioRepo.save(nuevo);

        return ResponseEntity.ok(Map.of("mensaje", "Usuario creado exitosamente", "username", username));
    }
}
