import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

// Obtener todas las ventas con sus detalles
export async function getVentas(req, res) {
  try {
    const query = `
      SELECT 
        ventas.idventa, ventas.fecha, ventas.idcliente, ventas.idconcesionario, ventas.total,
        detalle_ventas.iddetalle, detalle_ventas.idproducto, productos.nombreproducto, detalle_ventas.cantidad, detalle_ventas.precio
      FROM ventas
      JOIN detalle_ventas ON ventas.idventa = detalle_ventas.idventa
      JOIN productos ON detalle_ventas.idproducto = productos.idproducto
    `;
    const response = await conexion.pool.query(query);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
}

// Obtener una venta por ID
export async function getVentaById(req, res) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        ventas.idventa, ventas.fecha, ventas.idcliente, ventas.idconcesionario, ventas.total,
        detalle_ventas.iddetalle, detalle_ventas.idproducto, productos.nombreproducto, detalle_ventas.cantidad, detalle_ventas.precio
      FROM ventas
      JOIN detalle_ventas ON ventas.idventa = detalle_ventas.idventa
      JOIN productos ON detalle_ventas.idproducto = productos.idproducto
      WHERE ventas.idventa = $1
    `;
    const response = await conexion.pool.query(query, [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener venta' });
  }
}

// Crear una nueva venta con detalles
export async function postVenta(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { fecha, idcliente, idconcesionario, total, detalles } = req.body;
    await client.query('BEGIN');

    // Insertar la venta
    const ventaResponse = await client.query(
      'INSERT INTO ventas (fecha, idcliente, idconcesionario, total) VALUES ($1, $2, $3, $4) RETURNING idventa',
      [fecha, idcliente, idconcesionario, total]
    );

    const idventa = ventaResponse.rows[0].idventa;

    // Insertar los detalles de la venta
    for (const detalle of detalles) {
      const { idproducto, cantidad, precio } = detalle;
      await client.query(
        'INSERT INTO detalle_ventas (idventa, idproducto, cantidad, precio) VALUES ($1, $2, $3, $4)',
        [idventa, idproducto, cantidad, precio]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Venta y detalles agregados correctamente', idventa });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar venta y detalles' });
  } finally {
    client.release();
  }
}

// Eliminar una venta por ID
export async function deleteVenta(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    const ventaResponse = await client.query('DELETE FROM ventas WHERE idventa = $1 RETURNING *', [id]);
    if (ventaResponse.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    await client.query('DELETE FROM detalle_ventas WHERE idventa = $1', [id]);
    await client.query('COMMIT');
    res.json({ message: 'Venta y sus detalles eliminados correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar venta y detalles' });
  } finally {
    client.release();
  }
}

// Actualizar una venta y sus detalles
export async function updateVenta(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idventa, fecha, idcliente, idconcesionario, total, detalles } = req.body;

    await client.query('BEGIN');

    // Actualizar la venta
    await client.query(
      'UPDATE ventas SET fecha = $1, idcliente = $2, idconcesionario = $3, total = $4 WHERE idventa = $5',
      [fecha, idcliente, idconcesionario, total, idventa]
    );

    // Eliminar los detalles antiguos
    await client.query('DELETE FROM detalle_ventas WHERE idventa = $1', [idventa]);

    // Insertar los nuevos detalles
    for (const detalle of detalles) {
      const { idproducto, cantidad, precio } = detalle;
      await client.query(
        'INSERT INTO detalle_ventas (idventa, idproducto, cantidad, precio) VALUES ($1, $2, $3, $4)',
        [idventa, idproducto, cantidad, precio]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Venta y detalles actualizados correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar venta y detalles' });
  } finally {
    client.release();
  }
}

export default { getVentas, getVentaById, postVenta, deleteVenta, updateVenta };
