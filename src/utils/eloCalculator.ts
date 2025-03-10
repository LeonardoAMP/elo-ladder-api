import { Player } from '../types/player.types';
const calculateElo = (winnerElo: number, loserElo: number) => {
  const kFactor = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const eloChange = Math.round(kFactor * (1 - expectedScore));
  return eloChange;
};

const updatePlayerElo = (players: Player[], winnerId: number, loserId: number) => {
  const winner = players.find(player => player.id === winnerId);
  const loser = players.find(player => player.id === loserId);

  if (!winner || !loser) {
    throw new Error('Player not found');
  }

  const eloChange = calculateElo(winner.elo, loser.elo);

  winner.elo += eloChange;
  loser.elo -= eloChange;

  winner.matchesPlayed += 1;
  winner.wins += 1;
  loser.matchesPlayed += 1;
  loser.losses += 1;

  return { winner, loser };
};

export { calculateElo, updatePlayerElo };