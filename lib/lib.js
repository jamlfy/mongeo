var _ 	= require('underscore'), 
	path= require('path'), 
	dir = path.join(__dirname, '..'), 
	fs 	= require('fs'),
	config = require(path.join(dir, 'lib', 'config.js'));

exports.url = function(obj) {
	var OZ = _.isArray(obj) ? new Array() : new String();
	function UZ(obj) {
		url = obj.type ? obj.type + '://' : 'http://', 
		url += obj.user ? obj.user + ':' : '', 
		url += obj.pass ? obj.pass + '@' : '', 
		url += obj.host ? obj.host : 'localhost', 
		url += obj.port == 80 || !obj.port ? '' : ':' + obj.port, 
		url += obj.path ? '/' + obj.path : '/';
		return url;
	};
	if( _.isArray( obj ) ){
		for (var i = obj.length - 1; i >= 0; i--)
			OZ.push( _.isObject( obj[i] ) ? UZ( obj[i] ) : _.isStirng( obj[i] ) ? obj[i] : null );	
	} else {
		OZ = _.isObject(obj) ? UZ(obj) : obj ;
	};
	return _.isArray(obj) ? _.compact( OZ ).join(',') : OZ;
};

exports.console = function(x, y, z) {
	if (_.isArray(x) ? x.length > 0 : x) {
		w = new Date().toString();
		if (_.isArray(x)) {
			for (var i = 0, j = x.length; i < j; i++)
				x += ' - ' + x[i];
		} else {
			w += ' -- ' + x;
		};
		w += y ? ' -- ' + JSON.stringify(y) : '';
		w += z ? ' -- ' + JSON.stringify(z) : '';
		console[ _.isObject(y) ? 'log' : 'error' ](w);
		process.exit(this);
	};
};

exports.read = function(url) {
	//Aqui esta el chiste de todo Eso debe descargar una BD y leerla por stream
};
