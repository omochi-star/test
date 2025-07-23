const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    content: String,
    rating: Number,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    book: { type: Schema.Types.ObjectId, ref: 'Book' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);