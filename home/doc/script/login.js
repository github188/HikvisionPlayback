var g_lxdLogin = null; // Login.xml
/**********************************
功能: 初始化界面
***********************************/
function InitLogin()
{
   // debugger;
    
	var szUrl = decodeURI(document.URL);
	if(szUrl.indexOf("anonymous=true") != -1){
		$.cookie("enableAnonymous"+m_lHttpPort,"true");
		$("#divAnonymous").show();
	}else{
		$.cookie("enableAnonymous"+m_lHttpPort,"false");
		$("#divAnonymous").hide();
	}
	var szLanguage = $.cookie('language');
	if (szLanguage === null) // 如果直接到登录界面，也获取一下语言
	{
		if (navigator.appName === "Netscape" || navigator.appName === "Opera")
		{
			var sysLanguage = navigator.language.toLowerCase();
		}
		else
		{
			var sysLanguage = navigator.browserLanguage.toLowerCase();
		}
		szLanguage = sysLanguage.substring(0,2);
		if(szLanguage == "zh") {  //中文需要区分简体和繁体
			var arSysLan = sysLanguage.split("-");
			if (arSysLan.length === 2) {
				var szLanguage = arSysLan[0].toLowerCase() + "_" + arSysLan[1].toUpperCase();
				if(arSysLan[1].toLowerCase() === "cn") {
					$.cookie('language', 'zh');
				} else {
				    $.cookie('language', szLanguage);
				}
			}
		} else {
			$.cookie('language', szLanguage);
		}
		/*var arSysLan = sysLanguage.split("-"); //目前的机制认为不会出现“zh”格式的系统语言标示
		if (arSysLan.length === 2) {
			szLanguage = arSysLan[0].toLowerCase() + "_" + arSysLan[1].toUpperCase();
			if (arSysLan[0].toLowerCase() === "zh") { // 在支持繁体中文前，zh_HK和zh_TW都显示zh_CN
				szLanguage = "zh_CN";
			}
			$.cookie('language', szLanguage);
		} else {
			szLanguage = null;
		}*/
	}
	translator.initLanguageSelect(szLanguage);
	g_lxdLogin = translator.getLanguageXmlDoc("Login");
	translator.translatePage(g_lxdLogin, document);
	window.parent.document.title = translator.translateNode(g_lxdLogin, "lalogin");
	
	if (!(document.cookie || navigator.cookieEnabled))
    {
		alert(translator.translateNode(g_lxdLogin, "CookieTips"));
		return;
	}
	loginEventBind();
	$('#UserName').focus();
	$("#chAnonymous").click(function(){
		if($(this).prop("checked")){
			$("#UserName").prop("disabled", true);
			$("#Password").prop("disabled", true);
		}else{
			$("#UserName").prop("disabled", false);
			$("#Password").prop("disabled", false);
		}
	});
}
/**********************************
功能: 按回车键登录
***********************************/
document.onkeydown=function (event) 
{
	event = event?event:(window.event?window.event:null);	 
	 if(event.keyCode==13)
	{
		DoLogin(); 
	}
}
/**********************************
功能: 计算字符串的长度
参数: szString: 输入的字符串
***********************************/   
function JudgeTextLength(szString)
{
	var  iLength = 0;   
   	for(var i=0; i<szString.length; i++)   
   	{   
		if(szString.charCodeAt(i)>255)   
	  	{   
			iLength+=2;   
	  	}   
	  	else   
	  	{   
	    	iLength+=1;   
	  	}        
   	}   
   	return  iLength;    
}
/**********************************
功能: 登陆
***********************************/
function DoLogin()                            
{
    debugger;
	$("#LoginBtn").focus();
	if(!$("#chAnonymous").prop("checked")){
		//用户名为空时提示  
		if($('#UserName').val().length==0)
		{ 
			$('#UserName').focus();
			alert(translator.translateNode(g_lxdLogin, 'LoginTips1'));
			return false
		} 	
		if(JudgeTextLength($('#UserName').val()) > 16)
		{
			$('#UserName').focus();
			$('#UserName').val('');
			alert(translator.translateNode(g_lxdLogin, 'LoginTips2'));
			return false;
		} 	
		if(JudgeTextLength($('#Password').val()) > 16)
		{
			$('#Password').focus();
			$('#Password').val('');
			alert(translator.translateNode(g_lxdLogin, 'LoginTips3'));
			return false;
		}
		m_szUserPwdValue = Base64.encode($('#UserName').val() + ":" + $('#Password').val());
	}else{
		m_szUserPwdValue = Base64.encode("");/*anonymous:\177\177\177\177\177\177*/
	}
	//alert(m_szUserPwdValue);
	m_szUserPwdValue = "YWRtaW46MTIzNDU=";
	//alert();
	
   // debugger;
    $.getJSON("http://admin:12345@149.5.42.144:80/PSIA/Custom/SelfExt/userCheck",
function (data) {
    alert('jj');
});
	//alert(m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/userCheck");
   // url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/userCheck",
	/*$.getJSON({
		type: "GET",
		url: "http://149.5.42.144:80:80/PSIA/Custom/SelfExt/userCheck",
		async: true,
		timeout: 15000,
		crossDomain: true,
		datatype: "jsonp",
		beforeSend: function (xhr) {
		//    alert("149.5.42.144:80:4789/PSIA/Custom/SelfExt/userCheck");
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("200" == xmlDoc.documentElement.getElementsByTagName('statusValue')[0].childNodes[0].nodeValue)
			{
				var szUrl = decodeURI(document.URL);
				if(szUrl.indexOf("?page=") != -1)
				{
					var szPage = szUrl.substring(szUrl.indexOf("page=") + 5, szUrl.indexOf("&params="));
					if(szPage.indexOf(".asp") == -1)
					{
						szPage = szPage.concat(".asp");
					}
					var szParam = szUrl.substring(szUrl.indexOf("&params=") + 8, szUrl.length);
					$.cookie('page',szPage+"?"+szParam+"%1");
				}
				else
				{
					$.cookie('page',null);
				}
				
				$.cookie('userInfo'+m_lHttpPort,m_szUserPwdValue==""?Base64.encode("anonymous:\177\177\177\177\177\177"):m_szUserPwdValue);
				window.location.href = "main.asp";
			}
			else
			{   
				if(!$('#UserName').prop("disabled")) {
					$('#UserName').focus();
				}
				$('#UserName').val('');
				$('#Password').val('');
				alert(translator.translateNode(g_lxdLogin, 'LoginTips4'));
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if("timeout" == textStatus)
			{
				alert(translator.translateNode(g_lxdLogin, 'ConnectTimeoutTips'));
			}
			else
			{
				alert(translator.translateNode(g_lxdLogin, 'NetworkErrorTips'));
			}
		}
	});
    */
}

