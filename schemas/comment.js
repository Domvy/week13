const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true }
});

CommentSchema
.virtual("commentId")
.get(function () {
  return this._id.toHexString();
});

CommentSchema
.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comment", CommentSchema);
