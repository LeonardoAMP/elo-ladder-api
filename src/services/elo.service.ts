import Player from '../models/Player';
import Match from '../models/Match';
import { calculateElo } from '../utils/eloCalculator';

export const updateEloAfterMatch = async (winnerId: number, loserId: number) => {
  const winner = await Player.findByPk(winnerId);
  const loser = await Player.findByPk(loserId);

  if (!winner || !loser) {
    throw new Error('Player not found');
  }

  const eloChange = calculateElo(winner.elo, loser.elo);

  // Update players' ELO ratings
  await winner.update({
    elo: winner.elo + eloChange,
    matchesPlayed: winner.matchesPlayed + 1,
    wins: winner.wins + 1,
  });

  await loser.update({
    elo: loser.elo - eloChange,
    matchesPlayed: loser.matchesPlayed + 1,
    losses: loser.losses + 1,
  });

  // Create a match record
  await Match.create({
    playerAId: winnerId,
    playerBId: loserId,
    eloGain: eloChange,
    eloLoss: eloChange,
  });
};