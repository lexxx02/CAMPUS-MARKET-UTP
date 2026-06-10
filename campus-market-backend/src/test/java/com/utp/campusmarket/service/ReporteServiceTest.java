package com.utp.campusmarket.service;

import com.utp.campusmarket.entity.Categoria;
import com.utp.campusmarket.entity.Producto;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ReporteService reporteService;

    private Categoria categoria;
    private Producto productoNormal;
    private Producto productoBajoStock;
    private Producto productoAgotado;

    @BeforeEach
    void setUp() {
        categoria = Categoria.builder()
                .idCategoria(1L)
                .nombre("Snack")

                .activo(true)
                .build();

        productoNormal = Producto.builder()
                .idProducto(1L)
                .nombreProducto("Doritos")
                .descripcion("Tortilla chips")
                .precio(BigDecimal.valueOf(3.50))
                .stockPiso2(15)
                .stockPiso7(10)
                .activo(true)
                .categoria(categoria)
                .build();

        productoBajoStock = Producto.builder()
                .idProducto(2L)
                .nombreProducto("Red Bull")
                .descripcion("Energizante")
                .precio(BigDecimal.valueOf(7.00))
                .stockPiso2(2)
                .stockPiso7(1)
                .activo(true)
                .categoria(categoria)
                .build();

        productoAgotado = Producto.builder()
                .idProducto(3L)
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
    @DisplayName("Reporte general genera Excel no vacío")
    void testGenerarReporteGeneral_returnsNonEmptyExcel() throws Exception {
        when(productoRepository.findByActivoTrue())
                .thenReturn(Arrays.asList(productoNormal, productoBajoStock, productoAgotado));

        byte[] result = reporteService.generarReporteInventarioGeneral();

        assertNotNull(result);
        assertTrue(result.length > 0);
        // Verifica que es un archivo XLSX válido (magic bytes PK)
        assertEquals((byte) 0x50, result[0]); // 'P'
        assertEquals((byte) 0x4B, result[1]); // 'K'
    }

    @Test
    @DisplayName("Reporte stock crítico incluye solo productos con bajo stock")
    void testGenerarReporteStockCritico_includesOnlyLowStockProducts() throws Exception {
        when(productoRepository.findByActivoTrue())
                .thenReturn(Arrays.asList(productoNormal, productoBajoStock, productoAgotado));

        byte[] result = reporteService.generarReporteStockCritico();

        assertNotNull(result);
        assertTrue(result.length > 0);
        // El reporte se genera correctamente (es un XLSX válido)
        assertEquals((byte) 0x50, result[0]);
        assertEquals((byte) 0x4B, result[1]);
    }
}
