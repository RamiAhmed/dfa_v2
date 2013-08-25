/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

var server = 'http://www.alphastagestudios.com/apps/danmarksflyttemandapp/';//'http://danmarksflyttemand.dk/';

function initContactFormHandler() {
    $('#kontakt-send').on('click', function(evt) {
        evt.preventDefault();

        var mailData = "{'Company': " + $('#company_input').val() + ",'Name': " + $('#name_input').val() + ",'Address': " + $('#address_input').val() + ",'City': " + $('#zipcode_input').val() + ",'Email': " + $('#email_input').val() + ",'Telephone': " + $('#telephone_input').val() + ",'Subject': " + $('#subject_input').val() + ",'Message': " + $('#message_input').val() + "}";

        $.ajax({
            type: 'POST',
            url: server + 'ContactHandler.ashx',
            data: mailData,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(response) {
                navigator.notification.alert('SUCCESS. response: ' + response);
                /*if (data.Equals("success") || data == "success") {
                    $('#kontaktform').html('<h2>Din kontakt besked er sendt.</h2><p class="orange">Tak for din besked! Vi vender tilbage til dig snarest.</p>');
                }
                else {
                    navigator.notification.alert("Fejl: " + data);
                }*/
            },
            error: function(response) {
               // navigator.notification.alert('Fejl: ' + data);
               navigator.notification.alert('FAILURE. response: ' + response);
            }
        });
    });
}

/*
var phpServer = 'http://rami_ahmed.0fees.net/htdocs/';

function initContactFormHandler() {
    $('#kontakt-send').on('click', function(evt) {
    evt.preventDefault();
    $.post(phpServer + 'kontaktform-handler.php', {
        Company: $('#company_input').val(),
        Name: $('#name_input').val(),
        Address: $('#address_input').val(),
        City: $('#zipcode_input').val(),
        Email: $('#email_input').val(),
        Telephone: $('#telephone_input').val(),
        Subject: $('#subject_input').val(),
        Message: $('#message_input').val()

        // HTML function
        }, function(html) {
            // Place HTML in string
            var response = html;

            // PHP was done and email sent
            if (response == "success") {
                $('#kontaktform').html('<h2>Din kontakt besked er sendt!</h2><p class="orange">Tak for din besked! Vi vender tilbage til dig snarest.</p>');
            }
            else {
                navigator.notification.alert('Fejl: ' + response);
                return false;
            }
        });
    });
};

function initTilbudFormHandler() {
    $('#tilbud-send').on('click', function(evt) {
        evt.preventDefault();
        $.post(phpServer + 'tilbudform-handler.php', {
            Name: $('#tilbud-name_input').val(),
            Telephone: $('#tilbud-telephone_input').val(),
            Email: $('#tilbud-email_input').val(),

            FromAddress: $('#from-address_input').val(),
            FromZip: $('#from-zipcode_input').val(),
            FromCity: $('#from-city_input').val(),
            FromRegion: $('#from-region_input').val(),
            FromElevator: $('#from-elevator_input').val(),
            FromParking: $('#from-parking_input').val(),
            FromSize: $('#from-areal_input').val(),
            FromRooms: $('#from-rooms_input').val(),

            ToAddress: $('#to-address_input').val(),
            ToZip: $('#to-zipcode_input').val(),
            ToCity: $('#to-city_input').val(),
            ToRegion: $('#to-region_input').val(),
            ToElevator: $('#to-elevator_input').val(),
            ToParking: $('#to-parking_input').val(),
            ToSize: $('#to-areal_input').val(),
            ToRooms: $('#to-rooms_input').val(),

            MoveDate: $('#moving-date_input').val(),
            Flexible: $('#flexible-date_input').val(),
            AmountMen: $('#amount-men_input').val(),
            Packing: $('#pack-up_input').val(),
            Description: $('#description_input').val()

        }, function(html) {
            var response = html;

            if (response == "success") {
                $('#indhenttilbud').html('<h2>Din besked er sendt!</h2><p class="orange">Tak for din besked! Du vil modtage et skriftligt svar med et uforpligtende tilbud indenfor 24 timer.</p>');
            }
            else {
                navigator.notification.alert('Fejl: ' + response);
                return false;
            }
        });
    });
};
*/
function initFormHandler() {
    initContactFormHandler();
 //   initTilbudFormHandler();
};


