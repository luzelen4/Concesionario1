import express from 'express';
import { getVentas, getVentaById, postVenta, deleteVenta, updateVenta } from '../controllers/ventaController.js';

const router = express.Router();

router.get('/', getVentas);
router.get('/:id', getVentaById);
router.post('/', postVenta);
router.delete('/:id', deleteVenta);
router.patch('/', updateVenta);

export default router;
