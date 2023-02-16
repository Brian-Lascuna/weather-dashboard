



function getCoords() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=${APIkey}`)
        .then(response)
}