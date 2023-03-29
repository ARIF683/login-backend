const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");
const Auth = require("./auth");


dbconnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});



app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                email: req.body.email,
                password: hashedPassword
            })

            user.save().then((result) => {
                res.status(201).send({ message: "User created Successful", result })
            }).catch((error) => {
                res.status(500).send({ message: "Error creating user", error })
            })
        })
        .catch((e) => {
            res.status(500).send({ message: "Password hash isn't Successful", e })
        })
})

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        bcrypt.compare(req.body.password, user.password)
            .then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(400).send({ message: "Password doesn't match" })
                }
                const token = jwt.sign({
                    userId: user._id,
                    userEmail: user.email
                },
                    "RANDOM-TOKEN", {
                    expiresIn: "24h"
                })
                res.status(200).send({ message: "Login Successful",email: user.email, token })
            })
            .catch((error) => {
                res.status(400).send({ message: "Password doesn't match", error })
            })
    })
        .catch((e) => {
            res.status(404).send({ message: "Email not found", e })
        })
})

// free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", Auth,  (request, response) => {
    response.json({ message: "You are authorized to access me" });
});
module.exports = app;
