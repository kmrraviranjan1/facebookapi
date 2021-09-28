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
},{
    versionKey:false,
    timestamps:true,
});

module.exports = mongoose.model("post", postSchema);
