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
    isbn: {
        type: String,
        required: true,
        unique: true, // ISBNが一意になるよう制約
        validate: {
            validator: function (v) {
                // ハイフンを除去して数字だけ残す
                const digits = v.replace(/-/g, '');
                // 数字13桁かどうか
                return /^\d{13}$/.test(digits);
            },
            message: props => `${props.value} は正しいISBN13ではありません`
        }
    },
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

bookSchema.pre('save', function (next) {
    if (this.isbn) {
        this.isbn = this.isbn.replace(/-/g, '');
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);