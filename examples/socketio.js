/**
 * @author Alejandro
 */


var io = require('socket.io').listen(80),
	mongeo = new require('mongeo')();

io.configure(function (){
	io.set('authorization', mongo.socketio);
});

io.sockets.on('connection', function (socket) {
	socket.emit('form', socket.handshake.geo );
	socket.on('my other event', function (data) {
		console.log(data);
	});
});