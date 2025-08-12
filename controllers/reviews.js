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

module.exports.showReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('book').populate('owner');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/show', { review });
}

module.exports.renderEditForm = async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('book');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/edit', { review });
}

module.exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body.review;
    const updateReview = await Review.findByIdAndUpdate(reviewId, { content, rating }, { new: true });
    await updateReview.save();
    req.flash('success', 'ブックレビューを更新しました');
    res.redirect(`/reviews/${updateReview._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'ブックレビューを削除しました');
    res.redirect('/my/reviews');
}