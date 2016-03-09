// initialising client socket
// Client
var socket = io();
var file;
$('form').submit(function () {
    var newMessageField = $('#newMessage');
    var message = newMessageField.val();
    var messageRoom = $('h3').text();
    var stream;
    var blobStream;
    if (message.length > 0) {
        if (file) {
            console.log('uploading...', file.name);
            stream = ss.createStream();
            blobStream = ss.createBlobReadStream(file);
            ss(socket).emit('file upload', stream, file.name);
            blobStream.pipe(stream);
            socket.emit('new message', {
                messageText: message,
                messageRoom: messageRoom,
                messageFile: file.name
            }, function () {
                $('<span class="message"><span class="messageUser">ME : </span><span class="messageText"></span><a href="#" class="messageFile"></a></span>').appendTo('#messages');
                $('.messageText').last().text(message);
                $('.messageFile').last().text(' ' + file.name);
                file = null;
                $('#file').val("");
            });
        } else {
            socket.emit('new message', {
                messageText: message,
                messageRoom: messageRoom,
                messageFile: ""
            }, function () {
                $('<span class="message"><span class="messageUser">ME : </span><span class="messageText"></span><a href="#" class="messageFile"></a></span>').appendTo('#messages');
                $('.messageText').last().text(message);
                file = null;
                $('#file').val("");
            });
        }
        newMessageField.val('');
        return false; //prevents page reload on form submit
    }
    if (!message.length || file) {
        console.log('uploading...', file.name);
        stream = ss.createStream();
        blobStream = ss.createBlobReadStream(file);
        ss(socket).emit('file upload', stream, file.name);
        blobStream.pipe(stream);
        socket.emit('new message', {
            messageText: "",
            messageRoom: messageRoom,
            messageFile: file.name
        }, function () {
            $('<span class="message"><span class="messageUser">ME : </span><span class="messageText"></span><a href="#" class="messageFile"></a></span>').appendTo('#messages');
            console.log(file.name);
            $('.messageFile').last().text(' ' + file.name);
            file = null;
            $('#file').val("");
        });
        newMessageField.val('');
        return false; //prevents page reload on form submit
    }
    return false; //prevents page reload on form submit
});

socket.on('chat message', function (msg) {
    $('<span class="message"><span class="messageUser"></span><span class="messageText"></span><a href="#" class="messageFile"></a></span>').appendTo('#messages');
    $('.messageText').last().text(msg.messageText);
    $('.messageUser').last().text(msg.messageUser + " : ").css('color', msg.messageUserColor);
    if (msg.messageFile) {
        $('.messageFile').last().text(' ' + msg.messageFile);
    }
});

ss(socket).on('file download', function (stream) {

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
    file = e.target.files[0];
});


