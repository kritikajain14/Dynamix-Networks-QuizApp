import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  explanation: { type: String }, // optional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFallback: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
