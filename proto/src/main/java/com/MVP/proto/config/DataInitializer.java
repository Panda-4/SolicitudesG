package com.MVP.proto.config;

import com.MVP.proto.model.Rol;
import com.MVP.proto.model.Usuario;
import com.MVP.proto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Si no hay usuarios en la BD, crear el admin por defecto
        if (usuarioRepo.count() == 0) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombreCompleto("Administrador DGRM");
            admin.setRol(Rol.ADMINISTRADOR);
            admin.setActivo(true);
            admin.setFechaCreacion(LocalDate.now().toString());
            usuarioRepo.save(admin);

            System.out.println("════════════════════════════════════════════");
            System.out.println("  ✅ Usuario ADMIN creado por defecto");
            System.out.println("  👤 Usuario: admin");
            System.out.println("  🔑 Contraseña: admin123");
            System.out.println("  ⚠️  CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN");
            System.out.println("════════════════════════════════════════════");
        }
    }
}
