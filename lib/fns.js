var path 	= require('path'),
	dir		= path.join(__dirname, '..'),
	_ 		= require('underscore'), 
	utils 	= require( path.join(dir, 'lib', 'utils.js' ) ),
	models 	= require( path.join(dir, 'lib', 'models.js' ) ),
	config 	= require( path.join(dir, 'lib', 'config.js' ) );


exports.existAndDownload = function(url, callback){
	
	return path;
};

exports.update = function(path, db, orden, divid, callback){
	var model = models(db);
	// lea linea por liena
	lea.LinaPorLinea(path, otros, function(err, array){
		if(err)
			utils.console(err, array);
		for (var i=0; i < array.length; i++) {
			utils.LineToObjt(array[i], divid, orden, function(err, obj){
				if(err)
					utils.console(err, array);
				model[config.get('countries')].find({
					name : obj.country,
					code : obj.code
				}, { upsert: true }).exec(function(err, doc){
					if(err)
						utils.console(err, doc);
					doc.City.push({
						name: obj.city,
						lng : obj.lng,
						lat : obj.lat
					});
					doc.save(utils.console);
					ip = new model[config.get('geoip')]({
						country : doc._id,
						city : _.last(doc.city)._id,
						IPv4Max : obj.IPv4to,
						IPv4Min : obj.IPv6from,
						IPv6Max : obj.IPv4to,
						IPv6Min : obj.IPv6form
					});
					ip.save(utils.console)
				});
			});
		};
		return callback(null, "That's Ok!");
	});
};

