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
                form.html("Вы вошли в сайт").addClass('alert-success');
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
$('#logout-link').unbind().click(function () {
        $('<form action="/logout" method="POST"></form>').submit();
        return false
    }
);