import { Document } from "mongoose";

export interface UserDTO {
  authProvider: "local" | "google";
  googleId?: string;
  password?: string;
  username: string;
  email: string;
  role?: string;
}

export interface UserDocument extends Document {
  authProvider: "local" | "google";
  googleId?: string;
  avatar: string;
  name?: string;
  username: string;
  password?: string;
  email: string;
  role: string;
  status: string;
  lastActive?: Date;
  emailToken?: string;
  isVerified?: boolean;
  resetPasswordToken: string;
  resetPasswordExpire?: Number;
  isModified: (path: string) => boolean;
  generateAccessJWT: () => string;
}
