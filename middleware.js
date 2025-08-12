const Listing=require("./Model/Listing");
const Review = require("./Model/review");
const { listingSchema,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const checkUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to continue.");
        return res.redirect("/login");
    }
    next();
};

const saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

const isOwner = async(req, res, next) => {
    let { id } = req.params;
    let upListing = await Listing.findById(id);
    if (res.locals.currUser && !upListing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied: You do not have the required permissions to perform this action.");
        return res.redirect(`/listings/${id}`);
    
    }
    next();
}

const Validatelisting = (req,res,next) => {
    let {error}=listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
const isreviewauthor = async(req, res, next) => {
    let {id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "Access denied: You do not have the required permissions to perform this action.");
        return res.redirect(`/listings/${id}`);
    
    }
    next();
}

const Validatereview = (req,res,next) => {
    console.log("starts here");
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
module.exports = { checkUser, saveUrl,isOwner,isreviewauthor,Validatelisting,Validatereview};