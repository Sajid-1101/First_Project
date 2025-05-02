const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/review.js");

//review Post 
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createForm)
);
// delete review
router.delete(
  "/:r_id",isReviewAuthor,
  wrapAsync(reviewController.deleteForm)
);

module.exports = router;
