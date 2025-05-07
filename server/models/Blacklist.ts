import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import sequelize from '../config/database';

interface BlacklistAttributes {
  id?: string;
  token: string;
}

class Blacklist
  extends Model<BlacklistAttributes>
  implements BlacklistAttributes
{
  declare id: string;
  declare token: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Blacklist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Blacklist',
    tableName: 'Blacklists',
    timestamps: true,
  }
);

export default Blacklist;
