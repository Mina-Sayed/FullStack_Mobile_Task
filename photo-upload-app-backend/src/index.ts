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

app.use(cors())
app.use(express.json());
app.use('/api/photos', photoRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});

