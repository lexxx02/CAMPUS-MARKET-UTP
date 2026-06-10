package com.utp.campusmarket.exception;

/**
 * Excepción para recursos no encontrados (HTTP 404).
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
