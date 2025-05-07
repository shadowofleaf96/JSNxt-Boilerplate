import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { UserDocument } from '@/types/user.interface';

import sequelize from '../config/database';

interface UserCreationAttributes
  extends Optional<UserDocument, 'id' | 'lastActive' | 'isVerified'> {}

export const UserJoiSchema = Joi.object({
  authProvider: Joi.string().valid('local', 'google').required(),
  googleId: Joi.string().optional(),
  avatar: Joi.string().required(),
  name: Joi.string().optional(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.when('authProvider', {
    is: 'local',
    then: Joi.string().min(8).required(),
    otherwise: Joi.string().optional().allow(''),
  }),
  role: Joi.string().valid('admin', 'user').required(),
  status: Joi.string().valid('active', 'inactive').required(),
  emailToken: Joi.string().allow(null, '').optional(),
  isVerified: Joi.boolean().optional(),
  resetPasswordToken: Joi.string().allow(null, '').optional(),
  resetPasswordExpire: Joi.number().allow(null).optional(),
});

class User
  extends Model<UserDocument, UserCreationAttributes>
  implements UserDocument
{
  declare id: string;
  declare authProvider: 'local' | 'google';
  declare googleId?: string;
  declare avatar: string;
  declare name?: string;
  declare username: string;
  declare email: string;
  declare password?: string;
  declare role: 'admin' | 'user';
  declare status: 'active' | 'inactive';
  declare lastActive: Date;
  declare emailToken?: string | null;
  declare isVerified: boolean;
  declare resetPasswordToken?: string | null;
  declare resetPasswordExpire?: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async generateAccessJWT(): Promise<string> {
    return jwt.sign({ id: this.id }, process.env.SECRET_ACCESS_TOKEN!, {
      expiresIn: '10d',
    });
  }

  public validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password!);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    authProvider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local',
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(30),
      unique: 'unique_username_constraint',
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: 'unique_email_constraint',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.authProvider === 'local' && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }

        const dataToValidate = {
          authProvider: user.authProvider,
          googleId: user.googleId,
          avatar: user.avatar,
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          status: user.status,
          emailToken: user.emailToken,
          isVerified: user.isVerified,
          resetPasswordToken: user.resetPasswordToken,
          resetPasswordExpire: user.resetPasswordExpire,
        };

        const { error } = UserJoiSchema.validate(dataToValidate);
        if (error) throw error;
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
