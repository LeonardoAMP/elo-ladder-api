-- Drop tables if they exist to ensure clean seeding
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS characters;

-- Create users table (matching User model)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create characters table (matching Character model)
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon_name VARCHAR(255) NOT NULL,
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
    main INTEGER REFERENCES characters(id) ON UPDATE CASCADE ON DELETE SET NULL,
    skin SMALLINT DEFAULT 0,
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

-- Seed characters (popular SSBU characters)
INSERT INTO characters (name, icon_name, "createdAt", "updatedAt") VALUES
('Mario', 'mario', NOW(), NOW()),
('Donkey Kong', 'donkey_kong', NOW(), NOW()),
('Link', 'link', NOW(), NOW()),
('Samus', 'samus', NOW(), NOW()),
('Dark Samus', 'dark_samus', NOW(), NOW()),
('Yoshi', 'yoshi', NOW(), NOW()),
('Kirby', 'kirby', NOW(), NOW()),
('Fox', 'fox', NOW(), NOW()),
('Pikachu', 'pikachu', NOW(), NOW()),
('Luigi', 'luigi', NOW(), NOW()),
('Ness', 'ness', NOW(), NOW()),
('Captain Falcon', 'captain_falcon', NOW(), NOW()),
('Jigglypuff', 'jigglypuff', NOW(), NOW()),
('Peach', 'peach', NOW(), NOW()),
('Daisy', 'daisy', NOW(), NOW()),
('Bowser', 'bowser', NOW(), NOW()),
('Ice Climbers', 'ice_climbers', NOW(), NOW()),
('Sheik', 'sheik', NOW(), NOW()),
('Zelda', 'zelda', NOW(), NOW()),
('Dr. Mario', 'dr_mario', NOW(), NOW()),
('Pichu', 'pichu', NOW(), NOW()),
('Falco', 'falco', NOW(), NOW()),
('Marth', 'marth', NOW(), NOW()),
('Lucina', 'lucina', NOW(), NOW()),
('Young Link', 'young_link', NOW(), NOW()),
('Ganondorf', 'ganondorf', NOW(), NOW()),
('Mewtwo', 'mewtwo', NOW(), NOW()),
('Roy', 'roy', NOW(), NOW()),
('Chrom', 'chrom', NOW(), NOW()),
('Mr. Game & Watch', 'mr_game_and_watch', NOW(), NOW()),
('Meta Knight', 'meta_knight', NOW(), NOW()),
('Pit', 'pit', NOW(), NOW()),
('Dark Pit', 'dark_pit', NOW(), NOW()),
('Zero Suit Samus', 'zero_suit_samus', NOW(), NOW()),
('Wario', 'wario', NOW(), NOW()),
('Snake', 'snake', NOW(), NOW()),
('Ike', 'ike', NOW(), NOW()),
('Pokemon Trainer', 'pokemon_trainer', NOW(), NOW()),
('Diddy Kong', 'diddy_kong', NOW(), NOW()),
('Lucas', 'lucas', NOW(), NOW()),
('Sonic', 'sonic', NOW(), NOW()),
('King Dedede', 'king_dedede', NOW(), NOW()),
('Olimar', 'olimar', NOW(), NOW()),
('Lucario', 'lucario', NOW(), NOW()),
('R.O.B.', 'rob', NOW(), NOW()),
('Toon Link', 'toon_link', NOW(), NOW()),
('Wolf', 'wolf', NOW(), NOW()),
('Villager', 'villager', NOW(), NOW()),
('Mega Man', 'mega_man', NOW(), NOW()),
('Wii Fit Trainer', 'wii_fit_trainer', NOW(), NOW()),
('Rosalina & Luma', 'rosalina_and_luma', NOW(), NOW()),
('Little Mac', 'little_mac', NOW(), NOW()),
('Greninja', 'greninja', NOW(), NOW()),
('Palutena', 'palutena', NOW(), NOW()),
('Pac-Man', 'pac_man', NOW(), NOW()),
('Robin', 'robin', NOW(), NOW()),
('Shulk', 'shulk', NOW(), NOW()),
('Bowser Jr.', 'bowser_jr', NOW(), NOW()),
('Duck Hunt', 'duck_hunt', NOW(), NOW()),
('Ryu', 'ryu', NOW(), NOW()),
('Ken', 'ken', NOW(), NOW()),
('Cloud', 'cloud', NOW(), NOW()),
('Corrin', 'corrin', NOW(), NOW()),
('Bayonetta', 'bayonetta', NOW(), NOW()),
('Inkling', 'inkling', NOW(), NOW()),
('Ridley', 'ridley', NOW(), NOW()),
('Simon', 'simon', NOW(), NOW()),
('Richter', 'richter', NOW(), NOW()),
('King K. Rool', 'king_k_rool', NOW(), NOW()),
('Isabelle', 'isabelle', NOW(), NOW()),
('Incineroar', 'incineroar', NOW(), NOW()),
('Piranha Plant', 'piranha_plant', NOW(), NOW()),
('Joker', 'joker', NOW(), NOW()),
('Hero', 'hero', NOW(), NOW()),
('Banjo & Kazooie', 'banjo_and_kazooie', NOW(), NOW()),
('Terry', 'terry', NOW(), NOW()),
('Byleth', 'byleth', NOW(), NOW()),
('Min Min', 'min_min', NOW(), NOW()),
('Steve', 'steve', NOW(), NOW()),
('Sephiroth', 'sephiroth', NOW(), NOW()),
('Pyra', 'pyra', NOW(), NOW()),
('Mythra', 'mythra', NOW(), NOW()),
('Kazuya', 'kazuya', NOW(), NOW()),
('Sora', 'sora', NOW(), NOW());

-- Seed players with main characters and skins
INSERT INTO players (name, elo, "matchesPlayed", wins, losses, main, skin, "createdAt", "updatedAt") VALUES
('Blazer', 800, 0, 0, 0, 1, 0, NOW(), NOW()), -- Mario, default skin
('Jak', 800, 0, 0, 0, 9, 2, NOW(), NOW()), -- Pikachu, skin 2
('DarkR', 800, 0, 0, 0, 16, 1, NOW(), NOW()), -- Bowser, skin 1
('Fred', 800, 0, 0, 0, 3, 0, NOW(), NOW()), -- Link, default skin
('Jr', 800, 0, 0, 0, 8, 3, NOW(), NOW()), -- Fox, skin 3
('Leoo', 800, 0, 0, 0, 12, 0, NOW(), NOW()), -- Captain Falcon, default skin
('Jul', 800, 0, 0, 0, 4, 1, NOW(), NOW()); -- Samus, skin 1

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
