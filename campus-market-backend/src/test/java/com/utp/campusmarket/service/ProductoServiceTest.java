package com.utp.campusmarket.service;

import com.utp.campusmarket.dto.DashboardStatsDTO;
import com.utp.campusmarket.dto.ProductDTO;
import com.utp.campusmarket.entity.Categoria;
import com.utp.campusmarket.entity.Producto;
import com.utp.campusmarket.exception.ResourceNotFoundException;
import com.utp.campusmarket.repository.CategoriaRepository;
import com.utp.campusmarket.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoService productoService;

    private Categoria categoria;
    private Producto productoActivo;
    private Producto productoInactivo;
    private Producto productoBajoStock;
    private Producto productoAgotado;

    @BeforeEach
    void setUp() {
        categoria = Categoria.builder()
                .idCategoria(1L)
                .nombre("Snack")

                .activo(true)
                .build();

        productoActivo = Producto.builder()
                .idProducto(1L)
                .nombreProducto("Doritos")
                .descripcion("Tortilla chips")
                .precio(BigDecimal.valueOf(3.50))
                .stockPiso2(15)
                .stockPiso7(10)
                .imagenUrl("https://example.com/doritos.jpg")
                .activo(true)
                .categoria(categoria)
                .build();

        productoInactivo = Producto.builder()
                .idProducto(2L)
                .nombreProducto("Producto Eliminado")
                .descripcion("Ya no disponible")
                .precio(BigDecimal.valueOf(2.00))
                .stockPiso2(0)
                .stockPiso7(0)
                .activo(false)
                .categoria(categoria)
                .build();

        productoBajoStock = Producto.builder()
                .idProducto(3L)
                .nombreProducto("Red Bull")
                .descripcion("Energizante")
                .precio(BigDecimal.valueOf(7.00))
                .stockPiso2(2)
                .stockPiso7(1)
                .activo(true)
                .categoria(categoria)
                .build();

        productoAgotado = Producto.builder()
                .idProducto(4L)
                .nombreProducto("KitKat")
                .descripcion("Chocolate")
                .precio(BigDecimal.valueOf(2.50))
                .stockPiso2(0)
                .stockPiso7(0)
                .activo(true)
                .categoria(categoria)
                .build();
    }

    @Test
    @DisplayName("getAllProducts retorna solo productos activos")
    void testGetAllProducts_returnsOnlyActiveProducts() {
        when(productoRepository.findByActivoTrue())
                .thenReturn(Arrays.asList(productoActivo, productoBajoStock));

        List<ProductDTO> result = productoService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("Doritos", result.get(0).getName());
        assertEquals("Red Bull", result.get(1).getName());
        verify(productoRepository).findByActivoTrue();
    }

    @Test
    @DisplayName("createProduct con datos válidos retorna producto creado")
    void testCreateProduct_withValidData_returnsCreatedProduct() {
        ProductDTO dto = ProductDTO.builder()
                .name("Nuevo Producto")
                .description("Descripción")
                .price(BigDecimal.valueOf(5.00))
                .stockPiso2(10)
                .stockPiso7(8)
                .categoryId(1L)
                .build();

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            p.setIdProducto(99L);
            return p;
        });

        ProductDTO result = productoService.createProduct(dto);

        assertNotNull(result);
        assertEquals("Nuevo Producto", result.getName());
        assertEquals(10, result.getStockPiso2());
        assertEquals(8, result.getStockPiso7());
        verify(productoRepository).save(any(Producto.class));
    }

    @Test
    @DisplayName("deleteProduct establece activo = false (soft delete)")
    void testDeleteProduct_setsActivoToFalse() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoActivo));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoActivo);

        productoService.deleteProduct(1L);

        assertFalse(productoActivo.getActivo());
        verify(productoRepository).save(productoActivo);
    }

    @Test
    @DisplayName("getDashboardStats calcula conteos correctos")
    void testGetDashboardStats_calculatesCorrectCounts() {
        when(productoRepository.findByActivoTrue())
                .thenReturn(Arrays.asList(productoActivo, productoBajoStock, productoAgotado));

        DashboardStatsDTO stats = productoService.getDashboardStats();

        assertEquals(3, stats.getTotalProductos());
        assertEquals(1, stats.getDisponibles());      // productoActivo (15+10 >= 5 en ambos)
        assertEquals(1, stats.getBajoStock());          // productoBajoStock (2+1, ambos < 5)
        assertEquals(1, stats.getAgotados());           // productoAgotado (0+0)
        assertEquals(28, stats.getTotalUnidades());     // 15+10+2+1+0+0
    }

    @Test
    @DisplayName("getDashboardStats detecta productos con bajo stock")
    void testGetDashboardStats_detectsLowStockProducts() {
        when(productoRepository.findByActivoTrue())
                .thenReturn(Arrays.asList(productoActivo, productoBajoStock, productoAgotado));

        DashboardStatsDTO stats = productoService.getDashboardStats();

        assertNotNull(stats.getStockCritico());
        assertEquals(2, stats.getStockCritico().size()); // productoBajoStock + productoAgotado
        assertTrue(stats.getStockCritico().stream()
                .anyMatch(p -> p.getName().equals("Red Bull")));
        assertTrue(stats.getStockCritico().stream()
                .anyMatch(p -> p.getName().equals("KitKat")));
    }
}
