export interface Player {
  id: number;
  name: string;
  elo: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  main?: number; // Foreign key to Characters table
  skin?: number; // Character skin number
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayerResponse {
  player: Player;
}

export interface PlayerListResponse {
  players: Player[];
}

export interface CreatePlayerData {
  name: string;
  main?: number;
  skin?: number;
}

export interface UpdatePlayerData {
  name?: string;
  main?: number;
  skin?: number;
}