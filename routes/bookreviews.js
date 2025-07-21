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
const { isLoggedIn } = require('../middleware');

// router.use(isLoggedIn);

router.get('/', catchAsync(async (req, res) => {
    const bookreviews = await Review.find({});
    const formattedReviews = bookreviews.map(bookreview => ({
        ...bookreview.toObject(),
        createdAtFormatted: bookreview.createdAt.toLocaleDateString('ja-JP'),
        updatedAtFormatted: bookreview.updatedAt.toLocaleDateString('ja-JP')
    }));
    res.render('index', { formattedReviews });
}));

router.post('/', isLoggedIn, validateBookreview, catchAsync(async (req, res) => {
    const bookreview = new Review(req.body.bookreview);
    await bookreview.save();
    req.flash('success', '新しいブックレビューを登録しました');
    res.redirect(`bookreview/${bookreview._id}`);
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    if (!bookreview) {
        req.flash('error', 'ブックレビューは見つかりませんでした');
        return res.redirect('/bookreview');
    }
    const dateStr = bookreview.createdAt.toLocaleDateString();
    res.render('show', { bookreview, dateStr });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    if (!bookreview) {
        req.flash('error', 'ブックレビューは見つかりませんでした');
        return res.redirect('/bookreview');
    }
    res.render('edit', { bookreview });
}));

router.put('/:id', isLoggedIn, validateBookreview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const bookreview = await Review.findByIdAndUpdate(id, { ...req.body.bookreview });
    await bookreview.save();
    req.flash('success', 'ブックレビューを更新しました');
    res.redirect(`/bookreview/${bookreview._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'ブックレビューを削除しました');
    res.redirect('/bookreview');
}));

module.exports = router;