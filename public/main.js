$(function () {
  var socket = io();

  var $temp = document.getElementById("temperature");
  var $humidity = document.getElementById("humidity");
  var $description = document.getElementById("description");
  var $openWeatherIframe = document.getElementById("openWeatherIframe");

  var test54 = document.getElementById("backgroundImage");
  getLocation();
  setMapPos();
  //window.onload = () => {};

  socket.on("server send weather", (temp) => {
    $temp.innerHTML = "🌡️ Temperature: " + temp + "°C";
  });

  socket.on("server send humidity", (humidity) => {
    $humidity.innerHTML = "💨 % Humidity: " + humidity;
  });

  socket.on("server send description", (description) => {
    $description.innerHTML = "📜 Description: " + description;
  });

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        sendPos(position);
      });
    } else {
      console.log("Error: Unable to get position");
    }
  }

  const sendPos = (position) => {
    socket.emit(
      "client send location",
      parseFloat(position.coords.latitude).toFixed(3),
      parseFloat(position.coords.longitude).toFixed(3)
    );
  };

  const setMapPos = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      $openWeatherIframe.src =
        "https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=" +
        position.coords.latitude +
        "&lon=" +
        position.coords.longitude +
        "&zoom=8";
    });
  };
});
