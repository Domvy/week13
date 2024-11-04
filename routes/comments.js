const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment");

router.get("/post/:postId/comment", async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).sort({ createdAt:-1 }).exec();
    res.send({ comments });
});

router.post("/post/:postId/comment", async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const token = req.cookies.authToken;
    let decoded;

    if (!token) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }
    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const { userId, nickname } = decoded
    const comment = new Comment({ postId, nickname, content, userId });
    await comment.save();
    res.send({ comment });
});

router.patch("/post/:postId/comment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const token = req.cookies.authToken;
    let decoded;

    if (!token) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const { userId } = decoded;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }
    if (comment.userId != userId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }
    if (!content) {
      return res.status(400).json({ message: "댓글을 입력해주세요." });
    }

    comment.content = content;
    await comment.save();
    res.send({});
});

router.delete("/post/:postId/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const token = req.cookies.authToken;
  let decoded;

  if (!token) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }

  const { userId } = decoded;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  if (comment.userId != userId) {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  await comment.deleteOne();
  res.send({});
});

module.exports = router;