import { ConexionDataBase } from './conexion_dataBase.js';

const conexion = new ConexionDataBase();

// Obtener todos los empleados
export async function getEmpleados(req, res) {
  try {
    const response = await conexion.pool.query('SELECT * FROM empleados');
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
}

// Obtener un empleado por ID
export async function getEmpleadoById(req, res) {
  try {
    const { id } = req.params;
    const response = await conexion.pool.query('SELECT * FROM empleados WHERE idempleado = $1', [id]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener empleado' });
  }
}

// Crear un nuevo empleado
export async function postEmpleado(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { nombre, cargo, salario, idconcesionario } = req.body;
    await client.query('BEGIN');
    const response = await client.query(
      'INSERT INTO empleados (nombre, cargo, salario, idconcesionario) VALUES ($1, $2, $3, $4) RETURNING idempleado',
      [nombre, cargo, salario, idconcesionario]
    );
    const newId = response.rows[0].idempleado;
    await client.query('COMMIT');
    res.json({
      message: 'Empleado agregado correctamente',
      body: {
        idempleado: newId,
        nombre,
        cargo,
        salario,
        idconcesionario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al agregar empleado' });
  } finally {
    client.release();
  }
}

// Eliminar un empleado por ID
export async function deleteEmpleado(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    const response = await client.query('DELETE FROM empleados WHERE idempleado = $1 RETURNING idempleado', [id]);
    if (response.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    await client.query('COMMIT');
    res.json({
      message: 'Empleado eliminado correctamente',
      body: {
        idempleado: id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar empleado' });
  } finally {
    client.release();
  }
}

// Actualizar un empleado por ID
export async function updateEmpleado(req, res) {
  const client = await conexion.pool.connect();
  try {
    const { idempleado, nombre, cargo, salario, idconcesionario } = req.body;

    if (!idempleado) {
      return res.status(400).json({ message: 'El ID del empleado es requerido' });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (nombre) {
      fields.push(`nombre = $${index++}`);
      values.push(nombre);
    }
    if (cargo) {
      fields.push(`cargo = $${index++}`);
      values.push(cargo);
    }
    if (salario) {
      fields.push(`salario = $${index++}`);
      values.push(salario);
    }
    if (idconcesionario) {
      fields.push(`idconcesionario = $${index++}`);
      values.push(idconcesionario);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(idempleado);

    const query = `UPDATE empleados SET ${fields.join(', ')} WHERE idempleado = $${index}`;

    await client.query('BEGIN');
    await client.query(query, values);
    await client.query('COMMIT');

    res.json({
      message: 'Empleado actualizado correctamente',
      body: {
        idempleado,
        nombre,
        cargo,
        salario,
        idconcesionario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar empleado' });
  } finally {
    client.release();
  }
}

export default { getEmpleados, getEmpleadoById, postEmpleado, deleteEmpleado, updateEmpleado };
