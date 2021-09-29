const router = require("express").Router();
const Post = require("../model/post.model");
router.post("/", async (req, res) => {
  const post = await Post.create(req.body);
  console.log("post call made");
  res.status(201).json({ post });
});

router.get("/", async (req, res) => {
    const posts = await Post.find().lean().exec();
    
    console.log("get call made");
    res.status(200).json({ posts });
});


router.patch("/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body,{new:true});
  
  console.log("patch by id call made");
  res.status(201).json({ post });
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  
  res.status(200).json({ post });
});

module.exports = router;
