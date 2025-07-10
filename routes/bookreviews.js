const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/bookreview');
const { bookreviewSchema } = require('../schemas');
const validateBookreview = (req, res, next) => {
    const { error } = bookreviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join((','));
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const bookreviews = await Review.find({});
    const formattedReviews = bookreviews.map(bookreview => ({
        ...bookreview.toObject(),
        createdAtFormatted: bookreview.createdAt.toLocaleDateString('ja-JP'),
        updatedAtFormatted: bookreview.updatedAt.toLocaleDateString('ja-JP')
    }));
    res.render('index', { formattedReviews });
}));

router.post('/', validateBookreview, catchAsync(async (req, res) => {
    // if (!req.body) throw new ExpressError('不正なデータです', 400);
    const bookreview = new Review(req.body.bookreview);
    await bookreview.save();
    res.redirect(`bookreview/${bookreview._id}`);
}));

router.get('/new', (req, res) => {
    res.render('new');
})

router.get('/:id', catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    const dateStr = bookreview.createdAt.toLocaleDateString();
    res.render('show', { bookreview, dateStr });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    res.render('edit', { bookreview });
}));

router.put('/:id', validateBookreview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const bookreview = await Review.findByIdAndUpdate(id, { ...req.body.bookreview });
    await bookreview.save();
    res.redirect(`/bookreview/${bookreview._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect('/bookreview');
}));

module.exports = router;