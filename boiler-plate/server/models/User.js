const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 3    
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

// 유저 모델의 유저정보를 저장하기 전에 실행함
userSchema.pre('save', function(next) {
    // userSchema를 가리키는 변수 생성
    var user = this;

    if(user.isModified('password')) {
    // 비밀번호 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    var user = this;
    // plainpassword = 해싱안된 암호 
    bcrypt.compare(plainPassword, user.password, function(err, isMatch) {
        if (err) return cb(err, isMatch);
        cb(null, isMatch);
    });
};


userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken 이용하여 토큰 생성
    // user._id + 'secretToken' = token
    // 'secretToken'을 디코딩하면 user._id
    var token = jwt.sign(user._id.toHexString(), "secretToken");
  
    user.token = token;
    user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
};


userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // user._id + '' = token
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err)
            cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = {User};

