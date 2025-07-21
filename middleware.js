module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // 認証済み → 次の処理へ
    }
    req.flash('error', 'ログインしてください');
    res.redirect('/login'); // 未ログイン → ログインページへ
}
