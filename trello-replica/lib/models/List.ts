import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Card from './Card';

const ListSchema = new mongoose.Schema({
    _id: { type: ObjectId, required: true },
    name: {type: String},
    cards: {type: [Card]}
})

export default mongoose.models.List || mongoose.model('List', ListSchema);
