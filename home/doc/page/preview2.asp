<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="../css/base.css" type="text/css" />
<link rel="stylesheet" href="../css/preview.css" type="text/css" />
<link rel="stylesheet" href="../css/ptz.css" type="text/css" />
<title></title>
<script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="../script/jquery_modal.js"></script>
<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/tabs/jquery.tabs.js"></script>
<script type="text/javascript" src="../script/slider_extras.js"></script>
<script type="text/javascript" src="../script/preview.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Plugin.js"></script>
</head>
<body onload="InitPreview()" onunload="UnloadPage('preview.asp',1)">
<div id="contentRight" class="displaynone contentright">
    <!-- PTZ -->
    <div id="ptz">
        <div class="ptzOpe"> 
            <span class="left ptzDir">
                <div><span id="leftup" onmousedown="SetPTZLeftUpStart()" onmouseup="SetPTZStop(0)"></span><span id="up" onmousedown="SetPTZUpStart()" onmouseup="SetPTZStop(0)"></span><span id="rightup" onmousedown="SetPTZRightUpStart()" onmouseup="SetPTZStop(0)"></span></div>
                <div><span id="left" onmousedown="SetPTZLeftStart()" onmouseup="SetPTZStop(0)"></span><span id="auto" onclick="ptzAuto()"></span><span id="right" onmousedown="SetPTZRightStart()" onmouseup="SetPTZStop(0)"></span></div>
                <div><span id="leftdown" onmousedown="SetPTZLeftDownStart()" onmouseup="SetPTZStop(0)"></span><span id="down" onmousedown="SetPTZDownStart()" onmouseup="SetPTZStop(0)"></span><span id="rightdown" onmousedown="SetPTZRightDownStart()" onmouseup="SetPTZStop(0)"></span></div>
            </span>
	        <span class="left ptzDis">
                <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid"><div><span id="zoomIn" onmousedown="SetZoomInStart()" onmouseup="SetPTZStop(1)"></span><span class="vLine"></span><span id="zoomOut" onmousedown="SetZoomOutStart()" onmouseup="SetPTZStop(1)"></span></div></span><span class="ptzBtnRight"></span></div>
                <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid"><div><span id="focusIn" onmousedown="SetFocusInStart()" onmouseup="SetFocusStop()"></span><span class="vLine"></span><span id="focusOut" onmousedown="SetFocusOutStart()" onmouseup="SetFocusStop()"></span></div></span><span class="ptzBtnRight"></span></div>
                <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid"><div><span id="irisIn" onmousedown="IrisInStart()" onmouseup="IrisStop()"></span><span class="vLine"></span><span id="irisOut" onmousedown="IrisOutStart()" onmouseup="IrisStop()"></span></div></span><span class="ptzBtnRight"></span></div>
            </span> 
        </div>
        <div class="ptzSpeed">
            <span class="speedReduce" onclick="ptzReduce()" onmouseover="this.className = 'speedReduceon' " onmouseout="this.className = 'speedReduce'"></span></span><span id="ptzSlider" class="sliderBar"></span><span class="speedAdd" onclick="ptzAdd()" onmouseover="this.className = 'speedAddon' " onmouseout="this.className = 'speedAdd' "></span>
        </div>
        <div class="ptzAid">
            <span class="ptzBtnLeft"></span><span class="ptzAidBg"><div><span id="light" onclick="SetLight()" name="laLight"></span><span class="vLine"></span><span id="rain" onclick="SetWiper()" name="laWiper"></span><span class="vLine"></span><span id="oneKeyFocus" onclick="SetOneKeyFocus()" name="laOneKeyFocus"></span><span class="vLine"></span><span id="initCamera" onclick="SetInitCamera()" name="laLensInit"></span></div></span><span class="ptzBtnRight"></span>
        </div>
        <div> 
        <!-- tabs -->
            <ul class="ptztabs">
                <li class="tab1"><span></span></li>
                <li class="tab2"><span onclick="$('#selectPatrol').change()"></span></li>
                <li class="tab3"><span></span></li>
			</ul>
        <!-- panes -->
            <div>
                <div class="ptzpanes"><div id="PresetArea"></div></div>
                <div class="ptzpanes">
                    <div id="CruiseArea">
                        <div class="head">
                            <span>
                                <select id="selectPatrol"></select>
                            </span>
							<span class="start" onclick="StartPatrol()"></span>
							<span class="stop" onclick="StopPatrol()"></span>
							<span class="save" onclick="SavePatrol()"></span>
							<span class="delete" onclick="DeletePatrol()"></span>
                        </div>
                        <div id="PatrolPresetList"></div>
                        <div class="foot" align="left">
                            <span class="add" onclick="EditPresetListDlg(this, 0, 1, 1, 1)"></span>
                        </div>
                    </div>
                </div>
                <div class="ptzpanes">
                    <div id="TrackArea"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="content" class="contentleft">
    <div id="dvChangeSize" class="toptoolbar">
	    <div id="sp4to3" class="size4to3out" title="4:3" onclick="size4to3()"></div>
		<div id="sp16to9" class="size16to9out" title="16:9" onclick="size16to9()"></div>
	    <div id="spOriginal" class="originalout" name="windowProportionOpt1" title="" onclick="originSize()"></div>
		<div id="sizeauto" class="sizeautoout" onclick="autoSize()"></div>
		<div id="substream" class="substreamout" onclick="streamChoose(1)">
		    <label name="streamTypeOpt2" class="mousepointer"></label>
		</div>
		<div id="mainstream" class="mainstreamout" onclick="streamChoose(0)">
		    <label name="streamTypeOpt1" class="mousepointer"></label>
		</div>
		<div id="ptzshow" class="ptzshowout" onclick="ptzShow()"></div>
	</div>
	<div id="main_plugin" class="mainplugin"></div>
    <div id="toolbar" class="toolbar">
	    <div id="divPreviewTips" class="previewtips"><label id="laPreviewTips"></label></div>
        <div class="toolbarleft">
	        <span onclick="StartRealPlay()" class="btnmouseout">
		        <div id="play" name="play" class="play"></div>
		    </span>
			<span class="volumemouseout">
		        <div id="opensound" name="opensound" class="sounddisable" onclick="OpenSound()"></div>
				<div id="volumeDiv" class="left"></div>
		    </span>			
		</div>
        <div id="dv3DZoom" class="displaynone" style="float:right;">
        	<span onclick="set3DZoom()" class="btnmouseout">
		        <div id="Start3DZoom" name="Start3DZoom" class="dis3DZoom"></div>
	        </span>
        </div>
        <div id="dvEZoom" class="displaynone" style="float:right;">
        	<span onclick="setEZoom()" class="btnmouseout">
		        <div id="dvEZoomBtn" name="dvEZoomBtn" class="disEZoom"></div>
	        </span>
        </div>
	    <div class="toolbarright">
            <span onclick="Talk(this)" class="btnmouseout">
		        <div id="voiceTalk" name="voiceTalk" class="voiceoff"></div>
	        </span>
		    <span onclick="CapturePicture()" class="btnmouseout">
		        <div id="capture" name="capture" class="capturedisable"></div>
		    </span>
		    <span onclick="StartRecord()" class="btnmouseout">
		        <div id="startRecord" name="startRecord" class="recorddisable"></div>
		    </span>			
		</div>
    </div>
