<div class="subparamswhite">
    <input name="IsUseMotion" class="checkbox" type="checkbox" id="IsUseMotion" onclick="EnableMoveDetect()"/>&nbsp;
	<label id="laUseMotion" name="laUseMotion"></label><label id="laUseVideoLost"></label>
</div>
<div class="subparamswhite displaynone" id="divHighLight">
    <input class="checkbox" type="checkbox" id="chEnableHighLight"/>&nbsp;
	<label name="laHighLight"></label>
</div>
<div class="mainparams margintop10">
    <label id="laVideoTabDivBtn" name="laVideoTabDivBtn"></label>
</div>
<div class="margintop10"><div id="main_plugin" class="paramplugin"></div></div>
<div class="margintop10">
    <div class="videocontrols">
	    <input id='CoverStartMapbutton' class="button" name="CoverStartMapbutton" type="button" onclick="StartHuaCover()"/>
	</div>
	<div class="videocontrols">
	    <input id='CoverTimebutton' class="button" name="CoverTimebutton" type="button" onclick="ClearMapCover('Motion')"/>
	</div>
	<div class="videocontrolslabel">
	    <label id="laSensitivity" name="laSensitivity"></label>
	</div>  
    <div id="MoveSensitive" class="videocontrols"></div>
	<div class="clear"></div>
</div>
<div class="mainparams margintop26">
    <label name="laTimeTabDivBtn" id="laTimeTabDivBtn"></label>
</div>
<div class="margintop10">
    <div id="divScheduleEditBtn" class="schedulebtn">
	    <input id="ScheduleEditBtn" name="laEdit" type="button" class="savebtn" onclick="EditSchedule()"/>
	</div>
	<div id="divEventCanvas" class="schedulecanvas">
        <canvas id="ScheduleCanvas" width="520" height="285"></canvas>
    </div>
</div>
<div class="mainparams margintop26">
    <label id="laLinkageTabDivBtn" name="laLinkageTabDivBtn"></label>
</div>	
<div class="margintop10">
    <table id="tableEventLinkage" class="linkagetable" cellpadding="0" cellspacing="0">
	    <tr class="linkagetitle">
		    <td class="paddingleft5 borderc0c0c0"><label id="laNormalLink" name="laNormalLink"></label></td>
		    <td class="paddingleft5 borderc0c0c0"><label id="laOtherLink" name="laOtherLink"></label></td>
		</tr>
		<tr>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="MoveSoundAlarm" class="checkbox" type="checkbox" id="MoveSoundAlarm"/>&nbsp;
				            <label id="laSoundAlarm" name="laSoundAlarm"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input class="checkbox" name="MoveUpload" type="checkbox" id="MoveUpload"/>&nbsp;
				            <label id="laUpload" name="laUpload"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input class="checkbox" name="MoveEmail" type="checkbox" id="MoveEmail"/>&nbsp;
				            <label id="laEmail" name="laEmail"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input class="checkbox" name="MoveFTP" type="checkbox" id="MoveFTP"/>&nbsp;
				            <label name="laUpdateToFTP">FTP</label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input class="checkbox" name="TriggerRecordCheckbox" id="TriggerRecordCheckboxChan1" type="checkbox"/>&nbsp;
				            <label id="laRecordLinkage" name="laTrigglerecord"></label>
						</td>
			        </tr>
			    </table>
		    </td>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
                            <label name="laLinkageAlarmOutput"></label>
				            <input name="SelectAllAlarmOutputBox" class="checkbox" type="checkbox" id="SelectAllAlarmOutputBox"  onclick="SelectAllAlarmOutputToLinkage()"/>&nbsp;
				            <label id="laSelectAll" name="laSelectAll"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <span id="DisPlayLinkageList"></span>
				        </td>
			        </tr>
			    </table>
		    </td>
		</tr>
	</table>
</div>
<div id="TimeScheduleEdit" class="displaynone"></div>	

