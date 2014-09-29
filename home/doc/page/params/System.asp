<?xml version="1.0" encoding="utf-8"?><!-- tabs -->
<ul id="tabSystem" class="tabs">
	<li><a id="aDeviceInfo" name="aDeviceInfo" href="javascript:ia(DeviceInfo).update();"></a></li>
	<li><a id="aTimeSettings" name="aTimeSettings" href="javascript:ia(TimeSettings).update();"></a></li>
	<li><a id="aMaintain" name="aMaintain" href="javascript:ia(Maintain).update();"></a></li>
	<li><a href="javascript:ia(RS232Config).update();">&nbsp;&nbsp;RS232&nbsp;&nbsp;</a></li>
	<li><a href="javascript:ia(RS485Config).update();">&nbsp;&nbsp;RS485&nbsp;&nbsp;</a></li>
    <li><a name="aTelecontrol" href="javascript:ia(Telecontrol).update();"></a></li>
    <li><a name="laDST" href="javascript:ia(TimeSettings).updateDST();"></a></li>
</ul>

<!-- panes -->
<div class="panes panewidth" id="systemDiv">
	<div class="pane">
		<div id="diDeviceInfo">
			<div id="diBaseInfo">
				<div class="mainparams">
					<label id="laBaseInfo" name="laBaseInfo"></label>
				</div>
				<div class="subparamswhite">
				    <span class="firstspan"><label id="laDeviceName" name="laDeviceName"></label></span>
					<span>
					    <input id="teDeviceName" class="inputwidth" type="text" maxlength="32" onkeyup="CheckKeyDown(event)" onblur="pr(DeviceInfo).checkDeviceNameValidity(this.value, 'laDeviceNameTips', true)" />
					</span>
					<span><label id="laDeviceNameTips" class="tips"/></span>
				</div>
				<div class="subparamswhite displaynone" id="dvDeviceID">
				    <span class="firstspan"><label id="laDeviceID" name="laDeviceID"></label></span>
					<span>
					    <input id="teDeviceID" class="inputwidth" type="text" maxlength="3" onkeydown="CheckKeyDown(event)" onblur="pr(DeviceInfo).checkDeviceIDValidity(this.value, 'Equipmenttips', 'laDeviceID', 1, 255)" />
					</span>
					<span id="Equipmenttips"></span>
				</div>
			</div>
			<div id="diDetailedInfo">
				<table id="taDetailedInfo" border="0" cellspacing="0" cellpadding="0" class="deviceinfotable">
					<tr>
						<td class="rowheader deviceinfotd"><label id="laDeviceType" name="laDeviceType"></label></td>
						<td id="tdDeviceTypeValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laDeviceSn" name="laDeviceSn"></label></td>
						<td id="tdDeviceSnValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laFirmwareVersion" name="laFirmwareVersion"></label></td>
						<td id="tdFirmwareVersionValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laLogicVersion" name="laLogicVersion"></label></td>
						<td id="tdLogicVersionValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laChannelNum" name="laChannelNum"></label></td>
						<td id="tdChannelNumValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laDiskNum" name="laDiskNum"></label></td>
						<td id="tdDiskNumValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laAlarmInNum" name="laAlarmInNum"></label></td>
						<td id="tdAlarmInNumValue" class="deviceinfotd"></td>
					</tr>
					<tr>
						<td class="rowheader deviceinfotd"><label id="laAlarmOutNum" name="laAlarmOutNum"></label></td>
						<td id="tdAlarmOutNumValue" class="deviceinfotd"></td>
					</tr>
				</table>
			</div>
		</div><!--<div id="diDeviceInfo">-->
	</div><!--<div class="pane">-->
	
	<div class="pane">
		<div id="diTimeConfig">
			<div class="subparamswhite">
			    <span class="firstspan"><label id="laTimeZone" name="laTimeZone"></label></span>
				<span>
				    <select id="seTimeZone" onchange="ia(TimeSettings).updateSystemTime()" class="width300">
						<option id="timezoneOpt1" name="timezoneOpt1" value="CST+12:00:00"></option>
						<option id="timezoneOpt2" name="timezoneOpt2" value="CST+11:00:00"></option>
						<option id="timezoneOpt3" name="timezoneOpt3" value="CST+10:00:00"></option>
						<option id="timezoneOpt4" name="timezoneOpt4" value="CST+9:00:00"></option>
						<option id="timezoneOpt5" name="timezoneOpt5" value="CST+8:00:00"></option>
						<option id="timezoneOpt6" name="timezoneOpt6" value="CST+7:00:00"></option>
						<option id="timezoneOpt7" name="timezoneOpt7" value="CST+6:00:00"></option>
						<option id="timezoneOpt8" name="timezoneOpt8" value="CST+5:00:00"></option>
						<option id="timezoneOpt9" name="timezoneOpt9" value="CST+4:30:00"></option>
						<option id="timezoneOpt10" name="timezoneOpt10" value="CST+4:00:00"></option>
						<option id="timezoneOpt11" name="timezoneOpt11" value="CST+3:30:00"></option>
						<option id="timezoneOpt12" name="timezoneOpt12" value="CST+3:00:00"></option>
						<option id="timezoneOpt13" name="timezoneOpt13" value="CST+2:00:00"></option>
						<option id="timezoneOpt14" name="timezoneOpt14" value="CST+1:00:00"></option>
						<option id="timezoneOpt15" name="timezoneOpt15" value="CST+0:00:00"></option>
						<option id="timezoneOpt16" name="timezoneOpt16" value="CST-1:00:00"></option>
						<option id="timezoneOpt17" name="timezoneOpt17" value="CST-2:00:00"></option>
						<option id="timezoneOpt18" name="timezoneOpt18" value="CST-3:00:00"></option>
						<option id="timezoneOpt19" name="timezoneOpt19" value="CST-3:30:00"></option>
						<option id="timezoneOpt20" name="timezoneOpt20" value="CST-4:00:00"></option>
						<option id="timezoneOpt21" name="timezoneOpt21" value="CST-4:30:00"></option>
						<option id="timezoneOpt22" name="timezoneOpt22" value="CST-5:00:00"></option>
						<option id="timezoneOpt23" name="timezoneOpt23" value="CST-5:30:00"></option>
						<option id="timezoneOpt24" name="timezoneOpt24" value="CST-5:45:00"></option>
						<option id="timezoneOpt25" name="timezoneOpt25" value="CST-6:00:00"></option>
						<option id="timezoneOpt26" name="timezoneOpt26" value="CST-6:30:00"></option>
						<option id="timezoneOpt27" name="timezoneOpt27" value="CST-7:00:00"></option>
						<option id="timezoneOpt28" name="timezoneOpt28" selected="selected" value="CST-8:00:00"></option>
						<option id="timezoneOpt29" name="timezoneOpt29" value="CST-9:00:00"></option>
						<option id="timezoneOpt30" name="timezoneOpt30" value="CST-9:30:00"></option>
						<option id="timezoneOpt31" name="timezoneOpt31" value="CST-10:00:00"></option>
						<option id="timezoneOpt32" name="timezoneOpt32" value="CST-11:00:00"></option>
						<option id="timezoneOpt33" name="timezoneOpt33" value="CST-12:00:00"></option>
						<option id="timezoneOpt34" name="timezoneOpt34" value="CST-13:00:00"></option>
				    </select>
				</span>
			</div>
			<div id="diAutoTimeSync">
				<div class="mainparams margintop26">
					<label id="laAutoTimeSync" name="trTimeSync"></label>
				</div>
				<div class="subparamswhite">
					<span><input type="radio" value="0" onclick="pr(TimeSettings).setRadioItem('diTimeConfig', $(this).val())" /></span>
					<span><label id="laNtpTimeSync" name="laNtpTimeSync"></label></span>
				</div>
				<div class="subparamsgray">
					<span class="firstspan"><label name="laServerAdd"></label></span>
					<span>
					    <input id="teNtpServer" type="text" class="timetext" maxlength="64" disabled="disabled" onkeydown="CheckKeyDown(event)" onkeyup="CheckInput(event)" />
					</span>
					<span><label id="laNtpServerTips" class="tips" /></span>
				</div>
				<div class="subparamswhite">
					<span class="firstspan"><label id="laNtpPort" name="laNtpPort"></label></span>
					<span><input id="teNtpPort" type="text" class="timetext" maxlength="5" disabled="disabled" onkeydown="CheckKeyDown(event)" /></span>
					<span><label id="laNtpPortTips" class="tips"/></span>
				</div>
				<div class="subparamsgray">
					<span class="firstspan"><label id="laNtpInterval" name="laNtpInterval"></label></span>
					<span><input id="teNtpInterval" class="timetext" type="text" maxlength="5" disabled="disabled" onkeydown="CheckKeyDown(event)" /></span>
					<span><label id="laSecond" name="laSecond"></label></span>
					<span><label id="laNtpIntervalTips" class="tips"/></span>
				</div>
			</div>
			<div id="diManualTimeSync" class="margintop13">
				<div class="subparamswhite">
					<span><input type="radio" value="1" onclick="pr(TimeSettings).setRadioItem('diTimeConfig', $(this).val())" /></span>
					<span><label id="laManualTimeSync2" name="laManualTimeSync"></label></span>	
				</div>
				<div class="subparamsgray">
					<span class="firstspan"><label id="laDeviceTime" name="laDeviceTime"></label></span>
					<span><input id="teDeviceTime" type="text" class="timetext" readonly="readonly" disabled="disabled" /></span>
					<span><label id="laDeviceTimeTips" class="tips"/></span>
				</div>
				<div  class="subparamswhite">
					<span class="firstspan"><label name="laSelectTime"></label></span>
					<span><input id="teSelectTime" type="text" class="Wdate timetext" onclick="CreateCalendar(1)" /></span>
					<span><input id="chTimeSyncWithPC" type="checkbox" onclick="ia(TimeSettings).clickTimeSyncWithPC()" /></span>
					<span><label id="laTimeSyncWithPC" name="laTimeSyncWithPC"></label></span>	
				</div>
			</div>
		</div><!--<div id="diTimeConfig">-->
	</div><!--<div class="pane">-->
	
	<div class="pane">
		<div id="diMaintain">
        	<div id="diRestart">
				<div class="mainparams">
					<label id="laRestart" name="laRestart"></label>
				</div>
				<div class="subparamswhite">
				    <span class="firstspan">
					    <input id="btnRestart" name="laRestart" type="button" onclick="ia(Maintain).confirmAndRestart()" />
					</span>
					<span><label id="laRestartDevice" name="laRestartDevice"></label></span>
				</div>
			</div>
			<div id="diRestoreDefault">
				<div class="mainparams margintop26">
					<label name="geDefault"></label>
				</div>
				<div class="subparamswhite">
				    <span class="firstspan">
					    <input id="btnSimpleRestore" name="btnSimpleRestore" type="button" onclick="ia(Maintain).restoreDefault('basic')" />
					</span>
					<span><label id="laSimpleReStore" name="laSimpleReStore"></label></span>
				</div>
				<div class="subparamsgray">
				    <span class="firstspan">
					    <input id="btnCompleteRestore" name="btnCompleteRestore" type="button" onclick="ia(Maintain).restoreDefault('full')" />
					</span>
					<span><label id="laCompleteReStore" name="laCompleteReStore">。</label></span>
				</div>
			</div>
		    <div id="diParamImport">
			    <div class="mainparams margintop26">
				    <label name="laParamImport"></label>
				</div>
				<div class="subparamswhite">
				    <span class="firstspan"><label id="laImportFile" name="laImportFile"></label></span>
					<span>
					    <input id="inImportFile" type="text" readonly="readonly"/>
					    <input name="btnBrowse" type="button" class="button" onclick="browseFilePath('inImportFile', 1)" />
					    <input id="btnImport" name="btnImport" type="button" class="button" onclick="ia(Maintain).ImportParam()" />
					</span>	
				</div>
				<div class="subparamswhite">
				    <span><label name="laState"></label></span>
					<span><label id="laImportUping"></label></span>
				</div>
		    </div> <!--<div id="diParamImport">-->
			
			<div id="diParamExport">
		      <div class="mainparams margintop26">
				    <label id="laParamExport" name="laParamExport"></label>
		      </div>
			    <div class="subparamswhite">
				    <span>
					    <input id="btnExportFile" name="btnExportFile" type="button" class="button" onclick="ia(Maintain).ExportParam()" />
					    <label id="laExportUping" class="Tips"></label>
					</span>
				</div>
		    </div><!--<div id="diParamExport">-->
		
		    <div id="diRemoteUpgrade">
			    <div class="mainparams margintop26">
				    <label name="laRemoteUpgrade"></label>
				</div>
				<div class="subparamswhite">
				    <span class="firstspan"><label name="laUpgradeFile"></label></span>
					<span>
					    <input id="teUpgradeFile" type="text" readonly="readonly" />
					    <input name="btnBrowse" type="button" class="button" onclick="browseFilePath('teUpgradeFile', 1)" />
					    <input id="btnUpgrade" name="btnUpgrade" type="button" class="button"/ onclick="ia(Maintain).StartUp()" />  
					</span>
				</div>
				<div class="subparamswhite">
				    <span>
					    <label name="laState"></label>
					    <label id="laServerUping"></label>
					</span>
				</div>
				<div class="subparamswhite" id="divUpgradeExplain">
				    <label id="laUpgradeExplain" name="laUpgradeExplain" class="upgradelabel"></label>
					<label class="upgradelabel">:</label>&nbsp;
					<label id="laUpgradeExplains" name="laUpgradeExplains" class="upgradelabel upexplains"></label>
				</div>
			</div><!--<div id="diRemoteUpgrade">-->
			<div id="main_plugin" class="plugin0"/>
		</div> <!--<div id="diMaintain">-->
	</div><!--<div class="pane">-->
	
	<div class="pane">
		<div id="diRS232Config">
		    <div class="subparamswhite">
			    <span class="firstspan"><label id="laBaudRate232" name="laBaudRate"></label></span>
				<span>
					<select name="baudRate232" id="baudRate232" class="selectwidth">
						<option value="50">50 bps</option>
						<option value="75">75 bps</option>
						<option value="110">110 bps</option>
						<option value="150">150 bps</option>
						<option value="300">300 bps</option>
						<option value="600">600 bps</option>
						<option value="1200">1200 bps</option>
						<option value="2400">2400 bps</option>
						<option value="4800">4800 bps</option>
						<option value="9600">9600 bps</option>
						<option value="19200">19200 bps</option>
						<option value="38400">38400 bps</option>
						<option value="57600">57600 bps</option>
						<option value="76800">76800 bps</option>
						<option value="115200">115200 bps</option>
					</select>
				</span> 
		    </div>
		    <div class="subparamsgray">
			    <span class="firstspan"><label id="laDataBits232" name="laDataBits"></label></span>
				<span>
				    <select name="dataBits232" id="dataBits232" class="selectwidth">
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
					</select>
				</span>   
		    </div>
			<div class="subparamswhite">
			    <span class="firstspan"><label id="laStopRateRS232" name="laStopRate"></label></span>
				<span>
					<select name="stopRate232" id="stopRate232" class="selectwidth">
						<option value="1">1</option>
						<option value="2">2</option>
					</select>
				</span>
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label id="laParityType232" name="laParityType"></label></span>
				<span>
					<select name="parityType232" id="parityType232" class="selectwidth 232hidden">
						<option value="none" id='parityType232Opt1' name="parityTypeOpt1"></option>
						<option value="even" id='parityType232Opt2' name="parityTypeOpt2"></option>
						<option value="odd" id='parityType232Opt3' name="parityTypeOpt3"></option>
					</select>
				</span>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label id="laFlowControl232" name="laFlowControl"></label></span>
				<span>
					<select name="flowControl232" id="flowControl232" class="selectwidth 232hidden">
						<option value="none" id='dataFlowControl232Opt1' name="dataFlowControlOpt1"></option>
						<option value="hardware" id='dataFlowControl232Opt2' name="dataFlowControlOpt2"></option>
						<option value="software" id='dataFlowControl232Opt3' name='dataFlowControlOpt3'></option>
					</select>
				</span>	
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label id="laUsemode" name="laUsemode"></label></span>
				<span>
					<select name="workMode232" id="workMode232" class="selectwidth">
						<option value="console" id='workModeOpt1' name='workModeOpt1'>console</option>
						<option value="transparent" id='workModeOpt2' name='workModeOpt2'>transparent</option>
					</select>
				</span>
			</div>    
		</div><!--<div id="diRS232Config">-->
	</div><!--<div class="pane">-->	
	    
	<div class="pane">
		<div id="diRS485Config">	
		    <div class="subparamswhite">
			    <span class="firstspan"><label id="laBaudRate485" name="laBaudRate"></label></span>
				<span>
					<select name="baudRate485" id="baudRate485" class="selectwidth">
						<option value="50">50 bps</option>
						<option value="75">75 bps</option>
						<option value="110">110 bps</option>
						<option value="150">150 bps</option>
						<option value="300">300 bps</option>
						<option value="600">600 bps</option>
						<option value="1200">1200 bps</option>
						<option value="2400">2400 bps</option>
						<option value="4800">4800 bps</option>
						<option value="9600">9600 bps</option>
						<option value="19200">19200 bps</option>
						<option value="38400">38400 bps</option>
						<option value="57600">57600 bps</option>
						<option value="76800">76800 bps</option>
						<option value="115200">115200 bps</option>
					</select>
				</span>
		    </div>
			<div class="subparamsgray">
			    <span class="firstspan"><label id="laDataBits485" name="laDataBits"></label></span>
				<span>
					<select name="dataBits485" id="dataBits485" class="selectwidth">
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
					</select>
				</span>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label id="laStopRate485" name="laStopRate"></label></span>
				<span>
					<select name="stopRate485" id="stopRate485" class="selectwidth">
						<option value="1">1</option>
						<option value="2">2</option>
					</select>
				</span>
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label id="laParityType485" name="laParityType"></label></span>
				<span>
					<select name="parityType485" id="parityType485" class="selectwidth 485hidden">
						<option value="none" id='parityType485Opt1' name='parityTypeOpt1'></option>
						<option value="even" id='parityType485Opt2' name='parityTypeOpt2'></option>
						<option value="odd" id='parityType485Opt3' name='parityTypeOpt3'></option>
					</select>
				</span>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label id="laFlowControl485" name="laFlowControl"></label></span>
				<span>
					<select name="flowControl485" id="flowControl485" class="selectwidth 485hidden">
						<option value="none" id='dataFlowControl485Opt1' name='dataFlowControlOpt1'></option>
						<option value="hardware" id='dataFlowControl485Opt2' name='dataFlowControlOpt2'></option>
						<option value="software" id='dataFlowControl485Opt3' name='dataFlowControlOpt3'></option>
					</select>
				</span>
			</div>
			<div class="subparamsgray">
			    <span class="firstspan"><label id="laDecoderType485" name='laDecoderType485'></label></span>
				<span>
				    <select name="controlProtocol485" id="controlProtocol485" class="selectwidth"></select>
				</span>
			</div>
			<div class="subparamswhite">
			    <span class="firstspan"><label id="DecoderaddrTips" name="DecoderaddrTips"></label></span>
				<span><input name="controlAddress485" id="controlAddress485" class="inputwidth" type="text" onkeydown="CheckKeyDown(event)" maxlength="3" /></span>
				<span><label id="controlAddresstips" class="Tips"></label></span>	
			</div>
		</div><!--<div id="diRS485Config">-->
	</div><!--<div class="pane">-->
    <div class="pane" id="dvTelecontrol">
        <div class="mainparams">
            <label name="laStudy"></label>
        </div>
        <div class="subparamswhite">
			<span>
                <select id="seHardType" class="ptzlinkedit">
				    <option value="tel" name="aTelecontrol" />
				</select>
            </span>
			<span>
                <input name="laStudy" type="button" onclick="ia(Telecontrol).study()" class="button" />
            </span>
        </div>
        <div class="mainparams margintop26">
            <label name="btnArm"></label>/<label name="btnDisarm"></label>
        </div>
        <div class="subparamswhite">
            <span>
                <select id="seArmOrDisarm" class="ptzlinkedit">
			        <option value="arm" name="btnArm" />
				    <option value="disarm" name="btnDisarm" />
			    </select>
			    <select id="seDelayTime" class="ptzlinkedit">
			        <option value="0">0s</option>
					<option value="10">10s</option>
				    <option value="30">30s</option>
				    <option value="60">60s</option>
				    <option value="180">180s</option>
				    <option value="300">300s</option>
				    <option value="-1" name="constantBitRateOpt23"></option>
			    </select>
			    <input type="text" id="teCustomizeDelay" class="verticalmiddle displaynone" /><label id="laCustomizeDelay" class="displaynone">(s)</label>
            </span>
			<span id="spDelayTips"></span>
			<span>
                <input name="SetPreset" type="button" onclick="ia(Telecontrol).set()" class="button" />
            </span>
        </div>
    </div>
    <div class="pane" id="dvDST">
        <div class="mainparams">
            <label id="laDST" name="laDST"></label>
        </div>
        <div id="IsEnableDSTTr" class="subparamswhite">
            <span>
                <input type="checkbox" class="checkbox" id="IsEnableDST" onclick="ia(TimeSettings).clickDST()" />&nbsp;
                <label id="laEnableDST" name="laEnableDST"></label>
            </span>
        </div>
        <div id="StartTimeTr" class="subparamsgray">
            <span class="firstspan"><label id="laStartTime" name="laStartTime"></label></span>
            <span>
                <select id="StartMonth" class="timehidden width65">
                    <option value="M1" id='StartMonthOpt1' name="StartMonthOpt1" />
                    <option value="M2" id='StartMonthOpt2' name="StartMonthOpt2" />
                    <option value="M3" id='StartMonthOpt3' name="StartMonthOpt3" />
                    <option value="M4" id='StartMonthOpt4' name="StartMonthOpt4" selected="selected"/>
                    <option value="M5" id='StartMonthOpt5' name="StartMonthOpt5" />
                    <option value="M6" id='StartMonthOpt6' name="StartMonthOpt6" />
                    <option value="M7" id='StartMonthOpt7' name="StartMonthOpt7" />
                    <option value="M8" id='StartMonthOpt8' name="StartMonthOpt8" />
                    <option value="M9" id='StartMonthOpt9' name="StartMonthOpt9" />
                    <option value="M10" id='StartMonthOpt10' name="StartMonthOpt10" />
                    <option value="M11" id='StartMonthOpt11' name="StartMonthOpt11" />
                    <option value="M12" id='StartMonthOpt12' name="StartMonthOpt12" />
                </select>&nbsp;
                <select id="StartWeek" class="timehidden width65">
                    <option value="1" id='StartWeekOpt1' name="StartWeekOpt1" />
                    <option value="2" id='StartWeekOpt2' name="StartWeekOpt2" />
                    <option value="3" id='StartWeekOpt3' name="StartWeekOpt3" />
                    <option value="4" id='StartWeekOpt4' name="StartWeekOpt4" />
                    <option value="5" id='StartWeekOpt5' name="StartWeekOpt5" />
                </select>&nbsp;
                <select id="StartWeekDay" class="timehidden width65">
                    <option value="0" id='StartWeekDayOpt7' name="laSunday" />
                    <option value="1" id='StartWeekDayOpt1' name="laMonday" />
                    <option value="2" id='StartWeekDayOpt2' name="laTuesday" />
                    <option value="3" id='StartWeekDayOpt3' name="laWednesday" />
                    <option value="4" id='StartWeekDayOpt4' name="laThursday" />
                    <option value="5" id='StartWeekDayOpt5' name="laFriday" />
                    <option value="6" id='StartWeekDayOpt6' name="laSaturday" />
                </select>&nbsp;
