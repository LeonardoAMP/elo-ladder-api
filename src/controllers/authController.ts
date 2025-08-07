import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCredentials } from '../types/auth.types';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export const login = async (req: Request, res: Response) => {
  const { username, password }: UserCredentials = req.body;

  try {
    const token = await AuthService.login(username, password);
    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (user already exists, validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const register = async (req: Request, res: Response) => {
  const { username, password }: UserCredentials = req.body;

  try {
    const newUser = await AuthService.register(username, password);
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};