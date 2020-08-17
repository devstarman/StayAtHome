// packages required
const express = require("express");
const app = express();
const cors = require("cors");
const socketIo = require("socket.io");

const corsOptions = {
  exposedHeaders: "X-Auth-Token",
  //orgins: "https://filipogonowski.pl" // prod
};

app.use(cors(corsOptions));
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//environmental variables
require("dotenv").config();

//startup
require("./startup/routes")(app);
require("./startup/db")();

// listening

const port = process.env.PORT || 3001;
let server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

const io = socketIo(server);

//import functopns
const { getBestPosts } = require("./routes/posts");
const { getCounter } = require("./common/getCounter");

//cache people coounter
var currentPeople = 0;
setInterval(async () => {
  counter = await getCounter();
  currentPeople = counter.people;
}, 1000);

//cache posts
var posts = {};
setInterval(async () => {
  posts = await getBestPosts();
}, 2000);

io.set("origins", "https://localhost:3000:*"); // local
// io.set("origins", "https://filipogonowski.pl:*"); // prod

io.on("connection", socket => {
  console.log("New client connected"),
    setInterval(() => {
      socket.emit("counter", currentPeople);
      socket.emit("best", posts);
    }, 5000);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// scheduled jobs
require("./scheduledJobs/usersMaintenance");
