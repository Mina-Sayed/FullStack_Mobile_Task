import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Photo } from '../models/photo';
import { config } from '../config';
import { logError } from '../utils/logger';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const createPhotoObject = (req: Request, filename: string): Photo => {
  return {
    filename,
    path: path.join(UPLOADS_DIR, filename),
    mimetype: 'image/jpeg', // or infer from the file extension
    size: fs.statSync(path.join(UPLOADS_DIR, filename)).size,
    url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
  };
};

export const uploadPhoto = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded!' });
  } else {
    const photo: Photo = createPhotoObject(req, req.file.filename);
    res.status(200).json({ message: 'File uploaded successfully!', photo });
  }
};

export const browsePhotos = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const searchQuery = req.query.search as string || '';

  try {
    const files = await fs.promises.readdir(UPLOADS_DIR);
    const photos: Photo[] = files
      .filter((filename) => filename.includes(searchQuery))
      .map((filename) => createPhotoObject(req, filename));

    const paginatedPhotos = photos.slice(startIndex, endIndex);
    res.status(200).json({ photos: paginatedPhotos, total: photos.length, page, limit });
  } catch (err) {
    logError(err);
    res.status(500).json({ message: 'Unable to scan directory!' });
  }
};

export const deletePhoto = (req: Request, res: Response): void => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      logError(err);
      res.status(500).json({ message: 'Unable to delete file!' });
    } else {
      res.status(200).json({ message: 'File deleted successfully!' });
    }
  });
};

export const updatePhotoMetadata = (req: Request, res: Response): void => {
  const { filename } = req.params;
  const { description } = req.body;
  const filePath = path.join(UPLOADS_DIR, filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      logError(err);
      res.status(500).json({ message: 'Unable to read file!' });
    } else {
      const photo: Photo = createPhotoObject(req, filename);
      photo.description = description;
      res.status(200).json({ message: 'Metadata updated successfully!', photo });
    }
  });
};

export const uploadMultiplePhotos = (req: Request, res: Response): void => {
  if (!req.files || !Array.isArray(req.files)) {
    res.status(400).json({ message: 'No files uploaded!' });
  } else {
    const photos: Photo[] = (req.files as Express.Multer.File[]).map((file) =>
      createPhotoObject(req, file.filename)
    );
    res.status(200).json({ message: 'Files uploaded successfully!', photos });
  }
};
