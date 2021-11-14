const mongoose = require("mongoose");

module.exports = () =>
  mongoose.connect(
    "mongodb+srv://facebook:facebook@cluster0.lplze.mongodb.net/facebookdb?retryWrites=true&w=majority"
  ).then(()=>{
      console.log('cloud db connection succesful')
  }).catch((err)=>{
      console.log(err)
  });
// mongodb+srv://facebook:facebook@cluster0.lplze.mongodb.net/facebook?retryWrites=true&w=majority
// PORT=2424

// MONGO_URL=mongodb+srv://akshaykumar:akshay123+@haus.mmor8.mongodb.net/social

// JWT_KEY=facebook
// mongodb+srv://akshaykumar:akshay123+@haus.mmor8.mongodb.net/social