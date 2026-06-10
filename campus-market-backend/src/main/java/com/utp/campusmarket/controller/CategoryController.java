package com.utp.campusmarket.controller;

import com.utp.campusmarket.dto.CategoryDTO;
import com.utp.campusmarket.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de categorías — CRUD.
 * Base path: /api/categories
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoriaService categoriaService;

    /**
     * Lista todas las categorías activas.
     * Acceso: ADMIN + ESTUDIANTE
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriaService.getAllCategories());
    }

    /**
     * Crea una nueva categoría.
     * Acceso: solo ADMIN
     */
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.createCategory(dto));
    }

    /**
     * Actualiza una categoría existente.
     * Acceso: solo ADMIN
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoriaService.updateCategory(id, dto));
    }

    /**
     * Elimina una categoría (soft delete: activo = false).
     * Acceso: solo ADMIN
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoriaService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
