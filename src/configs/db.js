const mongoose = require("mongoose");

module.exports = () =>
  mongoose.connect(
    "mongodb+srv://facebook:facebook@cluster0.lplze.mongodb.net/facebookdb?retryWrites=true&w=majority"
  ).then(()=>{
      console.log('cloud db connection succesful')
  }).catch((err)=>{
      console.log(err)
  });
