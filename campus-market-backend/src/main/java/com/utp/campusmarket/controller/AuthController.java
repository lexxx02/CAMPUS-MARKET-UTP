package com.utp.campusmarket.controller;

import com.utp.campusmarket.dto.LoginRequest;
import com.utp.campusmarket.dto.LoginResponse;
import com.utp.campusmarket.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticación — Login con JWT.
 * POST /api/auth/login — Ruta pública.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Autentica un usuario y retorna un token JWT.
     *
     * @param request correo y contraseña del usuario
     * @return JWT token + datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
