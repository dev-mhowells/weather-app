const api = "50fc983604e9e8a3e164823d9e0e63e5";

const locationInput = document.getElementById("location");
const searchBtn = document.getElementById("search");
const dispLocation = document.getElementById("display-location");
const dispDescription = document.getElementById("display-description");
const dispTemp = document.getElementById("display-temp");

const bottom = document.getElementById("bottom");

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
  const dailyDisplay = document.createElement("div");
  dailyDisplay.classList.add("daily-display");
  bottom.appendChild(dailyDisplay);
  // put loop in here
  const tomDescription = arr[1].description;
  console.log(tomDescription);
  const dailyDescription = document.createElement("h4");
  dailyDescription.classList.add("description");
  dailyDescription.textContent = tomDescription;
  dailyDisplay.appendChild(dailyDescription);

  //   data.appendChild(testEl);
  //   testEl.textContent = tomDescription;
}

function createDomElsHtml(arr) {
  const html = `<div class="daily-display" id="daily-display">
  <h4 class="day" id="day">Oneday</h4>
  <h4 class="description" id="description">${arr[1].description}</h4>
  <div class="min-max" id="min-max">
    <h5 class="max" id="max">Max -</h5>
    <p class="max-val" id="max-val">${Math.round(arr[1].tempMax)}°</p>
    <h5 class="min" id="min">- Min</h5>
    <p class="min-val" id="min-val">${Math.round(arr[1].tempMin)}°</p>
  </div>
  <h4 class="wind" id="wind">Wind: ${arr[1].windSpd}</h4>
</div>`;
  bottom.insertAdjacentHTML("beforeend", html);
}

function centerDisplay(obj) {
  dispLocation.textContent = locationInput.value;
  dispDescription.textContent = obj.description;
  dispTemp.textContent = `${Math.round(obj.temp)}°C`;
}

// function bottomDisplay(obj) {
//     const html =
// }

const now = new Date();
const dayOfWeekArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayOfWeek = now.getDay();
console.log(dayOfWeekArray[dayOfWeek]);

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
  createDomElsHtml(allSummaries);
}

searchBtn.addEventListener("click", function () {
  fulfillSearch(locationInput.value);
});
