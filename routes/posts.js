const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

// Routes
router.get("/posts", (req, res) => {
  Post.find()
    .sort("-createdAt") //Return latest posts
    .limit(100) //Return only 100 posts
    .then((posts) => {
      const map = posts.map((item) => ({
        id: item._id,
        title: item.title,
        subtitle: item.subtitle,
        body: item.body,
      }));
      res.status(200).send(posts);
    })
    .catch((err) => {
      res.status(404).send({ message: "Could not connect" });
      // console.log(err);
    });
});

router.get("/posts/:id", (req, res) => {
  //Receive ID from URL
  const { id } = req.params;
  Post.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "404: Post not found" });
      }
      res.send({
        id: item._id,
        title: item.title,
        subtitle: item.subtitle,
        body: item.body,
      });
      return;
    })
    .catch((err) => {
      res.status(404).send({ message: "404: Post not found" });
      return;
    });
});

router.post("/posts", (req, res) => {
  const { name, title, subtitle, body } = req.body;
  if (!name || !title || !subtitle || !body) {
    return res.status(422).json({ error: "Please enter all fields" });
  }

  // Create a post object
  const post = new Post({
    name,
    title,
    subtitle,
    body,
  });

  // Index maintains control on duplicates

  //Save Post in the database
  post
    .save()
    .then((result) => {
      res.status(201).send({ id: result.id });
      return;
    })
    .catch((err) => {
      res.status(409).json({ error: "Post already exists" });
      return;
    });
});

router.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { subtitle, body } = req.body;

  if (!subtitle) delete req.body.subtitle;
  if (!body) delete req.body.body;

  mongoose.set("useFindAndModify", false);
  Post.findByIdAndUpdate(id, req.body, { new: true })
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "404: Post not found" });
        return;
      }
      if (!id || (!subtitle && !body)) {
        res.status(422).json({ error: "Please enter required fields" });
        return;
      }
      res.status(200).send({ message: "200: Post updated" });
      return;
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
