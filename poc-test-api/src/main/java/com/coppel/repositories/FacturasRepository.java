package com.coppel.repositories;

import com.coppel.entities.Facturas;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * FacturasRepository
 */
public interface FacturasRepository extends JpaRepository<Facturas, Long> {

}