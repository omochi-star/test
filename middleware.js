const ExpressError = require('./utils/ExpressError');
const { bookSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');
const Book = require('./models/book');

module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // 認証済み → 次の処理へ
    }
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'ログインしてください');
    res.redirect('/login'); // 未ログイン → ログインページへ
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isBookOwner = async (req, res, next) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book.owner.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/books/${bookId}`);
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/reviews/${reviewId}`);
    }
    next();
}

module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join((','));
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join((','));
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}