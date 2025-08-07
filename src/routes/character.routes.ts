import express from 'express';
import characterController from '../controllers/characterController';

const router = express.Router();

// Routes
router.get('/', characterController.getAllCharacters);
router.get('/:id', characterController.getCharacterById);
router.post('/', characterController.createCharacter);
router.put('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);

export default router;
