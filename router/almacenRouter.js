import express from 'express';
import { getAlmacenes, getAlmacenById,  postAlmacen,  deleteAlmacen,  updateAlmacen} from '../controllers/almacenController.js';

const router = express.Router();

router.get('/', getAlmacenes);
router.get('/:id', getAlmacenById);
router.post('/', postAlmacen);
router.delete('/:id', deleteAlmacen);
router.patch('/', updateAlmacen);

export default router;
