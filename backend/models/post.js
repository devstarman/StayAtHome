const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: true,
    maxlength: 150
  },
  points: {
    type: Number,
    default: 0,
    required: true
  },
  date: {
    type: Date,
    default: Date()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`
  },
  ranking: {
    type: Number,
    default: 0
  }
});

//declare user class based on schema
const Post = mongoose.model("Post", postSchema);

exports.Post = Post;
