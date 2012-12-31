var _ = require('underscore'), 
	path 	= require('path'), 
	dir 	= path.join(__dirname, '..'), 
	config 	= require(path.join(dir, 'lib', 'config.js'));

exports.url = function(obj){
	url = obj.type ? obj.type + '://' : 'http://', 
	url += obj.user ? obj.user + ':' : '', 
	url += obj.pass ? obj.pass + '@' : '', 
	url += obj.host ? obj.host : 'localhost', 
	url += obj.port == 80 || !obj.port ? '' : ':' + obj.port, 
	url += obj.path ? '/' + obj.path : '/';
	return url;
};

exports.console = function(x, y, z) {
		if (_.isArray(x) ? x.length > 0 : x ) {
			w = new Date().toString();
			if ( _.isArray(x) ) {
				for (var i = 0, j = x.length; i < j; i++)
					x += ' - ' + x[i];
			} else {
				w += ' -- ' + x;
			};
			w += y ? ' -- ' + JSON.stringify(y) : '';
			w += z ? ' -- ' + JSON.stringify(z) : '';
			console[ _.isObject(y) ? 'log' : 'error' ]( w );
			process.exit(this);
		};
	};

exports.orden = function(val){
	vals = val || config.get('fiels');
	return vals.split(',');
};

exports.LineToObjt = function(string, divid, orden, callback){
	obj = new Object;
	esto = string.split(divid);
	for (var i=0; i < esto.length; i++) {
		for (var x=0; x < orden.length; x++) {
			switch ( orden[x] ) {
				case config.get('countries'):
					obj[config.get('countries')] = esto[i];
					break;
				case config.get('city'):
					obj[config.get('city')] = esto[i];
					break;
				case config.get('lang'):
					obj[config.get('lang')] = esto[i];
					break;
				case config.get('lat'):
					obj[config.get('lat')] = esto[i];
					break;
				case config.get('code'):
					obj[config.get('code')] = esto[i];
					break;
				case config.get("IPv4From"):
					obj[config.get("IPv4From")] = esto[i];
					break;
				case config.get("IPv4To"):
					obj[config.get("IPv4To")] = esto[i];
					break;
				case config.get("IPv6From"):
					obj[config.get("IPv6From")] = esto[i];
					break;
				case config.get("IPv6To"):
					obj[config.get("IPv4To")] = esto[i];
					break;
				default:
					obj.adiciona.push(esto[i]);
					break;
			};
		};
	};
	return callabck(_.isArray(obj.adiciona) ? 'Error fail': null, obj);
};
exports.isLocal = function(url){
	return url.substring(0,7) == 'http';
};