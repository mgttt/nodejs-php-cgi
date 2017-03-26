//eg:
//node test_app.js [-port=1338] -cgi=`which php-cgi`
function argv2o(argv){
	var argv_o={};
	for(k in argv){
		var m,mm,v=argv[k];
		argv_o[""+k]=v;
		(m=v.match(/^--?([a-zA-Z0-9-_]*)=(.*)/))&&(argv_o[m[1]]=(mm=m[2].match(/^".*"$/))?mm[1]:m[2]);
	}
	return argv_o;
}
var argo=argv2o(process.argv);//console.log(argo)
console.log(argo);
var http_server=require('http').createServer(require("./php-cgi.js")({ bin:argo.cgi }))
.listen(ppp=argo.port||80,hhh=argo.host||'0.0.0.0',()=>{
	console.log(hhh+':'+ppp);
});
