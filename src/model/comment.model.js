const mongoose = require("mongoose");
const Post = require('./post.model')
const User = require('./user.model')
const commentSchema = new mongoose.Schema(
  {
    post_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
     },
    body_text: { type: String, required: true },
    body_photo: { type: String, required: false, default: null },
    body_video: { type: String, required: false, default: null },
    
    emoji: [{ type: String, required: false, default: null }],

    no_of_likes: { type: Number, required: false, default: 0 },
    liked_by: { type: Number, required: false, default: 0 },
    no_of_comments: { type: Number, required: false, default: 0 },
    commentd_by: { type: mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:true},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
