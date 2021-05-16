const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  initials: String,
});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);