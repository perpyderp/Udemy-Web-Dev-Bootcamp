
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let items = [];

app.get("/", function(req, res) {

    let today = new Date()
    // var currentDay = today.getDay()
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options)


    // switch(currentDay) {
    //     case 0:
    //         day = "Sunday"
    //         break;
    //     case 1:
    //         day = "Monday"
    //         break;
    //     case 2:
    //         day = "Tuesday"
    //         break;
    //     case 3:
    //         day = "Wednesday"
    //         break;
    //     case 4:
    //         day = "Thursday"
    //         break;
    //     case 5:
    //         day = "Friday"
    //         break;
    //     case 6:
    //         day = "Saturday"
    //         break;
    //     default:
    //         console.log("ERROR: Current day is equal to: " + currentDay)
    // }

    res.render("list", {kindOfDay: day, newItem: items});

});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
