import { Router } from 'express';
import { 
  createPlayer, 
  getPlayers, 
  getPlayerById, 
  updatePlayer, 
  deletePlayer 
} from '../controllers/playerController';
import authMiddleware from '../middleware/auth.middleware';
import { validatePlayer } from '../middleware/validation.middleware';

const router = Router();

// Route to create a new player
router.post('/', authMiddleware, validatePlayer, createPlayer);

// Route to get all players
router.get('/', getPlayers);

// Route to get a player by ID
router.get('/:id', getPlayerById);

// Route to update a player by ID
router.put('/:id', authMiddleware, updatePlayer);

// Route to delete a player by ID
router.delete('/:id', authMiddleware, deletePlayer);

export default router;