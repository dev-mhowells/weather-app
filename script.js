const api = "50fc983604e9e8a3e164823d9e0e63e5";

const locationInput = document.getElementById("location");
const searchBtn = document.getElementById("search");

async function getCoords(country) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${api}`
  );
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;
  console.log("test", lat, lon);
  return [lat, lon];
}

async function getWeather(lat, lon) {
  const weatherRespsonse = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${api}&units=metric`
  );
  const weatherData = await weatherRespsonse.json();
  //   console.log(weatherData);
  return weatherData;
}

function filterData(allData) {
  const filteredData = {
    feelsLike: allData.current.feels_like,
    humidity: allData.current.humidity,
    temp: allData.current.temp,
    description: allData.current.weather[0].description,
    windSpd: allData.current.wind_speed,
  };
  return filteredData;
}

class filteredDataDaily {
  constructor(humidity, tempMax, tempMin, description, windSpd) {
    this.humidity = humidity;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.description = description;
    this.windSpd = windSpd;
  }
}

function createDailySummaries(allData) {
  // Array of day objects
  const days = [];
  // create objects
  allData.daily.forEach((day) => {
    const dailyReport = new filteredDataDaily(
      day.humidity,
      day.temp.max,
      day.temp.min,
      day.weather[0].description,
      day.wind_speed
    );
    days.push(dailyReport);
  });
  return days;
}

// getCoords("london").then((coords) => getWeather(coords[0], coords[1])); mixing async and then

// doing the same with async:

// (async function () {
//   const coords = await getCoords("london");
//   const allData = await getWeather(coords[0], coords[1]);
//   console.log(allData);
//   console.log(allData.current.temp);
//   console.log(filterData(allData));
// })();

async function fulfillSearch(loc) {
  const coords = await getCoords(loc);
  const allData = await getWeather(coords[0], coords[1]);
  console.log(allData);
  console.log(filterData(allData));
  // loops through array of daily data and extracts needed data
  //   allData.daily.forEach((day) => {
  //     const dailyReport = new filteredDataDaily(
  //       day.humidity,
  //       day.temp.max,
  //       day.temp.min,
  //       day.weather[0].description,
  //       day.wind_speed
  //     );
  //     days.push(dailyReport);
  //   });
  console.log(createDailySummaries(allData));
}

searchBtn.addEventListener("click", function () {
  console.log(locationInput.value);
  fulfillSearch(locationInput.value);
});
