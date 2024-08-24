import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Photo } from '../models/photo';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export const uploadPhoto = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded!' });
  } else {
    const photo: Photo = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    };
    res.status(200).json({ message: 'File uploaded successfully!', photo });
  }
};

/**
 * Browse photos in the specified directory.
 * 
 * @param req - The request object.
 * @param res - The response object.
 */
export const browsePhotos = (req: Request, res: Response): void => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      res.status(500).json({ message: 'Unable to scan directory!' });
    } else {
      const photos: Photo[] = files.map((filename) => {
        return {
          filename,
          path: path.join(UPLOADS_DIR, filename),
          mimetype: 'image/jpeg', // or infer from the file extension
          size: fs.statSync(path.join(UPLOADS_DIR, filename)).size,
          url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
        };
      });
      res.status(200).json({ photos });
    }
  });
};
