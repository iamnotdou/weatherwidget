// Import packages
const { default: axios } = require("axios");
const express = require("express");
const { one } = require("./templates/one");
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.header("Pragma", "no-cache");
  res.header("Content-Type", "image/svg+xml");
  res.header("Expires", "0");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  const { data: weather } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather?q=istanbul&units=metric&appid=81dc02ed439385662d9650654bff3526"
  );
  res.send(
    one({
      city: weather.name,
      icon: weather.weather[0].icon,
      day: weather.sys.sunset > weather.dt,
      description: weather.weather[0].description,
      degreeType: "C",
      degree: Math.floor(weather.main.temp),
      time: ` ${(new Date().getHours() + 3) % 12 || 12}:${
        new Date().getMinutes() > 10
          ? new Date().getMinutes()
          : "0" + new Date().getMinutes()
      } ${new Date().getHours() > 12 ? "PM" : "AM"}`,
      wind: weather.wind,
    })
  );
});
app.use(express.static("public"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening to port ${port}`));
