const express = require("express");
const router = express.Router();

const Post = require("../schemas/post");

router.get("/posts", async (req, res) => {
    const posts = await Post.find({}, { title: 1, author: 1, createdAt: 1 }).sort({createdAt: -1}).exec();
  
    res.send({ posts });
});

router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId, { title: 1, author: 1, createdAt: 1 }).exec();
  
    res.send({ post });
});

router.post("/posts", async (req, res) => {
  const { title, author, password, content } = req.body;

  if (!title || !author || !password || !content) 
    { return res.status(400).json({ message: "모든 필드를 입력해주세요." });}

  const post = new Post({ title, author, password, content });
  await post.save();
  res.send({ post });
});

router.patch("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password, title, content } = req.body;

  const post = await Post.findById(postId).exec();
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  if (post.password != password) {
    throw new Error("비밀번호가 올바르지 않습니다.");
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
  const { password } = req.body;

  const post = await Post.findById(postId).exec();
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  if (post.password != password) {
    throw new Error("비밀번호가 올바르지 않습니다.");
  }

  await post.delete();
  res.send({});
});

module.exports = router;