-- Drop tables if they exist to ensure clean seeding
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;

-- Create users table (matching User model)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create players table (matching Player model)
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    elo INTEGER NOT NULL DEFAULT 1500,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create matches table (matching Match model)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    "playerAId" INTEGER NOT NULL,
    "playerBId" INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eloGain" INTEGER NOT NULL,
    "eloLoss" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("playerAId") REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY ("playerBId") REFERENCES players(id) ON DELETE CASCADE
);

-- Seed users
INSERT INTO users (username, password, "createdAt", "updatedAt") VALUES
('admin', '$2b$10$rJJUuvTDzXkBJD1NzIJnseQS7uFpWEXGYjJMZFdNgsJ/XRg.qpM0a', NOW(), NOW()), -- password: admin123
('player1', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()), -- password: password1
('player2', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()), -- password: password1
('player3', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()); -- password: password1

-- Seed players
INSERT INTO players (name, elo, "matchesPlayed", wins, losses, "createdAt", "updatedAt") VALUES
('Mario Player', 1625, 5, 4, 1, NOW(), NOW()),
('Link Master', 1450, 4, 1, 3, NOW(), NOW()),
('Kirby King', 1580, 3, 2, 1, NOW(), NOW()),
('Fox Fighter', 1490, 3, 1, 2, NOW(), NOW()),
('Pikachu Pro', 1520, 5, 3, 2, NOW(), NOW());

-- Seed matches - eloGain and eloLoss are the ELO points that were gained/lost in each match
INSERT INTO matches ("playerAId", "playerBId", timestamp, "eloGain", "eloLoss", "createdAt", "updatedAt") VALUES
(1, 2, NOW() - INTERVAL '5 days', 15, 15, NOW(), NOW()), -- Mario vs Link (Mario won)
(3, 4, NOW() - INTERVAL '4 days', 12, 12, NOW(), NOW()), -- Kirby vs Fox (Kirby won) 
(2, 5, NOW() - INTERVAL '3 days', 18, 18, NOW(), NOW()), -- Link vs Pikachu (Pikachu won)
(1, 3, NOW() - INTERVAL '2 days', 10, 10, NOW(), NOW()), -- Mario vs Kirby (Mario won)
(4, 5, NOW() - INTERVAL '1 day', 20, 20, NOW(), NOW()),  -- Fox vs Pikachu (Pikachu won)
(1, 5, NOW() - INTERVAL '10 hours', 15, 15, NOW(), NOW()), -- Mario vs Pikachu (Mario won)
(2, 4, NOW() - INTERVAL '5 hours', 8, 8, NOW(), NOW()),  -- Link vs Fox (Fox won)
(1, 4, NOW() - INTERVAL '2 hours', 10, 10, NOW(), NOW()); -- Mario vs Fox (Mario won)
