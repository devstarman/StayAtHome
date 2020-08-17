const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  fbId: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  allowedPost: {
    type: Boolean,
    default: true
  },
  allowedVotingUp: {
    type: Boolean,
    default: true
  },
  allowedVotingDown: {
    type: Boolean,
    default: true
  }
});

// method for create user token
userSchema.methods.generateAuthToken = function() {
  const secret = process.env.JWT_PRIVATE_KEY;
  const token = jwt.sign({ _id: this._id }, secret);
  return token;
};

//declare user class based on schema
const User = mongoose.model("User", userSchema);

exports.User = User;
