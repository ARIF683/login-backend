const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please Provide an email"],
        unique: [true, "Email Exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide an password"],
        unique: false
    }
})

module.exports = mongoose.model("Users", UserSchema)