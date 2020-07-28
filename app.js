//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/secretsDB", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const saltRounds = 10;

const User = new mongoose.model("user", userSchema);



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {
    res.redirect("/");
});


app.post("/register", function (req, res) {
    bycrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash,
        });
        newUser.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({ email: email }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bycrypt.compare(password, foundUser.password, function (compareErr, compareResult) {
                    if (!compareErr) {
                        if (compareResult) {
                            res.render("secrets");
                        } else {
                            res.send("Wrong!");
                        }
                    } else {
                        console.log(compareErr);
                    }
                });
            }
        }
    });
});


app.listen(3000, function () {
    console.log("Server started successfully");
});