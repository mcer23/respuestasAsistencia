package com.coppel.entities;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FacturaDetalle
 */
@Entity
@Table(name = "factura_detalle")
@AllArgsConstructor
@NoArgsConstructor
@Data public class FacturaDetalle implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @NotNull
    @Column(name = "idt")
    private Long idt;
    
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 25)
    @Column(name = "codigo_sku")
    private String codigoSku;
    
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 25)
    @Column(name = "nombre_producto")
    private String nombreProducto;
    
    @Basic(optional = false)
    @NotNull
    @Column(name = "cantidad")
    private int cantidad;
    
    @Basic(optional = false)
    @NotNull
    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;
    
    @Basic(optional = false)
    @NotNull
    @Column(name = "total")
    private BigDecimal total;
    
    @JoinColumn(name = "idtFactura", referencedColumnName = "idt")
    @ManyToOne(optional = false)
    @JsonBackReference
    private Facturas idtFactura;

}
