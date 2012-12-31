var _ = require('underscore');

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
	vals = val || 'id,country,city,lang,lat,IPv4From,IPv4To,IPv6From,IPv6To';
	return vals.split(',');
};

exports.LineToObjt = function(string, divid, orden, callback){
	obj = new Object;
	esto = string.split(divid);
	for (var i=0; i < esto.length; i++) {
		for (var x=0; x < orden.length; x++) {
			switch ( orden[x] ) {
				case "country":
					obj["country"] = esto[i];
					break;
				case "city":
					obj["city"] = esto[i];
					break;
				case "lang":
					obj["lng"] = esto[i];
					break;
				case "lat":
					obj["lat"] = esto[i];
					break;
				case "code":
					obj["code"] = esto[i];
					break;
				case "IPv4From":
					obj["IPv4From"] = esto[i];
					break;
				case "IPv4To":
					obj["IPv4To"] = esto[i];
					break;
				case "IPv6From":
					obj["IPv6From"] = esto[i];
					break;
				case "IPv6To":
					obj["IPv4To"] = esto[i];
					break;
				default:
					obj.adiciona.push(esto[i]);
					break;
			};
		};
	};
	return callabck(_.isArray(obj.adiciona) ? 'Error fail': null, obj);
};