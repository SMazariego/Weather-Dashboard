var searchCityButtonEl = document.querySelector("#searchCityButton");
var clearCityButtonEl = document.querySelector("#clearCityHistory");
var searchHistoryEl = document.querySelector("#searchHistory");
var historyButtonFormEl = document.querySelector("#history-button-form");
var searchHistoryButtonEl = document.createElement("button");
var todayDate = moment().format("MM/DD/YYYY");  

var searchHistoryArr = [ ];


var getCity = function(searchCity) {
    
    
    var searchCity = document.getElementById("searchCity").value;
    var searchCityUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchCity + "&appid=a07ac075789236bfb1d3198c9032e6b2";
    
    fetch(searchCityUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        
        console.log(data);

        var loc = data[0].name;
        var lat = data[0].lat;
        var lon = data[0].lon;
            
        getWeather(loc, lat, lon);

    });
    
}



var buttonHandler = function(event) {
    event.preventDefault();

    selectedButton = event.target.dataset.city;
    
    document.getElementById("searchCity").value = selectedButton;
    getCity(selectedButton);

}



var getWeather = function(loc, lat, lon) {

    var searchCity = document.getElementById("searchCity").value;
    
    saveHistory(searchCity);


   
    var todayEl = document.querySelector("#today");
    var todayWeatherEl = document.createElement("span");
    var tempEl = document.querySelector("#temp")
    var windEl = document.querySelector("#wind")
    var humidityEl = document.querySelector("#humidity")
    var uviEl = document.querySelector("#uvi")
    var conditionsEl = document.querySelector("#conditions")

    
    
    var dailyHeadingEl = document.createElement("div");
    var dailyWeatherEl = document.createElement("div");  

    
    var cityNameEl = document.createElement("h1");

    todayEl.textContent = "";

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&appid=a07ac075789236bfb1d3198c9032e6b2&units=imperial";

    fetch(weatherUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function(data) {
        console.log(data);

            cityNameEl.innerHTML = loc + " (" + todayDate + ") " + "<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png' />";
            
            

            tempEl.innerHTML = "Temp: " + data.current.temp + "°";
            windEl.innerHTML = "Wind: " + data.current.wind_speed + "mph";
            humidityEl.innerHTML = "Humidity: " + data.current.humidity + "%";
            uviEl.innerHTML = "UV Index: " + "<span>" + data.current.uvi + "</span>";
            uviEl.className = "uvi";
            conditionsEl.innerHTML = data.current.weather[0].description;

            if (data.current.uvi < 3) {
                uviEl.className = "low";
            } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
                uviEl.className = "medium";
            } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
                uviEl.className = "high";
            } else if (data.current.uvi >= 8 && data.current.uvi < 11) {
                uviEl.className = "very-high";
            } else if (data.current.uvi > 11) {
                uviEl.className = "extreme";
            }

            

           
            todayEl.appendChild(cityNameEl);
            todayEl.appendChild(tempEl);
            todayEl.appendChild(windEl);
            todayEl.appendChild(humidityEl);
            todayEl.appendChild(uviEl);
            todayEl.appendChild(conditionsEl);
           

            for (var i=0; i < 5; i++) {
                
                forecastDate = moment(todayDate,"MM/DD/YYYY").add((i+1), "days");
                forecastDate = moment(forecastDate).format("MM/DD/YYYY");

                dailyHeadingEl.innerHTML = "<h4>" + forecastDate + "</h4>";

                dailyWeatherEl.innerHTML = "<img src='https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png' />" + 
                "<br />" + "Temp: " + data.daily[i].temp.day + "°" + 
                "<br />" + "Wind: " + data.daily[i].wind_speed + "mph" + 
                "<br />" + "Humidity: " + data.daily[i].humidity + "%" + 
                "<br />" + "UV Index: " + data.daily[i].uvi + 
                "<br />" + data.daily[i].weather[0].description;

                var weatherDay = (i+1);
                displayData(weatherDay,dailyHeadingEl,dailyWeatherEl);

            }
    });

}



var displayData = function(weatherDay, dailyHeadingEl, dailyWeatherEl) {
    
    var dayOneEl = document.querySelector("#dayOne");
    var dayTwoEl = document.querySelector("#dayTwo");
    var dayThreeEl = document.querySelector("#dayThree");
    var dayFourEl = document.querySelector("#dayFour");
    var dayFiveEl = document.querySelector("#dayFive");  
    
    switch(weatherDay) {

        case 1:
            dayOneEl.innerHTML = dailyHeadingEl.innerHTML + "<br />" + dailyWeatherEl.innerHTML;
            break;
        
        case 2:
            dayTwoEl.innerHTML = dailyHeadingEl.innerHTML + "<br />" + dailyWeatherEl.innerHTML;
            break;

        case 3:
            dayThreeEl.innerHTML = dailyHeadingEl.innerHTML + "<br />" + dailyWeatherEl.innerHTML;
            break;

        case 4:
            dayFourEl.innerHTML = dailyHeadingEl.innerHTML + "<br />" + dailyWeatherEl.innerHTML;
            break;

        case 5:
            dayFiveEl.innerHTML = dailyHeadingEl.innerHTML + "<br />" + dailyWeatherEl.innerHTML;
            break;
    }

}



var createButton = function(searchCity) {

    searchHistoryButtonEl = document.createElement("button");
    searchHistoryButtonEl.innerHTML = searchCity;
    searchHistoryButtonEl.setAttribute("data-city",searchCity);
    searchHistoryButtonEl.className = "btn btnSearchHistory";
    searchHistoryEl.appendChild(searchHistoryButtonEl);

}



var saveHistory = function(searchCity) {
    
    var existingHistory = JSON.parse(localStorage.getItem("cities"));
  
    if (existingHistory) {

        searchHistoryArr = existingHistory;
        var isExist = searchHistoryArr.includes(searchCity);
    } 

    if (!isExist) {
        searchHistoryArr.push(searchCity);
        console.log("Search History Array: " + searchHistoryArr);
        localStorage.setItem("cities", JSON.stringify(searchHistoryArr));
        createButton(searchCity);
    }
    
}



var loadHistory = function() {
    
    var existingHistory = JSON.parse(localStorage.getItem("cities"));

    if (existingHistory) {
        for (var i=0; i < existingHistory.length; i++) {
            createButton(existingHistory[i]);
        }
    } else {
        
    }

}



var clearCityHistory = function() {

    var existingHistory = JSON.parse(localStorage.getItem("cities"));

    if (existingHistory) {
        existingHistory = [];
        localStorage.setItem("cities", JSON.stringify(existingHistory));
        location.reload();
    }

}



loadHistory();
searchCityButtonEl.addEventListener("click", getCity);
clearCityButtonEl.addEventListener("click", clearCityHistory);
historyButtonFormEl.addEventListener("click", buttonHandler);