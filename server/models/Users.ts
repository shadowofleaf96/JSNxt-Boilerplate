import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import sequelize from '../config/database';
import { UserDocument } from '@/types/user.interface';

interface UserCreationAttributes extends Optional<UserDocument, 'id' | 'lastActive' | 'isVerified'> {}

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

class User extends Model<UserDocument, UserCreationAttributes> implements UserDocument {
  public id!: number;
  public authProvider!: 'local' | 'google';
  public googleId?: string;
  public avatar!: string;
  public name?: string;
  public username!: string;
  public email!: string;
  public password?: string;
  public role!: 'admin' | 'user';
  public status!: 'active' | 'inactive';
  public lastActive!: Date;
  public emailToken?: string | null;
  public isVerified!: boolean;
  public resetPasswordToken?: string | null;
  public resetPasswordExpire?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async generateAccessJWT(): Promise<string> {
    return jwt.sign({ id: this.id }, process.env.SECRET_ACCESS_TOKEN!, {
      expiresIn: '10d'
    });
  }

  public validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password!);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authProvider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local'
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(30),
      unique: 'unique_username_constraint',
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: 'unique_email_constraint',
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpire: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.authProvider === 'local' && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
        const { error } = UserJoiSchema.validate(user);
        if (error) throw error;
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export default User;