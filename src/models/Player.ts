import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Player extends Model {
  public id!: number;
  public name!: string;
  public elo!: number;
  public matchesPlayed!: number;
  public wins!: number;
  public losses!: number;
  public main!: number; // Foreign key to Characters table
  public skin!: number; // SmallInt for character skin
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    main: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'characters',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    skin: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Player',
    tableName: 'players',
    timestamps: true,
  }
);

export default Player;