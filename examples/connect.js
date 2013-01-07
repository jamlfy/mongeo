/**
 * @author Alejandro
 */

var connect = require('connect'),
	mongeo = new require('mongeo')( );;

connect()
	.use(connect.bodyParser())
	.use(mongeo.connect)
	.use(hello)
	.listen(3000);

function hello(req, res, next) {
	res.setHeader('Content-Type', 'text/html');
	res.send( "Hello I'am in" + JSON.stringify(req.geo) );
}