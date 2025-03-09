import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

type MulterCallback = (error: Error | null, destination: string) => void;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: MulterCallback,
  ): void => {
    cb(null, 'uploads/');
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: MulterCallback,
  ): void => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedTypes = /jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Ошибка: только .jpg, .jpeg и .png файлы!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export { upload };
