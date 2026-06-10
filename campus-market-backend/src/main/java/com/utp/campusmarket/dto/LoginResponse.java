package com.utp.campusmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de login exitoso.
 * Incluye JWT token y datos del usuario (sin contraseña).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String rol;
    private String nombre;
    private Long idUsuario;
}
