`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="../css/base.css" rel="stylesheet" type="text/css" />
<link href="../css/login.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/login.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Translator.js"></script>
    <script type="text/javascript">

        $(document).ready(function () {
            $.support.cors = true;
        });

        jQuery(function () {
            $('#btn').click(function (e) {
                e.preventDefault();
                jQuery.ajax({
                    type: "GET",
                    url: "Preview.ashx",
                    data: "method=MyMethod1",
                    dataType: "xml",
                    timeout: 15000,
                    success: function (data) {
                      //  alert(data);
                        if ("200" == data.documentElement.getElementsByTagName('statusValue')[0].childNodes[0].nodeValue) {
                            var szUrl = decodeURI(document.URL);
                            if (szUrl.indexOf("?page=") != -1) {
                                var szPage = szUrl.substring(szUrl.indexOf("page=") + 5, szUrl.indexOf("&params="));
                                if (szPage.indexOf(".asp") == -1) {
                                    szPage = szPage.concat(".asp");
                                }
                                var szParam = szUrl.substring(szUrl.indexOf("&params=") + 8, szUrl.length);
                                $.cookie('page', szPage + "?" + szParam + "%1");
                            }
                            else {
                                $.cookie('page', null);
                            }
                            m_szUserPwdValue = "YWRtaW46MTIzNDU=";
                            $.cookie('userInfo' + m_lHttpPort, m_szUserPwdValue == "" ? Base64.encode("anonymous:\177\177\177\177\177\177") : m_szUserPwdValue);
                            window.location.href = "main.aspx";
                        }
                        else {
                            if (!$('#UserName').prop("disabled")) {
                                $('#UserName').focus();
                            }
                            $('#UserName').val('');
                            $('#Password').val('');
                            alert(translator.translateNode(g_lxdLogin, 'LoginTips4'));
                        }
                    },
                    error: function (textStatus, errorThrown) {
                        alert(errorThrown);
                        if ("timeout" == textStatus) {
                            alert(translator.translateNode(g_lxdLogin, 'ConnectTimeoutTips'));
                        }
                        else {
                            alert(translator.translateNode(g_lxdLogin, 'NetworkErrorTips'));
                        }
                    }
                });
            });
        });
    </script>
</head>
<body onload="InitLogin()">
<div class="container">
    <div class="loginpart">
        <div class="loginleft">
	    <div class="logo"></div>
	    </div>
        <div class="loginright">
	        <div class="languagepart">
	            <div class="languageshow"><label id="laCurrentLanguage"></label></div>
	            <div class="languagechange" id="divLanguageChoose"></div>
	        </div>
	        <div class="loginbar">
	            <div><label name="lausername" class="loginlabel"></label><input name="UserName" id='UserName' class="logininputwidth" type="text" maxlength="16" /></div>
                <div><label name="lapassword" class="loginlabel"></label><input name="Password" id="Password" class="logininputwidth" type="Password" maxlength="16" /></div>
	            <div class="loginbtn" onclick="DoLogin()" onmouseover="this.className = 'loginbtnon'" onmouseout="this.className = 'loginbtn'">

                    <label name="lalogin" class="mousepointer"></label></div>
                 <div class="loginbtn" id="btn" onmouseover="this.className = 'loginbtnon'" onmouseout="this.className = 'loginbtn'">

                    <label name="lalogin" class="mousepointer"></label></div>
                <div class="anonymous" id="divAnonymous"><input id="chAnonymous" type="checkbox" class="checkbox"/>&nbsp;<label class="loginlabel" name="laAnonymous"></label></div>
	        </div>
	    </div>	
    </div>
    <div class="footer">© Camba.tv - All Rights Reserved.</div>
</div>
</body>
</html>
