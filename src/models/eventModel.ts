import mongoose, { Schema, Document } from 'mongoose';

interface IEvent extends Document {
  title: string;
  location: string;
  tags: string[];
  image: string;
  location_url: string;
  date: Date;
  start_time: string;
  created_at: Date;
  updated_at: Date;
}

const eventSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  tags: { type: [String], required: false },
  image: { type: String, required: false },
  location_url: { type: String, required: false },
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IEvent>('Event', eventSchema);
