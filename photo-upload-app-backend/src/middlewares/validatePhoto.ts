import { Request, Response, NextFunction } from 'express';

export const validatePhoto = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  next();
};
