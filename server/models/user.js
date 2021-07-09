const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50, // 최대 길이 설정
  },
  email: {
    type: String,
    trim: true, // 스페이스가 들어갔을 때 없애주는 역활
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5, // 최소 글자 수
  },
  lastname: {
    type: String,
    maxlength: 50, // 최대 글자 수
  },
  role: {
    type: Number, // 숫자를 통해서 등급 부여
    default: 0, // 기본 값을 0으로 한다.
  },
  image: String,
  token: {
    type: String,
  },
  // 토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

// save 하기 전에 실행하고 next를 통해서 다음으로 넘긴다.
userSchema.pre("save", function (next) {
  const user = this;
  // password가 바뀔 때만
  if (user.isModified("password")) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // console.log("plainPassword", plainPassword);
  // 일치하는지 확인을 위해서는 입력한 password를 암호화를 해서 비교해야한다.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;

  // jsonwebtoken을 이용해서 token을 생성하기
  let token = jwt.sign(user._id.toHexString(), "secreToken");
  // user._id + 'secreToken' = token
  // ->
  // 'secretToen' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    console.log("user", user);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // 토큰을 docode 한다.
  jwt.verify(token, "secreToken", function (err, decode) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const user = mongoose.model("user", userSchema);

module.exports = { user };
