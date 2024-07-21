import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

export async function getConcesionarios(req, res) {
  try {
    const response = await conexion.pool.query('SELECT * FROM concesionarios');
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener concesionarios' });
  }
}

export async function getConcesionarioById(req, res) {
  const client = await conexion.pool.connect();
  try {
    const id = parseInt(req.params.id);

    const response = await client.query('SELECT * FROM concesionarios WHERE idconcesionario = $1', [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Concesionario no encontrado' });
    }

    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener concesionario' });
  } finally {
    client.release();
  }
}

export async function postConcesionario(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { nombre, direccion } = req.body;

    await client.query('BEGIN');
    const response = await client.query(
      'INSERT INTO concesionarios (nombre, direccion) VALUES ($1, $2) RETURNING idconcesionario',
      [nombre, direccion]
    );
    const newId = response.rows[0].idconcesionario;
    await client.query('COMMIT');

    res.json({
      message: 'Concesionario agregado correctamente',
      body: {
        idconcesionario: newId,
        nombre,
        direccion
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar concesionario' });
  } finally {
    client.release();
  }
}

export async function deleteConcesionario(req, res) {
  const client = await conexion.pool.connect();
  try {
    const id = parseInt(req.params.id);

    await client.query('BEGIN');
    await client.query('DELETE FROM concesionarios WHERE idconcesionario = $1', [id]);
    await client.query('COMMIT');

    res.json({
      message: 'Concesionario eliminado correctamente',
      body: {
        idconcesionario: id,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar concesionario' });
  } finally {
    client.release();
  }
}

export async function updateConcesionario(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idconcesionario, nombre, direccion } = req.body;

    await client.query('BEGIN');
    await client.query(
      'UPDATE concesionarios SET nombre = $1, direccion = $2 WHERE idconcesionario = $3',
      [nombre, direccion, idconcesionario]
    );
    await client.query('COMMIT');

    res.json({
      message: 'Concesionario actualizado correctamente',
      body: {
        idconcesionario,
        nombre,
        direccion
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar concesionario' });
  } finally {
    client.release();
  }
}

export default { getConcesionarios, getConcesionarioById, postConcesionario, deleteConcesionario, updateConcesionario };
