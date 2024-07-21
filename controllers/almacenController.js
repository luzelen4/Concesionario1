import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

// Obtener todos los almacenes
export async function getAlmacenes(req, res) {
  try {
    const response = await conexion.pool.query('SELECT * FROM almacenes');
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener almacenes' });
  }
}

// Obtener un almacén por ID
export async function getAlmacenById(req, res) {
  try {
    const { id } = req.params;
    const response = await conexion.pool.query('SELECT * FROM almacenes WHERE idalmacen = $1', [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener almacén' });
  }
}

// Crear un nuevo almacén
export async function postAlmacen(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { nombre, ubicacion } = req.body;
    await client.query('BEGIN');
    const response = await client.query(
      'INSERT INTO almacenes (nombre, ubicacion) VALUES ($1, $2) RETURNING idalmacen',
      [nombre, ubicacion]
    );
    const newId = response.rows[0].idalmacen;
    await client.query('COMMIT');
    res.json({
      message: 'Almacén agregado correctamente',
      body: {
        idalmacen: newId,
        nombre,
        ubicacion
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar almacén' });
  } finally {
    client.release();
  }
}

// Eliminar un almacén por ID
export async function deleteAlmacen(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    const response = await client.query('DELETE FROM almacenes WHERE idalmacen = $1 RETURNING idalmacen', [id]);
    if (response.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Almacén no encontrado' });
    }
    await client.query('COMMIT');
    res.json({
      message: 'Almacén eliminado correctamente',
      body: {
        idalmacen: id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar almacén' });
  } finally {
    client.release();
  }
}

// Actualizar un almacén por ID
export async function updateAlmacen(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idalmacen, nombre, ubicacion } = req.body;

    if (!idalmacen) {
      return res.status(400).json({ message: 'El ID del almacén es requerido' });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (nombre) {
      fields.push(`nombre = $${index++}`);
      values.push(nombre);
    }
    if (ubicacion) {
      fields.push(`ubicacion = $${index++}`);
      values.push(ubicacion);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(idalmacen);

    const query = `UPDATE almacenes SET ${fields.join(', ')} WHERE idalmacen = $${index}`;

    await client.query('BEGIN');
    await client.query(query, values);
    await client.query('COMMIT');

    res.json({
      message: 'Almacén actualizado correctamente',
      body: {
        idalmacen,
        nombre,
        ubicacion
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar almacén' });
  } finally {
    client.release();
  }
}

export default { getAlmacenes, getAlmacenById, postAlmacen, deleteAlmacen, updateAlmacen };
