const Book = require('../models/book');

module.exports.index = async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books });
}

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
}

module.exports.createBook = async (req, res) => {
    const book = new Book(req.body.books);
    book.owner = req.user._id;
    await book.save();
    req.flash('success', '新しい本を登録しました');
    res.redirect(`books/${book._id}`);
}

module.exports.showBook = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
        req.flash('error', '本の詳細ページは見つかりませんでした');
        return res.redirect('/books');
    }
    res.render('books/show', { book });
}

module.exports.renderEditForm = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
        req.flash('error', '本は見つかりませんでした');
        return res.redirect('/books');
    }
    res.render('books/edit', { book });
}

module.exports.updateBook = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findByIdAndUpdate(bookId, { ...req.body.books });
    await book.save();
    req.flash('success', '本の情報を更新しました');
    res.redirect(`/books/${book._id}`);
}

module.exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;
    await Book.findByIdAndDelete(bookId);
    req.flash('success', '本を削除しました');
    res.redirect('/books');
}

