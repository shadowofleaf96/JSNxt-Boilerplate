export interface User {
  _id: string;
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
  name: string;
  role: string;
  _id: string;
  username: string;
  avatar: string;
}
