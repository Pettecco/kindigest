/* eslint-disable @typescript-eslint/no-unsafe-call */
import { diskStorage } from 'multer';
import {
  ALLOWED_EXTENSIONS,
  MAX_VOCAB_FILE_SIZE,
  TEMP_UPLOAD_DIR,
} from './constants';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
  storage: diskStorage({
    destination: TEMP_UPLOAD_DIR,

    filename: (_req, file, callback) => {
      const extension = extname(file.originalname).toLowerCase();

      callback(null, `${randomUUID()}${extension}`);
    },
  }),

  limits: {
    fileSize: MAX_VOCAB_FILE_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return callback(
        new BadRequestException(
          'Only Kindle vocabularu database (.db) files are allowed',
        ),
        false,
      );
    }

    callback(null, true);
  },
};
