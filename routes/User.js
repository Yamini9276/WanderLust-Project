const express = require("express");
const router = express.Router();
// const User = require("../Model/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {saveUrl } = require("../middleware");
const userController=require("../Controllers/user")

//Signup
router.route("/signup")
    .get(userController.showsignup)
    .post(wrapAsync(userController.signup));

//login
router.route("/login")
    .get(async (req, res) => {
        res.render("users/login.ejs");
    })
    .post(saveUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.Login));


//logout
router.get("/logout", userController.renderlogin);


module.exports = router;