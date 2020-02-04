const notification = document.querySelector(".notification");
const iconWeather = document.querySelector(".icon-weather");
const temp = document.querySelector(".temp-value p");
const desc = document.querySelector(".temp-desc p");
const zone = document.querySelector(".location p");

const kelvin = 273; 
const key = "b5a3cbfba158fdfca9ef2456457088c0"; //api key

// const weather = {
//     temperature: 21,
//     description: 'sunny',
//     icon : "sunny",
//     city: "Kraków",
//     country: 'PL'
// };

const weather = {};

//check support browser
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setCoordinates, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = "<p>Your browser not support geolocation!</p>"
}

//set user coordinates
function setCoordinates(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    notification.style.display = 'block';
    notification.innerHTML = `<p>${error.message}</p>`;
}

//get weather from api data
function getWeather(latitude, longitude) {
    let api = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + key;
    fetch(api).then(response => {
        //console.log(response.status);
        let data = response.json();
        return data;
    })
    .then(data => {
        weather.temperature = Math.floor(data.main.temp - kelvin);
        weather.description = data.weather[0].description;
        weather.icon = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(() => {
        displayWeather();
    });
}

//display in web
function displayWeather() {
    iconWeather.innerHTML = `<img src="icons/${weather.icon}.svg"/>`;
    temp.innerHTML = `${weather.temperature}°<span>C</span>`;
    desc.innerHTML = weather.description;
    zone.innerHTML = `${weather.city}, ${weather.country}`;
};