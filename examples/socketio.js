/**
 * @author Alejandro
 */


var io = require('socket.io').listen(80),
	mongeo = new require('mongeo')( [ 'mongodb://localhost/hello', 'mongo://mydoamin.com/hello' ] );

io.configure(function (){
	io.set('authorization', mongeo.socketio(function(err, auth){
		//More!! Code
		//auth is Boolan
	}));
});

io.sockets.on('connection', function (socket) {
	socket.emit('form', socket.handshake.geo );
	socket.on('my other event', function (data) {
		console.log(data);
	});
});