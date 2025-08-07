import { Router } from 'express';
import authRoutes from './auth.routes';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';
import characterRoutes from './character.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
router.use('/characters', characterRoutes);

export default router;