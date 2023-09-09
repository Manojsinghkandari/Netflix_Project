const secret = "mysecret";

const jwt = require("jsonwebtoken");

const userAuthentication = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];
    try {
      const user = jwt.verify(token, secret);
      console.log(user);
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(401).send("You are not authenticated as no token found.");
  }
};

const adminAuthentication = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];
    try {
      const user = jwt.verify(token, secret);
      req.user = user;
      if (user.role === "admin") {
        next();
      } else {
        res.status(401).send("You are not authorized to perform this action.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(401).send("You are not authenticated as no token found.");
  }
};

module.exports = {
  userAuthentication,
  adminAuthentication,
};
