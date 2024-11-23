import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const CardSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);