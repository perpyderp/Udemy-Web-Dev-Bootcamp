
const express = require("express");
// Represents the express module
const app = express();

app.get("/", function(req, res) {
    res.send("Hello");
});

app.get("/contact", function(req, res) {
    res.send("Contact me at: test@gmail.com");
});

app.get("/about", function(req, res) {
    res.send("Biography about myself:");
});

app.get("hobbies", function(req, res) {
    res.send("List of all of my hobbies: ");
});

// Tell app to listen on port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
});