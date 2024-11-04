const express = require("express");
const router = express.Router();

const Post = require("../schemas/post");

router.get("/posts", async (req, res) => {
    const posts = await Post.find({}, { title: 1, nickname: 1, createdAt: 1 }).sort({createdAt: -1}).exec();
  
    res.send({ posts });
});

router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId, { title: 1, content: 1, nickname: 1, createdAt: 1 }).exec();
  
    res.send({ post });
});

router.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const token = req.cookies.authToken;

  if (!title || !content) {
    return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
  }
  if (!token) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, nickname } = decoded;

  const post = new Post({ title, content, nickname, userId });
  await post.save();
  res.send({ post });
});

router.patch("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decoded;

  const post = await Post.findById(postId).exec();
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  if (post.userId != userId) {
    throw new Error("권한이 없습니다.");
  }

  if (title)
    post.title = title;
  if (content)
    post.content = content;

  await post.save();
  res.send({});
});

router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decoded;

  const post = await Post.findById(postId).exec();
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  if (post.userId != userId) {
    throw new Error("권한이 없습니다.");
  }

  await post.deleteOne();
  res.send({});
});

module.exports = router;