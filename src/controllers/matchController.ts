import { Request, Response } from 'express';
import Match from '../models/Match';
import Player from '../models/Player';
import { calculateElo } from '../utils/eloCalculator';

// Create a new match
export const createMatch = async (req: Request, res: Response) => {
    const { playerAId, playerBId, winnerId } = req.body;
    console.log(playerAId, playerBId, winnerId);
    console.log('I AM HERE');
    try {
        const playerA = await Player.findByPk(playerAId);
        const playerB = await Player.findByPk(playerBId);

        if (!playerA || !playerB) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const eloChange = calculateElo(playerA.elo, playerB.elo);

        const match = await Match.create({
            playerAId,
            playerBId,
            timestamp: new Date(),
            eloGain: eloChange,
            eloLoss: -eloChange,
        });

        // Update player ELOs
        await playerA.update({ elo: playerA.elo + (winnerId === playerAId ? eloChange : -eloChange) });
        await playerB.update({ elo: playerB.elo + (winnerId === playerBId ? eloChange : -eloChange) });

        return res.status(201).json(match);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating match', error });
    }
};

// Get all matches
export const getMatches = async (req: Request, res: Response) => {
    try {
        const matches = await Match.findAll();
        return res.status(200).json(matches);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching matches', error });
    }
};

// Update a match
export const updateMatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { playerAId, playerBId, winnerId } = req.body;

    try {
        const match = await Match.findByPk(id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        await match.update({ playerAId, playerBId, winnerId });
        return res.status(200).json(match);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating match', error });
    }
};

// Delete a match
export const deleteMatch = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const match = await Match.findByPk(id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        await match.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting match', error });
    }
};

// Get recent matches
export const getRecentMatches = async (req: Request, res: Response) => {
    try {
        const recentMatches = await Match.findAll({
            order: [['timestamp', 'DESC']],
            limit: 10
        });
        return res.status(200).json(recentMatches);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching recent matches', error });
    }
};