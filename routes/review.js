const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {  reviewSchema } = require("../schema.js");
const Review = require("../Model/review.js");
const Listing = require("../Model/Listing.js");
const { checkUser, isreviewauthor, Validatereview } = require("../middleware.js");
const reviewController = require("../Controllers/review.js");

//postreview
router.post("/", Validatereview, checkUser, wrapAsync(reviewController.postR));
//Delete Review
router.put("/:reviewid",checkUser,isreviewauthor, wrapAsync(reviewController.deleteR))

module.exports = router;

    

