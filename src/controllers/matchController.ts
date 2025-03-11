import { Request, Response } from 'express';
import Match from '../models/Match';
import Player from '../models/Player';
import { calculateElo } from '../utils/eloCalculator';

// Create a new match
export const createMatch = async (req: Request, res: Response) => {
    const { playerAId, playerBId, winnerId } = req.body;

    try {
        const playerA = await Player.findByPk(playerAId);
        const playerB = await Player.findByPk(playerBId);

        if (!playerA || !playerB) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Determine winner and loser
        const winner = winnerId === playerAId ? playerA : playerB;
        const loser = winnerId === playerAId ? playerB : playerA;
        
        // Calculate ELO change
        const eloChange = calculateElo(winner.elo, loser.elo);

        const match = await Match.create({
            winnerId,
            loserId: loser.id,
            timestamp: new Date(),
            eloChange,
            winnerCurrentElo: winner.elo,
            loserCurrentElo: loser.elo,
        });

        // Update player ELOs and statistics
        await winner.update({ 
            elo: winner.elo + eloChange,
            matchesPlayed: winner.matchesPlayed + 1,
            wins: winner.wins + 1
        });
        
        await loser.update({ 
            elo: loser.elo - eloChange,
            matchesPlayed: loser.matchesPlayed + 1,
            losses: loser.losses + 1
        });

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
    const { winnerId, loserId } = req.body;

    try {
        const match = await Match.findByPk(id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        await match.update({ winnerId, loserId });
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