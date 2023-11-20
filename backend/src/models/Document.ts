import mongoose, { Schema } from 'mongoose';

const Document = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CommentObject',
    },
  ],
  availableTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model('Document', Document);
