const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  address: String,
  services: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);
