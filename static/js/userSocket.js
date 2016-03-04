// initialising client socket
var socket = io();

$('form').submit(function () {
    var newMessageField = $('#newMessage');
    var message = newMessageField.val();
    var messageRoom = $('h3').text();
    if (message.length > 0) {
        socket.emit('new message', {messageText: message, messageRoom: messageRoom}, function () {
            $('<span class="message"><span class="messageUser">ME : </span><span class="messageText">111</span></span>').appendTo('#messages');
            $('.messageText').last().text(message);
        });
        newMessageField.val('');
    }
    return false; //prevents page reload on form submit
});

socket.on('chat message', function (msg) {
    $('<span class="message"><span class="messageUser"></span><span class="messageText"></span></span>').appendTo('#messages');
    $('.messageText').last().text(msg.messageText);
    $('.messageUser').last().text(msg.messageUser + " : ").css('color', msg.messageUserColor);
});

$(function () {
    var messageUsers = $(".messageUser");
    var currentUserName = $('#logout-link').text().split("as ")[1].split(")")[0];
    console.log(currentUserName);
    console.log(messageUsers.length);
    messageUsers.each(function () {
        var name = $.trim($(this).text());
        console.log(name);
        if (name == currentUserName) {
            $(this).text("ME : ");
        }
    })
});
