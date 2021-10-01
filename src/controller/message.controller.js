const router = require("express").Router();
const Message = require("../model/message.model");
const User = require("../model/user.model");

// make new Message instance

router.post("/", async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    await msg.populate("sender");
    res.status(201).json({ msg });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const msg = await Message.find({ conversationId: req.params.id })
      .populate("sender")
      .lean()
      .exec();

    res.status(201).json({ msg });
  } catch (err) {
    res.status(401).json({ err });
  }
});

module.exports = router;
