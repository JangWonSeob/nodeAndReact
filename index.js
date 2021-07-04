const express = require("express");
const app = express();
const config = require("./config/index");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");

const { PORT, MONGO_URI } = config;

const { user } = require("./models/user");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected ..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! Express Server!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

app.post("/api/user/register", (req, res) => {
  // 회원 가입을 할 때 필요한 정보를 client에서 가져오면
  // 그것을 데이터 베이스에 넣어준다.

  const User = new user(req.body);
  User.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/user/login", (req, res) => {
  // 요청된 이메일을 데이터 베이스에 있는지 찾는다.
  user.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSucess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요쳥된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      console.log("err", err);
      console.log("isMatch", isMatch);
      if (!isMatch)
        return res.json({
          loginSucess: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      userInfo.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에 ? 쿠키(이걸 사용), 로컬스토리지
        res
          .cookie("x-auth", user.token)
          .status(200)
          .json({ loginSucess: true, userId: user._id });
      });
    });
  });
  // 비밀번호까지 맞다면 토큰을 생성하기.
});

app.get("/api/user/auth", auth, (req, res) => {
  // 여기까지 미들웨어가 통과해 왔다는 이야기는 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  console.log("req.user", req.user);
  user.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
