package com.utp.campusmarket.repository;

import com.utp.campusmarket.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de categorías — Consultas de categorías activas.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /**
     * Retorna solo las categorías activas.
     * @return lista de categorías activas
     */
    List<Categoria> findByActivoTrue();
}
