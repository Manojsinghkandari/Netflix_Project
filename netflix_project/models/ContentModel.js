const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, //in minutes
    required: true,
  },
  coverPhoto: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Content", contentSchema);
