import express from 'express';
import { getVehiculos, getVehiculoById, postVehiculo, deleteVehiculo, updateVehiculo } from '../controllers/vehiculoController.js';

const router = express.Router();

router.get('/', getVehiculos);
router.get('/:id', getVehiculoById);
router.post('/', postVehiculo);
router.delete('/:id', deleteVehiculo);
router.patch('/', updateVehiculo);

export default router;
