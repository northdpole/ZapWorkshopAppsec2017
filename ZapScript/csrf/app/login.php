<?php
session_start();
$loggedIn = false;
if (empty($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}
if ($_POST['query']==='test' &&
    $_POST['nx']==='test' &&
    hash_equals($_SESSION['token'], $_POST['csrf_token'])){
      $loggedIn=true;
}
 ?>
<!DOCTYPE html>
<html>
  <head>
    <title>Adder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <style>
        .container {
            max-width: 500px;
            padding-top: 20px;
        }
        input {
            max-width: 200px;
        }
    </style>
  </head>
  <body>
    <div class="container">
        <h1>Adder</h1>
        <br>
        <?php if ($loggedIn !== true){
          echo '
        <form role="form" method="post">
            <div class="form-group">
                <input type="text" class="form-control" name="query" placeholder="What\'s your name?" required>
                <input type="text" class="form-control" name="nx" placeholder="What\'s your surname?" required>
                <input type="hidden" name="csrf_token" value="'.$_SESSION['token'].'"/>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
        </form>
        <br>';}else{
          header("Location: /profile.php?name=");
          die();
      } ?>
    </div>
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
  </body>
</html>
