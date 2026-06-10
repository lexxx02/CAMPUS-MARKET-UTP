package com.utp.campusmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Kiosco — Representa los kioscos universitarios (Piso 2 y Piso 7).
 */
@Entity
@Table(name = "kiosco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Kiosco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_kiosco")
    private Long idKiosco;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "ubicacion", nullable = false, length = 100)
    private String ubicacion;

    @Column(name = "piso", nullable = false, length = 20)
    private String piso;

    @Column(name = "activo")
    @Builder.Default
    private Boolean activo = true;
}
