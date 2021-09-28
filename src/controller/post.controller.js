const router = require('express').Router()
const Post = require('../model/post.model')
router.post('/',async (req,res)=>{
    const post = await Post.create(req.body)
    res.status(201).json({post})
})
router.get('/',async (req,res)=>{
    const posts = await Post.find().lean().exec()
    res.status(201).json({posts})
})

module.exports = router;