<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
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
	            <div class="loginbtn" onclick="DoLogin()" onmouseover="this.className = 'loginbtnon'" onmouseout="this.className = 'loginbtn'"><label name="lalogin" class="mousepointer"></label></div>
                <div class="anonymous" id="divAnonymous"><input id="chAnonymous" type="checkbox" class="checkbox"/>&nbsp;<label class="loginlabel" name="laAnonymous"></label></div>
	        </div>
	    </div>	
    </div>
    <div class="footer">© Camba.tv - All Rights Reserved.</div>
</div>
</body>
</html>
