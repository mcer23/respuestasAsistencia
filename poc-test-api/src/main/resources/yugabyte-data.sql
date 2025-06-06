DROP TABLE IF EXISTS FACTURA_DETALLE;

DROP TABLE IF EXISTS FACTURA;

CREATE TABLE IF NOT EXISTS FACTURA
(
    idt BIGSERIAL,
    monto NUMERIC(19,2) NOT NULL,
    nit_cliente VARCHAR(25) NOT NULL,
    nombre_cliente VARCHAR(25) NOT NULL,
    CONSTRAINT factura_pkey PRIMARY KEY (idt)
);

CREATE TABLE IF NOT EXISTS FACTURA_DETALLE
(
    idt BIGSERIAL,
    cantidad INTEGER NOT NULL,
    codigo_sku VARCHAR(25) NOT NULL,
    nombre_producto VARCHAR(25) NOT NULL,
    precio_unitario NUMERIC(19,2) NOT NULL,
    total NUMERIC(19,2) NOT NULL,
    idt_factura BIGINT NOT NULL,
    CONSTRAINT factura_detalle_pkey PRIMARY KEY (idt),
    CONSTRAINT factura_detalle_fk FOREIGN KEY (idt_factura) REFERENCES FACTURA(idt)
);

-- Factura 1
INSERT INTO FACTURA (monto, nit_cliente, nombre_cliente)
VALUES (250, '95194185', 'Juan Carlos Zúñiga');

INSERT INTO FACTURA_DETALLE (idt_factura, codigo_sku, nombre_producto, precio_unitario, cantidad, total)
VALUES (1, '284942', 'Mouse Inalámbrico HP', 250, 1, 250);

-- Factura 2
INSERT INTO FACTURA (monto, nit_cliente, nombre_cliente)
VALUES (4000, '93902761', 'Ana Maria Flores');

INSERT INTO FACTURA_DETALLE (idt_factura, codigo_sku, nombre_producto, precio_unitario, cantidad, total)
VALUES (2, '316789', 'Levi´s 710 Mujer', 1100, 2, 2200),
       (2, '724301', 'Casio B640WC Rose Gold', 1800, 1, 1800);

-- Factura 3
INSERT INTO FACTURA (monto, nit_cliente, nombre_cliente)
VALUES (1600, '94827443', 'Jose Luis Carrasco');

INSERT INTO FACTURA_DETALLE (idt_factura, codigo_sku, nombre_producto, precio_unitario, cantidad, total)
VALUES (3, '818626', 'Nike Air Max Fusion', 1600, 1, 1600);
