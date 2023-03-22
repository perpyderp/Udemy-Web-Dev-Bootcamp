
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let items = [];
let workItems = [];
let day = date.getDay();

app.get("/", function(req, res) {

    res.render("list", {listTitle: day, items: workItems});

});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", items: items});
});

app.post("/", function(req, res) {

    if(req.body.value === "Work") {
        let workItem = req.body.newItem;
        workItems.push(workItem);
        res.redirect("/work");
    }
    else {
        let item = req.body.newItem;
        items.push(item);
        res.redirect("/");
    }
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
