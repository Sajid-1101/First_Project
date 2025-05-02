const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Major_Project");
}
main()
  .then(() => console.log("connnected to db"))
  .catch((err) => console.log(err));

const initDB = async ()=>{
    await Listing.deleteMany({});
    // initData.data is an array containing objects
    initData.data = initData.data.map((obj)=>({...obj,owner : '67ffb936df44e87099bc56f9'}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted.");
}
initDB();