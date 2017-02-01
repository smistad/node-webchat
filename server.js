var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.username = false;
    socket.on('chat message', function(msg){
        console.log('msg received: ' + msg)
        if(socket.username == false) { // Username not set yet
            console.log('Setting username..')
            socket.username = msg;
            // Send only to this user
            io.to(socket.id).emit('chat message', 'Welcome ' + socket.username + ' you can now chat.');

            // Broadcast to everyone else that this user joined
            socket.broadcast.emit('chat message', socket.username + ' joined the chat!');
        } else {
            // Send message to all
            io.emit('chat message', socket.username + ': ' + msg);
        }
    });

    socket.on('disconnect', function() {
        // Broadcast to everyone else that this user joined
        socket.broadcast.emit('chat message', socket.username + ' left the chat!');
    });
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
