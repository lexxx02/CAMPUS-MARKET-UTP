package com.utp.campusmarket.repository;

import com.utp.campusmarket.entity.Kiosco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de kioscos — Consultas de kioscos activos.
 */
@Repository
public interface KioscoRepository extends JpaRepository<Kiosco, Long> {

    /**
     * Retorna solo los kioscos que están activos.
     * @return lista de kioscos activos
     */
    List<Kiosco> findByActivoTrue();
}
