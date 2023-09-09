const express = require("express");
const app = express();
const port = 3001;

// -----------DATABASE-------------
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/";
const dbName = "netflix";

mongoose
  .connect(url + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });
// ------------------------------

const userRouter = require("./routers/users");
const contentRouter = require("./routers/content");
const ratingsRouter = require("./routers/ratings");

app.use("/video", express.static(__dirname + "/content"));

app.use(express.json());
app.use("/users", userRouter);
app.use("/contents", contentRouter);
app.use("/ratings", ratingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// FLOW OF OUR CODE:
//  index.js --> routers/users.js --> controllers/UsersController.js
