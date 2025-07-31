const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');

const { isLoggedIn, isAuthor, validateReview } = require('../middleware');

// レビューの詳細ページ表示
router.get('/:reviewId', async (req, res) => {
    const review = await Review.findById(req.params.reviewId).populate('book');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/show', { review });
});

// レビュー編集フォーム
router.get('/:reviewId/edit', isLoggedIn, isAuthor, async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('book');
    if (!review) {
        req.flash('error', 'レビューの詳細ページは見つかりませんでした');
        return res.redirect('/my/reviews');
    }
    res.render('reviews/edit', { review });
});

// レビュー更新
router.put('/:reviewId', isLoggedIn, isAuthor, validateReview, async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body.review;
    const updateReview = await Review.findByIdAndUpdate(reviewId, { content, rating }, { new: true });
    await updateReview.save();
    req.flash('success', 'ブックレビューを更新しました');
    res.redirect(`/reviews/${updateReview._id}`);
});

// レビュー削除
router.delete('/:reviewId', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'ブックレビューを削除しました');
    res.redirect('/my/reviews');
}));




module.exports = router;