/*************************************************
Function:		ChangeFrameLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无				
*************************************************/
function ChangeFrameLanguage(lan)
{
	$.cookie('language', lan);
	g_lxdLogin = translator.getLanguageXmlDoc("Login", lan);
	translator.translatePage(g_lxdLogin, document);
	window.parent.document.title = translator.translateNode(g_lxdLogin, "lalogin");
}
/*************************************************
Function:		CheckKeyDown
Description:	输入时按下空格时，不允许输入
Input:			iSetId: 需要验证表单Id	
				iSetValue: 需要验证的值	
Output:			无
return:			无				
*************************************************/
function CheckKeyDown(event)
{
	event = event?event:(window.event?window.event:null);
	if(event.keyCode == 32)   
    {
    	if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			event.preventDefault();
		}
		else
		{
		    event.returnValue = false;    //非ie浏览器event无returnValue属性
		}      
		return;
     }
}
/*************************************************
Function:		loginEventBind
Description:	事件绑定
Input:			无
Output:			无
return:			无				
*************************************************/
function loginEventBind() {
    //点击语言选择框
	$(".languageshow").bind({
	    click: function (e) {
			e.stopPropagation();
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			} else {
				$('#divLanguageChoose').show();
			}
		}
	});
	//点击语言选择框以为的地方
    $("body").bind({
	    click: function (e) {
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			}
		}
	});	
}