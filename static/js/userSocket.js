// initialising client socket
// Client
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

$('#file').change(function (e) {
    var file = e.target.files[0];
    console.log('uploading...', file.name);
    var stream = ss.createStream();
    var blobStream = ss.createBlobReadStream(file);

    blobStream.on('data', function (chunk) {
        console.log('data chunk.length:', chunk.length);
    });

    blobStream.on('end', function () {
        console.log('end');
    });

    ss(socket).emit('file upload', stream, file.name);
    blobStream.pipe(stream);
});
