/*
	Tenga cuidado al modificar este archivo
*/
module.exports = exports = function( JSON ){
 	return require('configurable')( _.extend( {
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
	}, JSON )  );
};
