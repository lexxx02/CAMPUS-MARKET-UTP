package com.utp.campusmarket.repository;

import com.utp.campusmarket.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de productos — Consultas de inventario y stock.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Retorna solo los productos activos.
     */
    List<Producto> findByActivoTrue();

    /**
     * Productos activos de una categoría específica.
     * @param idCategoria ID de la categoría
     */
    List<Producto> findByCategoria_IdCategoriaAndActivoTrue(Long idCategoria);

    /**
     * Productos activos con stock bajo en Piso 2 (menor al umbral).
     * @param umbral límite de stock bajo (normalmente 5)
     */
    List<Producto> findByStockPiso2LessThanAndActivoTrue(int umbral);

    /**
     * Productos activos con stock bajo en Piso 7 (menor al umbral).
     * @param umbral límite de stock bajo (normalmente 5)
     */
    List<Producto> findByStockPiso7LessThanAndActivoTrue(int umbral);

    /**
     * Búsqueda de productos por nombre (parcial, case-insensitive).
     * @param nombre texto a buscar en el nombre del producto
     */
    List<Producto> findByNombreProductoContainingIgnoreCaseAndActivoTrue(String nombre);
}
