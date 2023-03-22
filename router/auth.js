const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const Authenticate = require("../middleware/Authenticate");

const User = require("../models/userSchema");
const Mainaa = require("../models/timeSchema");
// const { findById } = require("../models/userSchema");

//Get
router.get("/", (req, res) => {
  res.send("hello world in auth");
});

//Register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(402).json({ error: "Fill all data" });
  }
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords are different" });
    }

    const user = new User({ name, email, phone, password, cpassword });

    //Here we are making data or password bcrypt
    //Writen innside Schema
    await user.save();
    res.status(200).json({ message: "Successfull Saved" });
  } catch (err) {
    console.log("we are here");
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(402).json({ error: "Plz fill all data" });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      //if it is match then it stores inside the inMatch
      const inMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      // console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000), //30 days
        // httpOnly: true,
      });
     

      if (!inMatch) {
        return res.status(404).send("invalid credentials");
      } else {
        res.status(201).json({ message: "user is logged in" });
      }
    } else {
      console.log("caught in auth.js");
      return res.status(404).send("invalid credentials");
    }
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.get("/about", Authenticate, (req, res) => {
  // console.log("hello my about");
  console.log(req.rootUser.name);
  console.log(req.rootUser.email);
  res.send(req.rootUser);
});

router.post("/delete", async (req, res) => {
  try {
    const del = await User.findOneAndDelete({ token: req.body.tokens.token });
    if (del) {
      res.status(201).send("done");
    } else {
      res.status(202).send("done");
    }
  } catch (err) {
    res.status(401).send(err);
  }
});

router.patch("/about", async (req, res) => {
  try {
    const did = await User.findByIdAndUpdate({ _id: req.body._id }, req.body, {
      new: true,
    });
    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(409).send(e);
  }
});

router.get("/appoint", async (req, res) => {
  try {
    const did = await User.find();

    res.status(200).send(did);
  } catch (e) {
    console.log(e);
    res.status(409).send(e);
  }
});
router.post("/appoint", async (req, res) => {
  try {
    const { userid, start, end, name, email } = req.body;
    const tmain = new Mainaa({ userid, start, end, name, email });

    // const itExist = await Mainaa.find({start:{$lte:start,}});
    if (end <= start) {
      res.status(505).json({ Failed });
    }
    const itExist = await Mainaa.find({
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } },
      ],
    });
    try {
      const a = itExist[0].userid;
      res.status(505).json({ itExist });
    } catch (e) {
      await tmain.save();
      res.status(200).json({ message: "Saved Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.status(409).send(e);
  }
});

router.delete("/scam/:id", async (req, res) => {
  try {
    // const tmain = new Mainaa({ req.body._id});
    const found = await Mainaa.findByIdAndDelete(req.params.id);

    if (found === null) {
      res.status(404).json({ message: "not found" });
    } else {
      res.status(200).json({ message: "deleted" });
    }
  } catch (e) {
    console.log(e);
    res.status(402).send(e);
  }
});

router.post("/find", async (req, res) => {
  try {
    const foundit = await User.findOne({ _id: req.body._id });
    res.status(200).json(foundit);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "not found" });
  }
});
router.get("/time", async (req, res) => {
  try {
    const time = await Mainaa.find(req.query);
    res.status(200).json(time);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "not found" });
  }
});
router.get("/appointment", async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "not found" });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});


router.get("/rooms")
module.exports = router;
