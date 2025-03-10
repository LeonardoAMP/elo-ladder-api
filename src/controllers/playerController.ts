import { Request, Response } from 'express';
import Player from '../models/Player';
import playerService from '../services/player.service';

// Create a new player
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const playerData = req.body;
    const newPlayer = await playerService.createPlayer(playerData);
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating player', error });
  }
};

// Get all players
export const getPlayers = async (req: Request, res: Response) => {
  try {
    const players = await playerService.getPlayers();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching players', error });
  }
};

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