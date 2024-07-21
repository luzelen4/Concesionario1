import pkg from 'pg';
const { Pool } = pkg;

export class ConexionDataBase {
  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      user: 'postgres',
      password: 'luz123',
      database: 'tienda_vehiculo_db',
      port: 5432
    });
  }

  async conectar() {
    try {
      await this.pool.connect();
      console.log('Conectado a la base de datos');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  async desconectar() {
    try {
      await this.pool.end();
      console.log('Desconectado de la base de datos');
    } catch (error) {
      console.error('Error al desconectar de la base de datos:', error);
    }
  }
}

export default ConexionDataBase;
