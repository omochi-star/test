const express = require('express');
const methodOverride = require('method-override')
const app = express();
const path = require('path');
const mongoose = require('mongoose');

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

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/bookreview', (req, res) => {
    res.render('index');
});

app.post('/bookreview', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.get('/bookreview/new', (req, res) => {
    res.render('new');
})

app.get('/bookreview/id', (req, res) => {
    res.render('show',);
});

app.get('/bookreview/id/edit', (req, res) => {
    res.render('edit');
});

app.put('/bookreview/id', (req, res) => {
    res.send(req.body);
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
