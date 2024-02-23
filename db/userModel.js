//user model tells db how to store data that the user passes
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: [true, "Email already exists."]
    },

    password: {
        type: String, 
        required: [true, "Please provide a password."],
        unique: [true, "Password already exists."]
    },
})

//create a user table or collection if there is no table with that name already
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
