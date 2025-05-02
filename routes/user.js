const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");
const userController = require("../controllers/user");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signupForm))
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginForm))

router.get("/logout",userController.logoutForm);

// router.get("/signup",userController.renderSignupForm)

// router.post("/signup",wrapAsync(userController.signupForm));

// router.get("/login",userController.renderLoginForm)

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginForm));


module.exports = router;
