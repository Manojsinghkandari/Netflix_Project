const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileInformationSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dob: {
    type: Date,
  },
  userPhoto: {
    type: String,
  },
  phone: {
    type: Number,
  },
  country: {
    type: String,
  },
});
// const nameSchema = new Schema({
//     fname: {
//       type: String,
//     },
//     mname: {
//       type: String,
//     },
//     lname: {
//       type: String,
//     },
//   });

const userSchema = new Schema({
  //   name: nameSchema,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  profileInformation: profileInformationSchema,
  membership: {
    membershipType: {
      type: String,
      default: "free",
      enum: ["free", "premium"],
    },
    membershipStartDate: {
      type: Date,
    },
    membershipEndDate: {
      type: Date,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
