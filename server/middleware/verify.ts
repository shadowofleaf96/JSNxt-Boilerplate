import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from "jsonwebtoken";
import User from "../models/Users";
import { UserDocument } from "../types/user.interface";

declare module 'express' {
  interface Request {
    user?: UserDocument;
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
}

const Verify = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.sendStatus(401);
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verify(token, process.env.SECRET_ACCESS_TOKEN as string) as DecodedToken;

    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          res.status(401).json({ message: "User not found" });
          return;
        }

        req.user = user;
        next();
      })
      .catch(() => {
        res.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      });

  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      res.status(401).json({ message: "Session expired. Please login" });
      return;
    }
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export default Verify;
