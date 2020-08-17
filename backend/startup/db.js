const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const dbpath = process.env.DB_PATH || "mongodb://localhost:27017/stayHome";

module.exports = async function() {
  await mongoose
    .connect(dbpath, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Could not connect to MongoDB, error: " + err));
};
