import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

// Obtener todos los vehículos
export async function getVehiculos(req, res) {
  try {
    const response = await conexion.pool.query('SELECT * FROM vehiculos');
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener vehículos' });
  }
}

// Obtener un vehículo por ID
export async function getVehiculoById(req, res) {
  try {
    const { id } = req.params;
    const response = await conexion.pool.query('SELECT * FROM vehiculos WHERE idvehiculo = $1', [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener vehículo' });
  }
}

// Crear un nuevo vehículo
export async function postVehiculo(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idproducto, marca, modelo, precio, idconcesionario } = req.body;
    await client.query('BEGIN');
    const response = await client.query(
      'INSERT INTO vehiculos (idproducto, marca, modelo, precio, idconcesionario) VALUES ($1, $2, $3, $4, $5) RETURNING idvehiculo',
      [idproducto, marca, modelo, precio, idconcesionario]
    );
    const newId = response.rows[0].idvehiculo;
    await client.query('COMMIT');
    res.json({
      message: 'Vehículo agregado correctamente',
      body: {
        idvehiculo: newId,
        idproducto,
        marca,
        modelo,
        precio,
        idconcesionario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar vehículo' });
  } finally {
    client.release();
  }
}

// Eliminar un vehículo por ID
export async function deleteVehiculo(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    const response = await client.query('DELETE FROM vehiculos WHERE idvehiculo = $1 RETURNING idvehiculo', [id]);
    if (response.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    await client.query('COMMIT');
    res.json({
      message: 'Vehículo eliminado correctamente',
      body: {
        idvehiculo: id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar vehículo' });
  } finally {
    client.release();
  }
}

// Actualizar un vehículo por ID
export async function updateVehiculo(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idvehiculo, idproducto, marca, modelo, precio, idconcesionario } = req.body;

    if (!idvehiculo) {
      return res.status(400).json({ message: 'El ID del vehículo es requerido' });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (idproducto) {
      fields.push(`idproducto = $${index++}`);
      values.push(idproducto);
    }
    if (marca) {
      fields.push(`marca = $${index++}`);
      values.push(marca);
    }
    if (modelo) {
      fields.push(`modelo = $${index++}`);
      values.push(modelo);
    }
    if (precio) {
      fields.push(`precio = $${index++}`);
      values.push(precio);
    }
    if (idconcesionario) {
      fields.push(`idconcesionario = $${index++}`);
      values.push(idconcesionario);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(idvehiculo);

    const query = `UPDATE vehiculos SET ${fields.join(', ')} WHERE idvehiculo = $${index}`;

    await client.query('BEGIN');
    await client.query(query, values);
    await client.query('COMMIT');

    res.json({
      message: 'Vehículo actualizado correctamente',
      body: {
        idvehiculo,
        idproducto,
        marca,
        modelo,
        precio,
        idconcesionario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar vehículo' });
  } finally {
    client.release();
  }
}

export default { getVehiculos, getVehiculoById, postVehiculo, deleteVehiculo, updateVehiculo };

