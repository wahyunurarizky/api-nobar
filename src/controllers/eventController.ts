import { Request, Response, NextFunction } from 'express';
import Event from '../models/eventModel';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/appError';

// Get all events
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find();
    const baseUrl = process.env.BASE_URL; // Get base URL from env

    // Map through events to include full image URL
    const eventsWithFullImageUrls = events.map((event) => ({
      ...event.toObject(), // Convert Mongoose document to plain object
      image: event.image ? `${baseUrl}/uploads/${event.image}` : null // Append base URL
    }));

    res.status(200).json(eventsWithFullImageUrls);
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    const baseUrl = process.env.BASE_URL; // Get base URL from env

    if (!event) {
      const error = new Error('Event not found');
      (error as any).statusCode = 404; // Set custom status code
      throw error;
    }

    // Return event with full image URL
    res.status(200).json({
      ...event.toObject(),
      image: event.image ? `${baseUrl}/uploads/${event.image}` : null
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, location, tags } = req.body;
    const newEvent = new Event({
      title,
      location,
      location_url: req.body.location_url,
      tags: tags.split(','),
      date: new Date(req.body.date),
      start_time: req.body.start_time,
      image: req.file?.filename
    });
    const savedEvent = await newEvent.save();
    const baseUrl = process.env.BASE_URL; // Get base URL from env

    // Return saved event with full image URL
    res.status(201).json({
      ...savedEvent.toObject(),
      image: savedEvent.image ? `${baseUrl}/uploads/${savedEvent.image}` : null
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const baseUrl = process.env.BASE_URL; // Get base URL from env

    // Find the existing event
    const existingEvent = await Event.findById(eventId);

    if (!existingEvent) {
      throw new AppError('Event not found', 404);
    }

    // Remove the previous image if it exists
    if (existingEvent.image && req.file) {
      const imagePath = path.join(__dirname, '../../uploads', existingEvent.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error removing previous image:', err);
        }
      });
    }

    // Update the event with new data
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        ...req.body,
        tags: req.body.tags.split(','), // Convert tags to array
        image: req.file ? req.file.filename : existingEvent.image // Use new file or retain the old one
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new AppError('Event not found', 404);
    }

    // Return updated event with full image URL
    res.status(200).json({
      ...updatedEvent.toObject(),
      image: updatedEvent.image ? `${baseUrl}/uploads/${updatedEvent.image}` : null
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      const error = new Error('Event not found');
      (error as any).statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};
