import express from 'express';
import { getInsumos, getInsumoById, postInsumo, deleteInsumo, updateInsumo } from '../controllers/insumoController.js';

const router = express.Router();
router.get('/', getInsumos);
router.get('/:id', getInsumoById);
router.post('/', postInsumo);
router.delete('/:id', deleteInsumo);
router.patch('/', updateInsumo);

export default router;
