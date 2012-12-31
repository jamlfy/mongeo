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
	config = require(path.join(dir, 'lib', 'config.js')), 
	net = require('net');

var MonGeo = function(_super) {
	this.MonGeoDB = models(_.isArray(_super) ? _super.join() : _.isString(_super) ? _super : utils.url({
		host : _.isObject(_super) ? _super.host || config.get('host') : config.get('host'),
		port : _.isObject(_super) ? _super.port || config.get('port') : config.get('port'),
		user : _.isObject(_super) ? _super.username || false : false,
		pass : _.isObject(_super) ? _super.password || false : false,
		path : _.isObject(_super) ? _super.db || config.get('db') : config.get('db'),
		type : config.get('type'),
	}));
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
	$ip_n = inet_pton($ipv6);
	$bits = 15;

	$ipv6long = 0;

	while ($bits >= 0) {
		$bin = sprintf("%08b", (ord($ip_n[$bits])));

		if ($ipv6long) {
			$ipv6long = $bin.$ipv6long;
		} else {
			$ipv6long = $bin;
		}
		$bits--;
	}
	return gmp_strval(gmp_init($ipv6long, 2), 10);
};

//GeoIp
geoIP = function(IP, callaback) {
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
	if (net.isIP(req.ip) > 0 && !_.isNull(query)) {
		return this.MonGeoDB[ config.get('geoip') ].findOne().and(query)
				.populate(config.get('countries'), ['name', 'code']).populate('city')
				.exec(function(err, doc){
					doc.date = new Date;
					return doc.save(callback);
				});
	} else {
		return callaback('Dont Found the IP', {
			city : {
				name : 'host',
				lat : 0,
				lang : 0,
			},
			country : {
				name : 'local',
				code : 'lc'
			}
		});
	};
};

//Express
express = function(res, req, next) {
	geoIP(req.ip, function(err, doc) {
		req.geo = {
			city : doc.city.name,
			country : doc.country.name,
			lang : doc.city.lang,
			lat : doc.city.lat,
			code : doc.country.code
		};
		next(err);
	});
};

//Socket.IO
socketio = function(socket, callback){
	geoIP(socket.handshake.address.address, function(err, doc) {
		socket.handshake.geo = {
			city : doc.city.name,
			country : doc.country.name,
			lang : doc.city.lang,
			lat : doc.city.lat,
			code : doc.country.code
		};
		callback(err, err ? false : true);
	});
};

//Stream
stream = function(){
	return this.MonGeoDB[ config.get('geoip') ].find()
		.where('date').gte( new Date )
		.sort({ field: 'date', test: -1 }).stream();
};

//Exports
MonGeo.prototype.stream = stream;
MonGeo.prototype.socketio = socketio;
MonGeo.prototype.connect = express;
MonGeo.prototype.express = express;
MonGeo.prototype.IPv6 = IPv6;
MonGeo.prototype.IPv4 = IPv4;
MonGeo.prototype.IP = geoIP;
module.exports = exports = MonGeo; 