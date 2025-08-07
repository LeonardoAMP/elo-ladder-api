import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Match from '../models/Match';
import Player from '../models/Player';
import { calculateElo } from '../utils/eloCalculator';

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Match management endpoints
 */

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Create a new match
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerAId
 *               - playerBId
 *               - winnerId
 *             properties:
 *               playerAId:
 *                 type: integer
 *                 description: ID of player A
 *                 example: 1
 *               playerBId:
 *                 type: integer
 *                 description: ID of player B
 *                 example: 2
 *               winnerId:
 *                 type: integer
 *                 description: ID of the winning player (must be either playerAId or playerBId)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
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

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Get all active matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: List of all active matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /matches/{id}:
 *   put:
 *     summary: Update a match
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Match ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - winnerId
 *               - loserId
 *             properties:
 *               winnerId:
 *                 type: integer
 *                 description: ID of the winning player
 *                 example: 1
 *               loserId:
 *                 type: integer
 *                 description: ID of the losing player
 *                 example: 2
 *     responses:
 *       200:
 *         description: Match updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match or player not found
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

/**
 * @swagger
 * /matches/{id}:
 *   delete:
 *     summary: Delete a match (soft delete)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Match ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Match deleted successfully
 *       404:
 *         description: Match or player not found
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

/**
 * @swagger
 * /matches/recent:
 *   get:
 *     summary: Get recent matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: List of recent active matches (last 10)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /matches/filter:
 *   get:
 *     summary: Filter matches with various criteria
 *     tags: [Matches]
 *     parameters:
 *       - in: query
 *         name: playerId
 *         description: Filter matches where the player was either winner or loser
 *         schema:
 *           type: integer
 *       - in: query
 *         name: winnerId
 *         description: Filter matches by specific winner
 *         schema:
 *           type: integer
 *       - in: query
 *         name: loserId
 *         description: Filter matches by specific loser
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         description: Filter matches from this date onwards (ISO format)
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         description: Filter matches up to this date (ISO format)
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: minEloChange
 *         description: Filter matches with ELO change >= this value
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxEloChange
 *         description: Filter matches with ELO change <= this value
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of results to return
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         description: Number of results to skip for pagination
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Filtered matches with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of matches matching the filter
 *                     limit:
 *                       type: integer
 *                       description: Number of results returned
 *                     offset:
 *                       type: integer
 *                       description: Number of results skipped
 *                     hasMore:
 *                       type: boolean
 *                       description: Whether there are more results available
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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