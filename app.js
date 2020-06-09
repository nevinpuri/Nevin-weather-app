var fs = require("fs");
var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var https = require("https");
var server = https.createServer(
  {
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("chain.pem"),
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3000;
var weather = require("openweather-apis");
weather.setLang("en");
weather.setAPPID("7534abbbcc4e9893cbfb5684ef75fb52");

server.listen(port, () => {
  console.log("Simple Weather App - By Nevin");
  console.log("https://github.com/Nevin1901/Nevin-weather-app");
  console.log("server listening on port 3000");
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("client send location", (latitude, longitude) => {
    getWeatherData(latitude, longitude);
  });

  socket.on("client request photo", () => {
    getPhoto();
  });
});
/*
const getWeatherData = (latitude, longitude) => {
  weather.setCoordinate(latitude, longitude);
  weather.getTemperature((err, temp) => {
    io.emit("server send weather", temp);
  });
  weather.getHumidity((err, humidity) => {
    io.emit("server send humidity", humidity);
  });
  weather.getDescription((err, description) => {
    io.emit("server send description", description);
  }); 
};
*/
// TODO : rewrite this as a promise
const getWeatherData = (latitude, longitude) => {
  weather.setCoordinate(latitude, longitude);
  let temp = weather.getTemperature();
  let humidity = weather.getHumidity();
  let description = weather.getDescription();
  io.emit("server send weather data", temp, humidity, description);
};
