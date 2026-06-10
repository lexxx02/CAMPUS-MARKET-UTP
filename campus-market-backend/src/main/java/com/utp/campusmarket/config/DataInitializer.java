package com.utp.campusmarket.config;

import com.utp.campusmarket.entity.Usuario;
import com.utp.campusmarket.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Inicializador de datos que crea usuarios con contraseñas BCrypt reales.
 * Se ejecuta al arrancar la aplicación. Solo inserta si no existen.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Crear usuario ADMIN si no existe
        if (usuarioRepository.findByCorreo("admin").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador UTP")
                    .correo("admin")
                    .contrasena(passwordEncoder.encode("admin123"))
                    .rol("ADMIN")
                    .build();
            usuarioRepository.save(admin);
            log.info("✅ Usuario ADMIN creado: admin");
        }

        log.info("🚀 Campus Market Backend inicializado correctamente");
    }
}
