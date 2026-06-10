package com.utp.campusmarket.controller;

import com.utp.campusmarket.dto.DashboardStatsDTO;
import com.utp.campusmarket.dto.ProductDTO;
import com.utp.campusmarket.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de productos — CRUD + dashboard + búsqueda.
 * Base path: /api/products
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductoService productoService;

    /**
     * Lista todos los productos activos.
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productoService.getAllProducts());
    }

    /**
     * Obtiene un producto por ID.
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductById(id));
    }

    /**
     * Crea un nuevo producto.
     * Acceso: solo ADMIN
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.createProduct(dto));
    }

    /**
     * Actualiza un producto existente.
     * Acceso: solo ADMIN
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productoService.updateProduct(id, dto));
    }

    /**
     * Elimina un producto (soft delete: activo = false).
     * Acceso: solo ADMIN
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productoService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Estadísticas del dashboard administrativo.
     * Acceso: solo ADMIN
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(productoService.getDashboardStats());
    }

    /**
     * Busca productos por nombre (parcial, case-insensitive).
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam("q") String query) {
        return ResponseEntity.ok(productoService.searchProducts(query));
    }

    /**
     * Filtra productos por categoría.
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping("/category/{id}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductsByCategory(id));
    }
}
