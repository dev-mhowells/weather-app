const api = "50fc983604e9e8a3e164823d9e0e63e5";

const locationInput = document.getElementById("location");
const searchBtn = document.getElementById("search");
const dispLocation = document.getElementById("display-location");
const dispDescription = document.getElementById("display-description");
const dispTemp = document.getElementById("display-temp");

async function getCoords(country) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${api}`
  );
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;
  return [lat, lon];
}

async function getWeather(lat, lon) {
  const weatherRespsonse = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${api}&units=metric`
  );
  const weatherData = await weatherRespsonse.json();
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

function createDomEls(arr) {
  // put loop in here
  const tomDescription = arr[1].description;
  console.log(tomDescription);
  //   const testEl = document.createElement("h2");
  //   data.appendChild(testEl);
  //   testEl.textContent = tomDescription;
}

function centerDisplay(obj) {
  dispLocation.textContent = locationInput.value;
  dispDescription.textContent = obj.description;
  dispTemp.textContent = `${obj.temp} C`;
}

async function fulfillSearch(loc) {
  const coords = await getCoords(loc);
  const allData = await getWeather(coords[0], coords[1]);
  console.log(allData);
  console.log(filterData(allData)); // for current weather, returns object
  currentWeatherObj = filterData(allData);
  centerDisplay(currentWeatherObj);
  const allSummaries = createDailySummaries(allData); // for daily weather for week, returns array of objects
  console.log(allSummaries);
  createDomEls(allSummaries); // takes array of objects (daily summaries) and puts on page
}

searchBtn.addEventListener("click", function () {
  fulfillSearch(locationInput.value);
});
