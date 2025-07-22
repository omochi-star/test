module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // 認証済み → 次の処理へ
    }
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'ログインしてください');
    res.redirect('/login'); // 未ログイン → ログインページへ
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}