import express from "express";
import https from "https";
import 'dotenv/config';
import ejs from "ejs";
const PORT = 3000;
const app = express();
app
  .set('view engine', 'ejs')
  .use(express.urlencoded({
    extended: true
  }))
  .use(express.static("public"))
  .listen(process.env.PORT || PORT, () => {
    console.log(`Connected to the Server on ${PORT}!`);
  })

app.post("/", (req, res) => {
  const
    city = req.body.cityName,
    units = req.body.units,
    uri = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + process.env.KEY + "&units=" + units;

  https.get(uri, (response) => {
    console.log(response.statusCode);

    response.on("data", data => {
      const weather = JSON.parse(data),
        temp = weather.main.temp,
        desc = weather.weather[0].description,
        icon = weather.weather[0].icon,
        imguri = "http://openweathermap.org/img/wn/" + icon + "@2x.png",
        unit = (units === "metric") ? "°C" : "°F";

      res.render("weather", {
        temperature: temp,
        description: desc,
        imgsrc: imguri,
        wUnit: unit
      })
    })
  })
})
