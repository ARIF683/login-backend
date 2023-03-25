const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});

dbConnect();

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
                res.status(200).send({ message: "Login Successful", token })
            })
            .catch((error) => {
                res.status(400).send({ message: "Password doesn't match", error })
            })
    })
        .catch((e) => {
            res.status(404).send({ message: "Email not found", e })
        })
})

module.exports = app;
