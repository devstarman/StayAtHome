const express = require("express");
const router = express.Router();
const axios = require("axios");

//middleware
const { auth } = require("../middleware/auth");

//user model
const { User } = require("../models/user");
const { Post } = require("../models/post");

//common functions
const { getToday } = require("../common/getToday.js");
const { getCounter } = require("../common/getCounter.js");

const cacheInterval = process.env.CACHE_INTERVAL;

// cacheing intervals
var currentPeople = 0;
setInterval(async () => {
  counter = await getCounter();
  currentPeople = counter.people;
}, 2000);

var allPosts = [];
setInterval(async () => {
  allPosts = await getAllPosts();
  var i = 1;
  allPosts.forEach(c => {
    c.ranking = i;
    i++;
  });
}, 2000);

//create new post
router.post("/create", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });

  //check if user have any posts today
  let today = getToday();
  console.log(today);
  let todaypost = await Post.find({
    userId: user._id,
    date: {
      $gte: new Date(today.year, today.month, today.day),
      $lt: new Date(today.year, today.month, today.day + 1)
    }
  });
  if (todaypost.length > 0)
    return res.status(400).json({ msg: "User has posted already" });

  //destructure the request
  const { content } = req.body;

  //initialize new post
  let newPost = new Post({
    content: content,
    userId: req.user._id
  });
  user.allowedPost = false;

  //save new Post to database
  try {
    newPost = await newPost.save();
    user = await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ msg: "Post has been saved" });
});

router.get("/all", async (req, res) => {
  const posts = await Post.find();
  if (!posts) return res.status(400).json({ msg: "No posts found" });
  return res.status(200).json(posts);
});

//post voting
router.post("/vote", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });
  const { postId, voteType } = req.body;
  let post = await Post.findById(postId);
  if (voteType == "plus") {
    if (!user.allowedVotingUp) {
      return res.status(400).json({ msg: "User not allowed to vote today" });
    }
    post.points = post.points + 1;
    user.allowedVotingUp = false;
  } else if (voteType == "minus") {
    if (!user.allowedVotingDown) {
      return res.status(400).json({ msg: "User not allowed to vote today" });
    }
    post.points = post.points - 1;
    user.allowedVotingDown = false;
  }
  try {
    user = await user.save();
    post = await post.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ msg: "vote has been submitted" });
});

//get 50 best posts
async function getBestPosts() {
  const posts = await Post.find()
    .sort({ points: -1 })
    .limit(50)
    .populate(
      "userId",
      " -allowedVotingUp -allowedVotingDown -active -allowedPost -fbId -_id -__v"
    )
    .select("points content");
  return posts;
}

//get all posts
async function getAllPosts() {
  const posts = await Post.find()
    .sort({ points: -1 })
    .populate(
      "userId",
      " -allowedVotingUp -allowedVotingDown -active -allowedPost -fbId  -__v"
    )
    .select("points content");
  return posts;
}

//get initial state of app
router.get("/initial", async (req, res) => {
  let toSend = allPosts.slice(0, 50);
  res.status(200).json({ people: currentPeople, posts: toSend });
});

//get my posts
router.get("/my", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });
  let toSend = await allPosts.filter(c => c.userId._id == String(user._id));
  if (toSend.length === 0)
    return res.status(400).json({ msg: "User has no posts" });
  return res.status(200).json(toSend);
});

//router delete my post
router.delete("/delete", auth, async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json({ msg: "User no longer exists." });
  const { postId } = req.body;
  try {
    await Post.findOneAndDelete({ _id: postId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
  return res.status(200).json({ msg: "post has been deleted" });
});

// get post by page
router.get("/page/:pageNo", async (req, res) => {
  const pageNo = req.params.pageNo;
  let begin = pageNo * 50;
  let end = begin + 50;
  let toSend = allPosts.slice(begin, end);
  return res.status(200).json(toSend);
});

//number of pages
router.get("/pageNo", async (req, res) => {
  const pageNo = Math.ceil(allPosts.length / 50 - 1);

  return res.status(200).json({ pageNo: pageNo });
});

//get best posts
router.get("/best", async (req, res) => {
  const posts = await Post.find()
    .sort({ points: -1 })
    .limit(50)
    .populate(
      "userId",
      " -allowedVotingUp -allowedVotingDown -active -allowedPost -fbId -_id -__v"
    )
    .select("points content");
  if (!posts) return res.status(404).json({ msg: "Posts not found" });
  return res.status(200).json(posts);
});

//create random 100 posts withg chuck norris jokes
router.post("/createRandom", async (req, res) => {
  const { userId } = req.body;
  for (i = 0; i < 100; i++) {
    var result = await addRandomPost(userId);
  }
  res.status(200).json(result);
});

// add random chuck norris posts
async function addRandomPost(userId) {
  let newPost = new Post({
    content: await getJoke(),
    userId: userId,
    points: Math.floor(Math.random() * 101)
  });

  //save new Post to database
  try {
    newPost = await newPost.save();
  } catch (err) {
    console.log(err);
  }

  return { msg: "ok" };
}

// get random Chuck norris joke
async function getJoke() {
  const response = await axios.get("http://api.icndb.com/jokes/random/");
  console.log(response.data.value.joke);
  return response.data.value.joke;
}

// console.log(getJoke());
exports.getBestPosts = getBestPosts;
exports.router = router;
