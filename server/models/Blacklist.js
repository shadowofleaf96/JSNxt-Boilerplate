const mongoose = require("mongoose");
const BlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false, collection: "Blacklist" }
);
module.exports = mongoose.model("Blacklist", BlacklistSchema);
