import express from 'express';
import photoRoutes from './routes/photoRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import path from 'path';
import { config } from './config';
import cors from 'cors';

/**
 * Express application instance.
 */
const app = express();

app.use(cors({
  origin: 'http://localhost:19006'
}));
app.use(express.json());
app.use('/api/photos', photoRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});

/**
 * Middleware function to handle CORS errors.
 * 
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'CorsError') {
    res.status(400).json({ message: 'CORS error: ' + err.message });
  } else {
    next(err);
  }
});
