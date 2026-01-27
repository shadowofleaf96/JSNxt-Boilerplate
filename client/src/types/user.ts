export interface User {
  id: string;
  authProvider: 'local' | 'google';
  avatar: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  avatar: string;
  name: string;
  role: string;
  username: string;
  accessToken?: string;
}
