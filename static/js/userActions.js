$('#login-form').submit(function () {
    var form = $(this);
    $('.error', form).html('');
    $(":submit", form).button("loading");
    $.ajax({
        url: "/login",
        method: "POST",
        data: form.serialize(),
        complete: function () {
            $(":submit", form).button("reset");
        },
        statusCode: {
            200: function () {
                window.location.href = "/lobby";
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
    return false;
});

$('#registration-form').submit(function () {
    var form = $(this);
    $('.error', form).html('');
    $(":submit", form).button("loading");
    $.ajax({
        url: "/register",
        method: "POST",
        data: form.serialize(),
        complete: function () {
            $(":submit", form).button("reset");
        },
        statusCode: {
            200: function () {
                alert("You are successfully registered");
                window.location.href = "/lobby";
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
    return false;
});

// Creating and submitting virtual form for "post" to /logout
$('#logout-link').click(function () {
    var $form = $('<form action="/logout" method="POST"></form>');
    $form.appendTo("body").submit();
        return false
    }
);

$(function () {
    if (localStorage.chkbx && localStorage.chkbx != '') {
        $('#remember-me').attr('checked', 'checked');
        $('#username').val(localStorage.usrname);
        $('#password').val(localStorage.pass);
    } else {
        $('#remember-me').removeAttr('checked');
        $('#username').val('');
        $('#password').val('');
    }
    $('#remember-me').click(function () {

        if ($('#remember-me').is(':checked')) {
            // save username and password
            localStorage.usrname = $('#username').val();
            localStorage.pass = $('#password').val();
            localStorage.chkbx = $('#remember-me').val();
        } else {
            localStorage.usrname = '';
            localStorage.pass = '';
            localStorage.chkbx = '';
        }
    });
});