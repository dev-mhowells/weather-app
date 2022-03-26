const api = "50fc983604e9e8a3e164823d9e0e63e5";

const locationInput = document.getElementById("location");
const searchBtn = document.getElementById("search");
const dispLocation = document.getElementById("display-location");
const dispDescription = document.getElementById("display-description");
const dispTemp = document.getElementById("display-temp");

const bottom = document.getElementById("bottom");
const extraData = document.getElementById("extra-data");

const feelsVal = document.createElement("p");
const humidityVal = document.createElement("p");
const windVal = document.createElement("p");

// const localTime = document.getElementById("local-time");
// const left = document.getElementById("left");

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

function createDomElsHtml(arr) {
  // function takes array and populates bottom of page with daily summaries
  const dayOfWeek = now.getDay();
  let n = dayOfWeek + 1; // because daily display starts from tomorrow
  for (let i = 1; i <= 7; i++) {
    // adjusts day of the week
    if (n < 7) {
      n++;
    } else if (n >= 7) {
      n = 0;
    }
    // dynamic daily summary elements
    const html = `<div class="daily-display" id="daily-display">
  <h4 class="day" id="day">${dayOfWeekArray[n]}</h4>
  <h4 class="description" id="description">${arr[i].description}</h4>
  <div class="min-max" id="min-max">
    <h5 class="max" id="max">Max -</h5>
    <p class="max-val" id="max-val">${Math.round(arr[i].tempMax)}°</p>
    <h5 class="min" id="min">- Min</h5>
    <p class="min-val" id="min-val">${Math.round(arr[i].tempMin)}°</p>
  </div>
  <h4 class="wind" id="wind">wind ${Math.round(arr[i].windSpd * 2.237)} mph</h4>
</div>`;
    bottom.insertAdjacentHTML("beforeend", html);
  }
}

function centerDisplay(obj) {
  dispLocation.textContent = locationInput.value;
  dispDescription.textContent = obj.description;
  dispTemp.textContent = `${Math.round(obj.temp)}°C`;
}

function leftDisplay(obj) {
  feelsVal.classList.add("left-feels-value");
  feelsVal.textContent = `${Math.round(obj.feelsLike)}°C`;
  extraData.appendChild(feelsVal);

  humidityVal.classList.add("left-humidity-value");
  humidityVal.textContent = `${obj.humidity}%`;
  extraData.appendChild(humidityVal);

  windVal.classList.add("left-wind-value");
  windVal.textContent = `${Math.round(obj.windSpd * 2.237)} mph`;
  extraData.appendChild(windVal);
}

// function setTime(obj) {}

async function fulfillSearch(loc) {
  const coords = await getCoords(loc);
  const allData = await getWeather(coords[0], coords[1]);
  bottom.innerHTML = "";
  console.log(allData);
  console.log(filterData(allData)); // for current weather, returns object
  currentWeatherObj = filterData(allData);
  centerDisplay(currentWeatherObj);
  leftDisplay(currentWeatherObj);
  const allSummaries = createDailySummaries(allData); // for daily weather for week, returns array of objects
  console.log(allSummaries);
  createDomElsHtml(allSummaries); // takes array of objects (daily summaries) and puts on page
  locationInput.value = "";
}

locationInput.value = "london";
fulfillSearch("london");

searchBtn.addEventListener("click", function () {
  console.log(locationInput.value.toLowerCase());
  fulfillSearch(locationInput.value);
});
