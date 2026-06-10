package com.utp.campusmarket.service;

import com.utp.campusmarket.entity.Producto;
import com.utp.campusmarket.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Servicio de reportes — Genera archivos Excel (.xlsx) con Apache POI.
 * Tres reportes: inventario general, stock crítico, inventario por kiosco.
 */
@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ProductoRepository productoRepository;

    private static final int UMBRAL_STOCK_BAJO = 5;

    // Colores del reporte
    private static final short COLOR_HEADER_RED = IndexedColors.DARK_RED.getIndex();
    private static final short COLOR_HEADER_DARK = IndexedColors.GREY_80_PERCENT.getIndex();
    private static final short COLOR_ALT_ROW = IndexedColors.GREY_25_PERCENT.getIndex();

    /**
     * Genera reporte Excel de inventario general.
     * Columnas: Código | Producto | Categoría | Stock Piso 2 | Stock Piso 7 | Stock Total | Estado
     */
    public byte[] generarReporteInventarioGeneral() throws IOException {
        List<Producto> productos = productoRepository.findByActivoTrue();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Inventario General");

            // Estilos
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook, false);
            CellStyle dataStyleAlt = createDataStyle(workbook, true);
            CellStyle numberStyle = createNumberStyle(workbook, false);
            CellStyle numberStyleAlt = createNumberStyle(workbook, true);

            int rowIdx = 0;

            // Título
            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("CAMPUS MARKET UTP — INVENTARIO GENERAL");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // Fecha
            Row dateRow = sheet.createRow(rowIdx++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Generado: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            dateCell.setCellStyle(dateStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // Encabezados
            Row headerRow = sheet.createRow(rowIdx++);
            String[] headers = {"Código", "Producto", "Categoría", "Stock Piso 2", "Stock Piso 7", "Stock Total", "Estado"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Datos
            for (int i = 0; i < productos.size(); i++) {
                Producto p = productos.get(i);
                Row row = sheet.createRow(rowIdx++);
                boolean alt = i % 2 == 1;
                CellStyle ds = alt ? dataStyleAlt : dataStyle;
                CellStyle ns = alt ? numberStyleAlt : numberStyle;

                int totalStock = p.getStockPiso2() + p.getStockPiso7();
                String estado = totalStock == 0 ? "Agotado" :
                        (p.getStockPiso2() < UMBRAL_STOCK_BAJO || p.getStockPiso7() < UMBRAL_STOCK_BAJO) ? "Bajo Stock" : "Disponible";

                createCell(row, 0, String.valueOf(p.getIdProducto()), ds);
                createCell(row, 1, p.getNombreProducto(), ds);
                createCell(row, 2, p.getCategoria() != null ? p.getCategoria().getNombre() : "Sin categoría", ds);
                createNumericCell(row, 3, p.getStockPiso2(), ns);
                createNumericCell(row, 4, p.getStockPiso7(), ns);
                createNumericCell(row, 5, totalStock, ns);
                createCell(row, 6, estado, ds);
            }

            // Auto-ajuste de columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toBytes(workbook);
        }
    }

    /**
     * Genera reporte Excel de stock crítico.
     * Filtra productos donde stockPiso2 < 5 OR stockPiso7 < 5.
     * Columnas: Producto | Categoría | Stock Piso 2 | Stock Piso 7 | Kiosco con bajo stock | Unidades restantes
     */
    public byte[] generarReporteStockCritico() throws IOException {
        List<Producto> productos = productoRepository.findByActivoTrue().stream()
                .filter(p -> p.getStockPiso2() < UMBRAL_STOCK_BAJO || p.getStockPiso7() < UMBRAL_STOCK_BAJO)
                .toList();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Stock Crítico");

            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook, false);
            CellStyle dataStyleAlt = createDataStyle(workbook, true);
            CellStyle numberStyle = createNumberStyle(workbook, false);
            CellStyle numberStyleAlt = createNumberStyle(workbook, true);

            int rowIdx = 0;

            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("CAMPUS MARKET UTP — STOCK CRÍTICO");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

            Row dateRow = sheet.createRow(rowIdx++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Generado: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            dateCell.setCellStyle(dateStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));

            Row headerRow = sheet.createRow(rowIdx++);
            String[] headers = {"Producto", "Categoría", "Stock Piso 2", "Stock Piso 7", "Kiosco con bajo stock", "Unidades restantes"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            for (int i = 0; i < productos.size(); i++) {
                Producto p = productos.get(i);
                Row row = sheet.createRow(rowIdx++);
                boolean alt = i % 2 == 1;
                CellStyle ds = alt ? dataStyleAlt : dataStyle;
                CellStyle ns = alt ? numberStyleAlt : numberStyle;

                StringBuilder kioscoBajo = new StringBuilder();
                int unidadesRestantes = 0;
                if (p.getStockPiso2() < UMBRAL_STOCK_BAJO) {
                    kioscoBajo.append("Piso 2");
                    unidadesRestantes += p.getStockPiso2();
                }
                if (p.getStockPiso7() < UMBRAL_STOCK_BAJO) {
                    if (kioscoBajo.length() > 0) kioscoBajo.append(", ");
                    kioscoBajo.append("Piso 7");
                    unidadesRestantes += p.getStockPiso7();
                }

                createCell(row, 0, p.getNombreProducto(), ds);
                createCell(row, 1, p.getCategoria() != null ? p.getCategoria().getNombre() : "Sin categoría", ds);
                createNumericCell(row, 2, p.getStockPiso2(), ns);
                createNumericCell(row, 3, p.getStockPiso7(), ns);
                createCell(row, 4, kioscoBajo.toString(), ds);
                createNumericCell(row, 5, unidadesRestantes, ns);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toBytes(workbook);
        }
    }

    /**
     * Genera reporte Excel de inventario por kiosco.
     * @param kiosk "piso2" o "piso7"
     * Columnas: Código | Producto | Categoría | Cantidad disponible | Estado
     */
    public byte[] generarReporteInventarioPorKiosco(String kiosk) throws IOException {
        List<Producto> productos = productoRepository.findByActivoTrue();
        String pisoLabel = "piso2".equalsIgnoreCase(kiosk) ? "Piso 2" : "Piso 7";

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Inventario " + pisoLabel);

            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook, false);
            CellStyle dataStyleAlt = createDataStyle(workbook, true);
            CellStyle numberStyle = createNumberStyle(workbook, false);
            CellStyle numberStyleAlt = createNumberStyle(workbook, true);

            int rowIdx = 0;

            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("CAMPUS MARKET UTP — INVENTARIO " + pisoLabel.toUpperCase());
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));

            Row dateRow = sheet.createRow(rowIdx++);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue("Generado: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            dateCell.setCellStyle(dateStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 4));

            Row headerRow = sheet.createRow(rowIdx++);
            String[] headers = {"Código", "Producto", "Categoría", "Cantidad disponible", "Estado"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            for (int i = 0; i < productos.size(); i++) {
                Producto p = productos.get(i);
                Row row = sheet.createRow(rowIdx++);
                boolean alt = i % 2 == 1;
                CellStyle ds = alt ? dataStyleAlt : dataStyle;
                CellStyle ns = alt ? numberStyleAlt : numberStyle;

                int stock = "piso2".equalsIgnoreCase(kiosk) ? p.getStockPiso2() : p.getStockPiso7();
                String estado = stock == 0 ? "Agotado" : stock < UMBRAL_STOCK_BAJO ? "Bajo stock" : "Disponible";

                createCell(row, 0, String.valueOf(p.getIdProducto()), ds);
                createCell(row, 1, p.getNombreProducto(), ds);
                createCell(row, 2, p.getCategoria() != null ? p.getCategoria().getNombre() : "Sin categoría", ds);
                createNumericCell(row, 3, stock, ns);
                createCell(row, 4, estado, ds);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toBytes(workbook);
        }
    }

    // ─── Helpers de estilos ─────────────────────────────────────

    private CellStyle createTitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createDateStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setItalic(true);
        font.setFontHeightInPoints((short) 10);
        font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_80_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDataStyle(Workbook wb, boolean alternate) {
        CellStyle style = wb.createCellStyle();
        if (alternate) {
            style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createNumberStyle(Workbook wb, boolean alternate) {
        CellStyle style = createDataStyle(wb, alternate);
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }

    private void createCell(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value != null ? value : "");
        cell.setCellStyle(style);
    }

    private void createNumericCell(Row row, int col, int value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private byte[] toBytes(XSSFWorkbook workbook) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return out.toByteArray();
    }
}
