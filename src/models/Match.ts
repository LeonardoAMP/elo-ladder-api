import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Match extends Model {
  public id!: number;
  public playerAId!: number;
  public playerBId!: number;
  public timestamp!: Date;
  public eloGain!: number;
  public eloLoss!: number;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playerAId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerBId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    eloGain: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eloLoss: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'matches',
  }
);

export default Match;