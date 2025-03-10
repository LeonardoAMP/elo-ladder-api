import { Router } from 'express';
import authRoutes from './auth.routes';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);

export default router;