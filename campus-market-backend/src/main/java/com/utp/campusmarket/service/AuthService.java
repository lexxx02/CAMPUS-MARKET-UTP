package com.utp.campusmarket.service;

import com.utp.campusmarket.config.JwtConfig;
import com.utp.campusmarket.dto.LoginRequest;
import com.utp.campusmarket.dto.LoginResponse;
import com.utp.campusmarket.entity.Usuario;
import com.utp.campusmarket.repository.UsuarioRepository;
import com.utp.campusmarket.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticación — Login con BCrypt y generación de JWT.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Autentica un usuario por correo y contraseña.
     * Valida la contraseña con BCryptPasswordEncoder y genera un JWT.
     *
     * @param request datos de login (correo + contraseña)
     * @return LoginResponse con token JWT y datos del usuario
     * @throws RuntimeException si las credenciales son inválidas
     */
    public LoginResponse login(LoginRequest request) {
        // Buscar usuario por correo
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // Validar contraseña con BCrypt
        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        // Generar JWT con claims del usuario
        String token = jwtTokenProvider.generateToken(
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.getNombre(),
                usuario.getIdUsuario()
        );

        return LoginResponse.builder()
                .token(token)
                .rol(usuario.getRol())
                .nombre(usuario.getNombre())
                .idUsuario(usuario.getIdUsuario())
                .build();
    }
}
