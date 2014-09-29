<div id="subparamswhite">
    <input name="IsUseKeepout" class="checkbox verticalmiddle" type="checkbox" id="IsUseKeepout" onclick="EnableBlockAlarm()"/>&nbsp;
	<label id="laUseKeepout" name="laUseKeepout"></label>
</div>
<div class="mainparams margintop10">
    <label name="laVideoTabDivBtn" id="laVideoTabDivBtn"></label>
</div>
<div class="margintop10"><div id="main_plugin" class="paramplugin"></div></div>
<div class="margintop10">
    <div class="videocontrols">
	    <input class="button" id='CoverStartMapbutton' name="CoverStartMapbutton" type="button"  value="" onClick="StartHuaCover()"/>
	</div>
	<div class="videocontrols">
	    <input class="button" id='CoverTimebutton' name="CoverTimebutton" type="button" value="" onClick="ClearMapCover('Block')"/>
	</div>
	<div class="videocontrolslabel">
	    <label id="laSensitivity" name="laSensitivity"></label>
	</div>  
    <div id="BlockSensitive" class="videocontrols"></div>
	<div class="clear"></div>
</div>	
<div class="mainparams margintop26">
    <label name="laTimeTabDivBtn" id="laTimeTabDivBtn"></label>
</div>
<div class="margintop10">
    <div id="divScheduleEditBtn" class="schedulebtn">
	    <input id="ScheduleEditBtn" name="laEdit" type="button" class="savebtn"  value="" onClick="EditSchedule()"/>
	</div> 	
	<div id="divEventCanvas" class="schedulecanvas">
        <canvas id="ScheduleCanvas" width="520" height="285"></canvas>
    </div>	   
</div>
<div class="mainparams margintop26">
	<label name="laLinkageTabDivBtn" id="laLinkageTabDivBtn"></label>
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
				            <input name="MoveUpload" class="checkbox" type="checkbox" id="MoveUpload"/>&nbsp;
				            <label id="laUpload" name="laUpload"></label>
						</td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="MoveEmail" class="checkbox" type="checkbox" id="MoveEmail"/>&nbsp;
				            <label id="laEmail" name="laEmail"></label>
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
	
