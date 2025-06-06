package com.coppel.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FacturasDetalleDTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Data public class FacturasDetalleDTO {

    private Long idt;

    private String codigoSku;

    private String nombreProducto;

    private int cantidad;

    private BigDecimal precioUnitario;

    private BigDecimal total;

    @JsonInclude(Include.NON_NULL)
    @JsonBackReference
    private FacturasDTO idtFactura;

}