</div>
<div id="EditPatrolPreset">
    <div>
        <span class="frameTopLeft"></span>
        <span class="frameTopMid">
            <label name="Patrol"></label>
        </span>
        <span class="frameTopRight"></span>
    </div>
    <div>
        <span class="frameCenLeft"></span>
        <span class="frameCenMid">
            <div align="center" class="elm">
                <span class="left"><label id="laPreset" name="laPreset"></label>:</span><span class="right"><select id="SelectPreset"></select></span>
            </div>
            <div align="center" class="elm">
                <span class="left"><label id="laPatrolTime" name="laPatrolTime"></label></span><span class="right"><input type="text" id="PatrolTime"></span>
            </div>
            <div align="center" class="elm">
                <span class="left"><label id="laPatrolSpeed" name="laPatrolSpeed"></label></span><span class="right"><input type="text" id="PatrolSpeed"></span>
            </div>
            <div align="center" class="elm">
                <span align="center">
                    <div onclick="onPresetListDlgOk()">
                        <span class="BtnLeft"></span>
                        <span class="BtnMid"><label id="laOK" name="laOK"></label></span>
                        <span class="BtnRight"></span>
                    </div>
                </span>
                <span align="center">
                    <div onclick="$.modal.impl.close()">
                        <span class="BtnLeft"></span>
                        <span class="BtnMid"><label id="laCancel" name="laCancel"></label></span>
                        <span class="BtnRight"></span>
                    </div>
                </span>
            </div>
        </span>
        <span class="frameCenRight"></span>
    </div>
    <div><span class="frameBotLeft"></span><span class="frameBotMid"></span><span class="frameBotRight"></span></div>
</div>
<div id="EditVoiceTalk">
    <div><span class="frameTopLeft"></span><span class="frameTopMid"></span><span class="frameTopRight"></span></div>
    <div>
        <span class="frameCenLeft"></span>
        <span class="frameCenMid">
            <div align="center" class="elm">
                <input name="Num1" id="Num1" type="checkbox"  value="0" onclick="SelectTalk(1)" >&nbsp;<label id="laTalkNum" name="laTalkNum"></label>1
            </div>
            <div align="center" class="elm">
                <input name="Num2" id="Num2" type="checkbox"  value="0" onclick="SelectTalk(2)" >&nbsp;<label id="laTalkNum" name="laTalkNum"></label>2
            </div>     
            <div align="center">
                <span align="center">
                    <div onclick="onVoiceTalkDlgOk()">
                        <span class="BtnLeft"></span>
                        <span class="BtnMid"><label id="laOK" name="laOK"></label></span>
                        <span class="BtnRight"></span>
                    </div>
                </span>
                <span align="center">
                    <div onclick="$.modal.impl.close()">
                        <span class="BtnLeft"></span>
                        <span class="BtnMid"><label id="laCancel" name="laCancel"></label></span>
                        <span class="BtnRight"></span>
                    </div>
                </span>
            </div>
        </span>
        <span class="frameCenRight"></span>
    </div>
    <div><span class="frameBotLeft"></span><span class="frameBotMid"></span><span class="frameBotRight"></span></div>
</div>
</body>
</html>
<script for=PreviewActiveX event="GetSelectWndInfo(SelectWndInfo)">
	GetSelectWndInfo(SelectWndInfo);
</script>
<script for=PreviewActiveX event="GetAllWndInfo(RealplayInfo)">
	GetAllWndInfo(RealplayInfo);
</script>
<script for=PreviewActiveX event="PluginEventHandler(iEventType, iParam1, iParam2)">
	PluginEventHandler(iEventType, iParam1, iParam2);
</script>
<script for=PreviewActiveX event="ZoomInfoCallback(szZoomInfo)">
	ZoomInfoCallback(szZoomInfo);
</script>