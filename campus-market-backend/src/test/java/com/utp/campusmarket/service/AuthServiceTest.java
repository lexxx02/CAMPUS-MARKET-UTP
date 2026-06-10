package com.utp.campusmarket.service;

import com.utp.campusmarket.dto.LoginRequest;
import com.utp.campusmarket.dto.LoginResponse;
import com.utp.campusmarket.entity.Usuario;
import com.utp.campusmarket.repository.UsuarioRepository;
import com.utp.campusmarket.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private Usuario admin;

    @BeforeEach
    void setUp() {
        admin = Usuario.builder()
                .idUsuario(1L)
                .nombre("Administrador UTP")
                .correo("admin@utp.edu.pe")
                .contrasena("$2a$10$hashedPassword")
                .rol("ADMIN")
                .build();
    }

    @Test
    @DisplayName("Login con credenciales válidas retorna token JWT")
    void testLogin_withValidCredentials_returnsToken() {
        LoginRequest request = new LoginRequest("admin@utp.edu.pe", "admin123");

        when(usuarioRepository.findByCorreo("admin@utp.edu.pe")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("admin123", "$2a$10$hashedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken(anyString(), anyString(), anyString(), anyLong()))
                .thenReturn("jwt-token-generado");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token-generado", response.getToken());
        assertEquals("ADMIN", response.getRol());
        assertEquals("Administrador UTP", response.getNombre());
        assertEquals(1L, response.getIdUsuario());
    }

    @Test
    @DisplayName("Login con contraseña inválida lanza excepción")
    void testLogin_withInvalidPassword_throwsException() {
        LoginRequest request = new LoginRequest("admin@utp.edu.pe", "wrongPassword");

        when(usuarioRepository.findByCorreo("admin@utp.edu.pe")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrongPassword", "$2a$10$hashedPassword")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(request));

        assertEquals("Credenciales incorrectas", exception.getMessage());
        verify(jwtTokenProvider, never()).generateToken(anyString(), anyString(), anyString(), anyLong());
    }

    @Test
    @DisplayName("Login con usuario inexistente lanza excepción")
    void testLogin_withNonExistentUser_throwsException() {
        LoginRequest request = new LoginRequest("noexiste@utp.edu.pe", "password");

        when(usuarioRepository.findByCorreo("noexiste@utp.edu.pe")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(request));

        assertEquals("Credenciales incorrectas", exception.getMessage());
    }
}
