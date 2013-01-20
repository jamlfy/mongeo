/**
 * @author Alejandro
 *
 * var mongeo = new require('mongeo')();
 *
 * mongeo.express(); Plugin de Express
 * mongeo.connect(); Plugin de Connect
 * mongeo.socketio(); Plugin de SocketIO
 * mongeo.IPv4(); Entero
 * mongeo.IPv6(); Entero
 * mongeo.IP(); Busqueda por enteros
 * mongeo.stream(); Observacion en tiempo real
 * 
 *
 */
var _ = require('underscore'), 
	path = require('path'), 
	dir = path.join(__dirname, '..'), 
	models = require(path.join(dir, 'lib', 'models.js')), 
	utils = require(path.join(dir, 'lib', 'utils.js')), 
	net = require('net');

var MonGeo = function(_super) {
	this.config = require(path.join(dir, 'lib', 'config.js'));
	if(_.isObject(_super)){
		if( _.has(_super, 'countries')
			this.config.set('countries', _super["countries"]);
		if( _.has(_super, 'geoip')
			this.config.set('geoip', _super["geoip"]);
		if( _.has(_super, 'city')
			this.config.set('city', _super["city"]);
	};
	this.MonGeoDB = models( _.isArray(_super ) ? _super.join() : _.isString(_super) ? _super : utils.url({
		host : _.isObject(_super) ? _super.host || this.config.get('host') : this.config.get('host'),
		port : _.isObject(_super) ? _super.port || this.config.get('port') : this.config.get('port'),
		user : _.isObject(_super) ? _super.username || false : false,
		pass : _.isObject(_super) ? _super.password || false : false,
		path : _.isObject(_super) ? _super.db || this.config.get('db') : this.config.get('db'),
		type : config.get('type'),
	}) );
}
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
	ip_n = inet_pton( ipv6 );
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

//GeoIp
geoIP = function(IP, callback) {
	switch ( net.isIP( IP ) ) {
		case 4:
			query = [{
				min4 : {
					$gte : IPv4(IP)
				}
			}, {
				max4 : {
					$lte : IPv4(IP)
				}
			}];
			break;
		case 6:
			query = [{
				min6 : {
					$gte : IPv6(IP)
				}
			}, {
				max6 : {
					$lte : IPv6(IP)
				}
			}];
			break;
		default:
			query = null
			break;
	};
	if (net.isIP( IP ) > 0 && !_.isNull( query ) ) {
		return this.MonGeoDB[ this.config.get('geoip') ].findOne().and(query)
				.populate(this.config.get('countries'), ['name', 'code']).populate('city')
				.exec(function(err, doc){
					return callback(err, doc.toObject() );
				});
	} else {
		return callback('Dont Found the IP', null);
	};
};

//Express
express = function(where){
		return function(res, req, next) {
		geoIP(req.ip, function(err, doc) {
			if(err)
				next( new Error( err ) );
			req[ where || 'geo' ] = {
				city : doc.city.name,
				country : doc.country.name,
				lang : doc.city.lang,
				lat : doc.city.lat,
				code : doc.country.code
			};
			next(null);
		});
	};
};

//Socket.IO
socketio = function(cb){
	return function(socket, callback){
		geoIP(socket.handshake.address.address, function(err, doc) {
			socket.handshake.geo = {
				city : doc.city.name,
				country : doc.country.name,
				lang : doc.city.lang,
				lat : doc.city.lat,
				code : doc.country.code
			};
			callback( err, cb(err, err ? false : true) );
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
MonGeo.prototype.models = this.MonGeoDB;
module.exports = exports = MonGeo; 