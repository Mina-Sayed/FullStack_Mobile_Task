import express from 'express';
import { uploadPhoto, browsePhotos } from '../controllers/photoController';
import { upload } from '../middlewares/uploadMiddleware';
import { validatePhoto } from '../middlewares/validatePhoto';
import { requestLogger } from '../middlewares/requestLogger';

/**
 * Express router for handling photo routes.
 */
const router = express.Router();

// Apply request logging middleware globally
router.use(requestLogger);

// Apply upload and validation middleware for the upload endpoint
router.post('/upload', upload.single('photo'), validatePhoto, uploadPhoto);

// Browse photos without middleware, as it's a simple GET request
router.get('/browse', browsePhotos);

export default router;
