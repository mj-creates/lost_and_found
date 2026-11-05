const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['lost', 'found'],
    },
    location: {
      type: String,
      default: '',
    },
    contact: {
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
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'returned'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
