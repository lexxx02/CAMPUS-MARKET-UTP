package com.utp.campusmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad UsuarioKiosco — Relación muchos-a-muchos entre administradores y kioscos.
 */
@Entity
@Table(name = "usuario_kiosco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioKiosco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_kiosco", nullable = false)
    private Kiosco kiosco;
}
