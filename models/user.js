const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

userSchema.pre("save", function (next) {
  // save 하기 전에 실행하고 next를 통해서 다음으로 넘긴다.
  var user = this;
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
  }
});

const user = mongoose.model("user", userSchema);

module.exports = { user };
