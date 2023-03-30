//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
const userDB = "mongodb://127.0.0.1:27017/userDB";

// Wait for database to connect, logging an error if there is a problem 
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(userDB);
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).
    then(userFound => {
        if(userFound) {
            if(userFound.password === password) {
                res.render("secrets");
            }
        }
    }).
    catch(error => res.json({error: error.message}));
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().
    then(result => {
        res.render("secrets");
    }).
    catch(error => res.json({error: error.message}));
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
})