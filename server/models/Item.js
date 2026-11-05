
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    status: {
    type: String,
    enum: ['Active', 'Returned'],
    default: 'Active'
},
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);