import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

export async function getClientes(req, res) {
  try {
    const response = await conexion.pool.query('SELECT * FROM clientes');
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
}

export async function getClienteById(req, res) {
  try {
    const { id } = req.params;
    const response = await conexion.pool.query('SELECT * FROM clientes WHERE idcliente = $1', [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
}

export async function postCliente(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { nombre, direccion, idconcesionario } = req.body;
    await client.query('BEGIN');
    const response = await client.query(
      'INSERT INTO clientes (nombre, direccion, idconcesionario) VALUES ($1, $2, $3) RETURNING idcliente',
      [nombre, direccion, idconcesionario]
    );
    const newId = response.rows[0].idcliente;
    await client.query('COMMIT');
    res.json({
      message: 'Cliente agregado correctamente',
      body: {
        idcliente: newId,
        nombre,
        direccion,
        idconcesionario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar cliente' });
  } finally {
    client.release();
  }
}

export async function deleteCliente(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    const response = await client.query('DELETE FROM clientes WHERE idcliente = $1 RETURNING idcliente', [id]);
    if (response.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    await client.query('COMMIT');
    res.json({
      message: 'Cliente eliminado correctamente',
      body: {
        idcliente: id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  } finally {
    client.release();
  }
}

export async function updateCliente(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idcliente, nombre, direccion, idconcesionario } = req.body;

    if (!idcliente) {
      return res.status(400).json({ message: 'El ID del cliente es requerido' });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (nombre) {
      fields.push(`nombre = $${index++}`);
      values.push(nombre);
    }
    if (direccion) {
      fields.push(`direccion = $${index++}`);
      values.push(direccion);
    }
    if (idconcesionario) {
      fields.push(`idconcesionario = $${index++}`);
      values.push(idconcesionario);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(idcliente);

    const query = `UPDATE clientes SET ${fields.join(', ')} WHERE idcliente = $${index}`;

    await client.query('BEGIN');
    await client.query(query, values);
    await client.query('COMMIT');

    res.json({
      message: 'Cliente actualizado correctamente',
      body: {
        idcliente,
        nombre,
        direccion,
        idconcesionario
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  } finally {
    client.release();
  }
}

export default { getClientes, getClienteById, postCliente, deleteCliente, updateCliente };
