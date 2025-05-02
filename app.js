if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const db_url = process.env.ATLASDB_URL;
async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/Major_Project");
  await mongoose.connect(db_url);
}
main()
  .then(() => console.log("connnected to db"))
  .catch((err) => console.log(err));

app.listen(8080, (req, res) => console.log("server is listening to 8080"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl : db_url,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24*3600
})
store.on("error",()=>{
  console.log("ERROR in Mongo Session Store",err);
});
const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  }
} 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());// The user only has to log in once in a session; after that, multiple reqs and res can be targeted to users who log in in a single session.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this middlewared uses session and passport,it must be below the setup of these 2
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.currUser);
  next();
})

// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email : "std123@gmail.com",
//     username : "sajid",
//   });
//   let registeredUser =  await User.register(fakeUser,"pass123");
//   res.send(registeredUser);
// })
// app.get("/", (req, res) => res.send("hi, i am root"));

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// if other errors found
app.all("*",(req,res,next)=>{
  // next(throw err)
  next(new ExpressError(404,"Page Not Found!"));
});

// custom error handler
app.use((err,req,res,next)=>{
  let {status =500,message="Something went Wrong!"} = err; // obj name should be same
  // res.status(status).send(mssg);
  res.status(status).render("error.ejs",{message});
})
