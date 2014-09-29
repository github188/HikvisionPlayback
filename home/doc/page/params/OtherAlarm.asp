<div id="dvWLS">
    <div class="mainparams" style="margin-top: 0px;">
	  <label name="laWirelessAlarm"></label>
	</div>
	<div class="subparamswhite">
	  <span class="firstspan"><label name="laSelWirelessAlarm"></label></span>
      <span>
          <select id="seWLSID" class="selectwidth"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select>
	  </span>
	</div>
	<div class="subparamsgray">
	  <span><input type="checkbox" id="inEnableWLSAlarm" class="checkbox verticalmiddle">&nbsp;<label name="laEnableWirelessAlarm"></label>
	  </span>
	</div>
	<div class="subparamswhite">
	  <span class="firstspan"><label id="laAlarmname" name="laAlarmname"></label></span>
      <span>
        <input name="inWLSName" id="inWLSName" class="inputwidth" type="text" onBlur="CheckDeviceName(this.value,'inWLSNameTips',1)" maxlength="32">
		<label id="inWLSNameTips" class='formtips'></label>
	  </span>		
	</div>
	<div id="dvEventLinkage">
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
				<input name="inRecord" class="checkbox" id="inRecord" type="checkbox"/>&nbsp;
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
				  <input class="checkbox" type="checkbox" id="inWLSSelectAllAlarmOutput"/>&nbsp;
				  <label name="laSelectAll"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <span id="spWLSDisPlayLinkageList"></span>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <label name="laTriggerWirelessAlarm"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				<input name="inLightAudioAlarm" class="checkbox" id="inLightAudioAlarm" type="checkbox"/>&nbsp;
				<label name="laLightAudioAlarm"></label>
				</td>
			  </tr>
			</table>
		  </td>		  
		</tr>
	  </table>
	</div>
	<div align="right"><span><input type="button"  value=""  onClick="setOtherAlarmLinkDoc('WLS')" name="laSaveBtn" class="savebtn"/></span></div>
</div>
<div id="dvPIR" class="margintop10">
    <div class="mainparams">
	  <label name="laPIRAlarm"></label>
	</div>
	<div class="subparamswhite">
	  <span><input type="checkbox" id="inEnablePIRAlarm" class="checkbox verticalmiddle">&nbsp;<label name="laEnablePIRAlarm"></label>
	  </span>
	</div>
	<div class="subparamsgray">
	  <span class="firstspan"><label id="laAlarmname" name="laAlarmname"></label></span>
      <span>
        <input name="inPIRName" id="inPIRName" class="inputwidth" type="text" onBlur="CheckDeviceName(this.value,'inPIRNameTips',1)" maxlength="32">
		<label id="inPIRNameTips" class='formtips'></label>
	  </span>		
	</div>
	<div id="dvEventLinkage">
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
				<input name="inRecord" class="checkbox" id="inRecord" type="checkbox"/>&nbsp;
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
				  <input class="checkbox" type="checkbox" id="inPIRSelectAllAlarmOutput"/>&nbsp;
				  <label name="laSelectAll"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <span id="spPIRDisPlayLinkageList"></span>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <label name="laTriggerWirelessAlarm"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				<input name="inLightAudioAlarm" class="checkbox" id="inLightAudioAlarm" type="checkbox"/>&nbsp;
				<label name="laLightAudioAlarm"></label>
				</td>
			  </tr>
			</table>
		  </td>		  
		</tr>
	  </table>
	</div>
	<div align="right"><span><input type="button"  value=""  onClick="setOtherAlarmLinkDoc('PIR')" name="laSaveBtn" class="savebtn"/></span></div>
</div>
<div id="dvCallHelp" class="margintop10 displaynone">
    <div class="mainparams">
	  <label name="OptCallHelp"></label>
	</div>
	<!--<div class="subparamswhite">
	  <span><input type="checkbox" id="inEnablePIRAlarm" class="checkbox verticalmiddle">&nbsp;<label name="laEnablePIRAlarm"></label>
	  </span>
	</div>-->
	<!--<div class="subparamswhite">
	  <span class="firstspan"><label id="laAlarmname" name="laAlarmname"></label></span>
      <span>
        <input name="inCallHelpName" id="inCallHelpName" class="inputwidth" type="text" onBlur="CheckDeviceName(this.value,'inCallHelpNameTips',1)" maxlength="32">
		<label id="inCallHelpNameTips" class='formtips'></label>
	  </span>		
	</div>-->
	<div id="dvEventLinkage" class="margintop10">
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
				<input name="inRecord" class="checkbox" id="inRecord" type="checkbox"/>&nbsp;
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
				  <input class="checkbox" type="checkbox" id="inCallHelpSelectAllAlarmOutput"/>&nbsp;
				  <label name="laSelectAll"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <span id="spCallHelpDisPlayLinkageList"></span>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				  <label name="laTriggerWirelessAlarm"></label>
				</td>
			  </tr>
			  <tr>
				<td class="height25 paddingleft5">
				<input name="inLightAudioAlarm" class="checkbox" id="inLightAudioAlarm" type="checkbox"/>&nbsp;
				<label name="laLightAudioAlarm"></label>
				</td>
			  </tr>
			</table>
		  </td>		  
		</tr>
	  </table>
	</div>
	<div align="right"><span><input type="button"  value=""  onClick="setOtherAlarmLinkDoc('callhelp')" name="laSaveBtn" class="savebtn"/></span></div>
</div>
	