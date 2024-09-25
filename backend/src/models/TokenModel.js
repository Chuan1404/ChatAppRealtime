const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
