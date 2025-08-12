const Book = require('../models/book');
const Review = require('../models/review');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const books = await Book.find({});
    res.render('books/index', { books });
}

module.exports.renderNewForm = (req, res) => {
    res.render('books/new');
}

module.exports.createBook = async (req, res) => {
    const book = new Book(req.body.books);
    book.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    book.owner = req.user._id;
    const exists = await Book.findOne({ isbn: book.isbn });
    if (exists) {
        req.flash('error', 'このISBNの本はすでに登録されています');
        return res.redirect('/books/new');
    };
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
    const reviews = await Review.find({ book: bookId }).populate('owner');
    // const formattedReviews = reviews.map(review => ({
    //     ...review.toObject(),
    //     formattedDate: review.createdAt.toLocaleDateString('ja-JP')
    // }));
    // res.render('books/show', { book, reviews: formattedReviews });
    res.render('books/show', { book, reviews });
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
    console.log(req.body);
    const { bookId } = req.params;
    const book = await Book.findByIdAndUpdate(bookId, { ...req.body.books });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    book.images.push(...imgs);
    await book.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await book.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', '本の情報を更新しました');
    res.redirect(`/books/${book._id}`);
}

module.exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;
    await Book.findByIdAndDelete(bookId);
    req.flash('success', '本を削除しました');
    res.redirect('/books');
}

