const router = require("express").Router();
const Notification = require("../model/notification.model");
const User = require("../model/user.model");

// make new notification instance
router.post("/", async (req, res) => {
  try {
    const notify = await Notification.create(req.body);
    res.status(201).json({ notify });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const msg = await Notification.find({ to: req.params.id })
      .populate("from")
      .lean()
      .exec();

    res.status(201).json({ msg });
  } catch (err) {
    res.status(401).json({ err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const msg = await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
    })
      .populate("from")
      .lean()
      .exec();

    res.status(201).json({ msg });
  } catch (err) {
    res.status(401).json({ err });
  }
});

module.exports = router;
