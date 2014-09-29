<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" href="../css/base.css"  type="text/css" />
<link rel="stylesheet" href="../css/log.css"  type="text/css" />
<title></title>
<script language="javascript">
var m_szBrowser = navigator.appName; //获取浏览器名称
var m_lHttpPort = 80;
var m_iLogNum = 0;  //搜索日志总数
var m_iHaveLogNumber = 0;  //搜索文件总数
var m_iHavePage = 0; //搜索记录共有几页
var m_iNowPage = 1; //搜索记录当前页
var m_iCurLogNumber = 0;
var m_iHaveLogPage = 0; //搜索记录共有几页
var m_iNowLogPage = 1; //搜索记录当前页
var m_iPerLogNum = 100; //下载文件的记录分页每页显示条数
var m_szExit = "是否注销";
</script>
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Plugin.js"></script>
<script type="text/javascript" src="../script/log.js"></script>
<script type="text/javascript" src="My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../script/uuid.js"></script>
</head>
<body onload="InitLog()" onunload="UnloadPage('log.asp',3)">
<div class="content">
    <div class="contentright">
        <div class="righttitle">
	        <label id='laLogSearch' name='laLogSearch'></label>
	    </div>
	    <div class="column">
            <span class="paddingleft5"><label name='laLogMajorType'></label></span><br>
            <span class="paddingleft5">
	            <select name="MajorType" id="MajorType" class="selectwidth" onchange="changeMajorType(this.value,0)">
                    <option value="All" id='MajorTypeOpt1' name='MajorTypeOpt1'></option>
                    <option value="Alarm" id='MajorTypeOpt2' name='MajorTypeOpt2'></option>
                    <option value="Exception" id='MajorTypeOpt3' name='Exception'></option>
                    <option value="Operation" id='MajorTypeOpt4' name='MajorTypeOpt4'></option>
                    <option value="Infomation" id='MajorTypeOpt5' name='Infomation'></option>
                </select>
	        </span>
	    </div>
        <div class="column">
	        <span class="paddingleft5">
	            <label name='laLogMinorType'></label>
	        </span><br>
	        <span class="paddingleft5">
                <select name="MinorType" id="MinorType" class="selectwidth"></select>
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
	    <div class="search" onclick="LogSearch()">
	        <span class="searchbg">&nbsp;</span>
	        <label name='laSearch' class="mousepointer"></label>
	    </div>
	    <div class="save">
	        <span id="spExportLog" class="exportlog" onclick="exportLog()">
	            <label name='laSaveLog' class="mousepointer"></label>
	        </span>
	    </div>
	    <div id="main_plugin" class="plugin0"></div>
    </div>
    <div class="contentleft">
        <div class='logtitle'>
            <table class="tableheader" cellpadding="0" cellspacing="0">
                <tr align="center">
		            <td width="4%" class="borderleftnone">&nbsp;</td>
		            <td class="borderwholse" width="18%"><label name='laLogTime'></label></td>
                    <td class="borderwholse" width="15%"><label id='laLogMajorType' name='laLogMajorType'></label></td>
                    <td class="borderwholse" width="15%"><label id='laLogMinorType' name='laLogMinorType'></label></td>
                    <td class="borderwholse" width="15%"><label id='laLogChannel' name='laChannelNo'></label></td>
                    <td class="borderwholse" width="15%"><label id='laLogRemoteUser' name='laLogRemoteUser'></label></td>
                    <td class="borderrightnone" width="15%"><label id='laLogRemoteIP' name='laLogRemoteIP'></label></td>
                </tr>
            </table>
        </div>
        <div class="logmiddle">
            <table border="0" cellspacing="0" cellpadding="0">
	            <tr>
                    <td valign="top">
		                <table width="711" cellspacing="0" cellpadding="0" id='LogTableList' onmousedown="SelectLogTd(event)">
			                <tr height="22" class="displaynone bgcolor">
			                    <td width="4%">&nbsp;</td>
			                    <td width="18%"><label name='laLogTime'></label></td>
                                <td width="15%"><label id='laLogMajorType' name='laLogMajorType'></label></td>
                                <td width="15%"><label id='laLogMinorType' name='laLogMinorType'></label></td>
                                <td width="15%"><label id='laLogChannel' name='laChannelNo'></label></td>
                                <td width="15%"><label id='laLogRemoteUser' name='laLogRemoteUser'></label></td>
                                <td width="15%"><label id='laLogRemoteIP'></label></td>
                            </tr>
		                </table>
					</td>
	            </tr>
	            <tr><td height="22">&nbsp;</td></tr>
            </table>
        </div>
        <div id="logpage" class="logbottom"><label name='laLogPage'></label></div>
    </div>
</div>
</body>
</html>