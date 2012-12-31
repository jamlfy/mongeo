var path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	_ 		= require('underscore'), 
	utils 	= require(path.join(dir, 'lib', 'utils.js')), 
	models	= require(path.join(dir, 'lib', 'models.js')), 
	config	= require(path.join(dir, 'lib', 'config.js'));

exports.existAndDownload = function(file_url, callback) {
	var DOWNLOAD_DIR = './downloads/';

	// We will be downloading the files to a directory, so make sure it's there
	// This step is not required if you have manually created the directory
	var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
	var child = exec(mkdir, function(err, stdout, stderr) {
		if (err)
			throw err;
		else
			download_file_httpget(file_url);
	});

	// Function to download file using HTTP.get
	var download_file_httpget = function(file_url) {
		var options = {
			host : url.parse(file_url).host,
			port : 80,
			path : url.parse(file_url).pathname
		};

		var file_name = url.parse(file_url).pathname.split('/').pop();
		var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

		return http.get(options, function(res) {
			res.on('data', function(data) {
				file.write(data);
			}).on('end', function() {
				file.end();
				return callback(err, path.join(DOWNLOAD_DIR, file_name ) );
			});
		});
	};
};

exports.update = function(path, db, orden, divid, callback) {
	var model = models(db);
	// lea linea por liena
	utils.read(path, function(err, array){
		if (err)
			utils.console(err, array);
		for(i in array) {
			utils.LineToObjt(array[i], divid, orden, function(err, obj) {
				if (err)
					utils.console(err, array);
				model[config.get('countries')].find({
					name : obj.country,
					code : obj.code
				}, {
					upsert : true
				}).exec(function(err, doc) {
					if (err)
						utils.console(err, doc);
					doc.City.push({
						name : obj.city,
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

