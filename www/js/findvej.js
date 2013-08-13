/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

var userPos = null;

function onGeoSuccess(position) {
    userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
}

function onGeoError(error) {
    navigator.notification.alert('Kan ikke finde placering. Fejl besked: ' + error.message);
}

function initMaps() {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

    $('#index').one('unloadpanel', function() {
        try {
            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(55.689403, 12.521281),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $('#googlemap').gmaps(mapOptions, userPos);

            $('#kontakt').on('loadpanel', function() {
                $('#googlemap').gmaps('resize', null);
            });

            if (userPos != null) {
                $('#googledirections').hide();
                $('#googlepanelbutton').on('click', function() {
                    $('#googledirections').toggle();
                });
            }
            else {
                $('#googledirections').remove();
                $('#googlepanelbutton').remove();
            }

        }
        catch (e) {
            $('#googledirections').remove();
            $('#googlepanelbutton').remove();

            var mapsUrl = 'http://maps.google.com/maps?';
            if (userPos != null) {
                mapsUrl += 'saddr=' + userPos.lat() + ',' + userPos.lng();
                mapsUrl += '&daddr=55.689403,12.521281';
            }
            else {
                mapsUrl += 'center=55.689403,12.521281';
            }
            mapsUrl += '&zoom=13';

            $('#googlemap').html(
                '<p>Find vej til hovedkontoret med <a id="mapurl" href="#" data-ignore="true">Google Maps</a>.</p>'
            );
            $('#mapurl').attr('href', mapsUrl);
            $('#googlemap').css('height', '60px');
        }

    });
};
