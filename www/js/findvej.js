/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

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

    $('#googledirections').hide();
    $('#googlepanelbutton').hide();

    $('#googlepanelbutton').on('click', function() {
        $('#googledirections').toggle();
    });

    $('#googlemap').text('Failed loading Google Maps.');

    $('#index').one('unloadpanel', function() {
        try {
            $('#googlemap').gmaps({
                zoom: 13,
                center: new google.maps.LatLng(55.689403, 12.521281),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            $('#kontakt').on('loadpanel', function() {
                $('#googlemap').gmaps('resize');
            });
        } catch(e) {
            navigator.notification.alert('init maps error: ' + e);
        }

    });
};
