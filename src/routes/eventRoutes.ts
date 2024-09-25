import express from 'express';
import multer, { FileFilterCallback } from 'multer';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import AppError from '../utils/appError';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Replace spaces with underscores in the original filename
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${originalName}`);
  }
});

// File filter to accept only images
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Accept image files only
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new AppError('Only images are allowed!', 400)); // Reject file
  }
};

// Create the multer instance with storage and file filter
const upload = multer({
  storage,
  fileFilter
});

// Routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', upload.single('image'), createEvent);
router.put('/:id', upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;
