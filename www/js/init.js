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
    navigator.notification.confirm("Vil du virkeligt forlade Danmarks Flyttemand?", onExitConfirm, "Exit", "Ja,Nej");
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

/* INITIALIZATION */
var fireOnce = false;

//This function will get executed when $.ui.launch has completed
$.ui.ready(function () {
    $().ready(function() {
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

        initMaps();
    });

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
