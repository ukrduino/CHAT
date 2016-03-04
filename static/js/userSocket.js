// initialising client socket
var socket = io();

$('form').submit(function () {
    var newMessageField = $('#newMessage');
    var message = newMessageField.val();
    if (message.length > 0) {
        socket.emit('chat message', {messageText: message}, function () {
            $('<span class="message"><span class="messageUserMe">ME : </span><span class="messageText">111</span></span>').appendTo('#messages');
            $('.messageText').last().text(message);
        });
        newMessageField.val('');
    }
    return false; //prevents page reload on form submit
});

socket.on('chat message', function (msg) {
    $('<span class="message"><span class="messageUser"></span><span class="messageText"></span></span>').appendTo('#messages');
    $('.messageText').last().text(msg.messageText);
    $('.messageUser').last().text(msg.messageUser);
});