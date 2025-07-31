const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    category: String,
    coverImageUrl: String,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Book', bookSchema);