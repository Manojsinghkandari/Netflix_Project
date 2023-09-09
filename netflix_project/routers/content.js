const express = require("express");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./content");
  },
  filename: function (req, file, cb) {
    // to use file name as a name --> file.originalName
    // to use date as a name --> Date.now()
    let fileName =
      Date.now().toString() + "." + file.originalname.split(".")[1];
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const { uploadContent } = require("../controllers/ContentController");

const {
  userAuthentication,
  adminAuthentication,
} = require("../controllers/authentication");

router.post(
  "/upload",
  adminAuthentication,
  upload.single("movie"),
  uploadContent
);

module.exports = router;
