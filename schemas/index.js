const mongoose = require("mongoose");

// localhost의 27017 포트 번호로 MongoDB와 연결합니다.
// Database Name은 week13-test 입니다.
mongoose.connect("mongodb://localhost:27017/week13-test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(value => console.log("MongoDB 연결에 성공하였습니다."))
  .catch(reason => console.log("MongoDB 연결에 실패하였습니다."))


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

module.exports = db;