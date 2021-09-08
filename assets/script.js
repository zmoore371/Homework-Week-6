var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
var search = $(".searchBtn");
var city = $(".city-name");




search.on("click", function(event) {
    event.preventDefault();
    
    console.log(city);
    console.log('abd');
})

function getApi () {
    var APIkey = "87fda1a82cfddd0be50e7d0dba921aff";
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=" + APIkey
    console.log(requestUrl)
    
    fetch(requestUrl)
        .then(function (response){
            return response.json();
        })


}
