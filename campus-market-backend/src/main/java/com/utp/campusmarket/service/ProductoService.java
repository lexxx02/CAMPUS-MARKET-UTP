package com.utp.campusmarket.service;

import com.utp.campusmarket.dto.DashboardStatsDTO;
import com.utp.campusmarket.dto.ProductDTO;
import com.utp.campusmarket.entity.Categoria;
import com.utp.campusmarket.entity.Producto;
import com.utp.campusmarket.exception.ResourceNotFoundException;
import com.utp.campusmarket.repository.CategoriaRepository;
import com.utp.campusmarket.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Servicio de productos — CRUD, estadísticas de dashboard y búsqueda.
 */
@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    private static final int UMBRAL_STOCK_BAJO = 5;

    /**
     * Retorna todos los productos activos.
     */
    public List<ProductDTO> getAllProducts() {
        return productoRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retorna un producto por su ID.
     * @throws ResourceNotFoundException si no existe o no está activo
     */
    public ProductDTO getProductById(Long id) {
        Producto producto = productoRepository.findById(id)
                .filter(Producto::getActivo)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return toDTO(producto);
    }

    /**
     * Crea un nuevo producto.
     * @param dto datos del producto a crear
     * @return producto creado con ID asignado
     */
    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getCategoryId()));

        Producto producto = Producto.builder()
                .nombreProducto(dto.getName())
                .descripcion(dto.getDescription())
                .precio(dto.getPrice())
                .stockPiso2(dto.getStockPiso2() != null ? dto.getStockPiso2() : 0)
                .stockPiso7(dto.getStockPiso7() != null ? dto.getStockPiso7() : 0)
                .imagenUrl(dto.getImage())
                .activo(true)
                .categoria(categoria)
                .build();

        Producto saved = productoRepository.save(producto);
        return toDTO(saved);
    }

    /**
     * Actualiza un producto existente.
     * @param id  ID del producto
     * @param dto nuevos datos
     * @return producto actualizado
     */
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        Categoria categoria = categoriaRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getCategoryId()));

        producto.setNombreProducto(dto.getName());
        producto.setDescripcion(dto.getDescription());
        producto.setPrecio(dto.getPrice());
        producto.setStockPiso2(dto.getStockPiso2() != null ? dto.getStockPiso2() : producto.getStockPiso2());
        producto.setStockPiso7(dto.getStockPiso7() != null ? dto.getStockPiso7() : producto.getStockPiso7());
        producto.setImagenUrl(dto.getImage());
        producto.setCategoria(categoria);

        Producto saved = productoRepository.save(producto);
        return toDTO(saved);
    }

    /**
     * Soft-delete: establece activo = false en lugar de eliminar el registro.
     * @param id ID del producto
     */
    @Transactional
    public void deleteProduct(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    /**
     * Busca productos por nombre (parcial, case-insensitive).
     */
    public List<ProductDTO> searchProducts(String query) {
        return productoRepository.findByNombreProductoContainingIgnoreCaseAndActivoTrue(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Filtra productos por categoría.
     */
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productoRepository.findByCategoria_IdCategoriaAndActivoTrue(categoryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Calcula las estadísticas del dashboard administrativo.
     * Incluye: totalProductos, disponibles, bajoStock, agotados, totalUnidades, stockCrítico.
     */
    public DashboardStatsDTO getDashboardStats() {
        List<Producto> productos = productoRepository.findByActivoTrue();

        int totalProductos = productos.size();
        int disponibles = 0;
        int bajoStock = 0;
        int agotados = 0;
        int totalUnidades = 0;

        for (Producto p : productos) {
            int totalStock = p.getStockPiso2() + p.getStockPiso7();
            totalUnidades += totalStock;

            if (totalStock == 0) {
                agotados++;
            } else if (p.getStockPiso2() < UMBRAL_STOCK_BAJO || p.getStockPiso7() < UMBRAL_STOCK_BAJO) {
                bajoStock++;
            } else {
                disponibles++;
            }
        }

        // Productos con stock < 5 en cualquier kiosco
        List<ProductDTO> stockCritico = productos.stream()
                .filter(p -> p.getStockPiso2() < UMBRAL_STOCK_BAJO || p.getStockPiso7() < UMBRAL_STOCK_BAJO)
                .map(this::toDTO)
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalProductos(totalProductos)
                .disponibles(disponibles)
                .bajoStock(bajoStock)
                .agotados(agotados)
                .totalUnidades(totalUnidades)
                .stockCritico(stockCritico)
                .build();
    }

    /**
     * Convierte una entidad Producto a ProductDTO.
     */
    private ProductDTO toDTO(Producto p) {
        return ProductDTO.builder()
                .id(p.getIdProducto())
                .name(p.getNombreProducto())
                .description(p.getDescripcion())
                .price(p.getPrecio())
                .stockPiso2(p.getStockPiso2())
                .stockPiso7(p.getStockPiso7())
                .image(p.getImagenUrl())
                .active(p.getActivo())
                .categoryId(p.getCategoria() != null ? p.getCategoria().getIdCategoria() : null)
                .categoryName(p.getCategoria() != null ? p.getCategoria().getNombre() : null)

                .build();
    }
}
