var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
var searchEl = $("#search");
var cities = $("#cities");
var cityEl = $(".city-name");
var previousSearches = [];
var renderedButtons = $(".city-info");

searchEl.on("click", function (event) {
    event.preventDefault();
    var city = cityEl.val();

    if (city == "clear") {
        localStorage.clear();
        location.reload();
    }
    else if (city) {
        getApiToday(city);
        getApiForecast(city);
        cityEl.val('');

    } else {
        alert("Text area cannot be blank!")
    }
});

cities.on("click", function (event) {
    if (event.target.matches('.history')) {
        event.preventDefault();
        var searchTerm = event.target.getAttribute('data-city');
        getPastApiToday(searchTerm);
        getApiForecast(searchTerm);
        cityEl.val('');
    }
})

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
                    localStorage.getItem("history");
                    searchText = city.charAt(0).toUpperCase() + city.slice(1);
                    previousSearches.push(searchText);
                    storePrevious(previousSearches);
                });
            } else {
                alert("Error! City not found!");
            }
        })
};

function getPastApiToday(city) {
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
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey;

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
};

function displayCurrent(today) {
    var currentCity = $(".current-city");
    var currentTemp = $(".current-temp");
    var currentWind = $(".current-wind");
    var currentHumidity = $(".current-humidity");
    var currentImg = $('.current-img')

    currentCity.text(today.name + " " + moment().format("(ddd, MMMM Do)"));
    currentTemp.text("Current Temp: " + (Math.round(today.main.temp)) + "°F");
    currentWind.text("Current Wind Speed: " + today.wind.speed + "MPH");
    currentHumidity.text("Current Humidity: " + today.main.humidity + "%");
    currentImg[0].src = "http://openweathermap.org/img/wn/" + today.weather[0].icon + "@2x.png"
};

function getUv(today) {
    lat = today.coord.lat;
    lon = today.coord.lon;
    requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayUv(data);
                })
            } else {
                return;
            }
        })
};

function displayUv(todayUv) {
    currentUv = $(".uv-index");
    uvIndex = todayUv.current.uvi;
    currentUv.text(uvIndex + " UV Index");

    if (uvIndex < 2) {
        currentUv.removeClass("moderate");
        currentUv.removeClass("high");
        currentUv.addClass("favorable");
    } else if (uvIndex < 5) {
        currentUv.removeClass("favorable");
        currentUv.removeClass("high");
        currentUv.addClass("moderate");
    } else {
        currentUv.removeClass("moderate");
        currentUv.removeClass("favorable");
        currentUv.addClass("high");
    }

};

function displayForecast(forecast) {
    x = 1
    nextDay = moment().add(x, "days").format("YYYY-MM-DD");
    limitedForecast = [];
    forecastDay = $(".forecast-date");
    forecastImg = $(".forecast-img");
    forecastTemp = $(".forecast-temp");
    forecastWind = $(".forecast-wind");
    forecastHumidity = $(".forecast-humidity");

    for (i = 0; i < forecast.list.length; i++) {
        if (forecast.list[i].dt_txt === nextDay + " 12:00:00") {
            x = x + 1
            limitedForecast.push(forecast.list[i]);
            nextDay = moment().add((x), "days").format("YYYY-MM-DD");
        }
    }
    // before putting this here if you looked at the weather too early it would not show a 5th day due to the 12:00 forecast being avaliable yet. This check makes sure that the array has 5 inputs to push to screen by appending the last avaliable forecast slot to limitedForecast
    if (limitedForecast.length !== 5) {
        limitedForecast.push(forecast.list[39]);
        console.log(limitedForecast);
    }

    for (i = 0; i < limitedForecast.length; i++) {
        if (limitedForecast === null) {
            return;
        } else {
            forecastDay[i].innerHTML = limitedForecast[i].dt_txt.substring(5, 10);
            forecastTemp[i].innerHTML = (Math.round(limitedForecast[i].main.temp)) + "°F";
            forecastWind[i].innerHTML = "Wind: " + limitedForecast[i].wind.speed + " MPH";
            forecastHumidity[i].innerHTML = "Humidity: " + limitedForecast[i].main.humidity + "%";
            forecastImg[i].src = "https://openweathermap.org/img/wn/" + limitedForecast[i].weather[0].icon + "@2x.png";
        }
    }
};

function renderPrevious() {
    for (var i = 0; i < searches.length; i++) {
        var btn = document.createElement("button");
        btn.textContent = searches[i];
        btn.setAttribute("class", "history");
        btn.setAttribute("data-city", searches[i]);
        cities.append(btn);
    }
};

function storePrevious(previousSearches, searches) {
    localStorage.setItem("history", JSON.stringify(previousSearches))

    if (previousSearches !== null) {
        var btn = document.createElement("button");
        btn.textContent = previousSearches.at(-1);
        btn.setAttribute("class", "history");
        btn.setAttribute("data-city", previousSearches.at(-1));
        cities.append(btn);
    }
};

function init() {
    $(".weather-info").hide();
    $(".forecast").hide();
    $(".forecast-header").hide();

    searches = JSON.parse(localStorage.getItem("history"));
    if (searches === null) {
        return;
    } else {
        previousSearches = searches;
    }
    renderPrevious();
};

init();

