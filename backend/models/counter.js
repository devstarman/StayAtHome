const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  people: {
    type: Number,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true
  }
});

//declare user class based on schema
const Counter = mongoose.model("Counter", counterSchema);

exports.Counter = Counter;
