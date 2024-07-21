import express from 'express';
import { getEmpleados, getEmpleadoById, postEmpleado, deleteEmpleado, updateEmpleado } from '../controllers/empleadoController.js';

const router = express.Router();
router.get('/', getEmpleados);
router.get('/:id', getEmpleadoById);
router.post('/', postEmpleado);
router.delete('/:id', deleteEmpleado);
router.patch('/', updateEmpleado);

export default router;
