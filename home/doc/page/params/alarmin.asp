<div class="subparamswhite">
    <span class="firstspan"><label id="laAlarminnumber" name="laAlarminnumber"></label></span>
	<span>
        <select name="AlarmInNo" id="AlarmInNo" class="selectwidth" onchange="GetAlarmInLink()"></select>
	</span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label id="laAlarmname" name="laAlarmname"></label></span>
    <span>
        <input name="AlarmInName" id="AlarmInName" class="inputwidth" type="text" onBlur="CheckDeviceName(this.value,'AlarmInNametips',1)" maxlength="32">
		<label name="laNoCopy"></label>
		<label id="AlarmInNametips" class='formtips'></label>
	</span>		
</div>
<div class="subparamswhite" id="dvAlarmType">
	<span class="firstspan"><label id="laAlarmtype" name="laAlarmtype"></label></span>
	<span>
		<select name="triggering" id="triggering" class="selectwidth">
            <option value="low" id='triggeringOpt1' name="triggeringOpt1"></option>
            <option value="high" id='triggeringOpt2' name="triggeringOpt2"></option>
        </select>
	</span>
</div>
<div class="subparamsgray displaynone" id="dvAlarmIpAddress">
    <span class="firstspan"><label name="laIpAddress"></label></span>
	<span><input name="IpAddress" id="IpAddress" class="inputwidth" type="text" disabled="disabled"></span>
</div>
<div id="dvArmSchedule">
	<div class="mainparams margintop26">
		<label name="laTimeTabDivBtn" id="laTimeTabDivBtn"></label>
	</div>
	<div class="margintop10">
	    <div id="divScheduleEditBtn" class="schedulebtn">
			<input name="laEdit" type="button" class="savebtn"  value="" onClick="EditSchedule()"/>
		</div>	
		<div id="divEventCanvas" class="schedulecanvas">
		    <canvas id="ScheduleCanvas" width="520" height="285"></canvas>
		</div>	  
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
				            <input name="InSoundAlarm" class="checkbox" type="checkbox" id="InSoundAlarm"/>&nbsp;
				            <label id="laSoundAlarm" name="laSoundAlarm"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="InUpload" class="checkbox" type="checkbox" id="InUpload"/>&nbsp;
				            <label id="laUpload" name="laUpload"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="InEmail" class="checkbox" type="checkbox" id="InEmail"/>&nbsp;
				            <label id="laEmail" name="laEmail"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input class="checkbox" name="InFTP" type="checkbox" id="InFTP"/>&nbsp;
				            <label name="laUpdateToFTP">FTP</label>
				        </td>
			        </tr>				  
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="TriggerRecordCheckbox" class="checkbox" id="TriggerRecordCheckboxChan1" type="checkbox"/>&nbsp;
				            <label id="laTrigglerecord" name="laTrigglerecord"></label>
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
				            <label name="laSelectAll"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <span id="DisPlayLinkageList"></span>
				        </td>
			        </tr>
			        <tr class="displaynone" id="trLinkagePTZ">
			            <td>
						    <table>
				                <tr>
					                <td class="height25 paddingleft5">
					                    <label name="laTriggleptz"></label>
					                </td>
				                </tr>
				                <tr>
					                <td class="height25 paddingleft5">
					                    <input name="IsUsePreset" class="checkbox" type="checkbox" id="IsUsePreset"  onclick="UnUseOther(this.id)"/>&nbsp;
					                    <span class="firstspan"><label id="laPresetnumer" name="laPresetnumer"></label></span>
					                    <select name="PresetNo"  id="PresetNo"  class="ptzlinkedit" disabled="disabled"></select>
					                </td>
				                </tr>
				                <tr>
					                <td class="height25 paddingleft5">
					                    <input name="IsUseCurise" class="checkbox" type="checkbox" id="IsUseCurise"  onclick="UnUseOther(this.id)"/>&nbsp;
					                    <span class="firstspan"><label id="laCurisenumber" name="laCurisenumber"></label></span>
					                    <select name="CuriseNo"  id="CuriseNo"  class="ptzlinkedit" disabled="disabled"></select>
					                </td>
				                </tr>	
				                <tr>
					                <td class="height25 paddingleft5">
					                    <input name="IsUseTrack" class="checkbox" type="checkbox" id="IsUseTrack"  onclick="UnUseOther(this.id)"/>&nbsp;
					                    <span class="firstspan"><label name="Pattern"></label></span>
					                    <select name="TrackNo"  id="TrackNo"  class="ptzlinkedit" disabled></select>
					                </td>
				                </tr>
				            </table>
				        </td>
			        </tr>		  		  
			    </table>
		    </td>		  
		</tr>
	</table>
</div>
<div class="mainparams margintop26">
	<label id="laCopyalarm" name="laCopyalarm"></label>
</div>
<div class="margintop10">
	<table id="tableEventLinkage" class="linkagetable" cellpadding="0" cellspacing="0">
		<tr>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="SelectAllBox" class="checkbox" type="checkbox" id="SelectAllBox"  onclick="SelectAllChanToCopy()"/>&nbsp;
				            <label name="laSelectAll"></label>
				        </td>
			        </tr>
			        <tr>
			            <td class="height25 paddingleft5">
				            <span id="DisPlayChanList"></span>
				        </td>
			        </tr>
			    </table>
		    </td>		  
		</tr>
	</table>
</div>	
<div id="TimeScheduleEdit" class="displaynone"></div>