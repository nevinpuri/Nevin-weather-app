$(function () {
  var socket = io();

  var $temp = document.getElementById("temperature");
  var $humidity = document.getElementById("humidity");
  var $description = document.getElementById("description");
  var $openWeatherIframe = document.getElementById("openWeatherIframe");

  var bgImage = document.getElementById("backgroundImage");
  // TODO : Implement unsplash api random background image which gets its description from openweather

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapPos(position);
        sendPos(position);
      });
    } else {
      console.log("Error: Unable to get position");
    }
  };

  const sendPos = (position) => {
    socket.emit(
      "client send location",
      parseFloat(position.coords.latitude).toFixed(3),
      parseFloat(position.coords.longitude).toFixed(3)
    );
  };

  const setMapPos = (position) => {
    $openWeatherIframe.src =
      "https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=" +
      position.coords.latitude +
      "&lon=" +
      position.coords.longitude +
      "&zoom=8";
  };

  // TODO : Just make all these 3 one socket which sends temp, humidity, and data

  socket.on("server send weather data", (weatherData) => {
    $temp.innerHTML = "🌡️ Temperature: " + weatherData.temperature + "°C";
    $humidity.innerHTML = "💨 % Humidity: " + weatherData.humidity;
    $description.innerHTML = "📜 Description: " + weatherData.description;
  });

  getLocation();
});
