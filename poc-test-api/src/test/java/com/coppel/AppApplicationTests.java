package com.coppel;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.coppel.config.AppConfig;
import com.coppel.dto.FacturasDTO;
import com.coppel.services.FacturasService;

@SpringBootTest
class AppApplicationTests {
	@Autowired
	private AppConfig config;

    @Autowired
    private FacturasService facturasService;

	@Test
    void getFacturasStatusCode() throws Exception {
        String contextVersion = config.getBuildProperties().getVersion();

        assertNotEquals(null, contextVersion);
    }

    @Test
    void getFactura() throws Exception {
        long idFactura = 2;
        FacturasDTO factura = facturasService.consultarFactura(idFactura);

        assertNotNull(factura);
        assertEquals(idFactura, factura.getIdt());
    }

    @Test
    void getFacturas() {
        int noFacturas = 3;
        List<FacturasDTO> facturas = facturasService.consultarFacturas();

        assertNotNull(facturas);
        assertTrue(facturas.size() > 0);
        assertEquals(noFacturas, facturas.size());
    }

    @Test
    void registerFactura() {
        FacturasDTO newFactura = DummyData.facturaDTO;
        FacturasDTO factura = facturasService.registrarFactura(newFactura);

        assertNotNull(factura);
        assertEquals(newFactura.getIdt(), factura.getIdt());
    }

    @Test
    void updateFactura() {
        FacturasDTO updateFactura = DummyData.facturaDTO;
        updateFactura.setNombreCliente("Jose Luis Marroquin");
        FacturasDTO factura = facturasService.actualizarFactura(updateFactura.getIdt(), updateFactura);

        assertNotNull(factura);
        assertEquals(updateFactura.getIdt(), factura.getIdt());
    }

    @Test
    void deleteFactura() {
        long idFactura = 1;
        FacturasDTO factura = facturasService.eliminarFactura(idFactura);

        assertNotNull(factura);
    }
}
