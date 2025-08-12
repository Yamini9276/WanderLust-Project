const { raw } = require("body-parser");
const mongoose = require("mongoose");
const { type } = require("../schema");


const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max:5,
    },
    comment: String,
    createdAt: {
        type: Date,
        default:Date.now()
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref:"User"
    }
})
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;