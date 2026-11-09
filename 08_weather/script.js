const apiKey = "dff3440e056b1df4918ff1dbf9127c9c"; // Paste your OpenWeatherMap API key here
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  if (!city) return;

  try {
    // If you provided an OpenWeatherMap API key, use it:
    if (apiKey && apiKey !== "dff3440e056b1df4918ff1dbf9127c9c") {
      const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${apiKey}`);

      if (!response.ok) {
        alert("City not found!");
        return;
      }

      const data = await response.json();

      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

      const condition = data.weather[0].main;
      if (condition === "Clouds") {
        weatherIcon.src = "images/clouds.png";
      } else if (condition === "Clear") {
        weatherIcon.src = "images/clear.png";
      } else if (condition === "Rain") {
        weatherIcon.src = "images/rain.png";
      } else if (condition === "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
      } else if (condition === "Mist" || condition === "Haze" || condition === "Fog") {
        weatherIcon.src = "images/mist.png";
      } else if (condition === "Snow") {
        weatherIcon.src = "images/snow.png";
      }
    } else {
      // Free fallback: Open-Meteo API (requires NO API key so it works right away!)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!");
        return;
      }

      const { name, latitude, longitude } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      const weatherData = await weatherRes.json();

      document.querySelector(".city").innerHTML = name;
      document.querySelector(".temp").innerHTML = Math.round(weatherData.current.temperature_2m) + "°C";
      document.querySelector(".humidity").innerHTML = weatherData.current.relative_humidity_2m + "%";
      document.querySelector(".wind").innerHTML = Math.round(weatherData.current.wind_speed_10m) + " km/h";

      const code = weatherData.current.weather_code;
      if (code === 0) {
        weatherIcon.src = "images/clear.png";
      } else if (code >= 1 && code <= 3) {
        weatherIcon.src = "images/clouds.png";
      } else if ((code >= 51 && code <= 57) || (code >= 80 && code <= 82)) {
        weatherIcon.src = "images/drizzle.png";
      } else if (code >= 61 && code <= 67) {
        weatherIcon.src = "images/rain.png";
      } else if ((code >= 71 && code <= 77) || code >= 85) {
        weatherIcon.src = "images/snow.png";
      } else if (code === 45 || code === 48) {
        weatherIcon.src = "images/mist.png";
      } else {
        weatherIcon.src = "images/clouds.png";
      }
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value.trim());
  }
});

// Load default city on startup
checkWeather("allahabad");

