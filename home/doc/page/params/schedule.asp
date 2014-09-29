<div id="timeInputWindow" style="position:absolute;top:20px;left:100px;display:none; z-index:10000;">
  <table style="width:190px;height:37px; border-collapse:collapse;">
    <tr>
      <td style="width:5px;height:37px;background:url(../images/config/timeInputWindowleft.png) no-repeat"></td>
      <td style="width:180px;height:37px;background:url(../images/config/timeInputWindowmid.png) repeat-x">
	    <input id="InputTimeH" type="text" value="00" style="width:80px" maxlength="2" onkeyup="if(!(Number(this.value) <= 24)) {this.value = this.value.replace(this.value,'00')}  else if((Number(this.value) == 24)) {document.getElementById('InputTimeM').value = '00'}">
		<label>:</label>
		<input id="InputTimeM" type="text" value="00" style="width:80px" maxlength="2" onkeyup="if(!(Number(this.value) <= 59)) {this.value = this.value.replace(this.value,'00')}  else if(document.getElementById('InputTimeH').value == '24') {this.value = '00'}">
	  </td>
      <td style="width:5px;height:37px;background:url(../images/config/timeInputWindowright.png) no-repeat"></td>
    </tr>
  </table>
</div>

<div class="scheduleeditdiv">
  <div id="divScheduleTitle" class="scheduleedittitlediv"><label  style="font-weight:bold" id="laScheduleEdit" name="laScheduleEdit"></label></div>
  <div style="width:550px; margin:20px auto 10px auto;">
    <ul class="tabs" id="ulSchedule">
      <li><a id="laMonday" name="laMonday" href="javascript:jump_showdaytime('0');"></a></li>
      <li><a id="laTuesday" name="laTuesday" href="javascript:jump_showdaytime('1');"></a></li>
      <li><a id="laWednesday" name="laWednesday" href="javascript:jump_showdaytime('2');"></a></li>
      <li><a id="laThursday" name="laThursday" href="javascript:jump_showdaytime('3');"></a></li>
      <li><a id="laFriday" name="laFriday" href="javascript:jump_showdaytime('4');"></a></li>
      <li><a id="laSaturday" name="laSaturday" href="javascript:jump_showdaytime('5');"></a></li>
      <li><a id="laSunday" name="laSunday" href="javascript:jump_showdaytime('6');"></a></li>
    </ul>
    <div class="panes" style="padding:20px 0 0 0;"> 
		<table cellpadding="0" cellspacing="0" style="width:548px;" class="linkagetable">
		  <tr style="background:#dedede; height:25px;">
			<td style="width:95px;" class="scheduletd"><label id="laTimerange" name="laTimerange"></label></td>
			<td style="width:219px;" class="scheduletd"><label name="laStartTime"></label></td>
			<td style="width:219px;" class="scheduletd"><label name="laEndTime"></label></td>
		  </tr>
		  <tr style="height:25px;">
			<td class="scheduletd">1</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(0)">
			  <label name="StartTime1H" id="StartTime1H">00</label>:
			  <label name="StartTime1M" id="StartTime1M">00</label>
			</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(8)">
			  <label name="StopTime1H" id="StopTime1H">00</label>:
			  <label name="StopTime1M" id="StopTime1M">00</label>
			</td>  				
		  </tr>
		  <tr style="height:25px;">
			<td class="scheduletd">2</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(1)">
			  <label name="StartTime2H" id="StartTime2H">00</label>:
			  <label name="StartTime2M" id="StartTime2M">00</label>
			</td>  
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(9)">
			  <label name="StopTime2H" id="StopTime2H">00</label>:
			  <label name="StopTime2M" id="StopTime2M">00</label>
			</td>  				
		  </tr>
		  <tr style="height:25px;">
			<td class="scheduletd">3</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(2)">
			  <label name="StartTime3H" id="StartTime3H">00</label>:
			  <label name="StartTime3M" id="StartTime3M">00</label>
			</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(10)">
			  <label name="StopTime3H" id="StopTime3H">00</label>:
			  <label name="StopTime3M" id="StopTime3M">00</label>
			</td>  				
		  </tr>
		  <tr style="height:25px;">
			<td class="scheduletd">4</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(3)">
			  <label name="StartTime4H" id="StartTime4H">00</label>:
			  <label name="StartTime4M" id="StartTime4M">00</label>
			</td>
			<td class="scheduletd scheduletdbackground" onclick="showScheduleinputWindow(11)">
			  <label name="StopTime4H" id="StopTime4H">00</label>:
			  <label name="StopTime4M" id="StopTime4M">00</label>
			</td> 
		  </tr>
	   </table>   
    </div>
	<div style="height:30px; line-height:30px;">
	  <span class="skybluefont"><label name="laCopyToWeek"></label></span>
      <input name="alldaylist" type="checkbox" class="checkbox" id="alldaylist" onclick="SelectAllplandayList()"/>&nbsp;
      <label name="laSelectAll"></label>
	</div>
	<div style="height:50px;">
	  <input name='ChannelplandayList0' id='ChannelplandayList0' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()' disabled="disabled" checked="checked">
	  <label id="laMonday" name="laMonday"></label>&nbsp;
	  <input name='ChannelplandayList1' id='ChannelplandayList1' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laTuesday" name="laTuesday"></label>&nbsp;
	  <input name='ChannelplandayList2' id='ChannelplandayList2' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laWednesday" name="laWednesday"></label>&nbsp;
	  <input name='ChannelplandayList3' id='ChannelplandayList3' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laThursday" name="laThursday"></label>&nbsp;
	  <input name='ChannelplandayList4' id='ChannelplandayList4' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laFriday" name="laFriday"></label>&nbsp;
	  <input name='ChannelplandayList5' id='ChannelplandayList5' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laSaturday" name="laSaturday"></label>&nbsp;
	  <input name='ChannelplandayList6' id='ChannelplandayList6' type='checkbox' class="checkbox" onClick='CheackAllChanneldayList()'>
	  <label id="laSunday" name="laSunday"></label>&nbsp;&nbsp;
	  <input type="button" name="CopyTo" id="CopyTo" value="" class="button" onClick="CopyDayTimeInfo()"/>
	</div>
	<div style="height:40px; text-align:right;">
	  <span id="SetResultTipsTwo" class='formtips'></span>
      <input id="ConfirmTips" name="laOK" type="button" value="" class="savebtn" onclick="OKEditScheduleDlg()">
	  <input id="laCancel" name="laCancel" type="button" value="" class="savebtn" onclick="CancelScheduleDlg();">
	</div>   
  </div>
</div>