const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    rating: { type: Number },
    comment: { type: String }
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);