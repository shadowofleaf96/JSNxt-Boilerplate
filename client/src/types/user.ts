export interface User {
  _id: string;
  authProvider: "local" | "google";
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
  _id: string;
  avatar: string;
  name: string;
  role: string;
  username: string;
}
