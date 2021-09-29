const router = require("express").Router();
const User = require("../model/user.model");

//get all users who are not his friends
router.get("/all/:id", async (req, res) => {
  const user = await User.find({ friends: { $nin: [req.params.id] } })
    .lean()
    .exec();

  res.status(201).json({ user });
});

// Get all friends
router.get("/friends", async (req, res) => {});

// send friend friendRequest
router.post("/sendRequest/:id", async (req, res) => {
  try {
    const sender = await User.findById(req.params.id).lean().exec();
    const reciever = await User.findById(req.body.id).lean().exec();

    // Check if they are already friends
    let aList = reciever.friends.filter((i) => {
      //console.log(req.params.id, i.toString());
      return i.toString() == req.params.id;
    });
    let bList = sender.friends.filter((i) => {
      return i.toString() == req.body.id;
    });
    console.log(aList, bList);
    if (aList.length == 1 || bList.length == 1) {
      return res.status(401).json({
        status: "failed",
        message: "You are already Friends",
      });
    }

    // check if sender already sent request before

    let aCon = sender.friendRequestSent.filter(
      (i) => i.toString() === req.body.id
    );

    let bCon = reciever.friendRequestRecieved.filter(
      (i) => i.toString() === req.params.id
    );
    let a, b;
    if (aCon.length != 1 || bCon.length != 1) {
      a =
        sender.friendRequestSent.length == 0
          ? []
          : sender.friendRequestSent.filter(
              (i) => i.toString() !== req.body.id
            );

      b =
        reciever.friendRequestRecieved.length == 0
          ? []
          : reciever.friendRequestRecieved.filter(
              (i) => i.toString() !== req.params.id
            );

      a.push(reciever._id);
      b.push(sender._id);
    } else {
      return res.status(401).json({
        status: "failed",
        message: "You are already Friends or they havent Accepted your request",
      });
    }

    const sent = await User.findByIdAndUpdate(req.params.id, {
      friendRequestSent: a,
    })
      .lean()
      .exec();

    const recieved = await User.findByIdAndUpdate(req.body.id, {
      friendRequestRecieved: b,
    })
      .lean()
      .exec();
    res.status(201).json({ sent, recieved });
    //res.send("hello");
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});

// Accept friend friend Request
router.post("/acceptRequest/:id", async (req, res) => {
  try {
    const acceptor = await User.findById(req.params.id).lean().exec();
    const sender = await User.findById(req.body.id).lean().exec();

    let bCon = sender.friendRequestSent.filter(
      (i) => i.toString() === req.params.id
    );

    let aCon = acceptor.friendRequestRecieved.filter(
      (i) => i.toString() === req.body.id
    );
    let aList, bList;
    let b = sender.friendRequestSent,
      a = acceptor.friendRequestRecieved;

    if (aCon.length !== 0 && bCon.length !== 0) {
      aList = acceptor.friends;
      bList = sender.friends;

      b = sender.friendRequestSent.filter(
        (i) => i.toString() !== req.params.id
      );

      a = acceptor.friendRequestRecieved.filter(
        (i) => i.toString() !== req.body.id
      );
      aList.push(sender._id);
      bList.push(acceptor._id);
    } else {
      return res.status(401).json({
        status: "failed",
        message: "Accepted or No new your request",
      });
    }

    const sent = await User.findByIdAndUpdate(req.body.id, {
      friendRequestSent: b,
      friends: bList,
    })
      .lean()
      .exec();

    const accepted = await User.findByIdAndUpdate(req.params.id, {
      friendRequestRecieved: a,
      friends: aList,
    })
      .lean()
      .exec();
    res.status(201).json({ sent, accepted });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});

//Reject Friend Request

router.post("/rejectRequest/:id", async (req, res) => {
  try {
    const rejector = await User.findById(req.params.id).lean().exec();
    const sender = await User.findById(req.body.id).lean().exec();

    let a =
      rejector.friendRequestRecieved.length == 0
        ? []
        : rejector.friendRequestRecieved.filter(
            (i) => i.toString() !== req.body.id
          );

    let b =
      sender.friendRequestSent.length == 0
        ? []
        : sender.friendRequestSent.filter(
            (i) => i.toString() !== req.params.id
          );
    console.log(a, b);
    const rejected = await User.findByIdAndUpdate(req.params.id, {
      friendRequestRecieved: a,
    })
      .lean()
      .exec();

    const recieved = await User.findByIdAndUpdate(req.body.id, {
      friendRequestSent: b,
    })
      .lean()
      .exec();
    res.status(201).json({ rejected, recieved });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});

// Remove || Unfriend Request
router.post("/unfriend/:id", async (req, res) => {
  try {
    const my = await User.findById(req.params.id).lean().exec();
    const unfriend = await User.findById(req.body.id).lean().exec();

    let bCon = unfriend.friends.filter((i) => i.toString() === req.params.id);

    let aCon = my.friends.filter((i) => i.toString() === req.body.id);
    if (aCon.length !== 1 && bCon.length !== 1) {
      return res.status(401).json({
        status: "failed",
        message: "They are not your friend",
      });
    }

    let aList, bList;

    bList = unfriend.friends.filter((i) => i.toString() !== req.params.id);

    aList = my.friends.filter((i) => i.toString() !== req.body.id);

    const unfriended = await User.findByIdAndUpdate(req.body.id, {
      friends: bList,
    })
      .lean()
      .exec();

    const me = await User.findByIdAndUpdate(req.params.id, {
      friends: aList,
    })
      .lean()
      .exec();
    res.status(201).json({ unfriended, me });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});

// update User
router.patch("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body)
    .lean()
    .exec();

  res.status(201).json({ user });
});
// Get user details
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).lean().exec();

  res.status(201).json({ user });
});

module.exports = router;
