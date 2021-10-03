const router = require("express").Router();
const Post = require("../model/post.model");
const Comment = require("../model/comment.model");
const User = require('../model/user.model')
router.post("/", async (req, res) => {
  const post = await Post.create(req.body);
  console.log("post call made");
  res.status(201).json({ post });
});

router.get("/", async (req, res) => {
  const posts = await Post.find().populate('user_id').sort({ createdAt: -1 }).lean().exec();

  console.log("get call made");
  res.status(200).json({ posts });
});

router.patch("/update/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  console.log("patch by id call made");
  res.status(201).json({ post });
});

router.delete("/delete/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({ post });
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.status(200).json({ post });
});

router.get("/:id/comments", async (req, res) => {
  const comments = await Comment.find({ post_id: req.params.id }).populate('commentd_by').lean().exec();

  res.status(200).json({ comments });
});
router.get("/user/:id", async (req, res) => {
  console.log(req.body)
  const posts = await Post.find({ user_id: { _id: req.params.id } }).lean().exec();

  res.status(200).json({ posts });
})
router.get("/otherusers/:id", async (req, res) => {
  console.log(req.body)
  const posts = await Post.find({ $and: [{ "user_id._id": { $ne: req.params.id } }, { "user_id": { $ne: req.params.id } }] }).lean().exec();

  res.status(200).json({ posts });
})

module.exports = router;
