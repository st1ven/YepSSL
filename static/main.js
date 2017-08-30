    jQuery(document).ready(function() {
        $.material.init()
		var csr_raw
		var raemail
		var getverify = false
		function randomString(len) {
		　　len = len || 32;
		　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		　　var maxPos = $chars.length;
		　　var pwd = '';
		　　for (i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		　　}
		　　return pwd;
		}
		
		function get_cert()
		{
			if (!getverify)
			{
				set_alert("#code #alert","danger","请先验证您的来源");
				return
			}
			$("#bstep #gp2").slideDown();
			$("#bstep .alert").addClass("alert-warning").removeClass("alert-danger")
			$("#bstep .alert").text("1/2 正在获取CSR和私钥")
			$.ajax({
					type: "get",
					url: "api.php",
					dataType : "json",
					data : {
						domain: $("#vdomain").val(),
						action : "getcsrandkey",
						email :  raemail
					},
					success: function(data){
						csr_raw = data.csr
						$("#bstep #key pre").text(data.key)
						$("#bstep #key").slideDown()
						$("#bstep .alert").text("2/2 正在获取证书")
						$.ajax({
							type: "post",
							url: "api.php?action=getcert",
							dataType : "json",
							data : {
								domain: $("#vdomain").val(),
								csr :  csr_raw
							},
							success: function(data){
								$("#bstep #gp2").slideUp();
								if (data.status == 0)
								{
									$("#bstep .alert").html('<span class="glyphicon glyphicon-remove"></span> 获取证书失败 , 请稍后再试')
									$("#bstep .alert").attr("class","alert alert-danger")
									return
								}
									$("#bstep #pem pre").text(atob(data.data.certificate) || "浏览器不支持base64解码")
									$("#bstep #capem pre").text(atob(data.data.intermediateCertificate) || "浏览器不支持base64解码")
									$("#bstep #pem").slideDown()
									$("#bstep #capem").slideDown()
									$("#bstep .alert").html('<span class="glyphicon glyphicon-ok"></span> 证书已获取')
							},
							error: function(){
								$("#bstep .alert").text("网络错误 , 请稍后再试")
								$("#bstep .alert").attr("class","alert alert-danger")
							}
						})
					},
					error: function(){
						$("#bstep .alert").text("网络错误 , 请稍后再试")
						$("#bstep .alert").attr("class","alert alert-danger")
					}
			})
		}
		
		function set_alert(who,type,content)
		{
			var ramdomid = randomString(12)
			$(who).append('<div id="'+ramdomid+'" class="alert alert-'+type+'" role="alert" style="display: none;">'+content+'</div>')
			$(who+" #"+ramdomid).slideDown();
			setTimeout(function(){
				$(who+" #"+ramdomid).slideUp();
			},5000)
		}
		
		function fzzen(id)
		{
			howlong = 30
			re = $(id).attr("data-fz")
			if (re == 1)
			{
				$(id).attr("disabled",false)
				$(id).attr("data-fz","")
				$(id).text($(id).attr("data-sourcetext"))
				return
			}
			if (re == "" || re == undefined || re == null)
			{
				re = howlong
				$(id).attr("data-sourcetext",$(id).text())
			}
			$(id).attr("disabled",true)
			re -= 1
			$(id).attr("data-fz",re)
			$(id).text($(id).attr("data-sourcetext") + " ("+re+")")
			setTimeout(function(){
				fzzen(id,howlong)
			},1000)
		}
		
		$("#verfiyvvcode").click(function(){
			$("#vvcode").attr("disabled",true)
			$("#code .active").slideDown()
			$("#verfiyvvcode").slideUp()
			console.log($("#vvcode").val())
			if ($("#vvcode").val() == "")
			{
				$("#vvcode").attr("disabled",false)
				$("#code .active").slideUp()
				$("#verfiyvvcode").slideDown()
				set_alert("#code #alert","danger","认证码不能为空")
				return
			}
			else if($("#vvcode").val().length < 10 || $("#vvcode").val().length > 30)
			{
					$("#vvcode").attr("disabled",false)
					$("#code .active").slideUp()
					$("#verfiyvvcode").slideDown()
					set_alert("#code #alert","danger","认证码长度错误")
					return
			}
			else if($("#vvcode").val().indexOf("Normal") == -1 && $("#vvcode").val().indexOf("Gift") == -1 && $("#vvcode").val().indexOf("Special") == -1)
			{
				$("#vvcode").attr("disabled",false)
				$("#code .active").slideUp()
				$("#verfiyvvcode").slideDown()
				set_alert("#code #alert","danger","认证码格式错误")
				return
			}
			else 
			{
			$.ajax({
					type: "get",
					url: "api.php",
					dataType : "text",
					data : {
						action : "getverify",
						code : $("#vvcode").val()
					},
					success: function(data){
						if (data == "ok")
						{
							$("#code .active").slideUp()
							getverify=true
							set_alert("#code #alert","success","已认证 , 操作时长 1 小时 超时无效");
							return;
						}
						if (data == "used")
						{
							$("#vvcode").attr("disabled",false)
							$("#code .active").slideUp()
							$("#verfiyvvcode").slideDown()
							set_alert("#code #alert","danger","认证码已被使用");
							return;
						}
						$("#vvcode").attr("disabled",false)
						$("#code .active").slideUp()
						$("#verfiyvvcode").slideDown()
						set_alert("#code #alert","danger","认证码无效");
					},
					error: function(){
					$("#vvcode").attr("disabled",false)
					$("#code .active").slideUp()
					$("#verfiyvvcode").slideDown()
						set_alert("#code #alert","danger","网络错误 , 请稍后再试");
					}
			})
			}
		})
		
		$("#resend").click(function(){
						$("#step3 .active").slideDown()
						$("#step3").slideDown()
						$("#step4").slideUp()
						$("#verfiyemail").click()
						$("#resend").attr("disabled",true)
		})
		
		$("#verfiycode").click(function(){
			raemail=$("#email:checked").val()
			$("#vcode").attr("disabled",true)
			$("#step4").slideUp()
			$("#gp").slideDown()
			$.ajax({
					type: "get",
					url: "api.php",
					dataType : "json",
					data : {
						domain: $("#vdomain").val(),
						action : "pushcode",
						email : $("#email:checked").val(),
						code : $("#vcode").val()
					},
					success: function(data){
						$("#gp").slideUp()
						if (data.status == 0)
						{
							$("#step4").slideDown()
							$("#vcode").attr("disabled",false)
							set_alert("#domain #alert","danger","验证失败 , 请稍后再试");
							return
						}
						  if (data.status == 3)
						  {
							$("#vcode").attr("disabled",false)
							set_alert("#domain #alert","danger","验证失效 , 请刷新页面重新验证您的来源");
							return
						  }
						  if (data.status == 4)
						  {
							$("#vcode").attr("disabled",false)
							set_alert("#domain #alert","danger","有效期已到期 , 请刷新页面重新验证您的来源");
							return
						  }
						set_alert("#domain #alert","success","验证成功 , 正在颁发证书");
						get_cert()
					},
					error: function(){
						$("#vcode").attr("disabled",false)
						$("#gp").slideUp()
						$("#step4").slideDown()
						set_alert("#domain #alert","danger","网络错误 , 请稍后再试");
					}
			})
		})
		
		$("#verfiyemail").click(function(){
			if (!getverify)
			{
				set_alert("#code #alert","danger","请先验证您的来源");
				return
			}
			getemail=$("#email:checked").val()
			if (getemail == "" || getemail == undefined || getemail == null)
			{
				set_alert("#domain #alert","danger","请选择一个邮箱")
			}
			$("#verfiyemail").slideUp()
			$("#step3 .active").slideDown()
			$("#email_select input").attr("disabled",true)
			$.ajax({
					type: "get",
					url: "api.php",
					dataType : "json",
					data : {
						domain: $("#vdomain").val(),
						action : "requestdomainvaild",
						email : getemail
					},
					success: function(data){
						if (data.status == 0)
						{
							$("#email_select input").attr("disabled",false)
							$("#verfiyemail").slideDown()
							$("#step3 .active").slideUp()
							set_alert("#domain #alert","danger","域名/邮箱错误 或 域名已验证 或 服务器正忙");
							return
						}
						  if (data.status == 3)
						  {
							$("#email_select input").attr("disabled",false)
							$("#verfiyemail").slideDown()
							$("#step3 .active").slideUp()
							set_alert("#domain #alert","danger","验证失效 , 请刷新页面重新验证您的来源");
							return
						  }
						  if (data.status == 4)
						  {
							$("#email_select input").attr("disabled",false)
							$("#verfiyemail").slideDown()
							$("#step3 .active").slideUp()
							set_alert("#domain #alert","danger","有效期已到期 , 请刷新页面重新验证您的来源");
							return
						  }
						set_alert("#domain #alert","success","邮件已发送");
						fzzen("#resend")
						$("#step3 .active").slideUp()
						$("#step3").slideUp()
						$("#step4").slideDown()
						console.log(data)
					},
					error: function(){
						$("#email_select input").attr("disabled",false)
						$("#verfiyemail").slideDown()
						$("#step3 .active").slideUp()
						set_alert("#domain #alert","danger","网络错误 , 请稍后再试");
					}
			})
		})
		
		$("#verfiydomain").click(function(){
			if (!getverify)
			{
				set_alert("#code #alert","danger","请先验证您的来源");
				return
			}
			$("#vdomain").attr("disabled",true)
			$("#step2").slideDown()
			$("#verfiydomain").slideUp()
			if ($("#vdomain").val() == "")
			{
				$("#vdomain").attr("disabled",false)
				$("#step2").slideUp()
				$("#verfiydomain").slideDown()
				set_alert("#domain #alert","danger","域名不能为空")
				return
			}
			else if($("#vdomain").val().indexOf(".") == -1)
			{
				$("#vdomain").attr("disabled",false)
				$("#step2").slideUp()
				$("#verfiydomain").slideDown()
				set_alert("#domain #alert","danger","域名格式不正确")
				return
			}
			else
			{
				$.ajax({
					type: "get",
					url: "api.php",
					dataType : "json",
					data : {
						domain: $("#vdomain").val(),
						action : "querywhois"
					},
					success: function(data){
						  if (data.status == 0)
						  {
							$("#vdomain").attr("disabled",false)
							$("#step2").slideUp()
							$("#verfiydomain").slideDown()
							set_alert("#domain #alert","danger","域名错误或服务器正忙");
							return
						  }
						  if (data.status == 3)
						  {
							$("#vdomain").attr("disabled",false)
							$("#step2").slideUp()
							$("#verfiydomain").slideDown()
							set_alert("#domain #alert","danger","验证失效 , 请刷新页面重新验证您的来源");
							return
						  }
						  if (data.status == 4)
						  {
							$("#vdomain").attr("disabled",false)
							$("#step2").slideUp()
							$("#verfiydomain").slideDown()
							set_alert("#domain #alert","danger","有效期已到期 , 请刷新页面重新验证您的来源");
							return
						  }
						  if (data.status == 2)
						  {
							$("#step2").slideUp()
							raemail="postmaster@"+$("#vdomain").val()
							get_cert()
							set_alert("#domain #alert","success","域名已验证 , 正在颁发证书");
							return 
						  }
						  $("#step3").slideDown()
						  $("#step2").slideUp()
						  $("#email_select").html("")
						  data.data.split("|").forEach(function(e){  
							if (e != "")
							{
								$("#email_select").append('<div class="radio"><label><input type="radio" id="email" name="email" value="'+e+'">'+e+'</label></div>')
							}
								
						  })
						  $.material.init()
					},
					error: function(){
						$("#vdomain").attr("disabled",false)
						$("#step2").slideUp()
						$("#verfiydomain").slideDown()
						set_alert("#domain #alert","danger","网络错误 , 请稍后再试");
					}
				})
			}
		})
		
						$("#regetcert").click(function(){
								$("#regetcert").slideUp()
								$("#rrrr_domain").attr("disabled",true)
								$("#rrrr_email").attr("disabled",true)
								$("#rrrr_code").attr("disabled",true)
								$("#findmycert .progress").slideDown()
								if ($("#rrrr_domain").val() == "")
								{
									$("#rrrr_domain").attr("disabled",false)
									$("#rrrr_email").attr("disabled",false)
									$("#rrrr_code").attr("disabled",false)
									$("#regetcert").slideDown()
									$("#findmycert .progress").slideUp()
									set_alert("#findmycert #alert","danger","域名不能为空")
									return
								}
								if ($("#rrrr_code").val() == "")
								{
									$("#rrrr_domain").attr("disabled",false)
									$("#rrrr_email").attr("disabled",false)
									$("#rrrr_code").attr("disabled",false)
									$("#regetcert").slideDown()
									$("#findmycert .progress").slideUp()
									set_alert("#findmycert #alert","danger","认证码不能为空")
									return
								}
								if ($("#rrrr_email").val() == "")
								{
									$("#rrrr_domain").attr("disabled",false)
									$("#rrrr_email").attr("disabled",false)
									$("#rrrr_code").attr("disabled",false)
									$("#regetcert").slideDown()
									$("#findmycert .progress").slideUp()
									set_alert("#findmycert #alert","danger","邮箱不能为空")
									return
								}
								if($("#rrrr_domain").val().indexOf(".") == -1)
								{
									$("#rrrr_domain").attr("disabled",false)
									$("#rrrr_email").attr("disabled",false)
									$("#rrrr_code").attr("disabled",false)
									$("#regetcert").slideDown()
									$("#findmycert .progress").slideUp()
									set_alert("#findmycert #alert","danger","域名格式不正确")
									return
								}
								if($("#rrrr_email").val().indexOf("@") == -1  && $("#rrrr_email").val().indexOf(".") == -1)
								{
									$("#rrrr_domain").attr("disabled",false)
									$("#rrrr_email").attr("disabled",false)
									$("#rrrr_code").attr("disabled",false)
									$("#regetcert").slideDown()
									$("#findmycert .progress").slideUp()
									set_alert("#findmycert #alert","danger","邮箱格式不正确")
									return
								}
								$.ajax({
									type: "get",
									url: "api.php",
									dataType : "json",
									data : {
										domain: $("#rrrr_domain").val(),
										action : "reget_cert",
										email :  $("#rrrr_email").val(),
										code : $("#rrrr_code").val(),
									},
									success: function(data){
										if (data.status == 3)
										{
											$("#rrrr_domain").attr("disabled",false)
											$("#rrrr_email").attr("disabled",false)
											$("#rrrr_code").attr("disabled",false)
											$("#regetcert").slideDown()
											$("#findmycert .progress").slideUp()
											set_alert("#findmycert #alert","danger","找不到符合的资料")
											return
										}
										else
										{
											var ramdomid = randomString(12)
											$("#findmycert #alert").append('<div id="'+ramdomid+'" class="alert alert-success" role="alert" style="display: none;">证书已取回 , 关闭本窗口后可见</div>')
											$("#findmycert #alert"+" #"+ramdomid).slideDown();
											$("#key pre").html(data.key);
											$("#pem pre").html(data.pem);
											$("#key").slideDown()
											$("#pem").slideDown()
											$("#code").slideUp()
											$("#domain").slideUp()
											$("#findmycert .progress").slideUp()
											$("#rrrr_code").parent().slideUp()
											$("#rrrr_email").parent().slideUp()
											$("#rrrr_domain").parent().slideUp()
											$("#bstep .alert").addClass("alert-success").removeClass("alert-danger")
											$("#bstep .alert").html('<span class="glyphicon glyphicon-ok"></span> 证书已取回')
										}
									},
									error: function(){
										$("#rrrr_domain").attr("disabled",false)
										$("#rrrr_email").attr("disabled",false)
										$("#rrrr_code").attr("disabled",false)
										$("#regetcert").slideDown()
										$("#findmycert .progress").slideUp()
										set_alert("#findmycert #alert","danger","网络错误 , 请稍后再试")
										return
									}
								})
						})
    })