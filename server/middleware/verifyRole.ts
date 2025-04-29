import express, { Request, Response, NextFunction } from 'express';
import { UserDocument } from "../types/user.interface";

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

const VerifyRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this page.",
      });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};

export default VerifyRole;
