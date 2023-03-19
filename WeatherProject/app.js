const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");

})

app.post("/", function(req, res) {
    
    const query = req.body.cityName;
    const apiKey = "";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function(response){
        // console.log(response);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const city = weatherData.name
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            // console.log(temp);
            // console.log(weatherData);
            res.write("<p>Weather description: " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + city + ": " + temp + "</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        })

    })

})


app.listen(process.env.PORT, function () {
    console.log("Server running on port 3000");
});
