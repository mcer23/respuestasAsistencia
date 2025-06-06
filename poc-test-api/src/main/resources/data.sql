CREATE TABLE IF NOT EXISTS FACTURA
(
    idt bigint auto_increment,
    monto numeric(19,2) NOT NULL,
    nit_cliente character varying(25) NOT NULL,
    nombre_cliente character varying(25) NOT NULL,
    CONSTRAINT factura_pkey PRIMARY KEY (idt)
);

CREATE TABLE IF NOT EXISTS FACTURA_DETALLE
(
    idt bigint auto_increment,
    cantidad integer NOT NULL,
    codigo_sku character varying(25) NOT NULL,
    nombre_producto character varying(25) NOT NULL,
    precio_unitario numeric(19,2) NOT NULL,
    total numeric(19,2) NOT NULL,
    idt_factura bigint NOT NULL,
    CONSTRAINT factura_detalle_pkey PRIMARY KEY (idt)
);

ALTER TABLE FACTURA_DETALLE
    ADD FOREIGN KEY (idt_factura) 
    REFERENCES FACTURA(idt);

-- Factura 1
INSERT INTO FACTURA(MONTO, NIT_CLIENTE, NOMBRE_CLIENTE)
    VALUES (250, 95194185, 'Juan Carlos Zúñiga');

    INSERT INTO FACTURA_DETALLE (IDT_FACTURA, CODIGO_SKU, NOMBRE_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, TOTAL)
      VALUES (1, '284942', 'Mouse Inalámbrico HP', 250, 1, 250);

-- Factura 2
INSERT INTO FACTURA(MONTO, NIT_CLIENTE, NOMBRE_CLIENTE)
    VALUES (4000, 93902761, 'Ana Maria Flores');

    INSERT INTO FACTURA_DETALLE (IDT_FACTURA, CODIGO_SKU, NOMBRE_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, TOTAL)
      VALUES (2, '316789', 'Levi´s 710 Mujer', 1100, 2, 2200);
    INSERT INTO FACTURA_DETALLE (IDT_FACTURA, CODIGO_SKU, NOMBRE_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, TOTAL)
      VALUES (2, '724301', 'Casio B640WC Rose Gold', 1800, 1, 1800);

-- Factura 3
INSERT INTO FACTURA(MONTO, NIT_CLIENTE, NOMBRE_CLIENTE)
    VALUES (1600, 94827443, 'Jose Luis Carrasco');

    INSERT INTO FACTURA_DETALLE (IDT_FACTURA, CODIGO_SKU, NOMBRE_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, TOTAL)
      VALUES (3, '818626', 'Nike Air Max Fusion', 1600, 1, 1600);