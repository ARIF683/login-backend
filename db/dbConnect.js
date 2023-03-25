const mongoose = require("mongoose");
require("dotenv").config()

async function dbConnect () {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log("Database Connected Successful")})
    .catch((error) => {console.log(error)})
}

module.exports = dbConnect;