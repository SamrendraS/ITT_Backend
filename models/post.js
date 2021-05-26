const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      require: true,
    },
    comments: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//Ensure uniqueness of every post
// postSchema.index(
//   { name: 1, url: 1, caption: 1 },
//   { unique: true },
//   { sparse: true }
// );

//Reduces time for searching first 100 posts
postSchema.index({ createdAt: -1 });

mongoose.model("Post", postSchema);
