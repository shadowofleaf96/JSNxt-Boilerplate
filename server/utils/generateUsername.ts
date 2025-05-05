import User from "../models/Users";

/**
 * Generates a unique username based on the provided name.
 * If the base username already exists, appends a numeric suffix to make it unique.
 *
 * @param name - The full name of the user.
 * @returns A unique username string.
 */
export async function generateUniqueUsername(name: string): Promise<string> {
  const baseUsername = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");

  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ where: { username } })) {
    username = `${baseUsername}_${counter}`;
    counter++;
  }

  return username;
}
