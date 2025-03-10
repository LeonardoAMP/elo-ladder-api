import { Router } from 'express';
import { 
  createPlayer, 
  getPlayers, 
  getPlayerById, 
  updatePlayer, 
  deletePlayer 
} from '../controllers/playerController';

const router = Router();

// Route to create a new player
router.post('/', createPlayer);

// Route to get all players
router.get('/', getPlayers);

// Route to get a player by ID
router.get('/:id', getPlayerById);

// Route to update a player by ID
router.put('/:id', updatePlayer);

// Route to delete a player by ID
router.delete('/:id', deletePlayer);

export default router;