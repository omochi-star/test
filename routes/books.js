const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const books = require('../controllers/books');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateBook, validateReview, isBookOwner } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, upload.array('image'), validateBook, catchAsync(books.createBook));

router.get('/new', isLoggedIn, books.renderNewForm);

router.route('/:bookId')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, isBookOwner, validateBook, catchAsync(books.updateBook))
    .delete(isLoggedIn, isBookOwner, catchAsync(books.deleteBook));

router.get('/:bookId/edit', isLoggedIn, isBookOwner, catchAsync(books.renderEditForm));

router.get('/:bookId/reviews/new', isLoggedIn, catchAsync(reviews.renderNewForm));

router.post('/:bookId/reviews', isLoggedIn, validateReview, catchAsync(reviews.createReview));

module.exports = router;