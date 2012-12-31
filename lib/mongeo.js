/**
 * @author Alejandro
 *
 * var mongeo = new require('mongeo')({
 * 		db : "database"
 * });
 *
 * app.use(mongeo.get);
 *
 */
var _ = require('underscore'), 
	path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	models 	= require(path.join(dir, 'lib', 'models.js')),
	utils 	= require(path.join(dir, 'lib', 'utils.js')),
	net 	= require('net');

var MonGeo = function(_super) {
	this.db = models(utils.url({
		host : _super.host || false,
		port : _super.port || 27017,
		user : _super.username || false,
		pass : _super.password || false,
		path : _super.db || 'test',
		type : 'mongo',
	}));
}

MonGeo.prototype.IPv4 = IPv4 = function(ip) {
	return (16777216 * ip.split('.')[0] ) 
		+ (65536 * ip.split('.')[1] ) 
		+ (256 * ip.split('.')[2] ) 
		+ ip.split('.')[3];
};

//IPv6
MonGeo.prototype.IPv6 = IPv6 = function(ip) {
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


MonGeo.prototype.get = function(req, res, next) {
	switch ( net.isIP( req.ip ) ) {
		case 4:
			query = [{
				min4 : {
					$gte : IPv4(req.ip)
				}
			}, {
				max4 : {
					$lte : IPv4(req.ip)
				}
			}];
			break;
		case 6:
			query = [{
				min6 : {
					$gte : IPv6(req.ip)
				}
			}, {
				max6 : {
					$lte : IPv6(req.ip)
				}
			}];
			break;
		default:
			query = null
			break;
	};
	if (net.isIP(req.ip) > 0 && !_.isNull(query)) {
		this.db.geoip.findOne().and(query)
			.populate('country', ['name', 'code']).populate('city')
			.exec(function(err, doc) {
			req.geo = {
				city : doc.city.name,
				country : doc.country.name,
				lang : doc.city.lng,
				lat : doc.city.lat,
				code : doc.country.code
			};
			next(err);
		});
	} else {
		req.geo = {
			city : 'host',
			country : 'local',
			lang : 0,
			lat : 0,
			code : 'lc'
		};
		next('Dont Found the IP');
	};
};

module.exports = exports = MonGeo;