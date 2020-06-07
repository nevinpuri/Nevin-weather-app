var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;
var weather = require("openweather-apis");
weather.setLang("en");
weather.setAPPID("7534abbbcc4e9893cbfb5684ef75fb52");

server.listen(port, () => {
  console.log("server listening on port 3000");
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("client send location", (latitude, longitude) => {
    //weather.setCoordinate(latitude, longitude);
    getWeatherData(latitude, longitude);
  });

  socket.on("client request photo", () => {
    getPhoto();
  });
});

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

const getPhoto = () => {
  console.log("hello guys");
};
