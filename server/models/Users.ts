import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Joi from 'joi';
import { UserDocument } from '../types/user.interface';
import { resetPassword } from '@/controllers/userController';

dotenv.config();

export const UserJoiSchema = Joi.object({
  _id: Joi.any().strip(),
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
  lastActive: Joi.date().optional(),
  emailToken: Joi.string().allow(null, '').optional(),
  isVerified: Joi.boolean().optional(),
  resetPasswordToken: Joi.string().allow(null, '').optional(),
  resetPasswordExpire: Joi.date().allow(null, '').optional(),
});

const UserSchema: Schema<UserDocument> = new Schema<UserDocument>(
  {
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    emailToken: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpire: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'User',
  }
);

UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    const validated = await UserJoiSchema.validateAsync(this.toObject(), {
      stripUnknown: true,
      allowUnknown: true,
    });

    Object.assign(this, validated);

    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate() as Partial<UserDocument>;

    if (update.password) {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    }

    const validated = await UserJoiSchema.validateAsync(update, {
      allowUnknown: true,
      presence: 'optional',
    });
    this.setUpdate(validated);

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre('updateOne', async function (next) {
  try {
    const update = this.getUpdate() as Partial<UserDocument>;

    if (update.password) {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    }

    const validated = await UserJoiSchema.validateAsync(update, {
      allowUnknown: true,
      presence: 'optional',
    });
    this.setUpdate(validated);

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.generateAccessJWT = function (): string {
  const payload = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN as string, {
    expiresIn: '10d',
  });
};

const User = mongoose.model<UserDocument>('users', UserSchema);

export default User;
