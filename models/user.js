const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type:String,
        required:true,
    },
    //username amd password block will automatically included by passportLocalMongoose.
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);