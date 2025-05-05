export interface UserDTO {
  authProvider: "local" | "google";
  googleId?: string;
  password?: string;
  username: string;
  email: string;
  role?: string;
}

export interface UserDocument {
  id: number;
  authProvider: 'local' | 'google';
  googleId?: string;
  avatar: string;
  name?: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastActive: Date;
  emailToken?: string | null;
  isVerified: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpire?: number | null;
}

