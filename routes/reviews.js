const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, isReviewOwner, validateReview } = require('../middleware');

// レビューの詳細ページ表示
router.get('/:reviewId', catchAsync(reviews.showReview));

// レビュー編集フォーム
router.get('/:reviewId/edit', isLoggedIn, isReviewOwner, catchAsync(reviews.renderEditForm));

// レビュー更新
router.put('/:reviewId', isLoggedIn, isReviewOwner, validateReview, catchAsync(reviews.updateReview));

// レビュー削除
router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));

module.exports = router;