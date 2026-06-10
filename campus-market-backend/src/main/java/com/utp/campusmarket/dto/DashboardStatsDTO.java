package com.utp.campusmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para estadísticas del dashboard administrativo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {

    private int totalProductos;
    private int disponibles;
    private int bajoStock;
    private int agotados;
    private int totalUnidades;

    /**
     * Lista de productos con stock < 5 en cualquier kiosco.
     */
    private List<ProductDTO> stockCritico;
}
