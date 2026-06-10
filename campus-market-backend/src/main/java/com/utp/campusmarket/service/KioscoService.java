package com.utp.campusmarket.service;

import com.utp.campusmarket.dto.KioskDTO;
import com.utp.campusmarket.dto.ProductDTO;
import com.utp.campusmarket.entity.Producto;
import com.utp.campusmarket.exception.ResourceNotFoundException;
import com.utp.campusmarket.repository.KioscoRepository;
import com.utp.campusmarket.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de kioscos — Gestión de stock por ubicación.
 */
@Service
@RequiredArgsConstructor
public class KioscoService {

    private final KioscoRepository kioscoRepository;
    private final ProductoRepository productoRepository;

    /**
     * Retorna todos los kioscos activos.
     */
    public List<KioskDTO> getAllKiosks() {
        return kioscoRepository.findByActivoTrue().stream()
                .map(k -> KioskDTO.builder()
                        .id(k.getIdKiosco())
                        .name(k.getNombre())
                        .location(k.getUbicacion())
                        .floor(k.getPiso())
                        .active(k.getActivo())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Retorna productos filtrados por kiosco con su stock correspondiente.
     * @param kiosk identificador del kiosco ("piso2" o "piso7")
     * @return lista de productos con stock > 0 en ese kiosco
     */
    public List<ProductDTO> getProductsByKiosk(String kiosk) {
        List<Producto> productos = productoRepository.findByActivoTrue();

        return productos.stream()
                .map(p -> {
                    int stock = "piso2".equalsIgnoreCase(kiosk) ? p.getStockPiso2() : p.getStockPiso7();
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
                })
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el stock de un producto en un kiosco específico.
     * @param productId ID del producto
     * @param kiosk     identificador del kiosco ("piso2" o "piso7")
     * @param cantidad  nueva cantidad de stock (debe ser >= 0)
     * @return producto actualizado
     * @throws IllegalArgumentException si la cantidad es negativa
     */
    @Transactional
    public ProductDTO updateKioskStock(Long productId, String kiosk, int cantidad) {
        if (cantidad < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }

        Producto producto = productoRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + productId));

        if ("piso2".equalsIgnoreCase(kiosk)) {
            producto.setStockPiso2(cantidad);
        } else if ("piso7".equalsIgnoreCase(kiosk)) {
            producto.setStockPiso7(cantidad);
        } else {
            throw new IllegalArgumentException("Kiosco inválido. Use 'piso2' o 'piso7'");
        }

        Producto saved = productoRepository.save(producto);

        return ProductDTO.builder()
                .id(saved.getIdProducto())
                .name(saved.getNombreProducto())
                .description(saved.getDescripcion())
                .price(saved.getPrecio())
                .stockPiso2(saved.getStockPiso2())
                .stockPiso7(saved.getStockPiso7())
                .image(saved.getImagenUrl())
                .active(saved.getActivo())
                .categoryId(saved.getCategoria() != null ? saved.getCategoria().getIdCategoria() : null)
                .categoryName(saved.getCategoria() != null ? saved.getCategoria().getNombre() : null)

                .build();
    }
}
