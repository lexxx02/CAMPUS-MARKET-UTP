package com.utp.campusmarket.controller;

import com.utp.campusmarket.dto.KioskDTO;
import com.utp.campusmarket.dto.ProductDTO;
import com.utp.campusmarket.service.KioscoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de kioscos — Gestión de stock por ubicación.
 * Base path: /api/kiosks
 */
@RestController
@RequestMapping("/api/kiosks")
@RequiredArgsConstructor
public class KioskController {

    private final KioscoService kioscoService;

    /**
     * Lista todos los kioscos activos.
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping
    public ResponseEntity<List<KioskDTO>> getAllKiosks() {
        return ResponseEntity.ok(kioscoService.getAllKiosks());
    }

    /**
     * Lista productos de un kiosco específico.
     * @param kiosk identificador del kiosco ("piso2" o "piso7")
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping("/{kiosk}/products")
    public ResponseEntity<List<ProductDTO>> getProductsByKiosk(@PathVariable String kiosk) {
        return ResponseEntity.ok(kioscoService.getProductsByKiosk(kiosk));
    }

    /**
     * Actualiza el stock de un producto en un kiosco específico.
     * @param kiosk     "piso2" o "piso7"
     * @param id        ID del producto
     * @param body      {"cantidad": 10}
     * Acceso: solo ADMIN
     */
    @PatchMapping("/{kiosk}/products/{id}/stock")
    public ResponseEntity<ProductDTO> updateKioskStock(
            @PathVariable String kiosk,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        int cantidad = body.getOrDefault("cantidad", 0);
        return ResponseEntity.ok(kioscoService.updateKioskStock(id, kiosk, cantidad));
    }
}
