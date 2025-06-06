package com.coppel.services;

import java.util.List;

import com.coppel.dto.FacturasDTO;

import org.springframework.stereotype.Service;

/**
 * FacturasService
 */
@Service
public interface FacturasService {

    public List<FacturasDTO> consultarFacturas();
    public FacturasDTO consultarFactura(Long id);
    public FacturasDTO registrarFactura(FacturasDTO nuevaFactura);
    public FacturasDTO actualizarFactura(Long id, FacturasDTO actualizacionesFactura);
    public FacturasDTO eliminarFactura(Long id);

}
