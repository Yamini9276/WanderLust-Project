const User = require("../Model/user");

const signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const reguser = await User.register(newUser, password);
        console.log(reguser);
        req.login(reguser, (err) => {
            if (err) {
                return next(err);
            }
             req.flash("success", "Welcome to Wanderlust");
             res.redirect("/listings");
        })
       

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

const showsignup=(req, res) => {
    res.render("users/signup.ejs");
}

const Login=async (req, res) => {
    req.flash("success", "welcome back to wanderlust");
    
    const redirectUrl = res.locals.redirectUrl || "/listings";
    if (!redirectUrl) {
        return res.redirect("/login");
    }
    res.redirect(redirectUrl);
}

const renderlogin=async(req,res,next) => {
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/listings");
    })
}

module.exports = { signup,showsignup,Login,renderlogin };