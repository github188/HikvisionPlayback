<ul class="tabs" id="tabPtz">
  <li><a href="javascript:initPtzBasic();" name="aPtzBasic"></a></li>
  <li><a href="javascript:initLimit();" name="aPtzLimit"></a></li>
  <li><a href="javascript:initHomePos();" name="aPtzHomePos"></a></li>
  <li><a href="javascript:initParkAction()" name="aPtzParkAction"></a></li>
  <li><a href="javascript:initPrivacyMask();" name="aPtzPrivacyMask"></a></li>
  <li><a href="javascript:initTimeTasks();" name="aPtzTimeTasks"></a></li>
  <li><a href="javascript:initClearCfg();" name="aPtzClearCfg"></a></li>
</ul>
<div class="panes" id="ptzCfg">
  <div id="enablePMArea"><span><input type="checkbox" id="enablePrivacyMask" class="checkBox"><label name="laEnablePrivacyMask"></label></span></div>
  <div id="ptzArea">
    <div id="main_plugin" class="paramplugin left"></div>
    <div id="ptzControl">
      <div class="ptzOpe"> <span class="ptzDir">
        <div><span id="leftup" onMouseDown="SetPTZLeftUpStart()" onMouseUp="SetPTZStop(0)"></span><span id="up" onMouseDown="SetPTZUpStart()" onMouseUp="SetPTZStop(0)"></span><span id="rightup" onMouseDown="SetPTZRightUpStart()" onMouseUp="SetPTZStop(0)"></span></div>
        <div><span id="left" onMouseDown="SetPTZLeftStart()" onMouseUp="SetPTZStop(0)"></span><span id="auto" onclick="ptzAuto()"></span><span id="right" onMouseDown="SetPTZRightStart()" onMouseUp="SetPTZStop(0)"></span></div>
        <div><span id="leftdown" onMouseDown="SetPTZLeftDownStart()" onMouseUp="SetPTZStop(0)"></span><span id="down" onMouseDown="SetPTZDownStart()" onMouseUp="SetPTZStop(0)"></span><span id="rightdown" onMouseDown="SetPTZRightDownStart()" onMouseUp="SetPTZStop(0)"></span></div>
        </span><span class="ptzDis">
        <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid">
          <div><span id="zoomIn" onMouseDown="SetZoomInStart()" onMouseUp="SetPTZStop(1)"></span><span class="vLine"></span><span id="zoomOut" onMouseDown="SetZoomOutStart()" onMouseUp="SetPTZStop(1)"></span></div>
          </span><span class="ptzBtnRight"></span></div>
        <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid">
          <div><span id="focusIn" onMouseDown="SetFocusInStart()" onMouseUp="SetFocusStop()"></span><span class="vLine"></span><span id="focusOut" onMouseDown="SetFocusOutStart()" onMouseUp="SetFocusStop()"></span></div>
          </span><span class="ptzBtnRight"></span></div>
        <div><span class="ptzBtnLeft"></span><span class="ptzBtnMid">
          <div><span id="irisIn" onMouseDown="IrisInStart()" onMouseUp="IrisStop()"></span><span class="vLine"></span><span id="irisOut" onMouseDown="IrisOutStart()" onMouseUp="IrisStop()"></span></div>
          </span><span class="ptzBtnRight"></span></div>
        </span> </div>
      <div class="ptzSpeed"> <span class="speedReduce"></span><span class="sliderLeft"></span><span id="ptzSlider" class="sliderBar"></span><span class="sliderRight"></span><span class="speedAdd"></span> </div>
      <!--<div class="ptzAid">
        <span class="ptzBtnLeft"></span><span class="ptzAidBg"><div><span id="light" onclick="SetLight()"></span><span class="vLine"></span><span id="rain" onclick="SetWiper()"></span><span class="vLine"></span><span id="oneKeyFocus"></span><span class="vLine"></span><span id="initCamera"></span></div></span><span class="ptzBtnRight"></span>
      </div>-->
      <div class="presetpane">
        <div id="PresetArea"></div>
      </div>
    </div>
  </div>
  <div class="pane" id="ptzBasic">
    <div class="ptzmainParams"><label id="laPtzBasic" name="laPtzBasic"></label></div>
    <div class="ptzsubParamsWhite"><span><input type="checkbox" id="enableProportionZoom"></span><span><label id="laProportionZoom" name="laProportionZoom"></label></span></div>
    <div class="ptzsubParamsGray"><span><input type="checkbox" id="enableImageFreeze"></span><span><label id="laImageFreeze" name="laImageFreeze"></label></span></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laPresetSpeed" name="laPresetSpeed"></label></span><span>
      <select id="presetSpeed" class="selectwidth">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select></span>
    </div>
    <div class="ptzsubParamsGray"><span class="firstspan"><label id="laControlSpeed" name="laControlSpeed"></label></span><span>
      <select id="keyBoardControlSpeed" class="selectwidth">
        <option value="low" name="aLevelLow"></option>
        <option value="normal" name="aLevelNormal"></option>
        <option value="high" name="aLevelHigh"></option>
      </select></span>
    </div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laAutoScanSpeed" name="laAutoScanSpeed"></label></span><span><select id="autoScanSpeed" class="selectwidth"></select></span>
    </div>
    <div class="ptzmainParams"><label id="laPtzOSDDis" name="laPtzOSDDis"></label></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laZoomLabel" name="laZoomLabel"></label></span><span>
      <select id="zoomLable" class="selectwidth">
        <option value="2sec" name="speedLevelOpt1"></option>
        <option value="5sec" name="speedLevelOpt2"></option>
        <option value="10sec" name="speedLevelOpt3"></option>
        <option value="alwaysclose" name="speedLevelOpt4"></option>
        <option value="alwaysopen" name="speedLevelOpt5"></option>
      </select></span>
    </div>
    <div class="ptzsubParamsGray"><span class="firstspan"><label id="laAzimuth" name="laAzimuth"></label></span><span>
      <select id="azimuth" class="selectwidth">
        <option value="2sec" name="speedLevelOpt1"></option>
        <option value="5sec" name="speedLevelOpt2"></option>
        <option value="10sec" name="speedLevelOpt3"></option>
        <option value="alwaysclose" name="speedLevelOpt4"></option>
        <option value="alwaysopen" name="speedLevelOpt5"></option>
      </select></span>
    </div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laPresetLable" name="laPresetLable"></label></span><span><select id="presetLable" class="selectwidth"><option value="2sec" name="speedLevelOpt1"></option>
        <option value="5sec" name="speedLevelOpt2"></option>
        <option value="10sec" name="speedLevelOpt3"></option>
        <option value="alwaysclose" name="speedLevelOpt4"></option>
        <option value="alwaysopen" name="speedLevelOpt5"></option></select></span></div>
    <div class="ptzmainParams"><label id="laSavePowerOff" name="laSavePowerOff"></label></div>
     <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laSavePowerType" name="laSavePowerType"></label></span><span>
     <select id="savePowerType" class="selectwidth">
       <option value="disable" name="trDisabled"></option>
       <option value="30sec" name="savePowerTypeOpt2"></option>
       <option value="60sec" name="savePowerTypeOpt3"></option>
       <option value="300sec" name="savePowerTypeOpt4"></option>
       <option value="600sec" name="savePowerTypeOpt5"></option>
     </select></span></div>
  </div>
  <div class="pane" id="ptzlimiteds">
    <div class="ptzsubParamsWhite setArea"><span class="firstspan"><input type="checkbox" id="enableLimit"><label name="laEnableLimit" id="laEnableLimit"></label></span><span></span></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laLimitType" name="laLimitType"></label></span><span><select id="limitType" class="selectwidth"><option value="1" name="limitTypeOpt1"></option><option value="2" name="limitTypeOpt2"></option></select></span></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laLimitStatus" name="laLimitStatus"></label></span><span><input id="limitStatus" type="text" disabled class="inputwidth"></span></div>
    <div class="ptzsubParamsWhite setArea"><input type="button" class="button" onClick="startLimitInfo()" name="SetPreset"><input type="button" class="button" onClick="cleanLimitInfo()" name="CleanPreset"></div>
  </div>
  <div class="pane" id="homePos"> 
    <div align="left" class="setArea"><span><input type="button" name="SetPreset" class="button" onClick="SetHomePos()"><input type="button" class="button" onClick="CleanHomePos()" name="CleanPreset"><input type="button" class="button" onClick="GotoHomePos()" name="btnGoto"></span></div>
  </div>
  <div class="pane" id="parkaction">
    <div class="ptzsubParamsWhite"><span class="rowfirst"><input type="checkbox" id="enabledPark"><label name="laEnabledPark"></label></span></div>
    <div class="ptzsubParamsGray"><span class="firstspan"><label name="laParkTime"></label></span><span><input type="text" id="parkTime" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'parkTimeTips','laParkTime',5,720)">&nbsp;&nbsp;<label name="optionSecond"/></span><span id="parkTimeTips"></span></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label id="laActionType" name="laActionType"></label></span><span><select id="actionType" class="selectwidth"><option value="autoscan" selected name="autoScan"></option><option value="framescan" name="frameScan"></option><option value="randomscan" name="randomScan"></option><option value="patrol" name="patrolScan"></option><option value="pattern" name="Pattern"></option><option value="preset" name="laPreset"></option><option value="panoramascan" name="panoramaScan"></option><option value="tiltscan" name="tiltScan"></option></select></span><span></span></div>
    <div class="ptzsubParamsGray" id="actionNumArea"><span class="firstspan"><label name="laActionNum"></label></span><span><select id="actionNum" class="selectwidth"></select></span></div>
  </div>
  <div class="pane" id="privacyMask">
    <div><span><input type="button" class="button" id="CoverStartMapbutton" onClick="StartHuaCover()" name="CoverStartMapbutton"><input type="button" name="CoverTimebutton" class="button" onClick="ClearMapCover()"></span></div>
    <div class="head"><span class="right"><input type="button" name="AddDigitalIpBtn" class="button" onClick="addPrivacyMask()"><input type="button" name="DelDigitalIpBtn" class="button" onClick="deletePrivacyMask()"></span><span><label id="laPrivacyMaskList" name="laPrivacyMaskList"></label></span></div>
    <div class="listHead"><span class="first"><label name="laSerialNumber"></label></span><span class="second"><label id="laPrivacyMaskTitle" name="laPrivacyMaskTitle"></label></span><span class="third"><label name="laType"></label></span><span class="fouth"><label id="laEnable" name="laEnable"></label></span></div>
    <div id="privacyMaskList"></div>
  </div>
  <div class="pane" id="timeTasks">
    <div class="ptzsubParamsWhite"><span class="rowfirst"><input type="checkbox" id="enabledTimeTasks"><label id="" name="laEnabledTimeTasks"></label></span></div>
    <div class="ptzsubParamsWhite"><span class="firstspan"><label name="laTimeTask"></label></span><span><input type="text" id="txTimeTasks" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'spTimeTaskTips','laTimeTask',5,720)">&nbsp;&nbsp;<label name="optionSecond"></label></span><span id="spTimeTaskTips"></span></div>
    <div class="ptzsubParamsGray"><span class="right"><input type="button" class="button" id="btnEditingTasks" name="btnEditingTasks"></span><span class="firstspan"><label name="laTimingTasks"></label></span></div>
    <div id="dvTimeTasks">
    </div>
    <div class="ptzsubParamsWhite">
      <label name="laTaskCaption"></label>
    </div>
    <div id="dvEditTimeTasks" style="display:none;"></div>
  </div>
  <div class="pane" id="clearCfg">
    <div class="ptzsubParamsWhite"><input type="checkbox" id="clearCfgAll" class="checkbox"><label name="laSelectAll"></label></div>
    <div class="ptzsubParamsGray"><input type="checkbox" id="clearAllPreset"><label name="laAllPreset"></label></div>
    <div class="ptzsubParamsWhite"><input type="checkbox" id="clearAllPatrol"><label name="laAllPatrol"></label></div>
    <div class="ptzsubParamsGray"><input type="checkbox" id="clearAllPattern" ><label name="laAllPattern"></label></div>
    <div class="ptzsubParamsWhite"><input type="checkbox" id="clearAllPrivacy"><label name="laAllMasks"></label></div>
    <div class="ptzsubParamsGray"><input type="checkbox" id="clearAllLimit"><label name="laAllLimit"></label></div>
    <div class="ptzsubParamsWhite"><input type="checkbox" id="clearAllTask"><label name="laAllTasks"></label></div>
    <div class="ptzsubParamsGray"><input type="checkbox" id="clearAllPark"><label name="laAllPark"></label></div>
  </div>
</div>
<div id="selectPMType" style="display:none;">
  <select style="width:100%; background:#c0c0c0; border:none;">
    <option value="gray" name="gray"></option>
    <option value="red" name="red"></option>
    <option value="green" name="green"></option>
    <option value="blue" name="blue"></option>
    <option value="orange" name="orange"></option>
    <option value="yellow" name="yellow"></option>
    <!--<option value="mosaic" name="mosaic"></option>-->
  </select>
</div> 
<div id="dvSelPMEnable" style="display:none;">
  <select style="width:100%; background:#c0c0c0; border:none;">
    <option value="true" name="jsTrue"></option>
    <option value="false" name="jsFalse"></option>
  </select>
</div> 
