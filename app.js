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
const LocalS = require("passport-local");
const User = require("./Model/user");
const userRouter = require("./routes/User.js");
const wrapAsync = require("./utils/wrapAsync.js");





const app = express();
let port = 8080;
    
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.dbUrl,
    crypto: {
        secret: process.env.secret
    },
    touchAfter: 24 * 3600 // optional
});

store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});

app.use(session({
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,  // better for auth sessions
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));


 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalS(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log("currUser in middleware:", req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use(express.static(path.join(__dirname, "/public")));
app.use("/listings", listingRouter)
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);
 

main().then(() => {
        console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.dbUrl);
}

app.listen(port, () => {
        console.log("I am listening");
})

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         username: "fuggy",
//         email: "fU@gmail.com",
//     });
//     let user1=await User.register(fakeuser,"helloworld");
//     res.send(user1);
// });
// app.get("/", (req, res) => {
    
//     res.send("hi I am root");
// })


app.use((err, req, res, next) => {
    let { status = 500, message= "Something went wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
});

