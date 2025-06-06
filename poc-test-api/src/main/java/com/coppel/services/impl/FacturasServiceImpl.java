package com.coppel.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.coppel.dto.FacturasDTO;
import com.coppel.entities.Facturas;
import com.coppel.mappers.FacturasDetalleMapper;
import com.coppel.mappers.FacturasMapper;
import com.coppel.repositories.FacturasRepository;
import com.coppel.services.FacturasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * FacturasService
 */
@Service
public class FacturasServiceImpl implements FacturasService {

    @Autowired
    private FacturasRepository repository;

    private static final String MESSAGE_NOT_FOUND = "Factura no existente.";

    @Override
    public List<FacturasDTO> consultarFacturas() {
        final List<FacturasDTO> facturas = new ArrayList<>();
        repository.findAll().forEach(factura -> facturas.add(FacturasMapper.mapFacturas(factura)));
        return facturas;
    }

    @Override
    public FacturasDTO consultarFactura(final Long id) {
        final Optional<Facturas> existeFactura = repository.findById(id);
        FacturasDTO facturasDTO = null;
        if (existeFactura.isPresent()) {
            facturasDTO = FacturasMapper.mapFacturas(existeFactura.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MESSAGE_NOT_FOUND);
        }
        return facturasDTO;
    }

    @Override
    public FacturasDTO registrarFactura(final FacturasDTO nuevaFactura) {
        final Facturas facturas = FacturasMapper.mapFacturasDTO(nuevaFactura);
        return FacturasMapper.mapFacturas(this.repository.save(facturas));
    }

    @Override
    public FacturasDTO actualizarFactura(final Long id, final FacturasDTO actualizacionesFactura) {
        FacturasDTO facturaActualizada = null;
        final Optional<Facturas> existeFactura = this.repository.findById(id);
        if (existeFactura.isPresent()) {
            final Facturas facturaActual = existeFactura.get();
            if (facturaActual.getMonto() != actualizacionesFactura.getMonto()) {
                facturaActual.setMonto(actualizacionesFactura.getMonto());
            }
            if (facturaActual.getNitCliente() != actualizacionesFactura.getNitCliente()) {
                facturaActual.setNitCliente(actualizacionesFactura.getNitCliente());
            }
            if (facturaActual.getNombreCliente() != actualizacionesFactura.getNombreCliente()) {
                facturaActual.setNombreCliente(actualizacionesFactura.getNombreCliente());
            }
            facturaActual.setFacturaDetalleList(
                    FacturasDetalleMapper.mapFacturasDetalleDTO(actualizacionesFactura.getFacturaDetalleList()));
            this.repository.save(facturaActual);
            facturaActualizada = FacturasMapper.mapFacturas(facturaActual);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MESSAGE_NOT_FOUND);
        }
        return facturaActualizada;
    }

    @Override
    public FacturasDTO eliminarFactura(final Long id) {
        FacturasDTO facturaEliminada = null;
        final Optional<Facturas> existeFactura = this.repository.findById(id);
        if (existeFactura.isPresent()) {
            facturaEliminada = FacturasMapper.mapFacturas(existeFactura.get());
            this.repository.delete(existeFactura.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MESSAGE_NOT_FOUND);
        }
        return facturaEliminada;
    }
}
