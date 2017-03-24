<?php
error_reporting(E_ERROR|E_COMPILE_ERROR|E_PARSE|E_CORE_ERROR|E_USER_ERROR);

#WARNING: this router/controller are for referece only.#V20170324

(function($webroot,$uu,$HTTP_RAW_POST_DATA){
	if($uu==''){
		require $webroot.'index.php';return;
	}
	$uu=$webroot.$uu;
	foreach(
		array(
			"/(,?)([^\/,]*)[\.|,]([^\.]*),?(.*)\.(api|static|web|json)$/"=>function(&$uu,$pattern,$matches){
				$_c=$_REQUEST['_c']=$_GET['_c']=$matches[2];
				$_m=$_REQUEST['_m']=$_GET['_m']=$matches[3];
				$uu=dirname($uu).'/'.($matches[5]=='static'?'static':'index').'.php';
			},

			"/([^\/]*)\.shtml$/"=>function(&$uu,$pattern,$matches){
				$_REQUEST['_p']=$_GET['_p']=$matches[1];
				if(file_exists(dirname($uu).'/shtml.php')){
					chdir(dirname($uu));
					require dirname($uu).'/shtml.php';
					return true;
				}
			},
			"/([^\/]*)\.api$/"=>function(&$uu,$pattern,$matches){
				$_REQUEST['_m']=$_GET['_m']=$matches[1];
				$uu=dirname($uu).'/index.php';
			},
			"/([^\/]*)\.static$/"=>function(&$uu,$pattern,$matches){
				$_REQUEST['_m']=$_GET['_m']=$matches[1];
				$uu=dirname($uu).'/static.php';
			},
			//TODO ./upload/ mapping to ..

			"/\/$/"=>function($uu){
				if(file_exists($uu .'index.php')){
					chdir($uu);
					require $uu.'index.php';
					return true;
				}
			},
			"/\.php$/"=>function($uu,$pattern){
				if(file_exists($uu)){
					chdir(dirname($uu));
					require basename($uu);
					return true;
				}else{
					echo "404 $uu ...";return true;
				}
			},
			"/\.(js|css|jpg|jpeg|png|gif|ttf|htm|json)$/"=>function($uu,$pattern){
				if(file_exists($uu)){
					echo file_get_contents($uu);
					return true;
				}
			},
			''=>function($uu){
				print "404 $uu";
			}
	) as $k=>$v){
		$matches=array();
		if($k=='' || preg_match($k,$uu,$matches)){
			if(true===$v($uu,$k,$matches)) break; else continue;
		}
	}
})(
	'webroot/',
	(function(){
		$rt=$_SERVER['REQUEST_URI'];
		if($rt) return ltrim($rt);
		$rt=$_SERVER['PATH_INFO'];
		if($rt) return ltrim($rt);
		return '/';//nothing?
	})(),
	(function(){
		global $HTTP_RAW_POST_DATA,$_POST;
		$POST_TRY=0;
		if($HTTP_RAW_POST_DATA==""){
			$POST_TRY=1;
			$HTTP_RAW_POST_DATA=file_get_contents("php://stdin");
			if($HTTP_RAW_POST_DATA==""){
				$POST_TRY=2;
				$HTTP_RAW_POST_DATA=file_get_contents("php://input");
				if($HTTP_RAW_POST_DATA==""){
					$POST_TRY=3;
					$HTTP_RAW_POST_DATA=json_encode($_POST);//join('&',$_POST);
				}
			}
		}
		return array($HTTP_RAW_POST_DATA,$POST_TRY);
	})()
);

