import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

/**
 * Middleware function for filtering uploaded files.
 * 
 * @param req - The request object.
 * @param file - The uploaded file object.
 * @param cb - The callback function.
 * @returns A callback function with an error or a boolean value indicating whether the file is allowed.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
