var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
var searchEl = $(".searchBtn");
var cityEl = $(".city-name");




searchEl.on("click", function(event) {
    event.preventDefault();
    console.log(cityEl.val());
    
    var city = cityEl.val()
    
    if(city) {
        getApiToday(city)
        cityEl.val('');
        $(".weather-info").show();
        $(".forecast").show();

    } else {
        alert("yo you gotta put some text in this mug")
    }

    
})

function getApiToday (city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + APIkey
    console.log(requestUrl)
    
    fetch(requestUrl)
        .then(function (response){
            return response.json();
        })
    //Put an if 404 alert thing somewhere in here probably

}

function getApiForecast (city) {
    var requestUrl = "whatever the 5 day forecast api call is" + city + "likely some more crap" + APIkey

    // fetch(requestUrl) then blah blah blah
}

function displayCurrent() {
    var currentCity = $(".current-city");
    var currentTemp = $(".current-temp");
    var currentWind = $(".current-wind");
    var currentHumidity = $(".current-humidity");
    console.log("hey")
    
    currentCity.text("Raleigh")
    currentTemp.text("Current Temp: " + 70)
    currentWind.text("Current Wind Speed: " + 15)
    currentHumidity.text("Current Humidity: " + 60 + "%")


}

function init() {
    $(".weather-info").hide()
    $(".forecast").hide()
}


// init();

displayCurrent();