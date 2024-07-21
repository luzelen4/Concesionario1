-- Database: tienda_vehiculo_db

-- Creación de la tabla Concesionarios
CREATE TABLE IF NOT EXISTS concesionarios (
    idconcesionario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL
);

-- Creación de la tabla Almacenes
CREATE TABLE IF NOT EXISTS almacenes (
    idalmacen SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL
);

-- Creación de la tabla Productos
CREATE TABLE IF NOT EXISTS productos (
    idproducto SERIAL PRIMARY KEY,
    nombreproducto VARCHAR(100) NOT NULL,
    precio_producto DECIMAL(10, 2) NOT NULL
);

-- Creación de la tabla Vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
    idvehiculo SERIAL PRIMARY KEY,
    idproducto INT NOT NULL REFERENCES productos(idproducto) ON UPDATE CASCADE ON DELETE CASCADE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    idconcesionario INT NOT NULL REFERENCES concesionarios(idconcesionario) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Creación de la tabla Insumos
CREATE TABLE IF NOT EXISTS insumos (
    idinsumo SERIAL PRIMARY KEY,
    idproducto INT NOT NULL REFERENCES productos(idproducto) ON UPDATE CASCADE ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    idalmacen INT NOT NULL REFERENCES almacenes(idalmacen) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Creación de la tabla Empleados
CREATE TABLE IF NOT EXISTS empleados (
    idempleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    idconcesionario INT NOT NULL REFERENCES concesionarios(idconcesionario) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Creación de la tabla Clientes
CREATE TABLE IF NOT EXISTS clientes (
    idcliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    idconcesionario INT NOT NULL REFERENCES concesionarios(idconcesionario) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Creación de la tabla Ventas
CREATE TABLE IF NOT EXISTS ventas (
    idventa SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    idcliente INT NOT NULL REFERENCES clientes(idcliente) ON UPDATE NO ACTION ON DELETE NO ACTION,
    idempleado INT NOT NULL REFERENCES empleados(idempleado) ON UPDATE NO ACTION ON DELETE NO ACTION,
    precio_total DECIMAL(10, 2) NOT NULL
);

-- Creación de la tabla DetalleVentas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    iddetalle_venta SERIAL PRIMARY KEY,
    idventa INT NOT NULL REFERENCES ventas(idventa) ON UPDATE NO ACTION ON DELETE NO ACTION,
    idproducto INT NOT NULL REFERENCES productos(idproducto) ON UPDATE NO ACTION ON DELETE NO ACTION,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL
);
