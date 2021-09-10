var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
var searchEl = $(".searchBtn");
var cityEl = $(".city-name");

searchEl.on("click", function(event) {
    event.preventDefault();
    console.log(cityEl.val());
    
    var city = cityEl.val();
    
    if(city) {
        getApiToday(city);
        getApiForecast(city);
        cityEl.val('');
        
    } else {
        alert("yo you gotta put some text in this mug")
    }
});

function getApiToday (city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=imperial&appid=" + APIkey

    fetch(requestUrl) 
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                  displayCurrent(data);
                  $(".weather-info").show();
                  $(".forecast").show();
                });
            } else {
                alert("Error! City not found!");
            }
        })
};


function getApiForecast (city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial=5&appid=" + APIkey

    fetch(requestUrl)
        .then (function (response) {
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
    var currentUv =$(".uv-index");

    currentCity.text(today.name + " " + moment().format("(ddd, MMMM Do)"));
    currentTemp.text("Current Temp: " + (Math.round(today.main.temp)) + "°F");
    currentWind.text("Current Wind Speed: " + today.wind.speed + "MPH");
    currentHumidity.text("Current Humidity: " + today.main.humidity + "%");
    currentUv.text();
}

function displayForecast(forecast) {
    x = 1
    nextDay = moment().add(x, "days").format("YYYY-MM-DD")
    limitedForecast =  []
    forecastDay = $(".forecast-date") 
    forecastTemp = $(".forecast-temp")
    forecastWind = $(".forecast-wind")
    forecastHumidity = $(".forecast-humidity")


    for (i=0; i<forecast.list.length; i++) {
        if (forecast.list[i].dt_txt === nextDay + " 12:00:00") {
            x = x + 1
            limitedForecast.push(forecast.list[i]);
            nextDay =  moment().add((x), "days").format("YYYY-MM-DD")
        }
    }
    console.log(nextDay)
    console.log(limitedForecast)

    for (i=0; i<limitedForecast.length; i++) {
        if (limitedForecast === null) {
            return;
        } else {
            forecastDay[i].innerHTML = limitedForecast[i].dt_txt.substring(5, 10)
            forecastTemp[i].innerHTML = limitedForecast[i].main.temp
            forecastWind[i].innerHTML = "Wind: " + limitedForecast[i].wind.speed + " MPH"
            forecastHumidity[i].innerHTML = "Humidity: " + limitedForecast[i].main.humidity + "%"
            console.log(limitedForecast[i].wind.speed)
        }
        
    }


}

function init() {
    $(".weather-info").hide()
    $(".forecast").hide()
}

// init();

