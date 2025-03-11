import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Match extends Model {
  public id!: number;
  public winnerId!: number;
  public loserId!: number;
  public timestamp!: Date;
  public eloChange!: number;
  public winnerCurrentElo!: number;
  public loserCurrentElo!: number;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    eloChange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    winnerCurrentElo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loserCurrentElo: {
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