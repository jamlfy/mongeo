/**
 * @author Alejandro
 */
var mongo	= require('mongoose'),
	Schema	= mongo.Schema,
	ObjectId= Schema.Types.ObjectId;

//Cuidades
var CitySchema = Schema({
	name: { type : String, trim : true, index : true, require : true },
	lng : { type : Number, min : 0, require : true },
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
	country : { type : ObjectId, ref : 'country', require : true },
	city : { type : ObjectId, ref : 'country.cuidad', require : true },
	IPv4Max : { type : Number, min : 0 },
	IPv4Min : { type : Number, min : 0 },
	IPv6Max : { type : Number, min : 0 },
	IPv6Min : { type : Number, min : 0 }
});

module.exports = function(dbString){
	db = mongo.createConnection( dbString );
	return {
		geoip : db.model('geoip', IpSchema),
		country : db.model('country', CountrySchema),
	};
};