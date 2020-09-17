var cities = ["Memphis", "Nashville", "Atlanta", "Little Rock"];
var apiKey = "b582a08f431d0675ea31853845578153";
var lat = "latitude";
var lon = "longitude";
var uvIndex = (lat + lon)

cities.forEach(function (city, index, originalArr) {
  renderButtons(city);

  if (index === originalArr.length - 1) {
    displayWeatherInfo(city);
  }
})

function displayWeatherInfo(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;



  $.get(queryURL).then(function (response) {
    var lon = response.coord.lon;
    var lat = response.coord.lat;
    var queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.get(queryUV)
      .then(function (uvResponse) {
        console.log(uvResponse)
        //=====  Calculations of Temp, Windspeed=======
        var temperature = response.main.temp;
        var windSpeed = response.wind.speed;
        var humidity = response.main.humidity;
        var cityDiv = $("<div class='city'>");
        var header = $("<h4>").text(city);
        var pOne = $("<p>").text("Temperature: " + temperature + String.fromCharCode(176) + "F");
        var pTwo = $("<p>").text("Wind Speed: " + windSpeed + "mph");
        var pThree = $("<p>").text("Humidity: " + humidity + "%");

        var color = "green";
        var UVindex = uvResponse.value;
        if (UVindex > 10) {
          color = "red";
        }
        else if (UVindex > 4) {
          color = "orange";
        };


        var uvSpan = $("<span>").text(uvResponse.value).css("color", color)
        var pFour = $("<p>").text("UV Index: ").append(uvSpan);
        cityDiv.append(header, pOne, pTwo, pThree, pFour);

        // =======Weather View =====

        $("#weather-view").empty();
        $("#weather-view").prepend(cityDiv);
      })


  })

}

function renderButtons(city) {
  var btn = $("<button>");
  btn.addClass("city-btn btn btn-default").css("display", "block");
  btn.attr("data-name", city);
  btn.text(city);
  $(".cities-array").append(btn);
}

$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  // ====== City Weather ======
  var $weather = $("#city-input").val();

  // ===== Update Search History =====
  cities.push($weather);
  localStorage.setItem("weather", JSON.stringify(cities))

  // == Weather ==
  renderButtons($weather);
  displayWeatherInfo($weather)
});

$(document).on("click", ".city-btn", function () {
  var city = $(this).attr("data-name");
  displayWeatherInfo(city);
});