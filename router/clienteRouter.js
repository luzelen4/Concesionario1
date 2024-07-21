import express from 'express';
import { getClientes, getClienteById, postCliente, deleteCliente, updateCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.post('/', postCliente);
router.delete('/:id', deleteCliente);
router.patch('/', updateCliente); 

export default router;