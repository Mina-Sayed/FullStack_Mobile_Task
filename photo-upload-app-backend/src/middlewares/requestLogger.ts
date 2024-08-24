import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for logging incoming requests.
 * 
 * @param req - The incoming request object.
 * @param res - The response object.
 * @param next - The next function in the middleware chain.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
