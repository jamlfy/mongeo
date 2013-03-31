/**
 * @author Alejandro
 */
var mongo	= require('mongoose'),
	path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	lib 	= require( path.join(dir, 'lib', 'lib.js' ) ),
	Schema	= mongo.Schema,
	ObjectId= Schema.Types.ObjectId;

//Cuidades
var CitySchema = Schema({
	name : 	{ type : String, trim : true, index : true, require : true },
	lag  :	{ type : Number, min : 0, require : true },
	lat  : 	{ type : Number, min : 0, require : true }
});
//Paises
var CountrySchema = Schema({
	name   : { type : String, require : true,  trim : true  },
	code   : { type : String, require : true,  trim : true, index : true, match : /[a-z]/ },
});

// IP
var IPSchema = Schema({
	IPv4Max : { type : Number, min : 0, require : true  },
	IPv4Min : { type : Number, min : 0, require : true  },
	IPv6Max : { type : Number, min : 0 },
	IPv6Min : { type : Number, min : 0 }
});

module.exports = function( config ){
	var obj = new Object(),
		cit = new Object(),
		ips = new Object();
	
	obj.db = mongo.createConnection( lib.url( config.db ), { server: { auto_reconnect: false } } );

	//Add the Names
	cit[ config['city'] ] = [ CitySchema ] ;
	ips[ config['countries'] ] = { type : ObjectId, ref : config['countries'], require : true };
	ips[ config['city'] ] = { type : ObjectId, ref : config['countries']+ '.'+ config['city'], require : true };

	CountrySchema.add( cit );
	IPSchema.add( ips );

	//Create the models
	obj[ config['countries'] ] = obj.db.model(config['countries'], CountrySchema);
	obj[ config['geoip'] ] = obj.db.model(config['geoip'], IPSchema ); 
	return obj;
};