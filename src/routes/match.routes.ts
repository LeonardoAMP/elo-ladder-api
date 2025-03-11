import { Router } from 'express';
import { createMatch, getMatches, updateMatch, deleteMatch, getRecentMatches } from '../controllers/matchController';
import authMiddleware from '../middleware/auth.middleware';
import { validateMatch } from '../middleware/validation.middleware';

const router = Router();

// Route to create a new match
router.post('/', authMiddleware, validateMatch,createMatch);

// Route to get all matches
router.get('/', getMatches);

// Route to get recent matches
//router.get('/recent', authMiddleware, getRecentMatches);
router.get('/recent', getRecentMatches);

// Route to update a match by ID
router.put('/:id', authMiddleware, validateMatch, updateMatch);

// Route to delete a match by ID
router.delete('/:id', authMiddleware, deleteMatch);

export default router;