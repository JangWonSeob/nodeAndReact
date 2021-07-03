const express = require("express");
const app = express();
const config = require("./config/index");

const { PORT, MONGO_URI } = config;

const { user } = require("./models/user");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.post("/register", (req, res) => {
  // 회원 가입을 할 때 필요한 정보를 client에서 가져오면
  // 그것을 데이터 베이서에 넣어준다.

  const User = new user(req.body);
  User.save((err, userInto) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
