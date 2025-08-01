const Book = require('../models/book');
const Review = require('../models/review');

module.exports.renderNewForm = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.render('reviews/new', { book, bookId });
}


module.exports.createReview = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ExpressError('Book not found', 404);
    }
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    review.book = book._id;
    await review.save();
    req.flash('success', 'レビューを登録しました');
    res.redirect(`/reviews/${review._id}`);
}