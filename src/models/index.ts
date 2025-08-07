import Player from './Player';
import Match from './Match';
import User from './User';
import Character from './Character';

// Define associations
Player.belongsTo(Character, {
  foreignKey: 'main',
  as: 'mainCharacter'
});

Character.hasMany(Player, {
  foreignKey: 'main',
  as: 'players'
});

export { Player, Match, User, Character };