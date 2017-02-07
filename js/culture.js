/* 
 * Gets a address and prefills a lat long value needed
 * 
 * @author Samuel No
 */

/* global type */
var loc = {
    lat: document.getElementById('lat').value,
    lng: document.getElementById('lng').value,
    rad: document.getElementById('rad').value
};
function getCultureData() {

    var loc = {
        lat: document.getElementById('lat').value,
        lng: document.getElementById('lng').value,
        rad: document.getElementById('rad').value
    };
    //variable loc used for testing
    $.ajax({
        url: "https://data.seattle.gov/resource/3c4b-gdxv.json?$$app_token=IZLnwcjjGNvFpmxfooid8p5VI",
        type: "GET",
        data: {
            "$limit": 10000,
            "$where": "within_circle(location, " + loc.lat + ", " + loc.lng + ", " +
                    loc.rad + ")AND(city_feature = 'Heritage Trees' " +
                    "OR city_feature = 'Viewpoints' OR city_feature = 'Museums and Galleries' " +
                    "OR city_feature = 'General Attractions' OR city_feature = 'Waterfront' " +
                    "OR city_feature = 'Libraries')"
        }
    }).done(function (data) {
        parseCityFeatures(data);
        getPublicArtData();
    });
}

function parseCityFeatures(data) {
    var typeMap = {};
    var dataMap = [];
    for (var i = 0; i < data.length; i++) {
        //string of events saved here
        var dat = data[i]["city_feature"];
        //counting the number of times a String appears
        if (dat !== null) {
            if (typeMap[dat]) {
                typeMap[dat]++;
                dataMap.push(data[i]);
            } else {
                typeMap[dat] = 1;
                dataMap.push(data[i]);
            }
        }
    }
    $('#output').append(printCityFeatureCount(typeMap));
    $('#output').append(getData(dataMap));
}

function printCityFeatureCount(typeMap) {
    var content = "";
    for (var type in typeMap) {
        if (type !== 'undefined') {
            content += type + " : " + typeMap[type] + "<br>";
        }
    }
    return content;
}

function getData(typeMap) {
    var content = "<table><tr><th>Name</th><th>Address</th><th>City Feature</th></tr>";
    for (var i = 0; i < typeMap.length; i++) {
        if (typeMap[i] !== null) {
            var name = typeMap[i].common_name == null ? "" : typeMap[i].common_name;
            var address = typeMap[i].address == null ? "" : typeMap[i].address;
            var city_feature = typeMap[i].city_feature == null ? "" : typeMap[i].city_feature;
            //var website = typeMap[i].website == null ? "" : typeMap[i].website;
            content += '<tr><td>' + name + '</td><td>' +
                    address + '</td><td>' +
                    city_feature + '</td></tr>';
            //website + '</td></tr>';
        }
    }
    content += "</table>";
    return content;
}

function getPublicArtData() {
    //variable loc used for testing

    var loc = {
        lat: document.getElementById('lat').value,
        lng: document.getElementById('lng').value,
        rad: document.getElementById('rad').value
    };
    $.ajax({
        url: "https://data.seattle.gov/resource/249z-59hj.json",
        type: "GET",
        data: {
            "$limit": 10000,
            "$where": "within_circle(geolocation, " + loc.lat + ", " + loc.lng + ", " +
                    loc.rad + ")"
        }
    }).done(function (data) {
        parsePublicArtFeatures(data);
    });
}

function parsePublicArtFeatures(data) {
    var typeMap = {};
    var dataMap = [];
    for (var i = 0; i < data.length; i++) {
        //string of events saved here
        var dat = data[i]["classification"];
        //counting the number of times a String appears
        if (dat !== null) {
            if (typeMap[dat]) {
                typeMap[dat]++;
                dataMap.push(data[i]);
            } else {
                typeMap[dat] = 1;
                dataMap.push(data[i]);
            }
        }
    }
    $('#art').append(printArtCount(typeMap));
    $('#art').append(getArtData(dataMap));
}
function printArtCount(typeMap) {
    var content = "";
    for (var type in typeMap) {
        if (type !== 'undefined') {
            content += type + " : " + typeMap[type] + "<br>";
        }
    }
    return content;
}
function getArtData(dataMap) {
    var content = '<table><tr><th>Artist Name</th><th>Title</th><th>Address</th>' +
            '<th>Location</th><th>Description</th></tr>';
    for (var i = 0; i < dataMap.length; i++) {
        if (dataMap[i] !== null) {
            var title = dataMap[i].title == null ? " " : dataMap[i].title;
            var artist_first_name = dataMap[i].artist_first_name == null ? " " : dataMap[i].artist_first_name;
            var artist_last_name = dataMap[i].artist_last_name == null ? " " : dataMap[i].artist_last_name;
            var location = dataMap[i].location == null ? " " : dataMap[i].location;
            var address = dataMap[i].address == null ? " " : dataMap[i].address;
            var description = dataMap[i].description == null ? " " : dataMap[i].description;
            //var website = dataMap[i].website == null ? "" : dataMap[i].website;
            content += '<tr><td>' + artist_first_name + " " + artist_last_name + '</td><td>' +
                    title + '</td><td>' +
                    address + '</td><td>' +
                    location + '</td><td>' +
                    description + '</td></tr>';
            //website + '</td></tr>';
        }
    }
    content += "</table>";
    return content;
}

function geocodeAddress() {
    var address = document.getElementById('address').value;
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAGjI71ShfO3kMt8NouBuHFE_8IJP_CJ3w",
        type: "GET",
        data: {
            "address": address
        },
        success: (function (data) {
            $('#output').empty();
            $('#art').empty();
            if (data.status === "ZERO_RESULTS") {
                $('#output').append("<div>" + "Services are down." + "</div><br>");
                $('#lat')[0].value = "";
                $('#lng')[0].value = "";
            } else {
                $('#lat')[0].value = data.results[0].geometry.location.lat;
                $('#lng')[0].value = data.results[0].geometry.location.lng;
            }
        }),
        error: (function () {
            $('#output').empty();
            $('#output').append("<div>" + "Services are down." + "</div><br>");
        })
    });
}
