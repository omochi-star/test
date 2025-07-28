const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Book = require('../models/book');
const { reviewSchema } = require('../schemas');

// レビューの詳細ページ表示
router.get('/:reviewId', async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('book');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/show', { review });
});

module.exports = router;