<select id="StartTime" class="timehidden width54">
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02" selected="selected">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>   
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>  
                </select>
            </span>	
            <span><label name="laOClock"></label></span>
        </div>
        <div id="EndTimeTr" class="subparamswhite">
            <span class="firstspan"><label id="laEndTime" name="laEndTime"></label></span>
            <span>
                <select id="StopMonth" class="timehidden width65">
                    <option value="M1" id='StartMonthOpt1' name="StartMonthOpt1" />
                    <option value="M2" id='StartMonthOpt2' name="StartMonthOpt2" />
                    <option value="M3" id='StartMonthOpt3' name="StartMonthOpt3" />
                    <option value="M4" id='StartMonthOpt4' name="StartMonthOpt4" />
                    <option value="M5" id='StartMonthOpt5' name="StartMonthOpt5" />
                    <option value="M6" id='StartMonthOpt6' name="StartMonthOpt6" />
                    <option value="M7" id='StartMonthOpt7' name="StartMonthOpt7" />
                    <option value="M8" id='StartMonthOpt8' name="StartMonthOpt8" />
                    <option value="M9" id='StartMonthOpt9' name="StartMonthOpt9" />
                    <option value="M10" id='StartMonthOpt10' name="StartMonthOpt10" selected="selected" />
                    <option value="M11" id='StartMonthOpt11' name="StartMonthOpt11" />
                    <option value="M12" id='StartMonthOpt12' name="StartMonthOpt12" />
                </select>&nbsp;
                <select id="StopWeek" class="timehidden width65">
                    <option value="1" id='StartWeekOpt1' name="StartWeekOpt1" />
                    <option value="2" id='StartWeekOpt2' name="StartWeekOpt2" />
                    <option value="3" id='StartWeekOpt3' name="StartWeekOpt3" />
                    <option value="4" id='StartWeekOpt4' name="StartWeekOpt4" />
                    <option value="5" id='StartWeekOpt5' name="StartWeekOpt5" selected="selected" />
                </select>&nbsp;
                <select id="StopWeekDay" class="timehidden width65">
                    <option value="0" id='StartWeekDayOpt7' name="laSunday" />
                    <option value="1" id='StartWeekDayOpt1' name="laMonday" />
                    <option value="2" id='StartWeekDayOpt2' name="laTuesday" />
                    <option value="3" id='StartWeekDayOpt3' name="laWednesday" />
                    <option value="4" id='StartWeekDayOpt4' name="laThursday" />
                    <option value="5" id='StartWeekDayOpt5' name="laFriday" />
                    <option value="6" id='StartWeekDayOpt6' name="laSaturday" />
                </select>&nbsp;
<select id="StopTime" class="timehidden width54">
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02" selected="selected">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>   
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>  
                </select>
            </span>
            <span><label name="laOClock"></label></span>
        </div>
        <div id="DSTBiasTr" class="subparamsgray">
            <span class="firstspan"><label id='laDSTBias' name="laDSTBias"></label></span>
            <span>
                <select id="DSTBias" class="timehidden width268">
                    <option value="00:30:00" id='DSTBiasOpt1' name="DSTBiasOpt1"></option>
                    <option value="01:00:00" id='DSTBiasOpt2' name="DSTBiasOpt2"></option>
                    <option value="01:30:00" id='DSTBiasOpt3' name="DSTBiasOpt3"></option>
                    <option value="02:00:00" id='DSTBiasOpt4' name="DSTBiasOpt4"></option>
                </select>
            </span>
        </div>
    </div>
</div><!--<div class="panes">-->