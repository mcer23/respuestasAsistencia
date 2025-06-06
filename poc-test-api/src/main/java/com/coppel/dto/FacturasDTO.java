package com.coppel.dto;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FacturasDTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Data public class FacturasDTO {

    private Long idt;

    private String nombreCliente;

    private String nitCliente;

    private BigDecimal monto;

    @JsonInclude(value = Include.NON_NULL)
    @JsonManagedReference
    private List<FacturasDetalleDTO> facturaDetalleList;

}
