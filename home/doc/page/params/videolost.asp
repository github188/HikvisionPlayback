<div id="subparamswhite">
    <input name="IsUseVideoLost" class="checkbox" type="checkbox" id="IsUseVideoLost" onclick="EnableVideoLost()"/>&nbsp;
	<label id="laUseVideoLost" name="laUseVideoLost"></label>
</div>
<div class="mainparams margintop10">
	<label id="laTimeTabDivBtn" name="laTimeTabDivBtn"></label>
</div>
<div class="margintop10">
	<div id="divScheduleEditBtn" class="schedulebtn">
	    <input id="ScheduleEditBtn" name="laEdit" type="button" class="savebtn"  value="" onclick="EditSchedule()"/>
	</div> 	
	<div id="divEventCanvas" class="schedulecanvas">
        <canvas id="ScheduleCanvas" width="520" height="285"></canvas>
    </div>	   
</div>
<div class="mainparams margintop26">
	<label id="laLinkageTabDivBtn" name="laLinkageTabDivBtn"></label>
</div>
<div class="margintop10">
	<table id="tableEventLinkage" cellpadding="0" cellspacing="0" class="linkagetable">
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