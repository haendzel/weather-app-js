const notification = document.querySelector(".notification");
const iconWeather = document.querySelector(".icon-weather");
const temp = document.querySelector(".temp-value p");
const desc = document.querySelector(".temp-desc p");
const zone = document.querySelector(".location p");

const KELVIN = 273; 
const key = "dec1d47427fe0c30ef917e4f5d0685ce"; //api key

// const weather = {
//     temperature: {
//         value: 21,
//     },

//     description: 'sunny',
//     icon : "sunny",
//     city: "Kraków",
//     country: 'PL'
// };

const weather = {};

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = "<p>Your browser not support geolocation!</p>"
}

function setCoordinates(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    notification.style.display = 'block';
    notification.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?latitude=${latitude}&longitude=${longitude}&appid=${key}`;
    fetch(api).then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.icon = data.weather.description;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function (){
        displayWeather();
    });
}

function displayWeather() {
    iconWeather.innerHTML = `<img src="icons/${weather.icon}.svg"/>`;
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    desc.innerHTML = weather.description;
    zone.innerHTML = `${weather.city}, ${weather.country}`;
}

//displayWeather();