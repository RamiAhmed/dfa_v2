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

$().ready(function() {
    $.ui.useOSThemes=false;
    $.ui.blockPageScroll();
    $.ui.showBackbutton=false;
    $.ui.openLinksNewTab = false;

    window.setTimeout(function () {
        if (!fireOnce)
            $.ui.launch();
        else
            delete fireOnce;
    }, 1000);
});

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
    var page = req.responseText;
    $(insertIntoId).html(page);
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
        exitGAAnalytics();
        navigator.app.exitApp();
    }
}

function onBackKeyDown() {
    navigator.notification.confirm("Vil du virkeligt forlade Danmarks Flyttemand App?", onExitConfirm, "Forlad App", "Ja,Nej");
}

function initBackButton() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

/* Google Analytics Page Tracking */

function initGAanalytics() {
    function gaSuccessHandler() {
        $('#afui .panel').on('loadpanel', function() {
            var page = location.hash.substring(1);
            if (page && page.length > 1) {
                gaPlugin.trackPage(function(){
                    //on success
                    console.log("tracked " + page);
                }, function(error){
                    // on error
                    navigator.notification.alert("could not track " + page + ", error: " + error);
                    console.log("could not track " + page + "\n error: " + error);
                }, page);
            }
            else {
                gaPlugin.trackPage(function(){
                    //on success
                    console.log("tracked " + page);
                }, function(error){
                    // on error
                    navigator.notification.alert("could not track " + page + ", error: " + error);
                    console.log("could not track " + page + "\n error: " + error);
                }, '/index');
            }
        });
    }

    function gaErrorHandler(error) {
        navigator.notification.alert("Google analytics error: " + error);
        console.log("Google Analytics error: " + error);
    }

    function initGAPlugin() {
        gaPlugin = window.plugins.gaPlugin;
        gaPlugin.init(gaSuccessHandler, gaErrorHandler, "UA-42432888-1", 10);
    }

    function onGAPermission() {
        if (button == 1)
            initGAPlugin();
    }

    navigator.notification.confirm('Google Analytics vil gerne indsamle bruger data. Ingen personlig data vil blive indsamlet.', onGAPermission, 'Advarsel', 'Tillad,Afslå');
}

function exitGAAnalytics() {
    gaPlugin.exit(function() {
        console.log("GA exited succesfully");
    }, function(error) {
        console.log("GA reported error: " + error);
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

    var fontFactor = 0.04;
    var fontSize = windowWidth * fontFactor;
    $('body,html').css("font-size", '' + fontSize + 'px');
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

    initMaps();
    initBackButton();
    initGAanalytics();
    initSwiping();
    initFormHandler();

});

/* This code is used for native apps */
var onDeviceReady = function () {
    fireOnce = true;
    window.setTimeout(function () {
        $.ui.launch();
    }, 1000);
};
document.addEventListener("deviceready", onDeviceReady, false);
