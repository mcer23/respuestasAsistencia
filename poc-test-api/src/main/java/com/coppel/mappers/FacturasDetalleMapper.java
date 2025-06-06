package com.coppel.mappers;

import java.util.ArrayList;
import java.util.List;

import com.coppel.dto.FacturasDetalleDTO;
import com.coppel.entities.FacturaDetalle;

import org.modelmapper.ModelMapper;

/**
 * FacturasDetalleMapper
 */
public class FacturasDetalleMapper {

    private FacturasDetalleMapper() {
        throw new IllegalStateException("No existe un constructor para la clase");
    }

    private static final ModelMapper MAPPER = new ModelMapper();

    public static List<FacturasDetalleDTO> mapFacturasDetalle(List<FacturaDetalle> facturasDetalle) {
        List<FacturasDetalleDTO> facturasDetalleDTO = new ArrayList<>();
        facturasDetalle.forEach(detalle -> {
            FacturasDetalleDTO detalleDTO = MAPPER.map(detalle, FacturasDetalleDTO.class);
            facturasDetalleDTO.add(detalleDTO);
        });
        return facturasDetalleDTO;
    }

    public static List<FacturaDetalle> mapFacturasDetalleDTO(List<FacturasDetalleDTO> facturaDetalleList) {
        List<FacturaDetalle> detalleFactura = new ArrayList<>();
        facturaDetalleList.forEach(detalle -> {
            FacturaDetalle facturaDetalle = MAPPER.map(detalle, FacturaDetalle.class);
            detalleFactura.add(facturaDetalle);
        });
        return detalleFactura;
    }
}
