var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
var searchEl = $(".searchBtn");
var cityEl = $(".city-name");

searchEl.on("click", function (event) {
    event.preventDefault();
    var city = cityEl.val();
    
    if (city) {
        getApiToday(city);
        getApiForecast(city);
        cityEl.val('');

    } else {
        alert("Text area cannot be blank!")
    }
});

function getApiToday(city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrent(data);
                    getUv(data);
                    $(".weather-info").show();
                    $(".forecast").show();
                });
            } else {
                alert("Error! City not found!");
            }
        })
};

function getApiForecast(city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayForecast(data);
                });
            } else {
                return;
            }
        })
}

function displayCurrent(today) {
    var currentCity = $(".current-city");
    var currentTemp = $(".current-temp");
    var currentWind = $(".current-wind");
    var currentHumidity = $(".current-humidity");
    var currentUv = $(".uv-index");
    var currentImg = $('.current-img')

    currentCity.text(today.name + " " + moment().format("(ddd, MMMM Do)"));
    currentTemp.text("Current Temp: " + (Math.round(today.main.temp)) + "°F");
    currentWind.text("Current Wind Speed: " + today.wind.speed + "MPH");
    currentHumidity.text("Current Humidity: " + today.main.humidity + "%");
    currentImg[0].src = "http://openweathermap.org/img/wn/" + today.weather[0].icon + "@2x.png"
}

function getUv(today) {
    lat = today.coord.lat
    lon = today.coord.lon
    requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey

    fetch(requestUrl)
        .then (function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    displayUv(data)
                })
            } else {
                return;
            }
        })
}

function displayUv(todayUv) {
    currentUv = $(".uv-index")
    uvIndex = todayUv.current.uvi
    currentUv.text(uvIndex + " UV Index")

    if(uvIndex < 2) {
        currentUv.removeClass("moderate")
        currentUv.removeClass("high")
        currentUv.addClass("favorable")
    } else if (uvIndex < 5) {
        currentUv.removeClass("favorable")
        currentUv.removeClass("high")
        currentUv.addClass("moderate")
    } else {
        currentUv.removeClass("moderate")
        currentUv.removeClass("favorable")
        currentUv.addClass("high")
    }

}


function displayForecast(forecast) {
    x = 1
    nextDay = moment().add(x, "days").format("YYYY-MM-DD")
    limitedForecast = []
    forecastDay = $(".forecast-date")
    forecastImg = $(".forecast-img")
    forecastTemp = $(".forecast-temp")
    forecastWind = $(".forecast-wind")
    forecastHumidity = $(".forecast-humidity")

    for (i = 0; i < forecast.list.length; i++) {
        if (forecast.list[i].dt_txt === nextDay + " 12:00:00") {
            x = x + 1
            limitedForecast.push(forecast.list[i]);
            nextDay = moment().add((x), "days").format("YYYY-MM-DD")
        }
    }

    for (i = 0; i < limitedForecast.length; i++) {
        if (limitedForecast === null) {
            return;
        } else {
            forecastDay[i].innerHTML = limitedForecast[i].dt_txt.substring(5, 10)
            forecastTemp[i].innerHTML = (Math.round(limitedForecast[i].main.temp)) + "°F"
            forecastWind[i].innerHTML = "Wind: " + limitedForecast[i].wind.speed + " MPH"
            forecastHumidity[i].innerHTML = "Humidity: " + limitedForecast[i].main.humidity + "%"
            forecastImg[i].src = "http://openweathermap.org/img/wn/" + limitedForecast[i].weather[0].icon + "@2x.png"
        }
    }
}

function init() {
    $(".weather-info").hide()
    $(".forecast").hide()
    $(".forecast-header").hide()
}

init();

