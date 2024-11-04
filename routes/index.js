const express = require("express");
const router = express.Router();

const postRouter = require("./posts");
const commentRouter = require("./comments");
const loginRouter = require("./login");

router.use("/posts", postRouter)
router.use("/comments", commentRouter);
router.use("/login", loginRouter);

module.exports = router;