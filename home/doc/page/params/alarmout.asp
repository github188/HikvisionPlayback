<div class="subparamswhite">
	<span class="firstspan"><label id="laAlarmoutnumber" name="laAlarmoutnumber"></label></span>
	<span>
		<select name="AlarmOutNo" id="AlarmOutNo" class="selectwidth" onchange="GetAlarmOutEach()"></select>
	</span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label id="laAlarmname" name="laAlarmname"></label></span>
    <span>
		<input name="AlarmOutName" id="AlarmOutName" class="inputwidth" type="text" maxlength="32" onBlur="CheckDeviceName(this.value,'AlarmOutNametips',1)">
		<label name="laNoCopy"></label>
		<label id="AlarmOutNametips" class='formtips'></label>
	</span>		
</div> 
<div class="subparamswhite">
	<span class="firstspan"><label id="laDelay" name="laDelay"></label></span>
    <span>
		<select name="pulseDuration" id="pulseDuration" class="selectwidth">
		    <option value="5000" id='pulseDurationOpt1' name="pulseDurationOpt1"></option>
		    <option value="10000" id='pulseDurationOpt2' name="pulseDurationOpt2"></option>
		    <option value="30000" id='pulseDurationOpt3' name="pulseDurationOpt3"></option>
		    <option value="60000" id='pulseDurationOpt4' name="pulseDurationOpt4"></option>
		    <option value="120000" id='pulseDurationOpt5' name="pulseDurationOpt5"></option>
		    <option value="300000" id='pulseDurationOpt6' name="pulseDurationOpt6"></option>
		    <option value="600000" id='pulseDurationOpt7' name="pulseDurationOpt7"></option>
		    <option value="0" name="aModeManual"></option>
        </select>
	</span>
</div>
<div class="subparamsgray displaynone">
	<span class="firstspan"><label name="laIpAddress"></label></span>
    <span>
		<input name="IpAddress" id="IpAddress" class="inputwidth" type="text" disabled="disabled">
	</span>		
</div>
<div class="subparamswhite displaynone">
	<span class="firstspan"><label id="laDefaultstate" name="laDefaultstate"></label></span>
	<span>
		<select name="defaultState" id="defaultState" class="selectwidth" disabled="disabled">
            <option value="high" id='defaultStateOpt1' name="defaultStateOpt1"></option>
            <option value="low" id='defaultStateOpt2' name="defaultStateOpt2"></option>
        </select>
	</span>
</div>
<div class="subparamsgray displaynone">
    <span class="firstspan">
		<label id="laTrigglestate" name="laTrigglestate"></label>
	</span>
	<span>
		<select name="outputState" id="outputState" class="selectwidth" disabled="disabled">
            <option value="high" id='defaultStateOpt1' name="defaultStateOpt1"></option>
            <option value="low" id='defaultStateOpt2' name="defaultStateOpt2"></option>
		    <option value="pulse" id='outputState1' name="outputState1"></option>
        </select>
	</span>    
</div>  	
<div class="mainparams margintop26">
	<label id="laTimeTabDivBtn" name="laTimeTabDivBtn"></label>
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
	<label id="laCopyalarm" name="laCopyalarm"></label>
</div>
<div class="margintop10">
	<table id="tableEventLinkage" class="linkagetable" cellpadding="0" cellspacing="0">
		<tr>
		    <td valign="top" class="borderc0c0c0">
		        <table>
			        <tr>
			            <td class="height25 paddingleft5">
				            <input name="SelectAllAlarmOutputBox" class="checkbox verticalmiddle" type="checkbox" id="SelectAllAlarmOutputBox"  onclick="SelectAllAlarmOutputToLinkage()"/>&nbsp;
				            <label name="laSelectAll"></label>
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