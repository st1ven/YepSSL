<?php
include '../lib/mysql.class.php';
include '../conn.php';
if(!$M->iCookie()){
  header('Location:login.php');
  exit();
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>首页 - YepSSL管理系统</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="//cdn.bootcss.com/amazeui/2.7.1/css/amazeui.min.css">
</head>
<body>
<div class="am-g">
  <div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
    <h1>YepSSL管理系统</h1>
    <div class="am-btn-group">
      <a href="./" class="am-btn am-btn-success am-btn-sm">管理首页</a>
      <a href="?action=key" class="am-btn am-btn-primary am-btn-sm">查看认证码</a>
      <a href="?action=logout" class="am-btn am-btn-warning am-btn-sm">退出登录</a>
    </div>
    <hr>
<?php
$action = isset($_GET['action'])?$_GET['action']:null;
$type = isset($_POST['type'])?$_POST['type']:null;
$num = isset($_POST['num'])?$_POST['num']:null;
switch ($action){
case 'make':
  echo '<ol>';
  for ($i = 0; $i < $num; $i++) {
    $key = uniqid($type);
    $result = $M->query("insert into `key` (`key`) values ('".$M->deStr($key)."')");
    if($result) {
      echo "<li>$key</li>";
    }else{
      echo '<li>生成失败</li>';
    }
  }
  echo '</ol><p><a href="./">返回首页</a></p>';
  break;
case 'key':
  echo <<<Html
<table class="am-table am-table-striped am-table-hover">
    <thead>
        <tr>
            <th>认证码</th>
            <th>使用状态</th>
            <th>认证邮箱</th>
            <th>认证域名</th>
            <th>订单号</th>
        </tr>
    </thead>
    <tbody>
Html;
  $result = $M->getAll("select * from `key` order by `id` desc");
  foreach($result as $value){
    echo '<tr><td>'.$value['key'].'</td><td>'.$value['status'].'</td><td>'.$value['email'].'</td><td>'.$value['domain'].'</td><td>'.$value['order'].'</td></tr>';
  }
echo <<<Html
    </tbody>
</table>
Html;
  break;
case 'logout':
  setcookie('username','password');
  header('Location:login.php');
  break;
default:
  echo <<<Html
    <form action="?action=make" method="post" class="am-form">
      <div class="am-form-group">
        <label for="type">认证码类型</label>
        <select id="type" name="type">
          <option value="Normal-">Normal - 普通</option>
          <option value="Gift-">Gift - 赠品</option>
          <option value="Special-">Special - 特殊渠道</option>
        </select>
        <span class="am-form-caret"></span>
      </div>
      <div class="am-form-group">
        <label for="num">生成数量</label>
        <input id="num" name="num" type="text" value="1">
      </div>
      <div class="am-form-group">
        <input type="submit" value="生成" class="am-btn am-btn-primary am-btn-sm am-fl">
      </div>
    </form>
Html;
}
?>
  </div>
</div>
</body>
</html>