<?php
header('Lifetime:+1s');
header('X-Powered-By:PHP/1.3.3');
include 'lib/mysql.class.php';
include 'lib/curl.class.php';
include 'conn.php';
$action = isset($_GET['action'])?$_GET['action']:null;
$domain = isset($_GET['domain'])?$_GET['domain']:null;
$pDomain = str_replace(array('http://','www.','*.'),'',isset($_POST['domain'])?$_POST['domain']:null);
$email = isset($_GET['email'])?$_GET['email']:null;
$code = isset($_GET['code'])?$_GET['code']:null;
$pCsr = isset($_POST['csr'])?$_POST['csr']:null;
switch ($action){
case 'getverify':
  $result = $M->check($code);
  if($result){setcookie("code",$code, time()+3600);echo 'ok';}else{echo 'used';}
  break;
case 'querywhois':
  if(!$M->code()){exit('{"status":"3"}');}
  echo curl_post_ssl('"actionType":"querywhois","domain":"'.$domain.'"');
  break;
case 'requestdomainvaild':
  if(!$M->code()){exit('{"status":"3"}');}
  echo curl_post_ssl('"actionType":"ApplyDomainVerification","domain":"'.$domain.'","authenEmail":"'.$email.'"');
  break;
case 'pushcode':
  if(!$M->code()){exit('{"status":"3"}');}
  echo curl_post_ssl('"actionType":"DomainValidation","domain":"'.$domain.'","authenEmail":"'.$email.'","authcode":"'.$code.'"');
  break;
case 'getcsrandkey':
  if(!$M->code()){exit('{"status":"3"}');}
  $result = explode('thisismyyahoohostspecialsplitstringhere',curl_post_key($email,$domain));
  $M->update(@$_COOKIE['code'],'used',$email,$domain,$result[1],$result[0]);
  echo json_encode(array('csr'=>urlencode($result[0]),'key'=>$result[1]));
  break;
case 'getcert':
  $result = curl_post_ssl('"actionType":"ApplyCertificate","certType":"IVSSL","domains":"*.'.$pDomain.','.$pDomain.'","CSR":"'.$pCsr.'"');
  $arr = json_decode($result,true);
  $M->updateSSL(@$_COOKIE['code'],$arr['data']['certificate'],$arr['data']['orderID']);
  echo $result;
  break;
case 'reget_cert':
  $result = $M->reGet($code,$domain,$email);
  if($result){echo json_encode(array('pem'=>base64_decode($result['pem']),'key'=>$result['pkey']));}else{echo '{"status":"3"}';}
  break;
default:
  echo '{"status":"3"}';
}
?>