package com.coppel.mappers;

import com.coppel.dto.FacturasDTO;
import com.coppel.entities.Facturas;

import org.modelmapper.ModelMapper;

/**
 * FacturasMapper
 */
public class FacturasMapper {

    private FacturasMapper() {
        throw new IllegalStateException("No existe un constructor para la clase");
    }

    private static final ModelMapper MAPPER = new ModelMapper();

    public static FacturasDTO mapFacturas(Facturas factura) {
        return MAPPER.map(factura, FacturasDTO.class);
    }

    public static Facturas mapFacturasDTO(FacturasDTO facturasDTO) {
        return MAPPER.map(facturasDTO, Facturas.class);
    }

}
