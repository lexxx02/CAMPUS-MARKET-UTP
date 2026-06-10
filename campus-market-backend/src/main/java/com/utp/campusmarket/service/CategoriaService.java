package com.utp.campusmarket.service;

import com.utp.campusmarket.dto.CategoryDTO;
import com.utp.campusmarket.entity.Categoria;
import com.utp.campusmarket.exception.ResourceNotFoundException;
import com.utp.campusmarket.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de categorías — CRUD con soft delete.
 */
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    /**
     * Retorna todas las categorías activas.
     */
    public List<CategoryDTO> getAllCategories() {
        return categoriaRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea una nueva categoría.
     * @param dto datos de la categoría
     * @return categoría creada con ID asignado
     */
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        Categoria categoria = Categoria.builder()
                .nombre(dto.getName())

                .activo(true)
                .build();

        Categoria saved = categoriaRepository.save(categoria);
        return toDTO(saved);
    }

    /**
     * Actualiza una categoría existente.
     * @param id  ID de la categoría
     * @param dto nuevos datos
     * @return categoría actualizada
     */
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));

        categoria.setNombre(dto.getName());


        Categoria saved = categoriaRepository.save(categoria);
        return toDTO(saved);
    }

    /**
     * Soft-delete: establece activo = false en lugar de eliminar el registro.
     * @param id ID de la categoría
     */
    @Transactional
    public void deleteCategory(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
        categoria.setActivo(false);
        categoriaRepository.save(categoria);
    }

    /**
     * Convierte entidad Categoria a CategoryDTO.
     */
    private CategoryDTO toDTO(Categoria c) {
        return CategoryDTO.builder()
                .id(c.getIdCategoria())
                .name(c.getNombre())

                .active(c.getActivo())
                .build();
    }
}
