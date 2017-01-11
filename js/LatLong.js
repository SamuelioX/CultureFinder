/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global type */

$(function () {
    $('#json').click(function (e) {
        e.preventDefault();
        json();
    });

    function json() {

        var latit = (document.getElementById('lat').value);
        var longit = (document.getElementById('lng').value);
        var limit = 0;
//        var limit = document.getElementById('limit').value;
        var radius = document.getElementById('rad').value;
//        radius = parseInt(document.getElementById('rad').value) * 1609;
        if (latit === null || latit === "" || longit === null || longit === "" ||
                radius === null || radius === "" || limit === null || limit === "") {
            alert("The form must be filled");
            return false;
        } else {
            $.ajax({
                url: "https://data.seattle.gov/resource/3c4b-gdxv.json?$$app_token=IZLnwcjjGNvFpmxfooid8p5VI",
                type: "GET",
                data: {
                    "$limit": 10000
////                "$where": "longitude=-122.282103194"
//                    "$where": "within_circle(location, " + latit + ", " + longit + ", " +
//                            1000 + ")"
                }
            }).done(function (data) {
//            for(var i = 0; i < data.length; i++){
//                $('#output').append(data[i]["city_feature"] + "<br>");
                var typeMap = [];

//                var evtclrMap = {};
                for (var i = 0; i < data.length; i++) {
                    //string of events saved here
                    var dat = data[i];
                    typeMap.push(data[i]);
//                    var dat = data[i]["city_feature"];
//                    
//                    counting the amount of times a string occurs
//                    if (dat !== null) {
//                        if (typeMap[dat]) {
//                            typeMap[dat]++;
//                        } else {
//                            typeMap[dat] = 1;
//                        }
//                    }
                }
                //print contents of hashmap string and count recorded
                $('#output').append("<div>INITIAL TYPE GROUP</div><br>");
//                for (var type in typeMap) {
//                    var p = type;
//                    if (type !== 'undefined') {
////                        $('#output').append("<div>" + type + " : " + typeMap[type] + "</div><br>");
//                        $('#output').append("<div>" + type + "</div><br>");
//                    }
//
//                }
                for(var i = 0; i < typeMap.length; i++){
                    if(typeMap[i] !== 'undefined'){
                        $('#output').append("<div>" + typeMap[i].address + "</div><br>");
                    }
                }
//            });
            });
        }
    }
});
