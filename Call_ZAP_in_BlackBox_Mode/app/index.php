<html>
<body>
<?php 
if(isset($_GET['query']))
	echo '<div id="id_echo">'.$_GET['query'].'</div>';
if(isset($_GET['nx']))
	echo '<div id="id_echo">'.html_entities($_GET['nx'], ENT_QUOTES,"UTF-8").'</div>';
if(isset($_GET['s'])){
	$connection = new PDO('sqlite:./db.sqlite');
	$result = $connection->query("SELECT lastname FROM employees where name=".$_GET['s']);}
?>

<form method="GET">
<input type="text" name="query">
<button name="submit" type="submit" value="submit">   Submit</button>
</form>
<a href="index.php?x=a">a</a>
</body>
</html>
