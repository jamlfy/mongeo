/**
 * @author Alejandro
 */
var mongo	= require('mongoose'),
	path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	Schema	= mongo.Schema,
	ObjectId= Schema.Types.ObjectId;

//Cuidades
var CitySchema = Schema({
	name : 	{ type : String, trim : true, index : true, require : true },
	lang :	{ type : Number, min : 0, require : true },
	lat  : 	{ type : Number, min : 0, require : true }
});
//Paises
var CountrySchema = Schema({
	name : { type : String, require : true,  trim : true  },
	code : { type : String, require : true,  trim : true, index : true, match : /[a-z]/ },
	citys : [ CitySchema ]
});

module.exports = function(dbString, config){
	obj =  new Object;
	db = mongo.createConnection( dbString, { server: { auto_reconnect: false } } );
	obj[ config['countries'] ] = db.model(config['countries'], CountrySchema);
	//IPv4 y su relacion
	obj[ config['geoip'] ] = db.model(config['geoip'], Schema({
		country : { type : ObjectId, ref : config['countries'], require : true },
		city : { type : ObjectId, ref : config['countries']+ '.'+ config['city'], require : true },
		IPv4Max : { type : Number, min : 0, require : true  },
		IPv4Min : { type : Number, min : 0, require : true  },
		IPv6Max : { type : Number, min : 0 },
		IPv6Min : { type : Number, min : 0 }
	}) ); 
	return obj;
};