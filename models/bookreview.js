const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    title: String,
    author: String,
    category: String,
    rating: Number,
    comment: String
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);