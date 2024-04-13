const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "helloitsbipin";

//ROUTE 1: create a user using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid name").isEmail(),
    body("password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // Add the async keyword to the callback function
    let success= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email }).select(
        "+password"
      );

      if (user) {
        return res.status(400).json({ success, error: "email exist" });
      }
      // Wait for the promise to resolve and assign it to a variable
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Use the variable as the password in the user model
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass, // Use the resolved password
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      // Handle any errors that may occur
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/userlogin",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can not be blank").exists({ min: 3 }),
  ],
  async (req, res) => {
    let success= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
       user = await User.findOne({email}).select(
        "+password"
      );

      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "plese try login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success,error: "plese try login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      // Handle any errors that may occur
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3: Get loogedin user details using: POST "/api/auth/login".  login required

router.post(
  "/getuser",
  fetchuser,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(req.body);

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
