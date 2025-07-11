const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);