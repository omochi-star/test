const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Book = require('../models/book');
const { reviewSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');

// レビューの詳細ページ表示
router.get('/:reviewId', isLoggedIn, async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('book');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/show', { review });
});

// レビュー編集フォーム
router.get('/:reviewId/edit', isLoggedIn, async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('book');
    res.render('reviews/edit', { review });
});

// レビュー更新
router.put('/:reviewId', isLoggedIn, async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body.review;
    const review = await Review.findByIdAndUpdate(reviewId, { content, rating }, { new: true });
    await review.save();
    req.flash('success', 'ブックレビューを更新しました');
    res.redirect(`/reviews/${review._id}`)
});

// レビュー削除
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'ブックレビューを削除しました');
    res.redirect('/my/reviews');
}));




module.exports = router;