package com.coppel.controllers;

import java.util.UUID;

import com.coppel.dto.ApiResponseDTO;
import com.coppel.dto.FacturasDTO;
import com.coppel.dto.FacturasDetalleDTO;
import com.coppel.services.FacturasService;
import com.coppel.util.Meta;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


/**
 * FacturasController
 */
@CrossOrigin
@RestController
public class FacturasController {
    private static final Logger LOGGER = LogManager.getLogger(FacturasController.class.getName());

    @Autowired
    private FacturasService facturasService;

    private static final String MESSAGE_BAD_REQUEST = "La información que envió no tiene el formato correcto.";
    private final Meta meta = new Meta(UUID.randomUUID().toString(), "OK", 200);

    private boolean validarPeticion(FacturasDTO facturasDTO) {
        boolean valida = true;
        if (facturasDTO == null) {
            valida = false;
        } else if (facturasDTO.getFacturaDetalleList() == null) {
            valida = false;
        } else if (facturasDTO.getFacturaDetalleList().size() > 0) {
            for (FacturasDetalleDTO detalle : facturasDTO.getFacturaDetalleList()) {
                if (detalle.getIdtFactura() == null) {
                    valida = false;
                    break;
                }
            }
        }
        return valida;
    }

    @GetMapping(value="facturas")
    public ApiResponseDTO consultarFacturas() {
        return new ApiResponseDTO(meta, facturasService.consultarFacturas());
    }

    @GetMapping(value="facturas/{id:[\\d]+}")
    public ApiResponseDTO consultarFacturaPorId(@PathVariable Long id) {
        return new ApiResponseDTO(meta, facturasService.consultarFactura(id));
    }
    
    @PostMapping(value="facturas")
    public ApiResponseDTO registrarFacturas(@RequestBody FacturasDTO nuevaFactura) {
        if (!this.validarPeticion(nuevaFactura)) {
            LOGGER.error("Factura inválida", new Exception("El objeto recibido no corresponde a una factura válida"));
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MESSAGE_BAD_REQUEST);
        }
        return new ApiResponseDTO(meta, facturasService.registrarFactura(nuevaFactura));
    }
    
    @PutMapping(value="facturas/{id:[\\d]+}")
    public ApiResponseDTO actualizarFactura(@PathVariable Long id, @RequestBody FacturasDTO facturaActualizada) {
        if (!this.validarPeticion(facturaActualizada)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, MESSAGE_BAD_REQUEST);
        }
        return new ApiResponseDTO(meta, facturasService.actualizarFactura(id, facturaActualizada));
    }

    @DeleteMapping(value = "facturas/{id:[\\d]+}")
    public ApiResponseDTO eliminarFactura(@PathVariable Long id) {
        return new ApiResponseDTO(meta, facturasService.eliminarFactura(id));
    }

}