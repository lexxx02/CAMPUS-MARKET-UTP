package com.utp.campusmarket.controller;

import com.utp.campusmarket.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Controlador de reportes — Descarga de archivos Excel.
 * Base path: /api/reports
 * Acceso: solo ADMIN
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReporteService reporteService;

    private static final String EXCEL_CONTENT_TYPE =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    /**
     * Descarga reporte de inventario general.
     */
    @GetMapping("/general")
    public ResponseEntity<byte[]> reporteGeneral() throws IOException {
        byte[] bytes = reporteService.generarReporteInventarioGeneral();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=reporte_inventario_general.xlsx")
                .contentType(MediaType.parseMediaType(EXCEL_CONTENT_TYPE))
                .body(bytes);
    }

    /**
     * Descarga reporte de stock crítico (productos < 5 unidades).
     */
    @GetMapping("/critical-stock")
    public ResponseEntity<byte[]> reporteStockCritico() throws IOException {
        byte[] bytes = reporteService.generarReporteStockCritico();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=reporte_stock_critico.xlsx")
                .contentType(MediaType.parseMediaType(EXCEL_CONTENT_TYPE))
                .body(bytes);
    }

    /**
     * Descarga reporte de inventario por kiosco.
     * @param kiosk "piso2" o "piso7"
     */
    @GetMapping("/kiosk/{kiosk}")
    public ResponseEntity<byte[]> reportePorKiosco(@PathVariable String kiosk) throws IOException {
        byte[] bytes = reporteService.generarReporteInventarioPorKiosco(kiosk);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=reporte_" + kiosk + ".xlsx")
                .contentType(MediaType.parseMediaType(EXCEL_CONTENT_TYPE))
                .body(bytes);
    }
}
