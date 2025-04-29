import { Document } from "mongoose";

export interface UserDTO {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserDocument extends Document {
  avatar: string;
  name?: string;
  username: string;
  password: string;
  email: string;
  role: string;
  status: string;
  lastActive?: Date;
  emailToken?: string;
  isVerified?: boolean;
  resetPasswordToken: string;
  resetPasswordExpire?: Date;
  isModified: (path: string) => boolean;
  generateAccessJWT: () => string;
}
