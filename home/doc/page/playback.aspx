<%@ Page Language="C#" AutoEventWireup="true" CodeFile="playback.aspx.cs" Inherits="playback" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<link rel="stylesheet" href="../css/base.css" type="text/css"/>
<link rel="stylesheet" href="../css/playback.css" type="text/css"/>
<title></title>
    <script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript">
    var m_DownWindow = null;
    var m_szBrowser = navigator.appName;
    var m_szExit = "";

    var m_szHostName = String('<%=mm_szHostName%>');
    var m_lHttpPort = String('<%=m_lHttpPort%>');
    var m_lHttp = "http://";
    var m_lRtspPort = '<%=m_lRtspPort%>';
    var m_lUserName = '<%=m_UserName%>';
    var m_lPassword = '<%=m_Password%>';
    var m_channel = '<%=m_Channel%>';

    /*$(document).ready(function () {
        var EvercamApi = "https://api.evercam.io/v1";
        var cameraId = '<=cameraId %>';
        var token = '<=token %>';
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: EvercamApi + "/cameras/" + cameraId + ".json",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Authorization", "bearer " + token);
            },
            //data: s,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var cam = response.cameras;
                m_szHostName = cam.external_host;
                m_lHttpPort = cam.external_http_port;
                m_lRtspPort = cam.external_rtsp_port;
                m_lUserName = cam.cam_username;
                m_lPassword = cam.cam_password;
                InitPlayback();
            },
            error: function (xhrc, ajaxOptionsc, thrownErrorc) {

            }
        });
    });*/
</script>

