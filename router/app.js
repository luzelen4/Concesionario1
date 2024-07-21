import { Router } from 'express';
import Concesionario from './concesionarioRouter.js';
import Cliente from './clienteRouter.js';
import Empleado from './empleadoRouter.js';
import Almacen from './almacenRouter.js';
import Insumo from './insumoRouter.js';

function routerApi(app){
  const router = Router();
  app.use('/api/v1', router);
  router.use('/concesionario', Concesionario);
  router.use('/cliente', Cliente);
  router.use('/empleado', Empleado);
  router.use('/almacen', Almacen);
  router.use('/insumo', Insumo);
}

export default routerApi;
