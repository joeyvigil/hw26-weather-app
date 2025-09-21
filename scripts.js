console.log("scripts.js loaded");
const apiKey =  '359683f8046b7c8fab3f079a5bc2c2b0'
let tempFormat = "C"; // default to Celsius

function isNumeric(str) {
  return Number.isFinite(+str);
}

document.getElementById("temp-format-switch").addEventListener("change", () => {
  if (tempFormat === "C") {
    tempFormat = "F";
    document.getElementById("temp-format-text").innerText = "Fahrenheit";
  } else {
    tempFormat = "C";
    document.getElementById("temp-format-text").innerText = "Celsius";
  }
});

document.getElementById("submit-btn").addEventListener("click", async () => {
    let location = document.getElementById("location-input").value;
    console.log("Location entered:", location);
    if (!location) {
        alert("Please enter a location.");
        return;
    }
    let data;
    if (isNumeric(location)) {
        location = `${location},us`; // assuming US zip codes for simplicity
        data = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=${apiKey}&units=${tempFormat === "C" ? "metric" : "imperial"}`);
    } else {
        data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${tempFormat === "C" ? "metric" : "imperial"}`);
    }
    const result = await data.json();
    if (result.cod !== 200) {
        alert("Location not found. Please try again.");
        return;
    }
    console.log("Weather data:", result);
    document.getElementById("weather-display").innerHTML = `
        <h1>Weather for <em>${result.name}</em></h1>
        <h6>latitude: <em>${result.coord.lat}</em>, longitude: <em>${result.coord.lon}</em></h6>
        <h4><img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png">  ${result.weather[0].description} <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png"></h4>
        <h4>Temp: <em>${result.main.temp} °${tempFormat}</em></h4>
        <h4>High: <em>${result.main.temp_max} °${tempFormat}</em></h4>
        <h4>Low: <em>${result.main.temp_min} °${tempFormat}</em></h4>
        <h4>Humidity: <em>${result.main.humidity}%</em></h4>
        <h4>Wind Speed: <em>${result.wind.speed} ${tempFormat === "C" ? "m/s" : "mph"}</em></h4>
        <h4>Cloud Coverage: <em>${result.clouds.all}%</em></h4>
        <h4>Pressure: <em>${result.main.pressure} hPa</em></h4>
        <h4>Visibility: <em>${result.visibility} meters</em></h4>
    `;
});


document.getElementById("current-location-btn").addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("Current location:", lat, lon);
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${tempFormat === "C" ? "metric" : "imperial"}`);
        const result = await data.json();
        console.log("Weather data:", result);
        if (result.cod !== 200) {
            alert("Location not found. Please try again.");
            return;
        }
        
        console.log("Weather data:", result);
        document.getElementById("weather-display").innerHTML = `
            <h1>Weather for <em>${result.name}</em></h1>
            <h6>latitude: <em>${result.coord.lat}</em>, longitude: <em>${result.coord.lon}</em></h6>
            <h4><img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png">  ${result.weather[0].description} <img src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png"></h4>
            <h4>Temp: <em>${result.main.temp} °${tempFormat}</em></h4>
            <h4>High: <em>${result.main.temp_max} °${tempFormat}</em></h4>
            <h4>Low: <em>${result.main.temp_min} °${tempFormat}</em></h4>
            <h4>Humidity: <em>${result.main.humidity}%</em></h4>
            <h4>Wind Speed: <em>${result.wind.speed} ${tempFormat === "C" ? "m/s" : "mph"}</em></h4>
            <h4>Cloud Coverage: <em>${result.clouds.all}%</em></h4>
            <h4>Pressure: <em>${result.main.pressure} hPa</em></h4>
            <h4>Visibility: <em>${result.visibility} meters</em></h4>
        `;
    }, (error) => {
        alert("Error getting location. Please try again.");
        console.error("Geolocation error:", error);
    });
});