const os = require("os");
const spawn = require('child_process').spawn;
const path = require("path");

module.exports = function(opts){

	var logger=opts.logger || console;

	return function(req,res){
		var tm0=new Date();

		var headersSent = false;

		var url=req.url;
		var host = (req.headers.host || '').split(':')
		var _env={
			__proto__: opts.env || {} //extends from..
			,SCRIPT_FILENAME:__dirname + "/route.php"
			,REMOTE_ADDR: req.connection.remoteAddress //TODO x-forwarded-for, x-real-ip
			//,'PATH_INFO':'/Users/wanjochan/Downloads/github/nodejs-php-cgi/test.php'
			//,'SERVER_SOFTWARE':"nodejs"
			,SERVER_PROTOCOL:"HTTP/1.1"
			,GATEWAY_INTERFACE:"CGI/1.1"
			,REQUEST_TIME_0:tm0.getTime()/1000
			,REQUEST_METHOD:req.method
			//,"PATH_INFO":path.normalize(reqEnv['DOCUMENT_ROOT']+reqdata.pathname)
			,PATH_INFO:url
			,QUERY_STRING: url.query || ''
			,SERVER_NAME: host[0]
			,SERVER_PORT: host[1] || 80
			,HTTPS: req.connection.encrypted ? 'On' : 'Off'
			//,REQUEST_URI:req.path
			//,REDIRECT_STATUS_ENV,0
			,REDIRECT_STATUS:200//This PHP CGI binary was compiled with force-cgi-redirect enabled.  This means that a page will only be served up if the REDIRECT_STATUS CGI variable is set, e.g. via an Apache Action directive...
		};
		//other headers
		for (var theHeader in req.headers) {
			_env['HTTP_' + theHeader.toUpperCase().split("-").join("_")] = req.headers[theHeader];
		}
		var cgi = spawn(opts.bin || '/usr/local/bin/php-cgi',
			opts.binarga || [],
			{'env':_env
				//,detached: true//https://nodejs.org/api/child_process.html#child_process_options_detached
				//On Windows, setting options.detached to true makes it possible for the child process to continue running after the parent exits. The child will have its own console window. Once enabled for a child process, it cannot be disabled.
				//On non-Windows platforms, if options.detached is set to true, the child process will be made the leader of a new process group and session. Note that child processes may continue running after the parent exits regardless of whether they are detached or not. See setsid(2) for more information.
			}).on('error',function(data){
				logger.log("cgi error:"+data.toString());//TODO use a logger to do something
			}).on('exit', function(code){
				res.end();
			});
		cgi.stderr.on('data',function(data) {
			logger.log("stderr.on(data):"+data.toString());
		});
		res.on('error',function(ex){
			logger.log("res.on(error):"+ex);
			//TODO dump req
		});
		cgi.stdout.on('end',function(){
			res.end();
		}).on('data',function(data){
			if (headersSent) {
				res.write(data);
			} else {
				var data_s=data.toString();
				var lines = data_s.split("\r\n");//TODO may improve the speed later
				for(var l=0;l<lines.length;l++) {
					if (lines[l] == "") {
						if (!res.getHeader("content-length")) {
							//stream the output
							res.setHeader('Transfer-Encoding', 'chunked');
						}
						res.writeHead(200);
						headersSent = true;
						res.write(lines.slice(l+1).join('\r\n'));//output the rest
						break;
					} else {
						var header = lines[l].split(":");
						if(header[0]=='X-Powered-By'){ continue; }
						res.setHeader(header[0], header[1]||'');
					}
				}//for
			}//if
		})
		//.on('error',function(data){
		//	logger.log("stderr.stdout.on(error):"+data);
		//})
		;
		req.pipe(cgi.stdin);
	};//return function
};
