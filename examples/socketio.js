/**
 * @author Alejandro
 */


var io = require('socket.io').listen(80),
	mongeo = new require('mongeo')( {
	"db": [
		{
			"host": "localhost",
			"port": 27017,
			"path": "test",
			"type": "mongodb"
		},{
			"host": "anotherHost",
			"port": 27017,
			"path": "test",
			"user": "user",
			"pass": "password",
			"type": "mongodb"
		},
		"mongodb://user:pass@localhost:port/database",
		"mongodb://user:pass@localhost:port/database,mongodb://anotherhost:port,mongodb://yetanother:port"
	],
	"geoip": "geoip",
	"countries": "countries",
	"city": "city"
} );

io.configure(function (){
	io.set('authorization', mongeo.socketio(null, function(err, auth){
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