const router = require("express").Router();
const Comment = require("../model/comment.model");

router.post("/", async (req, res) => {
  const comment = await Comment.create(req.body);
  console.log("comment post call made");
  res.status(201).json({ comment });
});

router.get("/", async (req, res) => {
  const comments = await Comment.find().sort({createdAt:-1}).lean().exec();

  console.log("comment get call made");
  res.status(200).json({ comments });
});

router.patch("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  console.log("comment patch by id call made");
  res.status(201).json({ comment });
});

router.delete("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  res.status(200).json({ comment });
});



module.exports = router;
