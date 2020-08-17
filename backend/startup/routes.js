const users = require("../routes/users");
const posts = require("../routes/posts");
const counters = require("../routes/counters");

module.exports = function(app) {
  app.use("/api/users", users.router);
  app.use("/api/post", posts.router);
  app.use("/api/counter", counters.router);
};
