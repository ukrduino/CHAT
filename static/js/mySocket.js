var socket = io();

$('form').submit(function () {
    var newMessageField = $('#newMessage');
    var message = newMessageField.val();
    if (message.length > 0) {
        socket.emit('chat message', newMessageField.val());
        newMessageField.val('');
    }
    return false; //prevents page reload on form submit
});