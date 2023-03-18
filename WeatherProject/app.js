const express = require("express");
const https = require("https");



const app = express();

app.get("/", function(req, res) {

    const url = "https://api.openweathermap.org/data/2.5/weather?q=Edison&appid=8250db915eda739034b58be99ceac9bc";
    https.get(url, function(response){
        console.log(response);
    });

    res.send("Server running");
})


app.listen(3000, function () {
    console.log("Server running on port 3000");
});