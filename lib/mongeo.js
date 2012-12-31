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

(function() {
	var _ = require('underscore'), 
		mongo = require('mongoose'), 
		Schema = mongo.Schema, 
		ObjectId = Schema.Types.ObjectId, 
		CitySchema = Schema({
			name : { type : String, trim : true, index : true, require : true },
			lng : { type : Number, require : true },
			lat : { type : Number, require : true } }),
		CountrySchema = Schema({
			name : { type : String, trim : true, require : true },
			code : { type : String, match : /[a-z]/, trim : true, index : true, require : true },
			citys : [CitySchema] }),
		IpSchema = Schema({
			country : { type : ObjectId, ref : 'country', require : true },
			city : { type : ObjectId, ref : 'country.citys', require : true },
			IPv4Max : { type : Number, min : 0, index : true },
			IPv4Min : { type : Number, min : 0, index : true },
			IPv6Max : { type : Number, min : 0, index : true },
			IPv6Min : { type : Number, min : 0, index : true } });

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

	MongeoExpress = (function(_super) {
		//Connecion

		db = mongo.createConnection(_super.db);
		geoip = db.model('geoip', IpSchema);
		country = db.model('country', CountrySchema);

		MongeoExpress.prototype.get = function(req, res, next) {
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
				geoip.findOne().and(query)
				.populate('country', ['name', 'code'])
				.populate('city').exec(function(err, doc) {
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
		}
	});
});
