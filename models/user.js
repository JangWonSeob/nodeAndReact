const mongoose = require("mongoose");

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

const user = mongoose.model("user", userSchema);

module.exports = { user };
