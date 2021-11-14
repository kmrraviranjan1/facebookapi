const mongoose = require("mongoose");
require("dotenv").config();
// const MongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/fb";
const MongoURL ="mongodb://localhost:27017/fb";

const connect = () => mongoose.connect(MongoURL);

module.exports = connect;
