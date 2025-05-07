import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import Blacklist from '../models/Blacklist';
import User from '../models/Users';

interface DecodedToken extends JwtPayload {
  id: string;
}

const Verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(401)
        .json({ message: 'Authorization header missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const blacklistedToken = await Blacklist.findOne({
      where: { token },
    });

    if (blacklistedToken) {
      res.status(401).json({ message: 'Token has been revoked' });
      return;
    }

    const decoded = verify(
      token,
      process.env.SECRET_ACCESS_TOKEN as string
    ) as DecodedToken;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user.get({ plain: true });

    next();
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Session expired. Please login' });
      return;
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

export default Verify;
