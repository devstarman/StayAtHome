const express = require("express");
const { Counter } = require("../models/counter");

async function getCounter() {
  const counters = await Counter.find();
  let counter = counters[0];
  return counter;
}

exports.getCounter = getCounter;