<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/timebar.js"></script>
<script type="text/javascript" src="../script/slider_extras.js"></script>
<script type="text/javascript" src="My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../script/playback.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Plugin.js"></script>
<script type="text/javascript" src="../script/uuid.js"></script>
</head>
<body onLoad="InitPlayback()" onunload="UnloadPage('playback.aspx',2)" scroll="no">
<div class="content">
    <div class="contentleft">
	    <div class="statusbar">
		    <span class="curstatus">
				<label id="laCurrentSpeed" name="laCurrentSpeed"></label>
				&nbsp;
				<label id="nowStatues" class="nowStatues"></label>&nbsp;
			</span>
		    <span class="paddingleft10 left labelhidden"><label id="laDeviceName"></label></span>
		    <span class="paddingleft10 left"><label id="laFishOSD"></label></span>				
		</div>
        <div id="main_plugin" class="videoplugin"></div>
        <div class="toolbar">
	        <div class="toolleft">
                <div onclick="StartPlayBack()" class="buttonmouseout">
		            <span id="play" class="play"></span>
		        </div>				
	            <div onclick="StopPlayBack()" class="buttonmouseout">
		            <span id="stop" class="stopdisable"></span>
		        </div>
		        <div onclick="PlayBackSlowly()" class="buttonmouseout">
		            <span id="SlowlyForward" class="slowlyforwarddisable"></span>
		        </div>
	            <div onclick="PlayBackFast()" class="buttonmouseout">
		            <span id="FastForward" class="fastforwarddisable"></span>
		        </div>
	            <div onclick="PlayBackFrame()" class="buttonmouseout">
		            <span id="SingleFrame" class="singleframedisable"></span>
		        </div>
                <div class="volumemouseout">
				    <div id="opensound" class="sounddisable" onclick="OpenSound()"></div>
					<div id="volumeDiv" class="left"></div>
		        </div>								    
	        </div>
	        <div class="toolright">	            
				<div id="dvEZoom" class="buttonmouseout displaynone" onclick="setEZoom()">
                    <span id="dvEZoomBtn" name="dvEZoomBtn" class="disEZoom"></span>
                </div>
                <div onclick="CapturePicture()" class="buttonmouseout">
		            <span id="capture" class="capturedisable"></span>
		        </div>
	            <div onclick="PlayBackSaveFile()" class="buttonmouseout">
		            <span id="record" class="recorddisable"></span>
		        </div>			        
				<!--<div class="buttonmouseout" onclick="DownloadGo()">
		            <span id="download" class="download"></span>
		        </div>	
                <div class="buttonmouseout" onclick="PictureDownloadGo()">
		            <span id="picturedownload"  class="picturedownload"></span>
		        </div>-->	
	        </div>  	  
	    </div>
	    <div id="playbackbar" class="timebar">
	    <script type="text/javascript">
	        if (navigator.appName == "Microsoft Internet Explorer") {
	            document.write("<object classid='clsid:E7EF736D-B4E6-4A5A-BA94-732D71107808' codebase='' standby='Waiting...' id='timebar' name='timebar' align='center' width='704' height='60'><param name='activextype' value='3'></object>");
	        }
	        else {
	            document.write("<canvas id='timebar' width='704' height='60'></canvas>")
	        }
        </script>
	    </div>
	    <div class="recordtypepart">
            <img src="../images/playback/playbck_02.gif" width="9" height="9">&nbsp;<span><label id='RecordType1' name="RecordType1"></label></span>&nbsp;&nbsp;&nbsp;
	        <img src="../images/playback/playbck_03.gif" width="9" height="9">&nbsp;<span><label id='RecordType2' name="RecordType2"></label></span>&nbsp;&nbsp;&nbsp;
	        <img src="../images/playback/playbck_05.gif" width="9" height="9">&nbsp;<span><label id='RecordType3' name="RecordType3"></label></span>&nbsp;&nbsp;&nbsp;
	        <img src="../images/playback/playbck_07.gif" width="9" height="9">&nbsp;<span><label id='RecordType4' name="RecordType4"></label></span>&nbsp;&nbsp;
	    </div>  
    </div>
    <div class="contentright">         
        <div id="div1" class="widthpercent100"></div>
        <div class="searchtime" onclick="SearchRecordFile(2)">
	        <span class="searchico">&nbsp;</span>
            <label name="laSearch" class="mousepointer"></label>
        </div>
	    <div id="divPlaybackTips" class="playbacktips">
	        <span class="tipspic">&nbsp;</span>
	        <span><label id="laPlaybackTips"></label></span>
	    </div>
	    <div class="localizer" style="display:none;">
	        <div class="left localizerleftbg"></div>
	        <div class="left localizermidbg">
	        <div class="paddingleft10 localizertitle"><label id="laPlaybackTimeLocalizer" name="laPlaybackTimeLocalizer"></label></div>
                <input class="timeinput" onkeyup="if(!(Number(this.value) <= 23)) {this.value = this.value.replace(this.value,'00')}" maxlength="2" type="text" name="shi" value="00" id="time_shi" />
                <input class="timeinput" onkeyup="if(!(Number(this.value) <= 59)) {this.value = this.value.replace(this.value,'00')}" maxlength="2" type="text" name="fen"  value="00" id="time_fen" />
                <input class="timeinput" onkeyup="if(!(Number(this.value) <= 59)) {this.value = this.value.replace(this.value,'00')}" maxlength="2" type="text" name="miao"  value="00" id="time_miao" />
                <span id="dingshi" class="timegotobtn" onclick="GoTime()"></span>	   
	        </div>
	        <div class="left localizerrightbg"></div>
	        <div class="clear"></div>
	    </div>
    </div>
    <div id="clear"></div>
</div>
<div id="dvTimebarCtrl" class="displaynone timebarctl">
    <span id="timeNarrow" class="timenarrowout" onclick="narrowTimebar()" onmouseover="this.className = 'timenarrowover' " onmouseout="this.className = 'timenarrowout' "></span>
	<span id="timeExpand" class="timeexpandout" onclick="expandTimebar()" onmouseover="this.className = 'timeexpandover' " onmouseout="this.className = 'timeexpandout' "></span>
</div>
<iframe id="frTimebarCtrl" class="displaynone timebarctlframe" src="javascript:false;" frameborder="0" scrolling="no"></iframe>
</body>
</html>
<script type="text/javascript" for=PreviewActiveX event="GetSelectWndInfo(SelectWndInfo)">
    GetSelectWndInfo(SelectWndInfo);
</script>
<script type="text/javascript" for=PreviewActiveX event="PluginEventHandler(iEventType, iParam1, iParam2)">
    PluginEventHandler(iEventType, iParam1, iParam2);
</script>
<script type="text/javascript" for=timebar event="GetMovePlaybackTime(szGetTime)">
    timeBarMouseUp(szGetTime);
</script>