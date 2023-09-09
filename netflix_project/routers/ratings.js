const express = require("express");

const router = express.Router();

const {
  addRating,
  updateRating,
  deleteRating,
  getRatingsOfAContent,
  getRatingsOfAUser,
  recommendMovie,
  topRatedContent
} = require("../controllers/RatingController");

const { userAuthentication } = require("../controllers/authentication");

router.post("/add", userAuthentication, addRating);
router.put("/update", userAuthentication, updateRating);
router.delete("/delete", userAuthentication, deleteRating);
router.get("/user", userAuthentication, getRatingsOfAUser);
router.get("/content", userAuthentication, getRatingsOfAContent);
router.get("/recommended-content", userAuthentication, recommendMovie);
router.get("/topRated-content", userAuthentication, topRatedContent);

module.exports = router;
