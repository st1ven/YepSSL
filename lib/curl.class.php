<?php
function curl_post_ssl($vars) {
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_HTTPHEADER,array('application/x-www-form-urlencoded'));
    curl_setopt($ch,CURLOPT_TIMEOUT,60);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);
    curl_setopt($ch,CURLOPT_URL,'https://api.startssl.com');
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,false);
    curl_setopt($ch,CURLOPT_SSLCERTTYPE,'PEM');
    curl_setopt($ch,CURLOPT_SSLCERT,'cert/cert.pem');
    curl_setopt($ch,CURLOPT_SSLCERTPASSWD,'Sangzijin0410');
    curl_setopt($ch,CURLOPT_SSLKEYTYPE,'PEM');
    curl_setopt($ch,CURLOPT_SSLKEY,'cert/private.pem');
    curl_setopt($ch,CURLOPT_POST,1);
    curl_setopt($ch,CURLOPT_POSTFIELDS,'RequestData={"tokenID":"tk_729333fe4e4b4ce5b8ad219b4d7cfe9f",'.$vars.'}');
    $data = curl_exec($ch);
    curl_close($ch);
    if($data){
        return $data;
    }else{
        return false;
    }
}
function curl_post_key($email,$domain) {
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_HTTPHEADER,array('application/x-www-form-urlencoded; charset=UTF-8'));
    curl_setopt($ch,CURLOPT_REFERER,'https://www.chinassl.net/ssltools/generator-csr.html');
    curl_setopt($ch,CURLOPT_TIMEOUT,30);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1);
    curl_setopt($ch,CURLOPT_URL,'https://www.chinassl.net/ssltools/generator-csr/generator-csr.php');
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,false);
    curl_setopt($ch,CURLOPT_POST,1);
    curl_setopt($ch,CURLOPT_POSTFIELDS,'email='.$email.'&domain='.$domain.'&company='.$domain.'&department='.$domain.'&city=Laiwu&province=Shandong&country=CN&cryptography_algorithms=rsa&hash_algorithms=sha256&keysize=2048');
    $data = curl_exec($ch);
    curl_close($ch);
    if($data){
        return $data;
    }else{
        return false;
    }
}