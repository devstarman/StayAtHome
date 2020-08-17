const express = require("express");
const router = express.Router();

//import counter
const { Counter } = require("../models/counter");

router.post("/create", async (req, res) => {
  const { people } = req.body;
  const counters = await Counter.find();
  if (counters.length > 0) {
    return res.status(400).json({ msg: "Counter currently exist" });
  }
  let newCounter = new Counter({
    people: people,
    lastUpdate: new Date()
  });
  try {
    newCounter = await newCounter.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ msg: "Counter has been created" });
});

async function updateCounter(type) {
  var counters = await Counter.find();
  if (counters.length == 0) return { msg: "Counter not found" };
  var counter = counters[0];
  if (type == "inc") {
    counter.people += 1;
  } else if (type == "dec") {
    counter.people -= 1;
  }
  counter.lastUpdate = new Date();
  try {
    counter = await counter.save();
  } catch (err) {
    console.log(err);
  }
}

exports.router = router;
exports.updateCounter = updateCounter;
