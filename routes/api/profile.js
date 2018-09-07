const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile model
const Profile = require("../../models/Profile");
// Load User model
const User = require("../../models/User");

// @route   POST api/profile/test
// @desc    test profile route
// @access  public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile/
// @desc    get the profile of current user
// @access  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/
// @desc    create/ update profile for user
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get fields
    const profileFields = {} ;
    profileFields.user = req.user.id   ; //???
    if(req.body.handle) profileFields.handle = req.body.handle ;
    if(req.body.company) profileFields.company = req.body.company ;
    if(req.body.website) profileFields.website = req.body.website ;
    if(req.body.location) profileFields.location = req.body.location ;
    if(req.body.bio) profileFields.bio = req.body.bio ;
    if(req.body.status) profileFields.status = req.body.status ;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername ;
    // Skills - split into array
    if(typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',')   ;
    }
    
    //Social
    profileFields.Social ={}  ;
    if(req.body.youtube) profileFields.Social.youtube = req.body.youtube ;
    if(req.body.twitter) profileFields.Social.twitter = req.body.twitter ;
    if(req.body.facebook) profileFields.Social.facebook = req.body.facebook ;
    if(req.body.linkedin) profileFields.Social.linkedin = req.body.linkedin ;
    if(req.body.instagram) profileFields.Social.instagram = req.body.instagram ;
  
  }
);

module.exports = router;
