require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 8081;
const url = "mongodb://127.0.0.1:27017/posts";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

require("./models/post");

app.use(express.json());
app.use(cors());
app.use(require("./routes/posts"));

app.listen(PORT, () => {
  console.log("Hello from the backend");
});
