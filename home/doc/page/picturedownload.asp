<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" href="../css/base.css"  type="text/css" />
<link rel="stylesheet" href="../css/log.css"  type="text/css" />
<title></title>
<script language="javascript">
    var m_szBrowser = navigator.appName;
    var m_szHostName = "149.5.42.144";
var m_lHttpPort = 8084;
var m_lHttp = "http://";
var m_iLogNum = 0;
var m_iHaveLogNumber = 0;
var m_iHavePage = 0;
var m_iNowPage = 1;
var m_iCurLogNumber = 0;
var m_iHaveLogPage = 0;
var m_iNowLogPage = 1; 
var m_iPerLogNum = 100; 
var m_szExit = "是否注销";
var m_lUserName = 'admin';
var m_lPassword = '12345';
</script>
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Plugin.js"></script>
<script type="text/javascript" src="../script/picturedownload.js"></script>
<script type="text/javascript" src="My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../script/uuid.js"></script>
<script type="text/javascript" src="../script/Translator.js"></script>
</head>
<body onload="InitPictureDownload()">
<div class="content">
    <div class="contentright">
        <div class="righttitle">
	        <label id='laLogSearch' name='laLogSearch'></label>
	    </div>
	    <div class="column">
            <span class="paddingleft5"><label id='laPictureType' name='laPictureType'></label></span><br>
            <span class="paddingleft5">
	            <select name="PictureType" id="PictureType" class="selectwidth">
                    <option value="timing" id='PictureType1' name='PictureType1'></option>
                    <option value="alarm" id='PictureType2' name='PictureType2'></option>
                    <option value="motion" id='PictureType3' name='PictureType3'></option>
					<option value="pir" name='laPIRAlarm'></option>
					<option value="wlsensor" name='laWirelessAlarm'></option>
					<option value="callhelp" name='OptCallHelp'></option>
                </select>
	        </span>
	    </div>
	    <div class="column">
	        <span class="paddingleft5">
	            <label id='laStartTime' name='laStartTime'></label>
	        </span><br>
	        <span class="paddingleft5">
	            <input type="text" id="begintime" onclick="CreateCalendar(0)" class="selectwidth Wdate">
	        </span>
	    </div>
	    <div class="column">
	        <span class="paddingleft5"><label id='laEndTime' name='laEndTime'></label></span><br>
	        <span class="paddingleft5"><input type="text" id="endtime" onclick="CreateCalendar(0)" class="selectwidth Wdate"></span>
	    </div>
	    <div class="search" onclick="PictureSearch()">
	        <span class="searchbg">&nbsp;</span>
	        <label name='laSearch' class="mousepointer"></label>  
	    </div>
        <div id='DownloadBtn' class="search" onclick="PictureDownload()">
	        <span class="downloadbg">&nbsp;</span>
	        <label id='laDownloadBtn' name='DownloadBtn' class="mousepointer"></label>  
	    </div>
        <div id="divPictureSearchTips" class="picturetips">
		    <span class="tipspic">&nbsp;</span>
	        <span><label id="laPictureSearchTips"></label></span>
	    </div>
	    <div id="main_plugin" class="plugin0"></div>
    </div>
    <div class="contentleft">
        <div class='logtitle'>
            <table class="tableheader" cellpadding="0" cellspacing="0">
                <tr align="center">
		            <td width="56" class="borderleftnone"><input id='SelectAll' type="checkbox" name="all" class="mousepointer" onclick="SelectAllFile()"></td>
		            <td class="borderwholse" width="56"><label id='laPictureNum' name='laSerialNumber'></label></td>
                    <td class="borderwholse" width="200"><label id='laPictureName' name='laFileName'></label></td>
                    <td class="borderwholse" width="156"><label id='laPictureData' name='laPictureData'></label></td>
                    <td class="borderwholse" width="100"><label id='laPictureSize' name='laFileSize'></label></td>
                    <td class="borderrightnone" width="143"><label id='laDownloadProcess' name='laDownloadProcess'></label></td>
                </tr>
            </table>
            <div id="DivxmlDoc"></div>
        </div>
        <div class="logmiddle">
            <table border="0" cellspacing="0" cellpadding="0">
	            <tr>
                    <td valign="top">
		                <table width="711" cellspacing="0" cellpadding="0" id='PictureTableList'>
			                <tr height="22px" class="displaynone bgcolor">
                                <td width="56"><input type="checkbox" name="all"></td>
                                <td width="56"><label id='laPictureNum' name='laSerialNumber'></label></td>
        		                <td width="200"><label id='laPictureName' name='laFileName'></label></td>
        		                <td width="156"><label id='laPictureData' name='laPictureData'></label></td>
                                <td width="100"><label id='laPictureSize' name='laFileSize'></label></td>
                                <td width="143"><label id='laDownloadProcess' name='laDownloadProcess'></label></td>
                            </tr>
		                </table>
					</td>
	            </tr>
	            <tr><td height="22">&nbsp;</td></tr>
            </table>
        </div>
        <div id="PicturePage" class="logbottom"><label name='laLogPage'></label></div>
    </div>
</div>
</body>
</html>