﻿<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>index</title>
<script type="text/javascript" src="doc/script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="doc/script/jquery.cookie.js"></script>
<script language="JavaScript"> 
  
if (navigator.appName == 'Netscape' || navigator.appName == "Opera")
{
    var sysLanguage= navigator.language.toLowerCase();
}
else
{
    var sysLanguage= navigator.browserLanguage.toLowerCase();
}
var szLanguage = sysLanguage.substring(0,2);
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
/*var arSysLan = sysLanguage.split("-");
if (arSysLan.length === 2) {
	var szLanguage = arSysLan[0].toLowerCase() + "_" + arSysLan[1].toUpperCase();
	if (arSysLan[0].toLowerCase() === "zh") { // 在支持繁体中文前，zh_HK和zh_TW都显示zh_CN
		szLanguage = "zh_CN";
	}
	$.cookie('language', szLanguage);
} else {
	//alert("The system language is not supported!");
}*/
self.moveTo(0,0);   //使其IE窗口最大化
self.resizeTo(screen.availWidth,screen.availHeight);
$.cookie('updateTips', 'true');

window.location.href = "doc/page/login.aspx";
</script> 
</head>
<body>
<table cellspacing="0" cellpadding="0">
  <tr>
    <td></td>
  </tr>
</table>
</body>
</html>