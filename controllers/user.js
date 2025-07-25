const User = require("../models/user");

module.exports.signupForm = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
module.exports.loginForm = async(req,res,next)=>{
    req.flash("success","Welcome back to your account!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ; 
    res.redirect(redirectUrl);
}
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}
module.exports.logoutForm = (req,res,next)=>{
    req.logOut((err)=>{
    if(err) return next(err);        
    req.flash("success","You are logged Out!");
    res.redirect("/listings");
    })
}