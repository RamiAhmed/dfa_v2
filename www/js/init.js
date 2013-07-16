/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

// include touch on desktop browsers only
if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
  var script = document.createElement("script");
  script.src = "plugins/af.desktopBrowsers.js";
  var tag = $("head").append(script);
  $.os.android = true; //let's make it run like an android device
  $.os.desktop = true;
};


$.ui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen

function openPDF() {
    var url = 'http://www.danmarksflyttemand.dk/forsikring/documents/Danmarksflyttemandvilk%C3%A5rogbetingelser.pdf',
        googleUrl = 'http://docs.google.com/viewer?url=';
    window.open(
        googleUrl + url,
        '_blank',
        'location=no');
};

function loadPage(page, insertIntoId) {
    var req = new XMLHttpRequest();
    req.open("GET", page, false);
    req.send(null);
    var newPage = req.responseText;
    $(insertIntoId).html(newPage);
};

function initIndexPage() {
    $.ui.toggleHeaderMenu(false);
    $.ui.toggleNavMenu(false);

    $('#index').one('unloadpanel', function() {
        $.ui.toggleHeaderMenu(true);
        $.ui.toggleNavMenu(true);
    });
};

/* BACK BUTTON */
function onExitConfirm(button) {
    if (button == 1) {
        navigator.app.exitApp();
    }
}

function onBackKeyDown() {
    navigator.notification.confirm("Vil du virkeligt forlade Danmarks Flyttemand App?", onExitConfirm, "Exit", "Ja,Nej");
}

function initBackButton() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

/* Google Analytics Page Tracking */
function initGAanalytics() {
    $('#afui .panel').on('loadpanel', function() {
        try {
            page = location.hash.substring(1);
            if (page && page.length > 1) {
            //    console.log("google analytics pageshow url: " + page);
                ga_storage._trackPageview(page);
            } else {
            //    console.log("google analytics pageshow default url");
                ga_storage._trackPageview('/index');
            }
        }
        catch (e) {
            navigator.notification.alert('Google Analytics error: ' + e);
            console.log('error google analytics' + e);
        }
    });
}


/* SWIPING */
function initSwiping() {
    $('#index').one('unloadpanel', function(evt) {

        var getPageId = function(index) {
            var page = '';
            switch (index) {
                case 0: page = 'services'; break;
                case 1: page = 'tilbud'; break;
                case 2: page = 'kontakt'; break;
                case 3: page = 'omos'; break;
            }
            return page;
        };

        var getIndex = function(page) {
            var index = -1;
            switch (page) {
                case 'services': index = 0; break;
                case 'tilbud': index = 1; break;
                case 'kontakt': index = 2; break;
                case 'omos': index = 3; break;
            }
            return index;
        };

        $('#afui').on('swipeLeft', function(evt) {
            var currentPanel = $.ui.activeDiv.id,
                newPanel;
            var currentIndex = getIndex(currentPanel);

            if (currentIndex < 3) {
                newPanel = getPageId(currentIndex+1);
            }
            else {
                newPanel = getPageId(0);
            }

            $.ui.loadContent('#' + newPanel, false, false, 'slide');
        });
        $('#afui').on('swipeRight', function(evt) {
            var currentPanel = $.ui.activeDiv.id,
                newPanel;
            var currentIndex = getIndex(currentPanel);

            if (currentIndex > 0) {
                newPanel = getPageId(currentIndex-1);
            }
            else {
                newPanel = getPageId(3);
            }
            $.ui.loadContent('#' + newPanel, false, true, 'slide');
        });
    });
}

/* AUTO FONT SIZE */
function initAutoFontSize() {
    var windowWidth = window.innerWidth;

    var fontFactor = 0.035;
    var fontSize = windowWidth * fontFactor;
    $('body,html').css("font-size", '' + fontSize + 'px');
}

/* MAPS */
function startMaps() {
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
                var map = mapsCache[this[0].id];
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
                map.setZoom(13);

                return map;
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

                var officeMarker = new google.maps.Marker({
                    position: officePos,
                    map: mapsCache[elem.id],
                    title: 'Danmarks Flyttemand Kontor'
                });

                $(document).one('userPositionAvailable', function(evt, userPos) {
                    addDirections(mapsCache[elem.id], userPos);
                });
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
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

        $().ready(function() {
            $('#googlemap').gmaps({
                zoom: 13,
                center: new google.maps.LatLng(55.689403, 12.521281),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            $('#kontakt').on('loadpanel', function() {
                $('#googlemap').gmaps('resize');
            });


            $('#googledirections').hide();
            $('#googlepanelbutton').hide();

            $('#googlepanelbutton').on('click', function() {
                $('#googledirections').toggle();
            });
        });
    }

}

/* INITIALIZATION */
var fireOnce = false;

//This function will get executed when $.ui.launch has completed
$.ui.ready(function () {
    new FastClick(document.body);

    initIndexPage();
    initAutoFontSize();

    loadPage('tilbudform.html', '#indhenttilbud');
    loadPage('kontaktform.html', '#kontaktform');
    loadPage('prisliste.html', '#kasseprisliste');

    $('#betingelserlink').on('click', function(evt) {
        evt.preventDefault();
        openPDF();
    });

    initBackButton();
    initSwiping();
    initGAanalytics();
    initFormHandler();

    try {
        startMaps();
    }
    catch(e) {
        navigator.notification.alert('google maps error: ' + e);
        console.log(e);
    }

});

$().ready(function() {
    $.ui.useOSThemes = false;
    $.ui.showBackbutton = false;
    $.ui.openLinksNewTab = false;

    window.setTimeout(function () {
        if (!fireOnce)
            $.ui.launch();
        else
            delete fireOnce;
    }, 3000);
});

/* This code is used for native apps */
var onDeviceReady = function () {
    fireOnce = true;
    window.setTimeout(function () {
        $.ui.launch();
    }, 1500);
};
document.addEventListener("deviceready", onDeviceReady, false);
