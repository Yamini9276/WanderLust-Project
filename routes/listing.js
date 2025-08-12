const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("../schema.js");
// const Listing = require("../Model/Listing.js");
const { checkUser, isOwner, Validatelisting } = require("../middleware.js");
const listingController=require("../Controllers/listings.js")
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



//All listings and Post new listing
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("listing[image]"), wrapAsync(listingController.postL));
    

//renders new form for lisiting
router.get("/new", checkUser, listingController.renderForm);



//show Listing and delete lisiting and EditPut
router.route("/:id")
    .get(wrapAsync(listingController.showL))
    .delete(checkUser, isOwner, wrapAsync(listingController.deleteL))
    .put(upload.single("listing[image]"),Validatelisting, isOwner, wrapAsync(listingController.putL));


//Edit route
router.get("/:id/edit",checkUser, isOwner, wrapAsync(listingController.EditL));



module.exports = router;

   

    





