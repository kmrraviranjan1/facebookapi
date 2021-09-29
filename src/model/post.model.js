const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  body_text: { type: String, required: true },
  body_photo: { type: String, required: false ,default:null},
  body_video: { type: String, required: false ,default:null },
  tags: [{ type: String, required: false ,default:null} ],
  emoji: [{ type: String, required: false ,default:null}],
  activities: [{ type: String, required: false ,default:null}],
  checkin: { type: String, required: false ,default:null},
  hostQna: { type: String, required: false ,default:null},
  no_of_likes: { type: Number, required: false ,default:0},
  liked_by: { type: Number, required: false ,default:0},
  no_of_comments: { type: Number, required: false ,default:0},
  commentd_by: { type: Number, required: false ,default:0},
  no_of_shares: { type: Number, required: false ,default:0},
  shared_by: { type: Number, required: false ,default:0},
},{
    versionKey:false,
    timestamps:true,
});

module.exports = mongoose.model("post", postSchema);
