const express = require("express");
require("dotenv").config();
const connect = require("./config/db.js");
const cors = require("cors");
const port = process.env.PORT || 8080;

const { register, login } = require("./controller/auth.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/register", register);
app.post("/api/login", login);

const start = async () => {
  app.listen(port, async () => {
    await connect();
    console.log("Listening to port " + port);
  });
};

module.exports = start;
