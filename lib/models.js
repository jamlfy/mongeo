/**
 * @author Alejandro
 */
var mongo	= require('mongoose'),
	path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	config 	= require(path.join(dir, 'lib', 'config.js'))
	Schema	= mongo.Schema,
	ObjectId= Schema.Types.ObjectId;

//Cuidades
var CitySchema = Schema({
	name : { type : String, trim : true, index : true, require : true },
	lang : { type : Number, min : 0, require : true },
	lat : { type : Number, min : 0, require : true }
});
//Paises
var CountrySchema = Schema({
	name : { type : String, trim : true, require : true },
	code : { type : String, match : /[a-z]/, trim : true, index : true, require : true },
	citys : [ CitySchema ]
});
//IPv4 y su relacion
var IpSchema = Schema({
	country : { type : ObjectId, ref : config.get('countries'), require : true },
	city : { type : ObjectId, ref : config.get('countries')+ '.'+ config.get('city'), require : true },
	IPv4Max : { type : Number, min : 0 },
	IPv4Min : { type : Number, min : 0 },
	IPv6Max : { type : Number, min : 0 },
	IPv6Min : { type : Number, min : 0 },
	date : { type : Date, defauct : Date.now }
});

module.exports = function(dbString){
	db = mongo.createConnection( dbString, { server: { auto_reconnect: false } } );
	obj[ config.get('countries') ] = db.model(config.get('countries'), CountrySchema);
	obj[ config.get('geoip') ] = db.model(config.get('geoip'), IpSchema); 
	return obj;
};