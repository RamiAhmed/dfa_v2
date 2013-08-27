/* Script written by Rami@alphastagestudios.com
    All Copyrights preserved.
*/

var server = "http://www.alphastagestudios.com/apps/danmarksflyttemandapp/";

function initContactFormHandler() {
    $('#kontakt-send').on('click', function(evt) {
        evt.preventDefault();


        $.ajax({
            type: "POST",
            url: server + "ContactHandler.ashx",
            //contentType: "application/json; charset=utf-8",
            dataType:"json",
            data: "{}",
            crossDomain: true,
            success: function(data) {
                navigator.notification.alert('Success: ' + data + ', .d: ' + data.d);
            },
            error: function(data) {
                navigator.notification.alert('Error: ' + data + ', .d: ' + data.d);
            }
        });



/*
        var mailData = "{'Company': '" + $('#company_input').val() + "','Name': '" + $('#name_input').val() + "','Address': '" + $('#address_input').val() + "','City': '" + $('#zipcode_input').val() + "','Email': '" + $('#email_input').val() + "','Telephone': '" + $('#telephone_input').val() + "','Subject': '" + $('#subject_input').val() + "','Message': '" + $('#message_input').val() + "'}";

        $.ajax({
            type: "POST",
            url: server + "ContactFormHandler.aspx/SendMail",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: onContactSuccess,
            error: onContactError,
            timeout: 5000,
            cache: false,
            async: false
        });
*/
    });
}

var onContactSuccess = function (msg) {
    navigator.notification.alert("SUCCESS. msg: " + msg + ", msg.d : " + msg.d);
    /*
    navigator.notification.alert('SUCCESS. data.results: ' + data.results + ', data.results[0]: ' + data.results[0] + ', data.results[1]: ' + data.results[1] + ', data.d: ' + data.d + ', textStatus: ' + textStatus);
    */
    /*if (data.Equals("success") || data == "success") {
        $('#kontaktform').html('<h2>Din kontakt besked er sendt.</h2><p class="orange">Tak for din besked! Vi vender tilbage til dig snarest.</p>');
    }
    else {
        navigator.notification.alert("Fejl: " + data);
    }*/
}

var onContactError = function(jqXHR, textStatus, errorThrown) {
    alert("ERROR. The server reported: " + jqXHR.responseText + ", status: " +textStatus + ", error: " + errorThrown);
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


