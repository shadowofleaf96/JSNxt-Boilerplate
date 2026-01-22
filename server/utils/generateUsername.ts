import prisma from '../models/client';

export const generateUniqueUsername = async (name: string): Promise<string> => {
  let username = name.toLowerCase().replace(/\s+/g, '');

  let usernameExists = await prisma.user.findUnique({
    where: { username },
  });

  let counter = 1;

  while (usernameExists) {
    const newUsername = `${username}${counter}`;
    usernameExists = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (!usernameExists) {
      username = newUsername;
    }
    counter++;
  }

  return username;
};
