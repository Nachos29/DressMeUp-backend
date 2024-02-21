const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  idProfilPict: String,
  profilPictURL: String,
  username: String,
  email: String,
  password: String,
  token: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
