var fs = require("fs");
var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3000;
var weather = require("openweather-apis");
weather.setLang("en");
weather.setAPPID("7534abbbcc4e9893cbfb5684ef75fb52");
const fetch = require("node-fetch");

var weatherData = {
  temperature: "Unknown",
  humidity: "Unknown",
  description: "Unknown",
};

server.listen(port, () => {
  console.log("Simple Weather App - By Nevin");
  console.log("https://github.com/Nevin1901/Nevin-weather-app");
  console.log("server listening on port 3000");
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("client send location", (latitude, longitude) => {
    getWeatherData(latitude, longitude)
      .then(sendWeatherData)
      .catch((err) => console.log(err));
  });

  socket.on("client request photo", () => {
    getPhoto();
  });

  socket.on("client send unsplash test", () => {
    testImage();
  });
});

const getWeatherData = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (weatherData["temperature"] === "Unknown") {
        reject("Error: Still equals same value");
      } else {
        resolve();
      }
    }, 250);
    weather.getTemperature((err, temp) => {
      weatherData["temperature"] = temp;
    });
    weather.getHumidity((err, humidity) => {
      weatherData["humidity"] = humidity;
    });
    weather.getDescription((err, description) => {
      weatherData["description"] = description;
    });
  });
};

const sendWeatherData = () => {
  io.emit("server send weather data", weatherData);
};

const testImage = () => {
  fetch(
    "https://api.unsplash.com/photos/random/?client_id=zitIfdGC9u1Xjp9vY-rUSdD4wXdEH8_NB-QdK9zkzW0&query=broken-clouds&orietation=landscape"
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      console.log(json["urls"]["full"]);
    })
    .catch((err) => console.log(err));
};
