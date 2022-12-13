var ApiKey = '732ea70045d06aae0e6f25cba0125d13';
var CallUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=732ea70045d06aae0e6f25cba0125d13'
var CoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var pillar2El = $('.pillar2');
var enduserFormEL = $('#city-search');
var fiveDayEl = $('#five-day');
var cityInsertEl = $('#city');
var presentDay = moment().format('M/DD/YYYY');
var searchingHistoryEl = $('#search-history');
const weatherUrl = 'http://openweathermap.org/img/wn/';
var searchingHistoryArray = loadSearchHistory();

// Capitalize the 1st letter of the string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {


// Assigned to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

//Load metrapolis from local storage and redevelop history buttons
function loadSearchHistory() {
    var searchingHistoryArray = JSON.parse(localStorage.getItem('search history'));

 // Develop new element to seek all end-user information
    if (!searchingHistoryArray) {
        searchingHistoryArray = {
            searchedCity: [],
        };
    } else {

        //insert search history buttons to pages
        for (var i = 0; i < searchingHistoryArray.searchedCity.length; i++) {
            searchHistory(searchingHistoryArray.searchedCity[i]);
        }
    }

    return searchingHistoryArray;
}

//Save to local storage
function saveSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchingHistoryArray));
};

//Develop history buttons
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

// Append button to search history div
    searchingHistoryEl.append(searchHistoryButton);
}

//Function to get weather data from apiUrl
function acquireWeather(city) {

// ApiUrl for corrolate
    var apiCoordinatesUrl = CoordinatesUrl + city + '&appid=' + ApiKey;
// Fetch the corrolation parameter for metrapolis
    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
    if (coordinateResponse.ok) {
     coordinateResponse.json().then(function (data) {
     var latitudeCity = data.coord.lat;
     var longitudeCity = data.coord.lon;
// Retrieve weather information
     var OneCallUrlAPI = CallUrl + latitudeCity + '&lon=' + longitudeCity + '&appid=' + ApiKey + '&units=imperial';

     fetch(OneCallUrlAPI)
     .then(function (weatherResponse) {
     if (weatherResponse.ok) {
     weatherResponse.json().then(function (weatherData) {


//Add div to detain present day feauture
    var currentWeatherEl = $('<div>')
    .attr({
    id: 'present-weather'
                 })

 // Retrieve the weather icon from metrapolies
    var weatherIcon = weatherData.current.weather[0].icon;
    var cityCurrentWeatherIcon = weatherUrl + weatherIcon + '.png';

    // Develop h2 to illustrate metrapolies + present day + present  weather icon
    var currentWeatherHeadingEl = $('<h2>')
    .text(city + ' (' + presentDay + ')');
    // Develop img dimension to illustrate icon
    var iconImgEl = $('<img>')
    .attr({
    id: 'present-weather-icon',
    src: cityCurrentWeatherIcon,
    alt: 'Weather Icon'
    })
    //Develop list of present weather feature
     var currWeatherListEl = $('<ul>')
     var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
     for (var i = 0; i < currWeatherDetails.length; i++) {
        
     //Develop an indiviual list of items and append to ul
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
     //Develop every list item that is not uvIndex
     } else {
     var currWeatherListItem = $('<li>')
     .text(currWeatherDetails[i])
     //append to ul
     currWeatherListEl.append(currWeatherListItem);
     }

        }

        //append present weather div to col2 before #five-day
         $('#five-day').before(currentWeatherEl);
        //append present weather heading to current weather div
        currentWeatherEl.append(currentWeatherHeadingEl);
        //append icon to present weather header
        currentWeatherHeadingEl.append(iconImgEl);
        //append ul to present weather
        currentWeatherEl.append(currWeatherListEl);

     

        //Present h2 header for five day forecast
        var fiveDayHeaderEl = $('<h2>')
        .text('5-Day Forecast:')
        .attr({
        id: 'five-day-header'
        })

//Append five day forecast header to col2 after present weather div
    $('#present-weather').after(fiveDayHeaderEl)

// Present array for the dates for the next 5 days

    var fiveDayArray = [];

    for (var i = 0; i < 5; i++) {
    let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');
    fiveDayArray.push(forecastDate);
    }

// for each date in the array develop a card illustrating temperature, wind and humidity
 for (var i = 0; i < fiveDayArray.length; i++) {
 // Develop a div for each card
 var cardDivEl = $('<div>')
.addClass('col3');
// Develop div for the card body
var cardFigureDivEl = $('<div>')
.addClass('card-body');
// Develop the card-title
var cardTitleEl = $('<h3>')
.addClass('card-title')
.text(fiveDayArray[i]);

// Develop the icon for present day weather
var forecastIcon = weatherData.daily[i].weather[0].icon;

var forecastIconEl = $('<img>')
.attr({
src: weatherUrl + forecastIcon + '.png',
alt: 'Weather Icon'
});

// Develop card text illustrating weather features
var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
 //Develop temperature
var tempEL = $('<p>')
.addClass('card-text')
.text('Temp: ' + weatherData.daily[i].temp.max)
//Develop wind
var windEL = $('<p>')
.addClass('card-text')
.text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')
// Develop humidity
var humidityEL = $('<p>')
.addClass('card-text')
.text('Humidity: ' + weatherData.daily[i].humidity + '%')


//append cardDivEl, cardfigure, card title, icon, temperature,wind, humidity  to the #five-day container
fiveDayEl.append(cardDivEl);

cardDivEl.append(cardFigureDivEl);

cardFigureDivEl.append(cardTitleEl);

cardFigureDivEl.append(forecastIconEl);

cardFigureDivEl.append(tempEL);

cardFigureDivEl.append(windEL);

cardFigureDivEl.append(humidityEL);
}


})
}
                        })
                });
                // if Open Weather cannot get features for metrapolis
            } else {
                alert('Error: Open Weather could not find city')
            }
        })
        // if fetch stop
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
}

//function to push button features to 

function submitCitySearch(event) {
    event.preventDefault();

    //Retrieve element from end user feedback
    var city = titleCase(cityInsertEl.val().trim());

    //Stop from looking for metrapolis stored in local storage
    if (searchingHistoryArray.searchedCity.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.');
        cityInsertEl.val('');
    } else if (city) {
        acquireWeather(city);
        searchHistory(city);
        searchingHistoryArray.searchedCity.push(city);
        saveSearchHistory();
        //Desolate the configuration from content region
        cityInsertEl.val('');

        //if end-user does not write in a metrapolis
    } else {
        alert('Please enter a city');
    }
}

// on submitting of end-user information get end-user feedback for metrapolies and retrieve api data
enduserFormEL.on('submit', submitCitySearch);

// on selecting the search button - desolate the present weather and five-day forecast information
$('#search-button').on('click', function () {
    $('#present-weather').remove();
    $('#five-day').empty();
    $('#five-day-header').remove();
})