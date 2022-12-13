var ApiKey = '26ba3a7e283acb9cd1e8665c6c3b319a';
var CallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='
var CoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var pillar2El = $('.pillar2');
var enduserFormEL = $('#city-search');
var fiveDayEl = $('#five-day');
var cityInsertEl = $('#city');
var presentDay = moment().format('M/DD/YYYY');
var searchingHistoryEl = $('#search-history');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
var searchingHistoryArray = loadSearchHistory();

// END GLOBAL VARIABLES //

// Define function to capitalize the first letter of a string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

//load cities from local storage and recreate history buttons
function loadSearchHistory() {
    var searchingHistoryArray = JSON.parse(localStorage.getItem('search history'));

    // if nothing in localStorage, create a new object to track all user info
    if (!searchingHistoryArray) {
        searchingHistoryArray = {
            searchedCity: [],
        };
    } else {
        //add search history buttons to page
        for (var i = 0; i < searchingHistoryArray.searchedCity.length; i++) {
            searchHistory(searchingHistoryArray.searchedCity[i]);
        }
    }

    return searchingHistoryArray;
}

//save to local storage
function saveSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchingHistoryArray));
};

//funciton to create history buttons
function searchHistory(city) {
    var searchHistoryButton = $('<button>')
        .addClass('button')
        .text(city)
        .on('click', function () {
            $('#present-weather').remove();
            $('#five-day').empty();
            $('#five-day-header').remove();
            acquireWeather(city);
        })
        .attr({
            type: 'button'
        });

    // append button to search history div
    searchingHistoryEl.append(searchHistoryButton);
}

//function to get weather data from apiUrl
function acquireWeather(city) {
    // apiUrl for coordinates
    var apiCoordinatesUrl = CoordinatesUrl + city + '&appid=' + ApiKey;
    // fetch the coordinates for parameter city
    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
    if (coordinateResponse.ok) {
     coordinateResponse.json().then(function (data) {
     var latitudeCity = data.coord.lat;
     var longitudeCity = data.coord.lon;
     // fetch weather information
     var OneCallUrlAPI = CallUrl + latitudeCity + '&lon=' + longitudeCity + '&appid=' + ApiKey + '&units=imperial';

     fetch(OneCallUrlAPI)
     .then(function (weatherResponse) {
     if (weatherResponse.ok) {
     weatherResponse.json().then(function (weatherData) {

    // ** START CURRENT DAY DISPLAY ** //

    //add div to hold current day details
    var currentWeatherEl = $('<div>')
    .attr({
    id: 'present-weather'
                 })

    // get the weather icon from city
    var weatherIcon = weatherData.current.weather[0].icon;
    var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

    // create h2 to display city + current day + current weather icon
    var currentWeatherHeadingEl = $('<h2>')
    .text(city + ' (' + presentDay + ')');
    // create img element to display icon
    var iconImgEl = $('<img>')
    .attr({
    id: 'present-weather-icon',
    src: cityCurrentWeatherIcon,
    alt: 'Weather Icon'
    })
    //create list of current weather details
     var currWeatherListEl = $('<ul>')
     var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
     for (var i = 0; i < currWeatherDetails.length; i++) {
        
     //create an indiviual list item and append to ul
     // run conditional to assign background color to UV index depending how high it is
     if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {
     var currWeatherListItem = $('<li>')
     .text('UV Index: ')
     currWeatherListEl.append(currWeatherListItem);
     var uviItem = $('<span>')
     .text(weatherData.current.uvi);
     if (uviItem.text() <= 2) {
     uviItem.addClass('approving');
     } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
     uviItem.addClass('modest');
     } else {
     uviItem.addClass('extreme');
     }
     currWeatherListItem.append(uviItem);
     //create every list item that isn't uvIndex
     } else {
     var currWeatherListItem = $('<li>')
     .text(currWeatherDetails[i])
     //append to ul
     currWeatherListEl.append(currWeatherListItem);
     }

        }

        //append curr weather div to col2 before #five-day
         $('#five-day').before(currentWeatherEl);
        //append current weather heading to current weather div
        currentWeatherEl.append(currentWeatherHeadingEl);
        //append icon to current weather header
        currentWeatherHeadingEl.append(iconImgEl);
        //append ul to current weather
        currentWeatherEl.append(currWeatherListEl);

        // ** END CURRENT DAY DISPLAY ** //

        // ** START 5-DAY FORECAST DISPLAY ** //

        //create h2 header for 5-day forecast
        var fiveDayHeaderEl = $('<h2>')
        .text('5-Day Forecast:')
        .attr({
        id: 'five-day-header'
        })

    //append 5 day forecast header to col2 after current weather div
    $('#present-weather').after(fiveDayHeaderEl)

     // create array for the dates for the next 5 days

    var fiveDayArray = [];

    for (var i = 0; i < 5; i++) {
    let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');
    fiveDayArray.push(forecastDate);
    }

// for each date in the array create a card displaying temp, wind and humidity
 for (var i = 0; i < fiveDayArray.length; i++) {
 // create a div for each card
 var cardDivEl = $('<div>')
.addClass('col3');
// create div for the card body
var cardFigureDivEl = $('<div>')
.addClass('card-body');
// create the card-title
var cardTitleEl = $('<h3>')
.addClass('card-title')
.text(fiveDayArray[i]);

// create the icon for current day weather
var forecastIcon = weatherData.daily[i].weather[0].icon;

var forecastIconEl = $('<img>')
.attr({
src: weatherIconUrl + forecastIcon + '.png',
alt: 'Weather Icon'
});

// create card text displaying weather details
var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
 //create temp
var tempEL = $('<p>')
.addClass('card-text')
.text('Temp: ' + weatherData.daily[i].temp.max)
//create wind
var windEL = $('<p>')
.addClass('card-text')
.text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')
// create humidity
var humidityEL = $('<p>')
.addClass('card-text')
.text('Humidity: ' + weatherData.daily[i].humidity + '%')


//append cardDivEl to the #five-day container
fiveDayEl.append(cardDivEl);
//append cardFigureDivEL to cardDivEl
cardDivEl.append(cardFigureDivEl);
//append card title to card body
cardFigureDivEl.append(cardTitleEl);
//append icon to card body
cardFigureDivEl.append(forecastIconEl);
//append temp details to card body
cardFigureDivEl.append(tempEL);
//append wind details to card body
cardFigureDivEl.append(windEL);
//append humidity details to card body
cardFigureDivEl.append(humidityEL);
}

// ** END 5-DAY FORECAST DISPLAY ** //
})
}
                        })
                });
                // if fetch goes through but Open Weather can't find details for city
            } else {
                alert('Error: Open Weather could not find city')
            }
        })
        // if fetch fails
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
}

//function to push button elements to 

function submitCitySearch(event) {
    event.preventDefault();

    //get value from user input
    var city = titleCase(cityInsertEl.val().trim());

    //prevent them from searching for cities stored in local storage
    if (searchingHistoryArray.searchedCity.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.');
        cityInsertEl.val('');
    } else if (city) {
        acquireWeather(city);
        searchHistory(city);
        searchingHistoryArray.searchedCity.push(city);
        saveSearchHistory();
        //empty the form text area
        cityInsertEl.val('');

        //if user doesn't type in a city
    } else {
        alert('Please enter a city');
    }
}

// on submission of user data get user input for city and fetch api data
enduserFormEL.on('submit', submitCitySearch);

// on click of search button - empty the current weather and 5-day forecast info
$('#search-button').on('click', function () {
    $('#present-weather').remove();
    $('#five-day').empty();
    $('#five-day-header').remove();
})