var express = require('express'),
	http = require('http'),
	mongeo = new require('mongeo')({
	"db": [
		{
			"host": "localhost",
			"port": 27017,
			"path": "test",
			"type": "mongodb"
		},{
			"host": "anotherHost",
			"port": 27017,
			"path": "test",
			"user": "user",
			"pass": "password",
			"type": "mongodb"
		},
		"mongodb://user:pass@localhost:port/database",
		"mongodb://user:pass@localhost:port/database,mongodb://anotherhost:port,mongodb://yetanother:port"
	],
	"geoip": "geoip",
	"countries": "countries",
	"city": "city"
});

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(mongeo.express('meGeo'));
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(res, req){
	res.send( "Hello I'am in " + JSON.stringify(req['meGeo']) );
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
