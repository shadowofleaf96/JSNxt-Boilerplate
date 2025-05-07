import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

import { ensureDirectoryExists } from './../utils/fileUtils';

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    if (file.fieldname === 'avatar') {
      const userDir = `uploads/images/users/avatar`;
      ensureDirectoryExists(userDir);
      cb(null, userDir);
    } else {
      const generalDir = 'uploads/images/general';
      ensureDirectoryExists(generalDir);
      cb(null, generalDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

function checkFileType(
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5_000_000 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    checkFileType(file, cb);
  },
});

export const uploadAvatar = upload.single('avatar');

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: './uploads/general/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  }),
  fileFilter: (req, file, cb) => checkFileType(file, cb),
}).single('image');

export default upload;
