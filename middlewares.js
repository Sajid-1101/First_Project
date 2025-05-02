const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Logged in first!")
        res.redirect("/login");
    }
    console.log("logged in !!",req.user);
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied!")
        return res.redirect(`/listings/${id}`);
    }
    console.log("owner check !!",req.user);
    next();
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id,r_id } = req.params;
    const review = await Review.findById(r_id);
    if(!review){
        req.flash("error","Review does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((ele)=>ele.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
    next();
  }
}
module.exports.validateReview = (req,res,next)=>{
  let {error} =reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((ele)=>ele.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}
