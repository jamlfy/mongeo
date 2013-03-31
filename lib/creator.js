var path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	_ 		= require('underscore'), 
	utl 	= require(path.join(dir, 'lib', 'utils.js')), 
	models	= require(path.join(dir, 'lib', 'models.js')), 
	config	= require(path.join(dir, 'lib', 'config.js'));

exports.update = function(config, url, callback) {
	var model = models( config );
	csv()
		.from.stream( utl.read( url ) )
		.transform( function(row){
			row.unshift( row.pop() );
			return row;
		})
		.on('record', function(row,index){
			var lugar = new Ojbect({ 
						IPv4Max : row[],
						IPv4Min : row[],
						IPv6Max : row[],
						IPv6Min : row[] });
			model[ config['countries'] ].find( {
					name : row[],
					code : row[]
				}, {
					upsert : true
				}).exec(function(err, doc) {
					if (err)
						utl.console(err, doc);
					doc[ config['city'] ].push({
						name : row[],
						lng : row[],
						lat : row[]
					});
					lugar[ config['countries']  ] = doc._id;
					lugar[ config['city'] ] = _.last( doc[ config['city'] ] )._id; //TODO sera cierto ?
					var ip = new model[ config['geoip'] ]( lugar );
					doc.save(utl.console);
					ip.save(utl.console);
					console.log( 'Save ' +  _.last( doc[ config['city'] ] ).name + ' in ' + doc.name );
				});
			})
		.on('end', callback)
		.on('error', function(error){
			console.log(error.message);
		});
};

