const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user / return JWT
// @access  public

router.post("/login", (req, res) => {
  
  const { errors, isValid } = validateLoginInput(req.body);

  const email = req.body.email;
  const password = req.body.password;

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User Not found!';
      return res.status(404).json(errors);
    }

    //Check for password
    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        // user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );

        // res.json({ msg: "Success" });
      } else {
        errors.password = 'Password Incorrect!' ;
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    return the current user
// @access  private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const result = req.user;
    res.json({
      id: result.id,
      name: result.name,
      avatar: result.avatar,
      email: result.email
    });
  }
);

module.exports = router;
