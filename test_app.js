//TODO argv2o

var port=1338;
var host='0.0.0.0';

var http_server=require('http').createServer(require("./php-cgi.js")({}))
	.listen(port, host, () => {
		console.log(host+':'+port+"\n");
	});
