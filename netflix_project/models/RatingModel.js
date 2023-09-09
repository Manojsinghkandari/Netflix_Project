const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userRatingSchema = new Schema({
  contentId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  rating: {
    required: true,
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
  dateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ratingModel = mongoose.model("UserRating", userRatingSchema);

module.exports = ratingModel;
