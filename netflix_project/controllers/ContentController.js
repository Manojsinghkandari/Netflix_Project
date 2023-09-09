const contentModel = require("../models/ContentModel");

// Steps to upload content:
// 1. Check if the user is admin or not ==> Getting done in routers/content.js
// 2. Whether I am getting all the necessary information
// 3. Upload the video in the content folder using multer
// 4. Adding a unique name to the video which would be Date.now() + originalname
// 5. Add the data to the database wrt it content name
const uploadContent = async (req, res) => {
  // const { name, description .... but not video and coverphoto } = req.body;
  const { name, description, genre, duration } = req.body;
  const videoUrl = "/video/" + req.fileName;

  const content = new contentModel({
    name,
    description,
    genre,
    duration,
    videoUrl,
  });

  try {
    await content.save();
    res.send("Content uploaded successfully");
  } catch (err) {
    res.send(err);
  }

  //  Video name would be Date.now() + originalname
  // e.g. movie name was test.mp4 --> 1234567890test.mp4
  // coverphoto name would be Date.now() + originalname
  // e.g. coverphoto name was test.jpg --> 1234567890test.jpg
  // Save data to DB with parameters from the top + coverphoto -> localhost:5000/video/1234567890test.jpg
  // Save data to DB with parameters from the top + movie -> localhost:5000/video/1234567890test.mp4
  // res.send("Content uploaded successfully");
};

const deleteContent = async (req, res) => {};
// look for filename in the database and delete it

module.exports = {
  uploadContent,
  deleteContent,
};
