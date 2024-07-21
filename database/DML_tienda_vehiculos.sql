-- Insertar datos en la tabla Concesionarios
INSERT INTO concesionarios (nombre, direccion) VALUES
('AutoConcesionario ABC', 'Av. Principal 123, Ciudad'),
('Vehículos y Más', 'Calle Secundaria 456, Ciudad'),
('Concesionario del Futuro', 'Boulevard de la Innovación 789, Ciudad');

-- Insertar datos en la tabla Almacenes
INSERT INTO almacenes (nombre, ubicacion) VALUES
('Almacén Central', 'Calle de los Almacenes 101, Ciudad'),
('Depósito Norte', 'Avenida del Norte 202, Ciudad'),
('Centro de Distribución Oeste', 'Calle del Oeste 303, Ciudad');

-- Insertar datos en la tabla Productos
INSERT INTO productos (nombreproducto, precio_producto) VALUES
('Aceite Motor', 25.50),
('Frenos Traseros', 75.00),
('Lámpara de Faros', 15.75),
('Neumático 205/55 R16', 120.00),
('Batería de 12V', 85.00);

-- Insertar datos en la tabla Vehiculos
INSERT INTO vehiculos (idproducto, marca, modelo, precio, idconcesionario) VALUES
(1, 'Toyota', 'Corolla', 20000.00, 1),
(2, 'Honda', 'Civic', 22000.00, 2),
(3, 'Ford', 'Focus', 21000.00, 3);

-- Insertar datos en la tabla Insumos
INSERT INTO insumos (idproducto, descripcion, idalmacen) VALUES
(1, 'Aceite de motor para vehículos', 1),
(2, 'Frenos traseros para automóviles', 2),
(3, 'Lámpara de faros de repuesto', 3);

-- Insertar datos en la tabla Empleados
INSERT INTO empleados (nombre, cargo, salario, idconcesionario) VALUES
('Juan Pérez', 'Vendedor', 1500.00, 1),
('Ana López', 'Mecánico', 1800.00, 2),
('Carlos Fernández', 'Asesor de Ventas', 1700.00, 3);

-- Insertar datos en la tabla Clientes
INSERT INTO clientes (nombre, direccion, idconcesionario) VALUES
('Laura Gómez', 'Calle de la Paz 45, Ciudad', 1),
('Pedro Martínez', 'Avenida Libertad 56, Ciudad', 2),
('Maria Rodríguez', 'Plaza Mayor 78, Ciudad', 3);

-- Insertar datos en la tabla Ventas
INSERT INTO ventas (fecha, idcliente, idempleado, precio_total) VALUES
('2024-07-15', 1, 1, 20200.00),
('2024-07-16', 2, 2, 22000.00),
('2024-07-17', 3, 3, 21000.00);

-- Insertar datos en la tabla DetalleVentas
INSERT INTO detalle_ventas (idventa, idproducto, cantidad, precio_unitario, precio_total) VALUES
(1, 1, 1, 25.50, 25.50),
(1, 4, 4, 120.00, 480.00),
(2, 2, 2, 75.00, 150.00),
(2, 5, 1, 85.00, 85.00),
(3, 3, 1, 15.75, 15.75);
