const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
},);

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingPasswordError: 'パスワードを入力してください。',
        AttemptTooSoonError: 'アカウントがロックされています。後で再度試してね',
        TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
        NoSaltValueStoredError: '認証ができませんでした。',
        IncorrectPasswordError: 'パスワード名またはユーザー名が間違っています。',
        IncorrectUsernameError: 'パスワード名またはユーザー名が間違っています。',
        MissingUsernameError: 'ユーザー名を入力してください。',
        UserExistsError: 'そのユーザー名はすでに使われています。'
    }
});

module.exports = mongoose.model('User', userSchema);