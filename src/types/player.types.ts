export interface Player {
  id: number;
  name: string;
  elo: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
}

export interface PlayerResponse {
  player: Player;
}

export interface PlayerListResponse {
  players: Player[];
}