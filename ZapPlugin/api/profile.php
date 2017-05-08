<?php

/*if(isset($_POST['username']))
error_log('post works');

error_log(var_dump($_POST));
*/$postdata = file_get_contents("php://input");
error_log(var_dump($postdata));

$request = json_decode($postdata);
$email = $request->username;
$pass = $request->password;

error_log($postdata);
$result = ['success'=>['username'=>$email,'password'=>$password],'message'=>"Hello $email"];
echo  json_encode($result);
