const Review = require("../Model/review");
const Listing = require("../Model/Listing.js");
const ExpressError=require("../utils/ExpressError.js")

const { post } = require("../routes/review");

const postR = async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
       listing.reviews.push(newReview);
         newReview.author = req.user._id;
        await newReview.save();
    
        await listing.save();
        res.redirect(`/listings/${req.params.id}`);
}

const deleteR=async (req, res, next) => { 
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    let review=await Review.findById(reviewid);
    console.log(review);
    
    res.redirect(`/listings/${id}`);
    
}



module.exports = { postR,deleteR };