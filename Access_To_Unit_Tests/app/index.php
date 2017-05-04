<html>
<body>
<?php

function processName($name){
	return "Hi $name";
}

function process(){
//	if(isset($_GET['query']))
//		echo '<div id="id_echo">'.$_GET['query'].'</div>';
	if(isset($_GET['hidden']))
		echo '<div id="id_hidden">'.$_GET['hidden'].'</div>';
	if(isset($_GET['nx']))
		echo '<div id="id_echo2">'.htmlentities($_GET['nx'], ENT_QUOTES,"UTF-8").'</div>';
	if(isset($_GET['s'])){
		$connection = new PDO('sqlite:./db.sqlite');
		$result = $connection->query("SELECT lastname FROM employees where name=".$_GET['s']);}
}
if(isset($_GET['query']) || isset($_GET['submit']))
	process();
?>

<form method="GET">
<input type="text" name="query">
<button name="submit" type="submit" value="submit">   Submit</button>
</form>
<a href="index.php?x=a">a</a>
</body>
</html>
