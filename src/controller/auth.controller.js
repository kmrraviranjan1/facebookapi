const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
require("dotenv").config();

const newToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_KEY);
};

const register = async (req, res) => {

  console.log(req.body)
  try {
    let email = req.body.email;
    let user = await User.findOne({ email: email }).lean().exec();
    if (user) {
      return res.status(401).json({
        status: "failed",
        message: "account already exists please login",
      });
    } else {
      user = await User.create(req.body);
      const token = newToken(user);
      res.status(201).json({ token, user });
    }
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const main = {
      email: req.body.email,
      password: req.body.password,
    };
    let user = await User.findOne({ email: main.email }).exec();
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "account doesnt exists please register",
      });
    }
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).json({
        status: "failed",
        message: "Email or Password is wrong",
      });
    }
    const token = newToken(user);
    let userOnline = await User.findOneAndUpdate(
      { email: main.email },
      { isOnline: true },
      { returnOriginal: false }
    )
      .populate("friends")
      .populate("friendRequestSent")
      .populate("friendRequestRecieved")
      .lean()
      .exec();
    res.status(201).json({ token, userOnline });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  register,
  login,
};
