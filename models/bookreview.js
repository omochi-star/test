const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    title: String,
    rating: Number,
    comment: String
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

module.exports = mongoose.model('Review', reviewSchema);