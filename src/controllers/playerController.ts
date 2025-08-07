import { Request, Response } from 'express';
import playerService from '../services/player.service';
import { CreatePlayerData, UpdatePlayerData } from '../types/player.types';

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management endpoints
 */

/**
 * @swagger
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The player's name
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Create a new player
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const playerData: CreatePlayerData = req.body;
    const newPlayer = await playerService.createPlayer(playerData);
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ message: 'Error creating player', error });
  }
};

/**
 * @swagger
 * /players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of all players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all players
export const getPlayers = async (req: Request, res: Response) => {
  try {
    const players = await playerService.getPlayers();
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players', error });
  }
};

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Player ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
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
// Get a player by ID
export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.id, 10);
    const player = await playerService.getPlayerById(playerId);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player', error });
  }
};

// Update a player
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.id, 10);
    const updatedData = req.body;
    const updatedPlayer = await playerService.updatePlayer(playerId, updatedData);
    if (updatedPlayer) {
      res.status(200).json(updatedPlayer);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating player', error });
  }
};

// Delete a player
export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.id, 10);
    const deletedPlayer = await playerService.deletePlayer(playerId);
    if (deletedPlayer) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting player', error });
  }
};