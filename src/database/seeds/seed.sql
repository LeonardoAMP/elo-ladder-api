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

-- Create matches table (matching updated Match model)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    "winnerId" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eloChange" INTEGER NOT NULL,
    "winnerCurrentElo" INTEGER NOT NULL,
    "loserCurrentElo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY ("winnerId") REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY ("loserId") REFERENCES players(id) ON DELETE CASCADE
);

-- Seed users
INSERT INTO users (username, password, "createdAt", "updatedAt") VALUES
('admin', '$2b$10$rJJUuvTDzXkBJD1NzIJnseQS7uFpWEXGYjJMZFdNgsJ/XRg.qpM0a', NOW(), NOW()), -- password: admin123
('player1', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()), -- password: password1
('player2', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()), -- password: password1
('player3', '$2b$10$OCqoFmGhvoCgGSfhVXJjpuzz2KzQ9618rQimPdYgnl2iuCI6XTpVy', NOW(), NOW()); -- password: password1

-- Seed players
INSERT INTO players (name, elo, "matchesPlayed", wins, losses, "createdAt", "updatedAt") VALUES
('Blazer', 800, 0, 0, 0, NOW(), NOW()),
('Jak', 800, 0, 0, 0, NOW(), NOW()),
('DarkR', 800, 0, 0, 0, NOW(), NOW()),
('Fred', 800, 0, 0, 0, NOW(), NOW()),
('Jr', 800, 0, 0, 0, NOW(), NOW()),
('Leoo', 800, 0, 0, 0, NOW(), NOW()),
('Jul', 800, 0, 0, 0, NOW(), NOW());

-- Seed matches - updated to use the new schema
INSERT INTO matches ("winnerId", "loserId", timestamp, "eloChange", "winnerCurrentElo", "loserCurrentElo", "createdAt", "updatedAt") VALUES
(1, 2, NOW() - INTERVAL '5 days', 15, 815, 785, NOW(), NOW()), -- Blazer vs Jak (Blazer won)
(3, 4, NOW() - INTERVAL '4 days', 12, 812, 788, NOW(), NOW()), -- DarkR vs Fred (DarkR won) 
(5, 2, NOW() - INTERVAL '3 days', 18, 818, 767, NOW(), NOW()), -- Jr vs Jak (Jr won)
(1, 3, NOW() - INTERVAL '2 days', 10, 825, 802, NOW(), NOW()), -- Blazer vs DarkR (Blazer won)
(5, 4, NOW() - INTERVAL '1 day', 20, 838, 768, NOW(), NOW()),  -- Jr vs Fred (Jr won)
(1, 5, NOW() - INTERVAL '10 hours', 15, 840, 823, NOW(), NOW()), -- Blazer vs Jr (Blazer won)
(4, 2, NOW() - INTERVAL '5 hours', 8, 776, 759, NOW(), NOW()),  -- Fred vs Jak (Fred won)
(1, 4, NOW() - INTERVAL '2 hours', 10, 850, 766, NOW(), NOW()); -- Blazer vs Fred (Blazer won)
