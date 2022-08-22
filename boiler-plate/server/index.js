const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {User} = require("./models/User");
const {auth} = require("./middleware/Auth");
const mongoose = require('mongoose');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());


// 몽고디비 연동
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongDB Connected...!'))

 .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('안녕하세요!!')
})


// 회원가입
app.post('/user/register', (req, res) => {
    // req.body 안에는 json형식의 데이터가 들어 있음
    const user = new User(req.body);
    user.save((err) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({success: true});
    });
});


// 로그인
app.post('/user/login', (req, res) => {
    // 요청된 Email을 DB에 있는지 찾기
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({loginSuccess: false, 
                message: "일치하는 유저가 없습니다."
            });
        }
        // 요청된 이메일이 DB에 있다면 비밀번호가 일치한지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) 
               return res.json({loginSuccess: false, 
                message: "비밀번호가 틀렸습니다."
            });
            // console.log(isMatch)
            // 비밀번호 까지 맞다면 token 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                // 토큰저장(로컬or쿠키)
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id});
            });              
        });
    });  
});


// role 1 어드민    role 2 특정 부서 어드민
// role 0 -> 일반유저   role 0이 아니면  관리자
app.get('/user/auth', auth, (req, res) => {
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});


// 로그아웃
app.get("/user/logout", auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({success: true});
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

