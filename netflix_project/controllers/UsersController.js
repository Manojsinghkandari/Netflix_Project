const User = require("../models/UserModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const secret = "mysecret";

const createUser = async (req, res) => {
  try {
    const { email, password, role, isLoggedIn, profileInformation } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashPassword,
      role,
      isLoggedIn,
      profileInformation,
    });
    let data = await newUser.save();
    console.log(data);
    res.send("User created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in creating user", err);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  // Check whether this email exists in my database
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      // User exists
      // Compare the passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ email, role: user.role }, secret);
        res.send({ token });
      } else {
        res.status(401).send("Password is incorrect");
      }
    } else {
      // User does not exist
      res.status(404).send("User does not exist");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log(req.user);

    const user = await User.findOneAndDelete({ email: req.user.email });
    if (user) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User does not exist");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const changePassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      // compare the old password with the password in the database i.e. user.password
      const passwordMatch = await bcrypt.compare(
        req.body.old_password,
        user.password
      );
      if (passwordMatch) {
        // Change the password
        const hashPassword = await bcrypt.hash(req.body.new_password, 10);
        user = await User.findOneAndUpdate(
          { email: req.body.email },
          { password: hashPassword }
        );
        res.send("Password changed successfully");
      } else {
        res.status(401).send("Password is incorrect");
      }
    } else {
      res.status(404).send("User does not exist");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Steps to upgrade membership:
// change the status of the user from free to premium
// change the membership start date to today's date
// change the membership end date to today's date + 30 days
const upgradeMembership = async (req, res) => {
  const paymentSuccessful = true;
  if (paymentSuccessful) {
    try {
      // Look for the user in the database
      const user = await User.findOne({ email: req.user.email });
      if (user) {
        // if user exists and is on free membership
        if (user.membership.membershipType !== "premium") {
          let membershipType = "premium";
          let today = new Date();
          let membershipStartDate = new Date(today.setDate(today.getDate()));
          let membershipEndDate = new Date(today.setDate(today.getDate() + 30));
          await User.findOneAndUpdate(
            { email: req.user.email },
            {
              membership: {
                membershipType,
                membershipStartDate,
                membershipEndDate,
              },
            }
          );

          res.send("User upgraded to premium membership");
        } else {
          res.send("User is already on premium membership");
        }
      } else {
        res.status(404).send("User does not exist");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  } else {
    res.send("Payment failed");
  }
};
// // Integrate a payment gateway

module.exports = {
  createUser,
  userLogin,
  getAllUsers,
  deleteUser,
  changePassword,
  upgradeMembership,
};
