package com.utp.campusmarket.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuración JWT — Lee propiedades desde application.properties.
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {

    /**
     * Clave secreta para firmar tokens JWT.
     */
    private String secret;

    /**
     * Tiempo de expiración del token en milisegundos (default: 24 horas).
     */
    private long expiration = 86400000;
}
