
// @author Ian Maffett
// @copyright App Framework 2012
// Modified by Rami@alphastagestudios.com - 2013

/**
 * af.maps.js - google maps plugin wrapper for App Framework apps.  You can pass in configuration options that are from the Google Maps API
   ```
   $("#map").gmaps({zoom: 8,center: new google.maps.LatLng(40.010787, -76.278076),mapTypeId: google.maps.MapTypeId.ROADMAP});   // create the map with basic options
   $("#map").gmaps() //return the google maps object back from cache
   ```
   *@param {Object} [options]
   *@title $().gmaps([options]);
   */
(function () {
    var gmapsLoaded = false; //internal variable to see if the google maps API is available

    //We run this on document ready.  It will trigger a gmaps:available event if it's ready
    // or it will include the google maps script for you
    $().ready(function () {
        if(window['google']&&google.maps){
            $(document).trigger("gmaps:available");
            gmapsLoaded = true;
            return true;
        }
        var gmaps = document.createElement("script");
        gmaps.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=gmapsPluginLoaded";
        $("head").append(gmaps);
        window['gmapsPluginLoaded'] = function () {
            $(document).trigger("gmaps:available");
            gmapsLoaded = true;
        }
    });

    //Local cache of the google maps objects
    var mapsCache = {};

    //We can invoke this in two ways
    //If we pass in positions, we create the google maps object
    //If we do not pass in options, it returns the object
    // so we can act upon it.

    $.fn.gmaps = function (opts, userPos) {
        if (this.length == 0) return;
        if (!opts) return mapsCache[this[0].id];
        //Special resize event
        if(opts=="resize"&&mapsCache[this[0].id])
        {
            var map = mapsCache[this[0].id];
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
            map.setZoom(13);

            return map;
        }

        //loop through the items and create the new gmaps object
        for (var i = 0; i < this.length; i++) {
            new gmaps(this[i], opts, userPos);
        }
    };


    //This is a local object that gets created from the above.
    var gmaps = function (elem, opts, userPos) {
        var createMap = function () {
            var officePos = new google.maps.LatLng(55.689403, 12.521281);
            if (!opts || Object.keys(opts).length == 0) {
                opts = {
                    zoom: 13,
                    center: officePos,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            }
            mapsCache[elem.id] = new google.maps.Map(elem, opts);

            var officeMarker = new google.maps.Marker({
                position: officePos,
                map: mapsCache[elem.id],
                title: 'Danmarks Flyttemand Kontor'
            });

            if (userPos != null) {
                addDirections(mapsCache[elem.id], userPos);
            }
        }

        var addDirections = function(gmap, userPos) {
            var officePos = new google.maps.LatLng(55.689403, 12.521281);
            var userMarker = new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "green",
                    scale: 5
                },
                position: userPos,
                map: gmap,
                title: 'Din placering'
            });

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
            directionsDisplay.setMap(gmap);
            directionsDisplay.setPanel(document.getElementById('googledirections'));

            var request = {
                origin: userPos,
                destination: officePos,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }

        //If we try to create a map before it is available
        //listen to the event
        if (!gmapsLoaded) {
            $(document).one("gmaps:available", function () {
                createMap();
            });
        } else {
            createMap();
        }
    }
})(af);
