import fs from 'fs';
import path from 'path';

export const ensureDirectoryExists = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

export const getPublicUrl = (filePath: string) => {
  const relativePath = path.relative('uploads', filePath);
  return `${process.env.BACKEND_URL}/${relativePath.replace(/\\/g, '/')}`;
};
