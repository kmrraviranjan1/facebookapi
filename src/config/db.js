const mongoose = require("mongoose");
require("dotenv").config();
const MongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/social";

const connect = () => mongoose.connect(MongoURL);

module.exports = connect;
