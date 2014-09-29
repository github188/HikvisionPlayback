<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="../css/base.css"  type="text/css" />
<link rel="stylesheet" href="../css/main.css"  type="text/css" />
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Translator.js"></script>
<script type="text/javascript" src="../script/main.js"></script>
</head>
<body onload="initMain()">
    <div id="header" class="header">
	    <div class="languagepart">
	        <div class="languageshow">
	            <label id="laCurrentLanguage"></label>
	        </div>
            <div id="divLanguageChoose" class="languagechange"></div>  	
	    </div>
	    <span class="help"></span> 
        <span class="logo"></span>
        <span class="devicetype" id="devicetype"></span>
	    <div id="SoftwareEdition" class="edtioncolumn">	
            <div class="edition">
	            <span><label>Web:</label>&nbsp;&nbsp;&nbsp;&nbsp;3.1.3.121206</span>
	        </div>	
            <div class="edition">
	            <span><label>Plugin:</label>&nbsp;3.0.3.24</span>
	        </div>	
        </div>
    </div>  
    <div id="nav" class="nav">
        <span class="menu" id="iMenu1" onclick="ChangeFrame('preview.asp',1)">
            <label id="laPreview" name="laPreview" class="mousepointer"></label>
        </span>
        <span class="menu" id="iMenu2" onclick="ChangeFrame('playback.asp',2)">
            <label id="laPlayback" name="laPlayback" class="mousepointer"></label>
        </span>
        <span class="menu" id="iMenu3" onclick="ChangeFrame('log.asp',3)">
            <label id="laLog" name="laLog" class="mousepointer"></label>
        </span>
        <span class="menu" id="iMenu4" onclick="ChangeFrame('paramconfig.asp',4)">
            <label id="laConfig" name="laConfig" class="mousepointer"></label>
        </span>
	    <span class="logout" onclick="GoAway()">
            <label id="laExit" name="laExit" class="mousepointer"></label>
        </span>
	    <span class="logoutimg" onclick="GoAway()">&nbsp;</span>	
	    <span class="riser">
	        <label>&nbsp;|&nbsp;</label>
	    </span>	
	    <span class="loginuser">
	        <label id="curruser"></label>
	    </span>
        <span class="loginuserimg">&nbsp;</span>		
    </div>	
    <div id="content" class="content"></div>
    <div class="footer">© Camba.tv - All Rights Reserved.</div>
    <div id="ConfigDivUpdateBlock" class="updateblock"></div>
</body>
</html>