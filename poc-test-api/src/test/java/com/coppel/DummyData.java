package com.coppel;

import java.math.BigDecimal;
import java.util.ArrayList;

import com.coppel.dto.FacturasDTO;
import com.coppel.dto.FacturasDetalleDTO;

public class DummyData {

    public static final FacturasDTO idtFactura = new FacturasDTO() {{ setIdt(4L); }};

    public static final FacturasDetalleDTO facturaDetalleDTO = new FacturasDetalleDTO() {{
        setIdt(5L);
        setCodigoSku("818626");
        setNombreProducto("Nike Air Max Fusion");
        setCantidad(2);
        setPrecioUnitario(new BigDecimal(3200L));
        setTotal(new BigDecimal(3200L));
        setIdtFactura(idtFactura);
    }};

    public static final FacturasDTO facturaDTO = new FacturasDTO() {{
        setIdt(4L);
        setMonto(new BigDecimal(3200L));
        setNitCliente("94827478");
        setNombreCliente("Juan Domingo Martinez");
        setFacturaDetalleList(new ArrayList<>() {{
            add(facturaDetalleDTO);
        }});
    }};
}
