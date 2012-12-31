# MonGeo

This is a script that generates a mongoDB the location of the IP.

## System
Installation is in the system, so

	[sudo] npm install -g mongeo

These options will give you the help
```console
$ mongeo --help

	Usage: mongeo [options]
	
	Options:
	
		-h, --help                 output usage information
		-V, --version              output the version number
		-d, --db [db]              Name of db
		-h, --host [host]          IP for the mongoDB
		-p, --port [port]          Port for the mongoDB
		-u, --user [user]          Username for database
		-w, --pass [pass]          Password for database
		-m, --multi [multi]        Multiply servers mongo
```
Place all data from their databases 

	--db MyDB --host 127.0.0.0 --user MyUser --password MyPassword

Remember that there are certain parameters default

	--host localhost --port 27017

When using `- multi` should be aware that you must enter either the url of connection to servers so mongo.

	--multi mongodb://user:pass@localhost:port/database,mongodb://anotherhost:port,mongodb://yetanother:port

## Use in the server

Run for install in the app

	npm install mongeo

### Configure

```js
//Configure
var mongeo = new require('mongeo')({
		db : 'MyDB',
		host : '127.0.0.1', //If 'localhost' not place anything
		port : 27017, // If different settings
		user : 'username', //If there
		pass : 'password', //If there
});

//	OR in array
var mongeo = new require('mongeo')([ 
	'mongodb://user:pass@localhost:port/database', //Conections Database 
	'mongodb://anotherhost:port',  
	'mongodb://yetanother:port' ]); 

//	OR in  a String
var mongeo = new require('mongeo')( 'mongodb://user:pass@localhost:port/database' );

//	OR in nothing
var mongeo = new require('mongeo')( );
```
If you use anything that reminds serara database `test` and a local conectactara `localhost`. With default settings mongoDB.

### Express
```javascript
var express = require('express');
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	// Your configuration
	app.use(mongeo.express); // Here! 
	app.use(app.router);
	// Your configuration
});
```

### Connect
```javascript
var connect = require('connect');

var app = connect()
	.use(mongeo.connect) //Here!!!
	.use(function(req, res){
		res.end('Hello from MonGeo!\n' );
	});
```
### Socket.IO
```javascript
io.configure(function (){
	io.set('authorization', mongo.socketio);
});
```