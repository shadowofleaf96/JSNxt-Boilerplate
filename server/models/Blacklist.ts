import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface BlacklistAttributes {
  id?: number;
  token: string;
}

class Blacklist extends Model<BlacklistAttributes> implements BlacklistAttributes {
  public id!: number;
  public token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Blacklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Blacklist',
    tableName: 'blacklists',
    timestamps: true
  }
);

export default Blacklist;