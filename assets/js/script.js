// Necessary variables
const APIkey = '76b0fd098a286373928b97461627195d';
var lat;
var lon;

// Grab necessary elements
const weatherMain = document.querySelector('.weather-main');
const weatherCards = document.querySelectorAll('.card-body');
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('#form1');
const searchHistory = document.querySelector('.recent-search');


// Uses Openweather's geolocation API to grab coordinates of searched city
function getCoords(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`)
        .then( response => response.json())
        .then( response => {
            lat = response[0].lat;
            lon = response[0].lon;
            getWeather(lat, lon);
        })
        .catch( err => console.error(err));
}

// Uses the grabbed coords to get weather conditions and display them
function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`)
        .then(response => response.json())
        .then(response => {
            console.log(response);

            weatherMain.children[0].textContent = response.city.name + ' (' + dayjs.unix(response.list[0].dt).format('M/D/YY') + ')';
            let weatherMainIcon = document.createElement('i');
            weatherMainIcon.classList.add(`fas`);
            weatherMainIcon.classList.add(getWeatherIcon(response, 0));
            weatherMain.children[0].append(weatherMainIcon);
            weatherMain.children[1].textContent = `Temp: ${response.list[0].main.temp} F`;
            weatherMain.children[2].textContent = `Wind: ${response.list[0].wind.speed} MPH`;
            weatherMain.children[3].textContent = `Humidity: ${response.list[0].main.humidity} %`; 

            let weatherCardIndex = 0;
            for (let i = 0; i < response.list.length; i += 8) {
                let time = dayjs.unix(response.list[i].dt).format('M/D/YY');

                weatherCards[weatherCardIndex].children[0].textContent = time;
                weatherCards[weatherCardIndex].children[1].classList.add(`fas`);
                weatherCards[weatherCardIndex].children[1].classList.add(getWeatherIcon(response, i));
                weatherCards[weatherCardIndex].children[2].textContent = `Temp: ${response.list[i].main.temp} F`;
                weatherCards[weatherCardIndex].children[3].textContent = `Wind: ${response.list[i].wind.speed} MPH`;
                weatherCards[weatherCardIndex].children[4].textContent = `Humidity: ${response.list[i].main.humidity} %`;
                weatherCardIndex++;
            }
        })
        .catch(err => {console.error(err)});
}

// Grabs corresponding weather icon for weather condition
function getWeatherIcon(response, index) {
    let weatherIcon = '';

    switch(response.list[index].weather[0].icon){
        case '01d':
        case '01n':
          weatherIcon = 'fa-sun'; break;
        case '02d':
        case '02n':
          weatherIcon = 'fa-cloud-sun'; break;
        case '03d':
        case '03n':
        case '04d':
        case '04n':
          weatherIcon = 'fa-cloud'; break;
        case '09d':
        case '09n':
          weatherIcon = 'fa-cloud-rain'; break;
        case '10d':
        case '10n':
          weatherIcon = 'fa-cloud-showers-heavy'; break;
        case '11d':
        case '11n':
          weatherIcon = 'fa-cloud-bolt'; break;
        case '13d':
        case '13n':
          weatherIcon = 'fa-snowflake'; break;
        case '50d':
        case '50n':
          weatherIcon = 'fa-smog'; break;
      }
      console.log(weatherIcon);
      return weatherIcon;
}

// Handles search bar functionality and recent searches
function formSubmitHandler(event) {
    event.preventDefault();

    let recentBtn = document.createElement('button');
    recentBtn.classList.add('btn', 'btn-secondary', 'recent-locations');
    recentBtn.innerHTML = capitalize(searchInput.value);
    searchHistory.insertBefore(recentBtn, searchHistory.children[0]);

    let recentLoc = document.querySelectorAll('.recent-locations');
    if (recentLoc.length > 7) {
        let removedBtn = recentLoc[recentLoc.length - 1];
        removedBtn.remove();
    }

    getCoords(searchInput.value);
}

// Capitalize function for recent search buttons
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event handler for recent search buttons
function recallLoc(event) {
    let target = event.target;

    if (target.tagName == 'BUTTON') {
        getCoords(target.textContent);
    }
}

// Adds appropriate event listeners once page is loaded
window.addEventListener('DOMContentLoaded', (event) => {
    searchBar.addEventListener("submit", formSubmitHandler);
    searchHistory.addEventListener("click", recallLoc);
    getCoords('sacramento');
})