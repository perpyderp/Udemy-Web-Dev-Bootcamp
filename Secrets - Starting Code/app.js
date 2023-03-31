//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile"]})
)

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

app.route("/login") 

.get((req, res) => {
    res.render("login");
})

.post((req, res) => {
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});

app.route("/logout")

.get((req, res) => {
    req.logout(err => {
        if(err) {
            console.log(err);
        }
    });
    res.redirect("/");
});

/*
    Authorization using bycrypt
*/

// app.post("/login", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}).
//     then(userFound => {
//         if(userFound) {
//             // Load hash from your password DB.
//             bcrypt.compare(password, userFound.password, function(err, result) {
//                 if(result === true) {
//                     res.render("secrets");
//                 }
//             });
//         }
//     }).
//     catch(error => res.json({error: error.message}));
// });

app.get("/secrets", (req, res) => {

    User.find({"secret": {$ne: null}})
    .then(foundUsers => {
        if(foundUsers) {
            console.log(foundUsers);
            res.render("secrets", {userWithSecrets: foundUsers});
        }
    })
    .catch(error => res.json({error: error.message}));


    // if(req.isAuthenticated()) {
    //     res.render("secrets");
    // }
    // else {
    //     res.redirect("/login");
    // }
});

app.get("/submit", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("submit");
    }
    else {
        res.redirect("/login");
    }
});

app.post("/submit", (req, res) => {
    const submittedSecret = req.body.secret;

    console.log(req.user.id);

    User.findOne({_id: req.user.id})
    .then(userFound => {
        if(userFound) {
            userFound.secret = submittedSecret;
            userFound.save()
            .then(() => {
                res.redirect("secrets");
            })
            .catch(error => { 
                res.json({error: error.message})
            });
            
        }
    })
    

});


app.route("/register")

.get( (req, res) => {
    res.render("register");
})

.post((req, res) => {
    
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            })
        }
    })

});

/*
    Registering users using bycrypt

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save().
        then(result => {
            res.render("secrets");
        }).
        catch(error => res.json({error: error.message}));
    });

})

*/


app.listen(3000, () => {
    console.log("Server started on port 3000");
})