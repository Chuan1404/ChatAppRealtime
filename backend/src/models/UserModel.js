const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
