import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Board || mongoose.model('Board', BoardSchema);
