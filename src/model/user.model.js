const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      unique: true,
    },
    last_name: { type: String, required: false, maxLength: 20 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true, minLength: 6 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friendRequestSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friendRequestRecieved: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ],
    isOnline: { type: Boolean, required: false, default: false },
    isAdmin: { type: Boolean, required: false, default: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    dob: { type: String, required: false },
    gender: { type: String, required: false },
    profile: { type: String, required: false, default: "" },
    cover: { type: String, required: false },
    bio: { type: String, required: false },
    education: [{ type: String, required: false }],
    city: { type: String, required: false },
    country: { type: String, required: false },
    university: { type: String, required: false },
    work: [{ type: String, required: false }],
    relationship: { type: String, required: false },
    mobile: { type: String, required: false },
    extra: [{ type: String, required: false }],
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  next();
});

userSchema.methods.checkPassword = function (password) {
  const hash = this.password;
  return bcrypt.compareSync(password, hash);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
