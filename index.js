const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const Review = require('./models/bookreview')
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

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/bookreview', async (req, res) => {
    const bookreviews = await Review.find({});
    res.render('index', { bookreviews });
});

app.post('/bookreview', async (req, res) => {
    console.log(req.body);
    const bookreview = new Review(req.body.bookreview);
    await bookreview.save();
    res.redirect(`bookreview/${bookreview._id}`);
});

app.get('/bookreview/new', (req, res) => {
    res.render('new');
})

app.get('/bookreview/:id', async (req, res) => {
    const bookreview = await Review.findById(req.params.id);
    res.render('show', { bookreview });
});

app.get('/bookreview/:id/edit', (req, res) => {
    const id = req.params.id
    res.render('edit', { id });
});

app.put('/bookreview/:id', (req, res) => {
    res.send(req.body);
});

app.delete('/bookreview/:id', (req, res) => {
    res.send('delete!!!!')
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
