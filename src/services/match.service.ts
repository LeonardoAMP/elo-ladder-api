import { Match } from '../models/Match';
import { Player } from '../models/Player';
import { sequelize } from '../config/database';
import { MatchResponse } from '../types/match.types';

export const createMatch = async (playerAId: number, playerBId: number, eloGain: number, eloLoss: number): Promise<MatchResponse> => {
    const match = await Match.create({
        PlayerAId: playerAId,
        PlayerBId: playerBId,
        EloGain: eloGain,
        EloLoss: eloLoss,
        Timestamp: new Date()
    });

    return match;
};

export const getMatchById = async (id: number): Promise<MatchResponse | null> => {
    const match = await Match.findByPk(id);
    return match;
};

export const getAllMatches = async (): Promise<MatchResponse[]> => {
    const matches = await Match.findAll();
    return matches;
};

export const updateMatch = async (id: number, playerAId: number, playerBId: number, eloGain: number, eloLoss: number): Promise<MatchResponse | null> => {
    const match = await Match.findByPk(id);
    if (!match) return null;

    match.PlayerAId = playerAId;
    match.PlayerBId = playerBId;
    match.EloGain = eloGain;
    match.EloLoss = eloLoss;
    await match.save();

    return match;
};

export const deleteMatch = async (id: number): Promise<boolean> => {
    const match = await Match.findByPk(id);
    if (!match) return false;

    await match.destroy();
    return true;
};