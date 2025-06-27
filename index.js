const express = require('express');
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
        console.log('MongoDBコネクションエラー！！！');
        console.log(err);
    });



// cssなど静的ファイルの配置場所を設定
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));

// node.jsの実行場所に関わらず、viewsが参照するディレクトリを設定する
app.set('views', path.join(__dirname, 'views'));

//　テンプレートにejsを使う設定
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/bookreview', (req, res) => {
    res.render('index');
});

app.get('/bookreview/new', (req, res) => {
    res.render('new');
})

app.get('/bookreview/:id', (req, res) => {
    const { id } = req.params;
    res.render('show', { id });
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
