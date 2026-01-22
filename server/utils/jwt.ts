import jwt from 'jsonwebtoken';

export const generateAccessJWT = (userId: string): string => {
  const payload = {
    id: userId,
  };

  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN as string, {
    expiresIn: '10d',
  });
};
