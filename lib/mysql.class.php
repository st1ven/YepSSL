<?php
class mysql{
	private $conn;
	//连接数据库
	public function connect($DB_HOST,$DB_USER,$DB_PASS,$DB_NAME){
		$this->conn = mysqli_connect($DB_HOST,$DB_USER,$DB_PASS,$DB_NAME)or die('Mysql Error');
	}
	//执行SQL语句
	public function query($sql){
		return mysqli_query($this->conn,$sql);
	}
	//获取单条数据
	public function getOne($sql){
		$result = $this->query($sql);
		if($result){
			$data = mysqli_fetch_assoc($result);
			return $data;
		}
		return false;
	}
	//获取多条数据
	public function getAll($sql){
		$result = $this->query($sql);
		if($result){
			$num = mysqli_num_rows($result);
			for($i = 0;$i <= $num;$i++){
				$arr[] = mysqli_fetch_assoc($result);
			}
			array_pop($arr);
			return $arr;
		}
		return false;
	}
	//字符串编码
	public function deStr($str){
		if(get_magic_quotes_gpc()){
			return $str;
		}else{
			return addslashes($str);
		}
	}
	//判断登录账号
	public function login($username,$password){
		if(empty($username) || empty($password)){
			return false;
		}
		$result = $this->getOne("select `username`,`password` from `admin` where `username` = '".$this->deStr($username)."' and `password` = '".$this->deStr($password)."'");
		if($result){
			return true;
		}else{
			return false;
		}
	}
	//判断认证码
	public function check($code){
		if(empty($code)){
			return false;
		}
		$result = $this->getOne("select `status` from `key` where `key` = '".$this->deStr($code)."'");
		if($result['status'] == 'ok'){
			return true;
		}else{
			return false;
		}
	}
	//检测登录状态
	public function iCookie(){
		return $this->login(@$_COOKIE['username'],@$_COOKIE['password']);
	}
	//检测认证码状态
	public function code(){
		return $this->check(@$_COOKIE['code']);
	}
	//更新认证码
	public function update($key,$status,$email,$domain,$pkey,$csr){
		if(empty($key) || empty($status) || empty($email) || empty($domain) || empty($pkey) || empty($csr)){
			return false;
		}
		return $this->query("update `key` set `status` = '".$this->deStr($status)."',`email` = '".$this->deStr($email)."',`domain` = '".$this->deStr($domain)."',`pkey` = '".$this->deStr($pkey)."',`csr` = '".$this->deStr($csr)."' where `key` = '".$this->deStr($key)."'");
	}
	//更新证书
	public function updateSSL($key,$pem,$order){
		if(empty($key) || empty($pem) || empty($order)){
			return false;
		}
		return $this->query("update `key` set `pem` = '".$this->deStr($pem)."',`order` = '".$this->deStr($order)."' where `key` = '".$this->deStr($key)."'");
	}
	//找回证书
	public function reGet($key,$domain,$email){
		if(empty($key) || empty($domain) || empty($email)){
			return false;
		}
		return $this->getOne("select `pem`,`pkey` from `key` where `key` = '".$this->deStr($key)."' and `domain`= '".$this->deStr($domain)."' and `email`= '".$this->deStr($email)."'");
	}
}