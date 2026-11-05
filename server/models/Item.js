const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      required: [true, 'Type (lost/found) is required'],
      lowercase: true,
      enum: ['lost', 'found'],
    },
    location: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    contact: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'returned'],
      default: 'open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'PostedBy user is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);