import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to validate if a photo file is uploaded in the request.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call in the middleware chain.
 */
export const validatePhoto = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  next();
};
