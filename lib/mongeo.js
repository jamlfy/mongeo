/**
 * @author Alejandro
 *
 * var mongeo = new require('mongeo')({
		db :[ {
			host : "localhost",
			port : 27017,
			user : false,
			pass : false,
			db : 'test',
			type : 'mongodb',
	 		}
	 	],
		geoip 	: "geoip",
		countries: "countries",
		city : "city",
	});
 *
 * mongeo.express("geo"); Plugin de Express
 * mongeo.connect("geoIP"); Plugin de Connect
 * mongeo.socketio("geo"); Plugin de SocketIO
 * mongeo.IPv4(IP); Entero
 * mongeo.IPv6(IP); Entero
 * mongeo.IP(IP); Busqueda por enteros
 *
 */
var _  		= require('underscore'),
	path 	= require('path'),
	dir 	= path.join(__dirname, '..'),
	net 	= require('net');

var MonGeo = function( _super ) {
	this.config = require(path.join(dir, 'lib', 'config.js'))( _super );
	this.DB = require(path.join(dir, 'lib', 'models.js') )( this.config );
};

//IPv4
IPv4 = function(ip) {
	return (16777216 * ip.split('.')[0] )
		+ (65536 * ip.split('.')[1] )
		+ (256 * ip.split('.')[2] )
		+ ip.split('.')[3];
};

//IPv6
IPv6 = function(ip) {
	//TODO REHACER A JS
	ip_n = inet_pton( ip );
	bits = 15;

	ipv6long = 0;

	while ( bits >= 0) {
		bin = sprintf("%08b", ( ord( ip_n[ bits] ) ) );

		if ( ipv6long) {
			 ipv6long = bin.ipv6long;
		} else {
			ipv6long = bin;
		}
		bits--;
	}
	return gmp_strval(gmp_init( ipv6long, 2), 10);
};

//GeoIp Search
geoIP = function(IP, callback) {
	switch ( net.isIP( IP ) ) {
		case 4:
			query = [{
				IPv4Min : {
					$gte : IPv4(IP)
				}
			}, {
				IPv4Max : {
					$lte : IPv4(IP)
				}
			}];
			break;
		case 6:
			query = [{
				IPv6Min : {
					$gte : IPv6(IP)
				}
			}, {
				IPv6Max : {
					$lte : IPv6(IP)
				}
			} ];
			break;
		default:
			query = null
			break;
	};
	if ( net.isIP( IP ) > 0 && !_.isNull( query ) ) {
		return this.DB[ this.config.get('geoip') ].findOne().and( query )
				.populate( this.config.get('countries'), ['name', 'code'])
				.populate( this.config.get('city') )
				.exec(function(err, doc){
					return callback(err, doc.toObject() );
				});
	} else {
		return callback('Dont Found the IP', null);
	};
};

//Express and connect
express = function(where){
		return function(res, req, next) {
		req[ where || 'geo' ] = new Object();
		geoIP(req.ip, function(err, doc) {
			if(err)
				next( new Error( err ) );
			req[ where || 'geo' ] = doc.toObject();
			next(null);
		});
	};
};

//Socket.IO
socketio = function(where){
	return function(socket, callback){
		geoIP(socket.handshake.address.address, function(err, doc) {
			socket.handshake[ where || 'geo' ] = doc.toObject();
			callback( err, cb ); // TODO ????
		});
	};
};

//Exports
MonGeo.prototype.socketio = socketio;
MonGeo.prototype.connect = express;
MonGeo.prototype.express = express;
MonGeo.prototype.IPv6 = IPv6;
MonGeo.prototype.IPv4 = IPv4;
MonGeo.prototype.IP = geoIP;
MonGeo.prototype.models = this.DB;
module.exports = exports = MonGeo;