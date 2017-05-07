<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$email = $request->username;
$pass = $request->password;
error_log($postdata);
echo  "{ success: username = '$email' && password = '$pass' };";
echo "Hello $email";