import { Request, Response } from 'express';
import { Op } from 'sequelize';
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
        const matches = await Match.findAll({
            where: { isActive: true }
        });
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
        const match = await Match.findOne({
            where: { id, isActive: true }
        });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Check if players have changed
        const playersChanged = match.winnerId !== winnerId || match.loserId !== loserId;

        if (playersChanged) {
            // Get all involved players (old and new)
            const [oldWinner, oldLoser, newWinner, newLoser] = await Promise.all([
                Player.findByPk(match.winnerId),
                Player.findByPk(match.loserId),
                Player.findByPk(winnerId),
                Player.findByPk(loserId)
            ]);

            if (!oldWinner || !oldLoser || !newWinner || !newLoser) {
                return res.status(404).json({ message: 'One or more players not found' });
            }

            // Revert the original ELO changes and statistics
            await oldWinner.update({
                elo: oldWinner.elo - match.eloChange,
                matchesPlayed: oldWinner.matchesPlayed - 1,
                wins: oldWinner.wins - 1
            });

            await oldLoser.update({
                elo: oldLoser.elo + match.eloChange,
                matchesPlayed: oldLoser.matchesPlayed - 1,
                losses: oldLoser.losses - 1
            });

            // Calculate new ELO change with current ELO values
            const newEloChange = calculateElo(newWinner.elo, newLoser.elo);

            // Apply new ELO changes and statistics
            await newWinner.update({
                elo: newWinner.elo + newEloChange,
                matchesPlayed: newWinner.matchesPlayed + 1,
                wins: newWinner.wins + 1
            });

            await newLoser.update({
                elo: newLoser.elo - newEloChange,
                matchesPlayed: newLoser.matchesPlayed + 1,
                losses: newLoser.losses + 1
            });

            // Update the match with new values
            await match.update({
                winnerId,
                loserId,
                eloChange: newEloChange,
                winnerCurrentElo: newWinner.elo,
                loserCurrentElo: newLoser.elo
            });
        } else {
            // If no player changes, just update the match (though winnerId and loserId are the same)
            await match.update({ winnerId, loserId });
        }

        return res.status(200).json(match);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating match', error });
    }
};

// Delete a match
export const deleteMatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`Deleting match with ID: ${id}`);
    try {
        const match = await Match.findOne({
            where: { id, isActive: true }
        });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Get the winner and loser players
        const [winner, loser] = await Promise.all([
            Player.findByPk(match.winnerId),
            Player.findByPk(match.loserId)
        ]);

        if (!winner || !loser) {
            return res.status(404).json({ message: 'One or more players not found' });
        }

        // Revert the ELO changes and statistics
        await winner.update({
            elo: winner.elo - match.eloChange,
            matchesPlayed: winner.matchesPlayed - 1,
            wins: winner.wins - 1
        });

        await loser.update({
            elo: loser.elo + match.eloChange,
            matchesPlayed: loser.matchesPlayed - 1,
            losses: loser.losses - 1
        });

        // Soft delete the match
        await match.update({ isActive: false });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting match', error });
    }
};

// Get recent matches
export const getRecentMatches = async (req: Request, res: Response) => {
    try {
        const recentMatches = await Match.findAll({
            where: { isActive: true },
            order: [['timestamp', 'DESC']],
            limit: 10
        });
        return res.status(200).json(recentMatches);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching recent matches', error });
    }
};

// Filter matches
export const filterMatches = async (req: Request, res: Response) => {
    const { 
        playerId, 
        winnerId, 
        loserId, 
        startDate, 
        endDate, 
        minEloChange, 
        maxEloChange,
        limit = 50,
        offset = 0 
    } = req.query;

    try {
        const whereClause: any = { isActive: true };

        // Filter by specific player (either winner or loser)
        if (playerId) {
            whereClause[Op.or] = [
                { winnerId: playerId },
                { loserId: playerId }
            ];
        }

        // Filter by winner
        if (winnerId) {
            whereClause.winnerId = winnerId;
        }

        // Filter by loser
        if (loserId) {
            whereClause.loserId = loserId;
        }

        // Filter by date range
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate) {
                whereClause.timestamp[Op.gte] = new Date(startDate as string);
            }
            if (endDate) {
                whereClause.timestamp[Op.lte] = new Date(endDate as string);
            }
        }

        // Filter by ELO change range
        if (minEloChange || maxEloChange) {
            whereClause.eloChange = {};
            if (minEloChange) {
                whereClause.eloChange[Op.gte] = parseInt(minEloChange as string);
            }
            if (maxEloChange) {
                whereClause.eloChange[Op.lte] = parseInt(maxEloChange as string);
            }
        }

        const matches = await Match.findAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
        });

        const totalCount = await Match.count({ where: whereClause });

        return res.status(200).json({
            matches,
            pagination: {
                total: totalCount,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
                hasMore: (parseInt(offset as string) + parseInt(limit as string)) < totalCount
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error filtering matches', error });
    }
};