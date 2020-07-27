//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/secretsDB", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = {
    email: String,
    password: String,
};

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            res.send("err");
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({ email: email, password: password }, function (err, result) {
        if (result) {
            res.render("secrets");
        } else {
            res.send("Wrong!");
        }
    });
});


app.listen(3000, function () {
    console.log("Server started successfully");
});