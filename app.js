require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user");
const userRouter = require("./routes/User.js");

const app = express();
<<<<<<< HEAD
const port = 8080;

// View engine setup
app.engine("ejs", ejsMate);
=======
let port = 8080;

app.use((req, res, next) => {
  console.log("currUser in middleware:", req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
>>>>>>> b015a089b922d9e67a0c9a7de4ead5a1cb1aed60
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// Method override for PUT/DELETE in forms
app.use(methodOverride("_method"));

// MongoDB session store
const store = MongoStore.create({
    mongoUrl: process.env.dbUrl,
    crypto: {
        secret: process.env.secret
    },
    touchAfter: 24 * 3600 // 24 hours
});

store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});

// Session configuration — **important: session first**
app.use(session({
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,  // Good for auth sessions
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));

<<<<<<< HEAD
// Flash messages — must come after session middleware
=======

 
>>>>>>> b015a089b922d9e67a0c9a7de4ead5a1cb1aed60
app.use(flash());

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to expose flash messages and current user to all templates — after flash and passport
app.use((req, res, next) => {
    console.log("currUser in middleware:", req.user);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));

// Routers — mount reviewRouter on fixed base path, **with plural 'reviews'**
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(process.env.dbUrl);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}
main();

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Error handling middleware — at the end of all routes
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { err, message });
});
