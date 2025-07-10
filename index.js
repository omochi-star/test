const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/bookreview');
// const morgan = require('morgan');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/bookreview';

mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！');
        console.log(err);
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/bookreview', catchAsync(async (req, res) => {
    const bookreviews = await Review.find({});
    const formattedReviews = bookreviews.map(bookreview => ({
        ...bookreview.toObject(),
        createdAtFormatted: bookreview.createdAt.toLocaleDateString('ja-JP'),
        updatedAtFormatted: bookreview.updatedAt.toLocaleDateString('ja-JP')
    }));
    res.render('index', { formattedReviews });
}));

app.post('/bookreview', catchAsync(async (req, res) => {
    if (!req.body) throw new ExpressError('不正なデータです', 400);
    const bookreview = new Review(req.body.bookreview);
    await bookreview.save();
    res.redirect(`bookreview/${bookreview._id}`);
}));

app.get('/bookreview/new', (req, res) => {
    res.render('new');
})

app.get('/bookreview/:id', catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    const dateStr = bookreview.createdAt.toLocaleDateString();

    res.render('show', { bookreview, dateStr });

}));

app.get('/bookreview/:id/edit', catchAsync(async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    res.render('edit', { bookreview });
}));

app.put('/bookreview/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const bookreview = await Review.findByIdAndUpdate(id, { ...req.body.bookreview });
    await bookreview.save();
    res.redirect(`/bookreview/${bookreview._id}`)
}));

app.delete('/bookreview/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect('/bookreview');
}));

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
    const { status = 500, message = '問題が発生しました' } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log('ポート3000で受付中。。');
});

// 目標！ブックレビューアプリを作る。

//CRUD
// Create:bookreviewを新規作成
// Read：ブックレビュー閲覧
// Update:ブックレビュー編集
// Delete:ブックレビュー削除
