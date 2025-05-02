const Listing = require("../models/listing");
// const listingSchema

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // first slash must not be included
    res.render("listings/index.ejs", { allListings });
  };
module.exports.renderNewForm = (req, res) => {
    console.log("req user", req.user);
    res.render("listings/create.ejs");
  }
module.exports.createNew = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename}; 
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    // in redirecting first slash is compulsory
    res.redirect("/listings");
  }
module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing not exists");
      res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250")
    
    res.render("listings/edit.ejs", { listing , originalUrl });
  }
module.exports.updateForm = async (req, res) => {
    let { id } = req.params;
    // both req.body and req.file is independent to each other
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
      req.flash("success","Listing Updated");
      res.redirect(`/listings/${id}`);
  }
module.exports.deleteForm = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
  }
module.exports.showForm = async (req, res) => {
    console.log(req.params.id);
    const list = await Listing.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    console.log(list);
    // in render function , we assume that it search inside the views folder
    res.render("listings/show.ejs", { list });
  }
