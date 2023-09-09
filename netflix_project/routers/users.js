const express = require("express");

const router = express.Router();

const {
  createUser,
  userLogin,
  deleteUser,
  changePassword,
  upgradeMembership,
} = require("../controllers/UsersController");
const {
  userAuthentication,
  adminAuthentication,
} = require("../controllers/authentication");

router.post("/signup", createUser);
router.post("/login", userLogin);
// router.get("/all_users", isAuthenticated, getAllUsers);
router.delete("/delete", userAuthentication, deleteUser);
router.put("/change-password", userAuthentication, changePassword);
router.put("/upgrade", userAuthentication, upgradeMembership);

module.exports = router;
