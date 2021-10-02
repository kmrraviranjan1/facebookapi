const router = require("express").Router();
const User = require("../model/user.model");

//get all users who are not his friends
router.get("/all/:id", async (req, res) => {
  const user = await User.find({
    $and: [
      { friends: { $nin: [req.params.id] } },
      { friendRequestRecieved: { $nin: [req.params.id] } },
      { _id: { $ne: req.params.id } },
    ],
  })
    .lean()
    .exec();

  res.status(201).json({ user });
});


//get all users who are not his friends
router.get("", async (req, res) => {
  const users = await User.find().populate("friends")
    .lean()
    .exec();

  res.status(201).json({ users });
});

//dummy user post request
router.post("", async (req, res) => {
  console.log(req.body)
  const user = await User.create(req.body);
  return res.status(201).json({ user });
})
// Get all friends
router.get("/friends", async (req, res) => { });

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

    const sent = await User.findByIdAndUpdate(
      req.params.id,
      {
        friendRequestSent: a,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();

    const recieved = await User.findByIdAndUpdate(
      req.body.id,
      {
        friendRequestRecieved: b,
      },
      { returnOriginal: false }
    )
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

    const sent = await User.findByIdAndUpdate(
      req.body.id,
      {
        friendRequestSent: b,
        friends: bList,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();

    const accepted = await User.findByIdAndUpdate(
      req.params.id,
      {
        friendRequestRecieved: a,
        friends: aList,
      },
      { returnOriginal: false }
    )
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
    const rejected = await User.findByIdAndUpdate(
      req.params.id,
      {
        friendRequestRecieved: a,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();

    const recieved = await User.findByIdAndUpdate(
      req.body.id,
      {
        friendRequestSent: b,
      },
      { returnOriginal: false }
    )
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

// Cancel Friend Request
router.post("/cancelRequest/:id", async (req, res) => {
  try {
    const rejector = await User.findById(req.params.id).lean().exec();
    const sender = await User.findById(req.body.id).lean().exec();

    let a =
      rejector.friendRequestSent.length == 0
        ? []
        : rejector.friendRequestSent.filter(
          (i) => i.toString() !== req.body.id
        );

    let b =
      sender.friendRequestRequest.length == 0
        ? []
        : sender.friendRequestRequest.filter(
          (i) => i.toString() !== req.params.id
        );
    console.log(a, b);
    const cancelledBy = await User.findByIdAndUpdate(
      req.params.id,
      {
        friendRequestSent: a,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();

    const canceledUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        friendRequestRequest: b,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();
    res.status(201).json({ cancelledBy, canceledUser });
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

    const unfriended = await User.findByIdAndUpdate(
      req.body.id,
      {
        friends: bList,
      },
      { returnOriginal: false }
    )
      .lean()
      .exec();

    const me = await User.findByIdAndUpdate(
      req.params.id,
      {
        friends: aList,
      },
      { returnOriginal: false }
    )
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

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnOriginal: false,
    })
      .lean()
      .exec();

    res.status(201).json({ user });
  } catch (err) {
    return res.status(401).json({ message: err });
  }
});
// Get user details
router.get("/:id", async (req, res) => {

  try {
    const user = await User.findById(req.params.id).populate("friends").lean().exec();

    res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: err });
  }
});

module.exports = router;
