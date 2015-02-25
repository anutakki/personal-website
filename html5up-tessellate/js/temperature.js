// Author: Wah Loon Keng, Feb 2015

// File for the weather app
$(function() {

    // load body after done loading (html body initially hidden)
    document.getElementsByTagName("body")[0].style.visibility = "visible";

    // Prototype:
    // mode 1:
    // Can I go out?
    // tempC
    // wind: word + number kph
    // condition (word)
    // location

    // mode 2:
    // Can I go out?
    // tempF
    // wind: word + number mph
    // cond (word)
    // location

    // btm button to display more detail, drop down smoothly


    //////////////////////////////
    // Main data, stored as map //
    //////////////////////////////
    // Default data is in metric units
    var data;
    // The 3 variables to determine can-I-go-out
    var season, windiness, tempC, tempF, canI;

    //////////////////////
    // Algorithm start: //
    //////////////////////
    // 1. Get season {4-tuple}
    // 2. get wind {3-tuple}
    //  3.1 if no wind, report no-wind, get temp
    //  3.2 if wind, report crazy or ok, get windchill
    // 4. output(can-I-go-out, wind)
    // 

    // 1. Set the season, indexed 0-3 starting from winter
    var date = new Date();
    var month = date.getMonth() + 1;

    function setSeason() {
        switch (month) {
            case 12:
            case 1:
            case 2:
                season = 0;
                break;
            case 3:
            case 4:
            case 5:
                season = 1;
                break;
            case 6:
            case 7:
            case 8:
                season = 2;
                break;
            case 9:
            case 10:
            case 11:
                season = 3;
                break;
        }
    }

    // 2. Get windspeed
    // The windspeed breakpoints in mph
    // Fix later from default data
    var windBP = {
        calm: 5,
        strong: 20,
        danger: 30
    };
    // retrieve data and set the windiness using breakpoint, note the use of data
    function setWindiness() {
        switch (true) {
            case (data.wind <= windBP.calm):
                windiness = "calm";
                break;
            case windBP.calm < data.wind && data.wind <= windBP.strong:
                windiness = "strong";
                break;
            case windBP.danger < data.wind:
                windiness = "danger";
                break;
            default:
                break;
        }
    }

    // 2.1 Set the temperature breakpoints in C, by season
    // corresponding messages are sandwiched by the breakpoints
    var winterBP, springBP, summerBP, fallBP;
    winterBP = {
        msg1: "STAY. IN.",
        low: -8,
        msg2: "Okay...",
        high: 0,
        msg3: "YASSS! WARMTH!"
    };
    springBP = {
        msg1: "Nope. So cold.",
        low: 5,
        msg2: "Okay, a bit chilly.",
        high: 15,
        msg3: "Oh Yesss!"
    };
    summerBP = {
        msg1: "Yeah, lil chilly.",
        low: 18,
        msg2: "Yes! Go Go Go!",
        high: 26,
        msg3: "Nope. Scorching-hot."
    };
    fallBP = {
        msg1: "Erm, kinda cold",
        low: 11,
        msg2: "Okay, lil chilly",
        high: 16,
        msg3: "Yes, go enjoy."
    };

    // Group all breakpoints into array, indexed from 0
    var seasonArr;
    seasonArr = [winterBP, springBP, summerBP, fallBP];


    // 2.2. Set the status
    var msg1, low, msg2, high, msg3;

    function setStats() {
        msg1 = seasonArr[season].msg1;
        low = seasonArr[season].low;
        msg2 = seasonArr[season].msg2;
        high = seasonArr[season].high;
        msg3 = seasonArr[season].msg3;
    }


    // 3. Set the temperature: if windy, use windchill
    function setTemp() {
        // if no wind, use honest temperature, else use windchill
        if (windiness === "calm") {
            tempC = data.tempC;
            tempF = data.tempF;
        } else {
            tempC = data.windChill;
            tempF = data.windChill;
        }
    }

    // 4. Compute and set the can-I-go-out message
    function setCanI() {
        switch (true) {
            case data.tempC <= low:
                canI = msg1;
                break;
            case low < data.tempC && data.tempC <= high:
                canI = msg2;
                break;
            case high < data.tempC:
                canI = msg3;
                break;
            default:
                break;
        }
    }



    ///////////////////////
    // Display functions //
    ///////////////////////

    // access elements to display
    // The weather summary
    var $summary = $('ul#weatherSummary').children();
    // the flippable part of summary: temp and wind
    var $flippable = $summary.slice(1, 3);

    // The hidden weather details
    var $hiddenDetail = $('ul#hiddenDetail');
    // hide on default
    $hiddenDetail.hide();
    var $detail = $hiddenDetail.children();

    // Helper: write the weather summary to element
    function writeS(i, msg) {
        $summary.eq(i).children().text(msg);
    }

    // Helper: write the weather detail, tho hidden first
    function writeD(i, msg) {
        $detail.eq(i).children().text(msg);
    }

    // Helper: (un)hide the detail by tapping once
    var unhide = false;

    function toggleDetail() {
        unhide = (unhide !== true);
        if (unhide) {
            $hiddenDetail.slideDown(500);
        } else {
            $hiddenDetail.slideUp(500);
        }
    }


    // use metric units by default (false for initialization call)
    var metric = false;
    // Helper: flip the unit between metric and imperial
    function flipUnit() {
        // flip by XOR
        metric = (metric !== true);

        // animation
        var time = 500;
        $flippable.fadeTo(0, 0);

        // write the temperature and wind in unit of choice
        if (metric) {
            // set the summary
            writeS(1, data.tempC + ' °C');
            // writeS(2, windiness);
            writeS(2, Math.floor(1.61 * data.wind) + ' km/h ' + windiness);
            // set the detail
            writeD(0, 'range ' + data.lowC + ' ~ ' + data.highC + ' °C');
            writeD(3, data.tmrlowC + ' ~ ' + data.tmrhighC + ' °C');
        } else {
            writeS(1, data.tempF + ' °F');
            writeS(2, data.wind + ' mph ' + windiness);
            writeD(0, 'range ' + data.lowF + ' ~ ' + data.highF + ' °F');
            writeD(3, data.tmrlowF + ' ~ ' + data.tmrhighF + ' °F');
        }

        $flippable.fadeTo(time, 1);
    }

    // write everything to html by calling the helper methods
    function writeAll() {
        // Set the summary
        // writeS(0, canI);
        // writeS(1, temp + ' °' + unit);
        // writeS(2, data.wind + ' ' + data.speed);
        writeS(3, data.currently);
        writeS(4, data.city + ' ' + data.region);

        // set the detail
        // writeD(0, 'range today: ');
        writeD(1, 'sunset ' + data.sunset);
        // writeD(3, 'range tomorrow: ');
        writeD(4, data.tmrtext);

        // and set the changing parts
        flipUnit();
    }




    // Primary method: Write the Can-I-go-out separately as failsafe for function-chaining
    function getCanI() {
        // run all functions to get CanI message
        setSeason();
        setWindiness();
        setTemp();
        setStats();
        setCanI();

        // show the canI message
        writeS(0, canI);
    }



    // Primary method: set the display and add eventlisteners for animation
    function setDisplay() {
        // reset, and call
        metric = false;
        getCanI();
        writeAll();

        // addEventListener, whenever clicked, switch unit, 
        $('div#summaryBox').on('click', flipUnit);
        // or click for detail dropdown
        $('#detailBox').on('click', toggleDetail);
    }




    // Primary method to load weather from simpleWeather.js
    function loadWeather(location) {
        $.simpleWeather({
            location: location,
            unit: 'f',
            success: function(weather) {
                // save as key-value map
                data = {
                    tempF: weather.temp,
                    lowF: weather.low,
                    highF: weather.high,
                    tempC: weather.alt.temp,
                    lowC: weather.alt.low,
                    highC: weather.alt.high,

                    wind: weather.wind.speed,
                    windChill: weather.wind.chill,
                    currently: weather.currently,
                    city: weather.city,
                    region: weather.region,
                    sunset: weather.sunset,

                    tmrtext: weather.forecast[1].text,
                    tmrlowF: weather.forecast[1].low,
                    tmrhighF: weather.forecast[1].high,
                    tmrlowC: weather.forecast[1].alt.low,
                    tmrhighC: weather.forecast[1].alt.high

                };

                // Reset, display the app once data loaded
                setDisplay();

            },
            // error handling
            error: function(error) {
                $('#weather').html('<p>' + error + '</p>');
            }
        });

    }


    //////////////////////////
    // Actual Function Call //
    //////////////////////////
    // saved coordinate to refresh-call
    var coor;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // save the coor
            coor = position.coords.latitude + ',' + position.coords.longitude;
            // load the weather
            loadWeather(coor);
        });
        // if doesn't support geolocation
    } else {
        writeS(0, ":( Your browser doesn't support geolocation");
    }

    // autorefresh per interval
    setInterval(function() {
        loadWeather(coor);
    }, 300000);



});
