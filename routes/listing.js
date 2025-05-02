const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createNew)
);
//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

router
.route("/:id")
.get(wrapAsync(listingController.showForm))
.put(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  isOwner,
  wrapAsync(listingController.updateForm))
.delete(
  isLoggedIn,
  isOwner,wrapAsync(listingController.deleteForm))
//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   validateListing,
//   isOwner,
//   wrapAsync(listingController.updateForm)
// );
//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteForm)
// );
//show route
// this route should be at the bottom of request function
// router.get(
//   "/:id",
//   wrapAsync(listingController.showForm)
// );

module.exports = router;
