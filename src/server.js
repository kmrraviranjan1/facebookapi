const express = require("express");
require("dotenv").config();
const connect = require("./config/db.js");
const cors = require("cors");
const port = process.env.PORT || 8080;

const { register, login } = require("./controller/auth.controller");
const postController = require("./controller/post.controller");
const userController = require("./controller/user.controller");
const commentController = require('./controller/comment.controller')

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/posts", postController);
app.post("/api/register", register);
app.post("/api/login", login);
app.use("/api/user", userController);
app.use("/api/comments", commentController);

const start = async () => {
  app.listen(port, async () => {
    await connect();
    console.log("Listening to port " + port);
  });
};

module.exports = start;
