import express from 'express';
import { getConcesionarios, getConcesionarioById, postConcesionario, deleteConcesionario, updateConcesionario } from '../controllers/concesionarioController.js';

const router = express.Router();

router.get('/', getConcesionarios);
router.get('/:id', getConcesionarioById);
router.post('/', postConcesionario);
router.delete('/:id', deleteConcesionario);
router.patch('/', updateConcesionario);  // Cambia a PUT si prefieres una actualización completa

export default router;