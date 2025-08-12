const mongoose = require("mongoose");
const { schema } = require("../schema");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1752035680973-79d3836f317a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1752035680973-79d3836f317a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        },
        filename: {
            type: String,
            default: "default.jpg",
            set: (v) => {
                  if (v) return v;
                  return "default.jpg";
            }
        }
    },
    price: {
        type:Number,
    },
    location: {
        type:String,
    },
    country: {
        type:String
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

// listingSchema.post("findOneAndDelete", async (lisiting) => {
//     if (lisiting.reviews.length>0) {
//         await Review.deleteMany({ _id: { $in: lisiting.reviews } });
//     }
   
    
// })

const Listing = mongoose.model("Listing", listingSchema);

module.exports=Listing;