exports.sendJson = function(req, res, data) {
	res.writeHead(200, {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"});
	if(data) {
		res.write(JSON.stringify(data));
	}
	res.end();
}

exports.sendError = function(req, res, data) {
	res.writeHead(500, {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"});
	if(data) {
		res.write(JSON.stringify(data));
	}
	res.end();	
}