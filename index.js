const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users');

const { isLoggedIn } = require('./middleware');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/bookreview';

mongoose.connect(dbUrl)
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

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const sessionConfig = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

//ログインしているユーザのレビュー一覧表示
app.get('/my/reviews', isLoggedIn, async (req, res) => {
    const userId = req.user._id;
    const myReviews = await Review.find({ owner: userId }).populate('book');
    res.render('myReview', { myReviews });
});

app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = '問題が発生しました'
    }
    res.status(statusCode).render('error', { err });
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
