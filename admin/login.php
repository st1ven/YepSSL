<?php 
include '../lib/mysql.class.php';
include '../conn.php';
if($_POST){
	if($M->login($_POST['username'],md5($_POST['password']))){
		setcookie('username',$_POST['username']);
		setcookie('password',md5($_POST['password']));
		header('Location:index.php');
		exit();
	}
}
if($M->iCookie()){
  header('Location:index.php');
  exit();
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>登录 - YepSSL管理系统</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="//cdn.bootcss.com/amazeui/2.7.1/css/amazeui.min.css">
</head>
<body>
<div class="am-g">
  <div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
    <h1>YepSSL管理系统</h1>
    <hr>
    <form action="" method="post" class="am-form">
      <label for="text">帐号</label>
      <input type="text" name="username">
      <br>
      <label for="password">密码</label>
      <input type="password" name="password">
      <br>
      <div class="am-cf">
        <input type="submit" value="登录" class="am-btn am-btn-primary am-btn-sm am-fl">
      </div>
    </form>
  </div>
</div>
</body>
</html>