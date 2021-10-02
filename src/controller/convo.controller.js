const router = require("express").Router();
const Conversation = require("../model/convo.model");

// make new Conversation instance

router.post("/", async (req, res) => {
  try {
    const one = new Conversation({
      members: [req.body.senderId, req.body.recieverId],
    });
    const saved = await one.save();
    console.log(saved);
    res.status(201).json({ saved });
  } catch (err) {
    res.status(401).json({ err });
  }
});

// get convo

router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json({ conversation });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.get("/:id/:id2", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      $or: [
        { members: { $eq: [req.params.id, req.params.id2] } },
        { members: { $eq: [req.params.id2, req.params.id] } },
      ],
    });
    if (conversation.length > 0) {
      res.status(200).json({ conversation, present: true });
    } else {
      res.status(200).json({ conversation, present: false });
    }
  } catch (err) {
    res.status(401).json({ err });
  }
});

module.exports = router;
