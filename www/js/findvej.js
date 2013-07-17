/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

// @author Ian Maffett
// @copyright App Framework 2012
// Modified by Rami@alphastagestudios.com - 2013

(function () {
    var gmapsLoaded = false; //internal variable to see if the google maps API is available

    //We run this on document ready.  It will trigger a gmaps:available event if it's ready
    // or it will include the google maps script for you
    $(document).ready(function () {
        if(window["google"]&&google.maps){
            $(document).trigger("gmaps:available");
            gmapsLoaded = true;
            return true;
        }
        var gmaps = document.createElement("script");
        gmaps.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=gmapsPluginLoaded";
        $("head").append(gmaps);
        window["gmapsPluginLoaded"] = function () {
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

    $.fn.gmaps = function (opts) {
        if (this.length == 0) return;
        if (!opts) return mapsCache[this[0].id];
        //Special resize event
        if(opts=="resize"&&mapsCache[this[0].id])
        {
           return google.maps.event.trigger(mapsCache[this[0].id], "resize");
        }

        //loop through the items and create the new gmaps object
        for (var i = 0; i < this.length; i++) {
            new gmaps(this[i], opts);
        }
    };


    //This is a local object that gets created from the above.
    var gmaps = function (elem, opts) {
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
            google.maps.event.trigger(mapsCache[elem.id], 'resize');
        }

        //If we try to create a map before it is available
        //listen to the event
        if (!gmapsLoaded) {
            $(document).one("gmaps:available", function () {
                createMap()
            });
        } else {
            createMap();
        }
    }
})(af);

function onGeoSuccess(position) {
    var userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    $(document).trigger('userPositionAvailable', userPos);
    $('#googlepanelbutton').show();
}

function onGeoError(error) {
    navigator.notification.alert('Kan ikke finde placering. Fejl besked: ' + error.message);

    $('#googledirections').remove();
    $('#googlepanelbutton').remove();
}

function initMaps() {
    //navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(55.689403, 12.521281),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $('#googlemap').gmaps(mapOptions);

    $('#kontakt').on('loadpanel', function() {
        $('#googlemap').gmaps('resize');
    });

    $('#googledirections').hide();
    $('#googlepanelbutton').hide();
/*
    $('#googlepanelbutton').on('click', function() {
        $('#googledirections').toggle();
    });
*/
};
