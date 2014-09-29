<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title></title>
<script type="text/javascript" src="doc/script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="doc/script/jquery.cookie.js"></script>
<script src="doc/script/common.js"></script>
<script type="text/javascript">
function init()
{
	var szLanguage = $.cookie('language');
	if(szLanguage == null)				//如果直接到登录界面，也获取一下语言
	{
		if (navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			var sysLanguage= navigator.language.toLowerCase();
		}
		else
		{
			var sysLanguage= navigator.browserLanguage.toLowerCase();
		}
		var szLanguage = sysLanguage.substring(0,2);
        $.cookie('language', szLanguage);
	}
	
	var szUrl = decodeURI(document.URL);
	if(szUrl.indexOf("&page=")!=-1)
	{
		if(szUrl.indexOf("user=")!=-1 && szUrl.indexOf("&pass=")!=-1)
		{
			var szUser = szUrl.substring(szUrl.indexOf("user=") + 5, szUrl.indexOf("&pass="));
			var szPass = szUrl.substring(szUrl.indexOf("pass=") + 5, szUrl.indexOf("&page="));
		
			m_szUserPwdValue = Base64.encode(szUser + ":" + szPass);
			
			$.ajax(
			{
				type: "GET",
				url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/userCheck",
				async: true,
				timeout: 15000,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("If-Modified-Since", "0");
					xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				},
				success: function(xmlDoc, textStatus, xhr) 
				{
					var szUrl = decodeURI(document.URL);
					var szPage = szUrl.substring(szUrl.indexOf("&page=") + 6, szUrl.indexOf("[&"));
					if(szPage.indexOf(".asp") == -1)
					{
						szPage = szPage.concat(".asp");
					}
					var szParam = szUrl.substring(szUrl.indexOf("[&") + 2, szUrl.length - 1);
					if("200" == $(xmlDoc).find('statusValue').eq(0).text())
					{
						$.cookie('page',szPage+"?"+szParam+"%1");
						$.cookie('userInfo'+m_lHttpPort,m_szUserPwdValue);
						window.location.href = "doc/page/main.asp";
					}
					else
					{   
						window.location.href = "doc/page/login.asp"+"?page="+szPage+"&params="+szParam;
					}
				},
				error: function(xhr, textStatus, errorThrown)
				{
					
				}
			});
		}
		else
		{
			var szUrl = decodeURI(document.URL);
			var szPage = szUrl.substring(szUrl.indexOf("&page=") + 6, szUrl.indexOf("[&"));
			if(szPage.indexOf(".asp") == -1)
			{
				szPage = szPage.concat(".asp");
			}
			var szParam = szUrl.substring(szUrl.indexOf("[&") + 2, szUrl.length - 1);
			
			window.location.href = "doc/page/login.asp"+"?page="+szPage+"&params="+szParam;
		}
	}
	else
	{
		window.location.href = "doc/page/login.asp";
	}
}
</script>
</head>

<body onLoad="init()">
</body>
</html>
