import express, { NextFunction, Request, Response } from 'express';

const VerifyRole = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;

    if (!user || user.role !== 'admin') {
      res.status(401).json({
        status: 'failed',
        message: 'You are not authorized to view this page.',
      });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      data: [],
      message: 'Internal Server Error',
    });
  }
};

export default VerifyRole;
