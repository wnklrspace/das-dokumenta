import mongoose, { Schema } from 'mongoose'

const Comment = new Schema({
  resolved: {
    type: Boolean,
    required: true
  },
  timesEdited: {
    type: Number,
    required: true
  },
  left: {
    type: String,
    required: true
  },
  top: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  document: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }
})

export default mongoose.model('comments', Comment)
