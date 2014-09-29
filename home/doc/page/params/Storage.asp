<ul class="tabs" id="tabStorage">
    <li><a id="aRecordPlan" name="aRecordPlan" href="javascript:ia(RecordPlan).update();"></a></li>	
    <li><a id="aHardDisk" name="aHardDisk" href="javascript:ia(DiskInfo).update()"></a></li>
    <li><a href="javascript:ia(NAS).update()">NAS</a></li>
</ul>
<div class="panes">
    <div class="pane" id="recordPlan">
        <div class="subparamswhite">
	        <span class="firstspan"><label id='laPreRecordTime' name='laPreRecordTime'></label></span>
	        <span>
                <select name="PreRecordTime" id="PreRecordTime" class="selectwidth">
                    <option value="0" id='PreRecordTimeOpt1' name='PreRecordTimeOpt1'></option>
                    <option value="5" id='PreRecordTimeOpt2' name='PreRecordTimeOpt2'></option>
                    <option value="10" id='PreRecordTimeOpt3' name='PreRecordTimeOpt3'></option>
                    <option value="15" id='PreRecordTimeOpt4' name='PreRecordTimeOpt4'></option>
                    <option value="20" id='PreRecordTimeOpt5' name='PreRecordTimeOpt5'></option>
                    <option value="25" id='PreRecordTimeOpt6' name='PreRecordTimeOpt6'></option>
                    <option value="30" id='PreRecordTimeOpt7' name='PreRecordTimeOpt7'></option>
                    <option value="2147483647" id='PreRecordTimeOpt8' name='PreRecordTimeOpt8'></option>
                </select>
	        </span>
	    </div>
	    <div class="subparamsgray">
	        <span class="firstspan"><label id='laRecordTime' name='laRecordTime'></label></span>
            <span>
                <select id="RecordTime" class="selectwidth">
                    <option value="5" id='PreRecordTimeOpt2' name='PreRecordTimeOpt2'></option>
                    <option value="10" id='PreRecordTimeOpt3' name='PreRecordTimeOpt3'></option>
                    <option value="30" id='PreRecordTimeOpt7' name='PreRecordTimeOpt7'></option>
                    <option value="60" id='RecordTimeOpt1' name='RecordTimeOpt1'></option>
                    <option value="120" id='RecordTimeOpt2' name='RecordTimeOpt2'></option>
                    <option value="300" id='RecordTimeOpt3' name='RecordTimeOpt3'></option>
                    <option value="600" id='RecordTimeOpt4' name='RecordTimeOpt4'></option>
                </select>
	        </span>		
	    </div>
        <div class="subparamswhite displaynone">
	        <span class="firstspan"><label id='laRedundancyRec' name='laRedundancyRec'></label></span>
	        <span>
                <select name="RedundancyRec" id="RedundancyRec" class="selectwidth" disabled="disabled">
                    <option value="false" id='RedundancyRecOpt1' name='RedundancyRecOpt1'></option>
                    <option value="true" id='RedundancyRecOpt2' name='RedundancyRecOpt2'></option>
                </select>
	        </span>
	    </div>
	    <div class="subparamsgray displaynone">
	        <span class="firstspan"><label id='laAudioRec' name='laAudioRec'></label></span>
            <span>
                <select name="AudioRec" id="AudioRec" class="selectwidth" disabled="disabled">
                    <option value="false" id='RedundancyRecOpt1' name='RedundancyRecOpt1'></option>
                    <option value="true" id='RedundancyRecOpt2' name='RedundancyRecOpt2'></option>
                </select>
	        </span>		
	    </div>
        <div class="subparamswhite displaynone">
	        <span class="firstspan"><label id="geRecorderDuration" name="geRecorderDuration"></label></span>
	        <span>
                <input name="RecorderDuration" type="text" maxlength="3" id="RecorderDuration" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'geRecorderDuration','geRecorderDuration',0,30)" onkeydown="CheckKeyDown(event)" disabled="disabled"/>
	        </span>	
	    </div>
        <div class="subparamsgray margintop26">
	        <input type="checkbox" class="checkbox" name="EnableRecordPlan" id="EnableRecordPlan" onclick="EnableRecording()"/>
	        <label id="laEnableRecordPlan" name="laEnableRecordPlan"></label>
	    </div>
	    <div class="recordschedulebtn">  
	        <input id="recordScheduleEditBtn" name="laEdit" type="button" class="savebtn" onclick="EditRecordSchedule()"/>	
	    </div>	
	    <div class="paddingleft10 recordschedulecanvas" id="recordplanCanvas">
            <canvas id="myCanvas" width="670" height="280"></canvas>
        </div>
        <div id="scheduleplan" class="displaynone"></div>
    </div> 
    <div class="pane">
		<div class="subparamsgray">
			<span class="left"><label id="laDiskTitle" name="laDiskTitle"></label></span>
			<span class="right marginright10"><input type="button" class="button" id="formatDisk" name="formatDisk" onclick="FormatSelDisk()"></span>
		</div>
		<div class="bgeaeaea height25 lineheight25">
			<span class="paddingleft10 inlineblock width85 left">
				<input class="checkbox" type="checkbox" id="selAllDisk">&nbsp;
				<label id="laDiskNumer" name="laDiskNumer"></label>
			</span>
			<span class="inlineblock width92 left"><label id="laCapacity" name="laCapacity"></label></span>
			<span class="inlineblock width92 left"><label id="laFreeSpace" name="laFreeSpace"></label></span>
			<span class="inlineblock width92 left"><label id="laState" name="laState"></label></span>
			<span class="inlineblock width92 left"><label id="laType" name="laType"></label></span>
			<span class="inlineblock width92 left"><label id="laProperty" name="laAttribute"></label></span>
			<span class="inlineblock width92 left"><label id="laProcess" name="laProcess"></label></span>
		</div>
		<div id="storageDecList"></div>
    </div>
    <div class="pane" id="nas">
        <div class="nasline bgeaeaea lineheight25">
            <span class="nasrow"><label id="laDiskNo" name="laDiskNumer"></label></span>
			<span class="nasrow"><label id="laNasType" name="laType"></label></span>
			<span class="nasrow"><label name="laServerAdd"></label></span>
			<span class="nasrow"><label id="laFilePath" name="laFilePath"></label></span>
        </div>
        <div class="nasline">
            <span class="nasrow"><label>1</label></span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">2</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">3</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">4</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">5</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">6</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">7</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasline">
            <span class="nasrow">8</span><span class="nasrow">NAS</span><span class="nasrow"></span><span class="nasrow"></span>
        </div>
        <div class="nasfoot">
            <span id="IPAddressTips" class='nasrow nasformtips'>&nbsp;</span>
            <span id="FilePathTips" class='nasrow nasformtips'>&nbsp;</span>
        </div>
    </div>
</div>

<div id="editText" class="nasedittext">
  <input type="text" id="inputText" maxlength="128">
</div> 
