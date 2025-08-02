const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, isReviewOwner, validateReview } = require('../middleware');

router.route('/:reviewId')
    .get(catchAsync(reviews.showReview))
    .put(isLoggedIn, isReviewOwner, validateReview, catchAsync(reviews.updateReview))
    .delete(isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));

router.get('/:reviewId/edit', isLoggedIn, isReviewOwner, catchAsync(reviews.renderEditForm));

module.exports = router;