package com.utp.campusmarket.security;

import com.utp.campusmarket.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

/**
 * Proveedor de tokens JWT — Genera, valida y extrae información de tokens.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    private final JwtConfig jwtConfig;
    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    /**
     * Genera un token JWT con los claims del usuario.
     *
     * @param correo    correo del usuario (subject)
     * @param rol       rol del usuario (ADMIN/ESTUDIANTE)
     * @param nombre    nombre del usuario
     * @param idUsuario ID del usuario
     * @return token JWT firmado
     */
    public String generateToken(String correo, String rol, String nombre, Long idUsuario) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration());

        return Jwts.builder()
                .setSubject(correo)
                .claim("rol", rol)
                .claim("nombre", nombre)
                .claim("idUsuario", idUsuario)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrae el correo (subject) del token.
     */
    public String getCorreoFromToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extrae el rol del token.
     */
    public String getRolFromToken(String token) {
        return getClaims(token).get("rol", String.class);
    }

    /**
     * Valida si el token es válido y no ha expirado.
     */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Token JWT malformado");
        } catch (ExpiredJwtException ex) {
            log.error("Token JWT expirado");
        } catch (UnsupportedJwtException ex) {
            log.error("Token JWT no soportado");
        } catch (IllegalArgumentException ex) {
            log.error("Token JWT vacío");
        } catch (Exception ex) {
            log.error("Error al validar token JWT: {}", ex.getMessage());
        }
        return false;
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
