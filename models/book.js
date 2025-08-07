const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    category: String,
    images: [imageSchema],
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


bookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ book: doc._id });
    }
});

module.exports = mongoose.model('Book', bookSchema);