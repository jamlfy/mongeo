var express = require('express'),
	http = require('http'),
	mongeo = new require('mongeo')();

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(mongeo.express);
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(res, req){
	res.send( "Hello I'am in" + JSON.stringify(req.geo) );
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
