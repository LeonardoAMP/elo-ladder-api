import Player from '../models/Player';
import Match from '../models/Match';
import { Op } from 'sequelize';

// Create a new player
const createPlayer = async (name: string) => {
  const newPlayer = await Player.create({
    name,
    elo: 1500,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
  });
  return newPlayer;
};

// Get all players
const getPlayers = async () => {
  return await Player.findAll();
};

// Get a player by ID
const getPlayerById = async (id: number) => {
  return await Player.findByPk(id);
};

// Update a player's information
const updatePlayer = async (id: number, updates: Partial<{ name: string; elo: number; matchesPlayed: number; wins: number; losses: number; }>) => {
  const player = await Player.findByPk(id);
  if (player) {
    return await player.update(updates);
  }
  throw new Error('Player not found');
};

// Delete a player
const deletePlayer = async (id: number) => {
  const player = await Player.findByPk(id);
  if (player) {
    await player.destroy();
    return true;
  }
  throw new Error('Player not found');
};

// Get player rankings
const getPlayerRankings = async () => {
  return await Player.findAll({
    order: [['elo', 'DESC']],
  });
};

// Get match history for a player
const getPlayerMatchHistory = async (playerId: number) => {
  return await Match.findAll({
    where: {
      [Op.or]: [
        { playerAId: playerId },
        { playerBId: playerId },
      ],
    },
    order: [['timestamp', 'DESC']],
  });
};

// Export as a single service object
export default {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getPlayerRankings,
  getPlayerMatchHistory
};