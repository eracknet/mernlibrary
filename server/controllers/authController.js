const User = require('../models/user')
const passport = require("passport");

const registerUser = async (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      return res.status(400).json({success: false, err});
    }
    if (user) {
      return res.status(403).json({success: false, message: "User already exists"});
    } else {
      const newUser = new User(req.body);
      newUser.setPassword(req.body.password);
      newUser.save((err, user) => {
        if (err) {
          return res.status(400).json({success: false, err});
        }
        return res.status(201).json({
          success: true,
          user
        });
      })
    }
  })
}

const loginUser = async (req, res, next) => {
  // User.findOne({ email: req.body.email }, (err, user) => {
  //   if(err) {
  //     return res.status(400).json({ success: false, err });
  //   }
  //   if(!user) {
  //     return res.status(403).json({ success: false, message: "User not found" });
  //   }
  //   if(!user.isValidPassword(req.body.password)) {
  //     return res.status(403).json({ success: false, message: "Password incorrect" });
  //   }
  //   return res.status(200).json({
  //     success: true,
  //     user
  //   });
  // })

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(400).json({success: false, err});
    }
    if (!user) {
      return res.status(403).json({success: false, message: info.message});
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(400).json({success: false, err});
      }
      return res.status(200).json({
        success: true,
        user
      });
    });
  },)(req, res, next);
}

module.exports = {
  registerUser,
  loginUser,
}
