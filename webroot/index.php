<?php
global $HTTP_RAW_POST_DATA;
if($_SERVER['REQUEST_METHOD']=='POST'){
	var_dump($HTTP_RAW_POST_DATA);
}
?>
<form action="post.php" method="POST"/>
<input type="text" name="honda" value="toshiba"/>
<input type="submit" value="submit post"/>
</form>
<?
phpinfo();