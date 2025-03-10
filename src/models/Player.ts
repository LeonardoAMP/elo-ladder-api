import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Player extends Model {
  public id!: number;
  public name!: string;
  public elo!: number;
  public matchesPlayed!: number;
  public wins!: number;
  public losses!: number;
}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    elo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1500,
    },
    matchesPlayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    losses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'players',
  }
);

export default Player;