const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Book = require('../models/book');
const { reviewSchema } = require('../schemas');
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join((','));
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/', catchAsync(async (req, res) => {
    const books = await Book.find({});
    // const formattedReviews = reviews.map(review => ({
    //     ...review.toObject(),
    //     createdAtFormatted: review.createdAt.toLocaleDateString('ja-JP'),
    //     updatedAtFormatted: review.updatedAt.toLocaleDateString('ja-JP')
    // }));
    res.render('books/index', { books });
}));

// router.post('/', validateReview, catchAsync(async (req, res) => {
router.post('/', catchAsync(async (req, res) => {

    const book = new Book(req.body.books);
    await book.save();
    req.flash('success', '新しい本を登録しました');
    res.redirect(`books/${book._id}`);
}));

router.get('/new', (req, res) => {
    res.render('books/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        req.flash('error', '本の詳細ページは見つかりませんでした');
        return res.redirect('/books');
    }
    res.render('books/show', { book });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        req.flash('error', 'ブックレビューは見つかりませんでした');
        return res.redirect('/bookreview');
    }
    res.render('edit', { review });
}));

router.put('/:id', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
    await review.save();
    req.flash('success', 'ブックレビューを更新しました');
    res.redirect(`/bookreview/${review._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'ブックレビューを削除しました');
    res.redirect('/bookreview');
}));

module.exports = router;