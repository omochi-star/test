const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const books = require('../controllers/books');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateBook, validateReview, isBookOwner } = require('../middleware');

router.get('/', catchAsync(books.index));

router.get('/new', isLoggedIn, books.renderNewForm);

router.post('/', validateBook, isLoggedIn, catchAsync(books.createBook));

router.get('/:bookId', catchAsync(books.showBook));

router.get('/:bookId/edit', isLoggedIn, isBookOwner, catchAsync(books.renderEditForm));

router.put('/:bookId', isLoggedIn, isBookOwner, validateBook, catchAsync(books.updateBook));

router.delete('/:bookId', isLoggedIn, isBookOwner, catchAsync(books.deleteBook));

//本に対するレビュー投稿フォーム表示
router.get('/:bookId/reviews/new', isLoggedIn, reviews.renderNewForm);

//レビュー登録
router.post('/:bookId/reviews', isLoggedIn, validateReview, catchAsync(reviews.createReview));

module.exports = router;