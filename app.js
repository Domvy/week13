const express = require("express");

require("dotenv").config();
const db = require("./schemas/index.js");
const postsRouter = require("./routes/index.js");

const app = express();

app.use("/api", express.json(), postsRouter);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});