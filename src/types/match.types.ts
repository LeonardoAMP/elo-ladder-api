export interface Match {
  id: number;
  playerAId: number;
  playerBId: number;
  timestamp: Date;
  eloGain: number;
  eloLoss: number;
}

export interface MatchResponse {
  id: number;
  playerA: string;
  playerB: string;
  timestamp: string;
  eloGain: number;
  eloLoss: number;
}