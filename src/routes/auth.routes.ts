import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateLogin, validateRegistration } from '../middleware/validation.middleware';

const router = Router();

// Login route
router.post('/login', validateLogin, login);

// Registration route
//router.post('/register', validateRegistration, register);

export default router;