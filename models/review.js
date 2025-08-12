const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    content: String,
    rating: Number,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    book: { type: Schema.Types.ObjectId, ref: 'Book' },
}, { timestamps: true });

reviewSchema.virtual('formattedDate').get(function () {
    if (!this.createdAt) return '';
    return this.createdAt.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);