/*
	Tenga cuidado al modificar este archivo
*/

module.exports = exports = require('configurable')({
	host : "localhost",
	port : 27017,
	user : false,
	pass : false,
	db : 'test',
	type : 'mongodb',
	geoip : "geoip",
	countries : "countries",
	lang : "lang",
	lat: "lat",
	code : "code",
	IPv4From : "IPv4From",
	IPv4To :"IPv4To",
	IPv6From:"IPv6From",
	IPv6To:"IPv4To",
	divisor : "', '",
	fiels : "id,countries,city,lang,lat,IPv4From,IPv4To,IPv6From,IPv6To",
	file : "dbCountrysAndIps.cvs"
});
