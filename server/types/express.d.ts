import { UserDocument } from "../types/user.interface";

declare module 'express' {
  interface Request {
    user?: UserDocument;
  }
}
