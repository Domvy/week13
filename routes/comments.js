const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment");

router.get("/post/:postId/comments", async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).sort({ createdAt:-1 }).exec();
    res.send({ comments });
});

router.post("/post/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    const { author, content, password } = req.body;

    if (!content) {
    throw new Error("댓글 내용을 입력해주세요.");
    }

    const comment = new Comment({ postId, author, content, password });
    await comment.save();
    res.send({ comment });
});

router.patch("/posts/:postId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content, password } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
    throw new Error("댓글을 찾을 수 없습니다.");
    }
    if (comment.password != password) {
    throw new Error("비밀번호가 올바르지 않습니다.");
    }
    if (!content) {
    throw new Error("댓글을 입력해주세요.");
    }

    comment.content = content;
    await comment.save();
    res.send({});
});

router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("댓글을 찾을 수 없습니다.");
  }
  if (comment.password != password) {
    throw new Error("비밀번호가 올바르지 않습니다.");
  }

  await comment.delete();
  res.send({});
});

module.exports = router;