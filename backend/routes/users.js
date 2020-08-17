const express = require("express");
const router = express.Router();

//middleware
const { auth } = require("../middleware/auth");

//user model
const { User } = require("../models/user");
const { Post } = require("../models/post");

//counter function
const { updateCounter } = require("./counters");

//verify user method
router.get("/verify", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });
  return res.status(200).json({
    firstName: user.firstName,
    authentication: true,
    imageUrl: user.imageUrl,
    allowedVotingUp: user.allowedVotingUp,
    allowedVotingDown: user.allowedVotingDown,
    active: user.active,
    allowedPost: user.allowedPost
  });
});

//create new user
router.post("/create", async (req, res) => {
  const { firstName, fbId, imageUrl } = req.body;
  let user = await User.findOne({ fbId: fbId });
  if (user) {
    if (!user.active) {
      user.active = true;
      updateCounter("inc");
      try {
        user = await user.save();
      } catch (err) {
        console.log(err);
      }
    }

    const token = user.generateAuthToken();
    return res.header("x-auth-token", token).json({
      firstName: user.firstName,
      authentication: true,
      imageUrl: user.imageUrl,
      allowedVotingUp: user.allowedVotingUp,
      allowedVotingDown: user.allowedVotingDown,
      active: user.active,
      allowedPost: user.allowedPost
    });
  }

  //initialize new User
  let newUser = new User({
    firstName: firstName,
    fbId: fbId,
    imageUrl: imageUrl
  });

  //save new User to database
  try {
    newUser = await newUser.save();
  } catch (err) {
    console.log(err);
  }

  //update counter
  updateCounter("inc");

  const token = newUser.generateAuthToken();
  return res.header("x-auth-token", token).json({
    firstName: newUser.firstName,
    imageUrl: newUser.imageUrl,
    allowedVotingUp: true,
    allowedVotingDown: true,
    active: true,
    allowedPost: true
  });
});

//login the user in
router.post("/login", async (req, res) => {
  const { fbId } = req.body;
  let user = await User.findOne({ fbId: fbId });
  if (!user) return res.status(404).json({ msg: "User not found" });
  const token = user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .json({ firstName: user.firstName, authentication: true });
});

//delete user account
router.delete("/deleteMe", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });
  user.active = false;
  try {
    user = await user.save();
    await updateCounter("dec");
    await Post.deleteMany({ userId: String(user._id) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
  return res.status(200).json({ msg: "User has been deactivated" });
});

//remeber to handle all user messages - delete them

exports.router = router;
