const apiKey = "8f53e49a373356f9bdd578665a79e5b5"; // Replace with your OpenWeatherMap API key
let isCelsius = true;

// Function to fetch weather data by city name
const getWeather = (city) => {
  const unit = isCelsius ? "metric" : "imperial";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error("Network error");
    });
};

// Function to fetch weather data by geolocation
const getWeatherByLocation = (lat, lon) => {
  const unit = isCelsius ? "metric" : "imperial";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error("Network error");
    });
};

// Function to display weather data
const displayWeather = (data) => {
  const weatherDisplay = document.getElementById("weatherDisplay");
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const unitSymbol = isCelsius ? "°C" : "°F";

  weatherDisplay.innerHTML = `
    <div class="weather-info">
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="${data.weather[0].description}">
      <p>Temperature: ${data.main.temp}${unitSymbol}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Condition: ${data.weather[0].description}</p>
    </div>
  `;
};

// Function to handle form submission
document.getElementById("weatherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const city = document.getElementById("cityInput").value.trim();

  if (city) {
    getWeather(city)
      .then((data) => {
        displayWeather(data);
      })
      .catch((error) => {
        document.getElementById(
          "weatherDisplay"
        ).innerHTML = `<p class="error">${error.message}</p>`;
      });
  } else {
    alert("Please enter a city name");
  }
});

// Function to handle geolocation button click
document.getElementById("geolocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon)
          .then((data) => {
            displayWeather(data);
          })
          .catch((error) => {
            document.getElementById(
              "weatherDisplay"
            ).innerHTML = `<p class="error">${error.message}</p>`;
          });
      },
      (error) => {
        document.getElementById(
          "weatherDisplay"
        ).innerHTML = `<p class="error">Geolocation error: ${error.message}</p>`;
      }
    );
  } else {
    document.getElementById(
      "weatherDisplay"
    ).innerHTML = `<p class="error">Geolocation is not supported by your browser.</p>`;
  }
});

// Function to handle unit toggle
document.getElementById("unitSwitch").addEventListener("change", () => {
  isCelsius = !isCelsius;
  const city = document.getElementById("cityInput").value.trim();

  if (city) {
    getWeather(city)
      .then((data) => {
        displayWeather(data);
      })
      .catch((error) => {
        document.getElementById(
          "weatherDisplay"
        ).innerHTML = `<p class="error">${error.message}</p>`;
      });
  }
});
