import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

// Obtener todos los insumos junto con la información de productos
export async function getInsumos(req, res) {
  try {
    const query = `
      SELECT 
        insumos.idinsumo,
        insumos.idproducto, 
        productos.nombreproducto,
        insumos.descripcion, 
        productos.precio_producto,
        insumos.idalmacen
      FROM insumos
      JOIN productos ON insumos.idproducto = productos.idproducto
    `;
    const response = await conexion.pool.query(query);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener insumos' });
  }
}

// Obtener un insumo por ID
export async function getInsumoById(req, res) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        insumos.idinsumo,
        insumos.idproducto, 
        productos.nombreproducto,
        insumos.descripcion, 
        productos.precio_producto,
        insumos.idalmacen
      FROM insumos
      JOIN productos ON insumos.idproducto = productos.idproducto
      WHERE insumos.idinsumo = $1
    `;
    const response = await conexion.pool.query(query, [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener insumo' });
  }
}

// Crear un nuevo insumo relacionado con un producto
export async function postInsumo(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idproducto, nombreproducto, precio_producto, descripcion, idalmacen } = req.body;

    await client.query('BEGIN');

    // Insertar el nuevo producto
    await client.query(
      'INSERT INTO productos (idproducto, nombreproducto, precio_producto) VALUES ($1, $2, $3)',
      [idproducto, nombreproducto, precio_producto]
    );

    // Insertar el nuevo insumo relacionado con el producto
    const insumoResponse = await client.query(
      'INSERT INTO insumos (idproducto, descripcion, idalmacen) VALUES ($1, $2, $3) RETURNING *',
      [idproducto, descripcion, idalmacen]
    );

    await client.query('COMMIT');
    res.json({
      message: 'Producto e insumo agregados correctamente',
      body: insumoResponse.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar producto e insumo' });
  } finally {
    client.release();
  }
}

// Eliminar un insumo por ID
export async function deleteInsumo(req, res) {
  try {
    const { id } = req.params;
    const response = await conexion.pool.query('DELETE FROM insumos WHERE idinsumo = $1 RETURNING *', [id]);
    if (response.rowCount === 0) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    res.json({ message: 'Insumo eliminado correctamente', body: response.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar insumo' });
  }
}

// Actualizar un insumo y su producto relacionado
export async function updateInsumo(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idinsumo, idproducto, nombreproducto, precio_producto, descripcion, idalmacen } = req.body;

    // Verificar que el idinsumo y el idproducto existan
    const insumoCheck = await client.query('SELECT * FROM insumos WHERE idinsumo = $1', [idinsumo]);
    const productoCheck = await client.query('SELECT * FROM productos WHERE idproducto = $1', [idproducto]);

    if (insumoCheck.rows.length === 0) {
      throw new Error('El insumo especificado no existe');
    }
    if (productoCheck.rows.length === 0) {
      throw new Error('El producto especificado no existe');
    }

    await client.query('BEGIN');

    // Actualizar el producto relacionado
    await client.query(
      'UPDATE productos SET nombreproducto = $1, precio_producto = $2 WHERE idproducto = $3',
      [nombreproducto, precio_producto, idproducto]
    );

    // Actualizar el insumo
    const insumoResponse = await client.query(
      'UPDATE insumos SET descripcion = $1, idalmacen = $2 WHERE idinsumo = $3 RETURNING *',
      [descripcion, idalmacen, idinsumo]
    );

    await client.query('COMMIT');
    res.json({
      message: 'Producto e insumo actualizados correctamente',
      body: insumoResponse.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar producto e insumo', error: error.message });
  } finally {
    client.release();
  }
}

export default { getInsumos, getInsumoById, postInsumo, deleteInsumo, updateInsumo };
