<ul class="tabs">
	<li><a id="aUser" name="aUser" href="javascript:ia(User).update();"></a></li>
    <li><a id="aRTSPAuth" name="aRTSPAuth" href="javascript:ia(RTSPAuth).update();"></a></li>
    <li><a id="aAnonymousVisit" name="aAnonymousVisit" href="javascript:ia(AnonymousVisit).update();"></a></li>
    <li><a id="aIPFilter" name="aIPFilter" href="javascript:ia(IPFilter).update();"></a></li>
</ul>
<div class="panes panewidth" id="divSafety">
    <div class="pane" id="UserPage"></div> 
    <div class="pane" id="RTSPAuth">
        <div class="subparamswhite">
	        <span class="firstspan"><label id="laAuthType" name="laAuthType"></label></span>
	        <span>
	            <select id="selRTSPAuth" class="selectwidth">
		            <option value="false">disable</option>
			        <option value="true">basic</option>
	            </select>
	        </span>
        </div>
    </div>
    <div class="pane" id="divAnonymousVisit">
        <div class="subparamswhite">
	        <span class="firstspan"><label id="aAnonymousVisit" name="aAnonymousVisit"></label></span>
	        <span>
	            <select id="selEnableAnonymous" class="selectwidth">
		            <option value="false" name="trDisabled"></option>
			        <option value="true" name="laEnable"></option>
	            </select>
	        </span>
        </div>
    </div>
    <div class="pane" id="divIPFilter">
        <div class="subparamswhite">
	        <input type="checkbox" class="checkbox" id="chEnableIPFilter"/>&nbsp;<label id="laEnableIPFilter" name="laEnableIPFilter"></label>
        </div>
        <div class="subparamsgray">
        	<span class="firstspan"><label name="laIPFilterType"></label></span>
	        <span>
	            <select id="selIPFilterType" class="selectwidth">
		            <option value="allow" name="optAllow"></option>
			        <option value="deny" name="optDeny"></option>
	            </select>
	        </span>
        </div>
        <div class="mainparams margintop26">
            <label name="aIPFilter"></label>
        </div>
        <div class="ipfilterhead"><span class="right"><input type="button" name="AddDigitalIpBtn" class="button" onclick="showAddIPAddressWnd()" id="btnAddIP"/><input type="button" name="MdfDigitalIpBtn" class="button" onclick="modifyIPAddress()" id="btnModifyIP" disabled/><input id="btnDeleteIP" type="button" name="DelDigitalIpBtn" class="button" onclick="deleteIPAddress()" disabled/><input type="button" name="CleanPreset" class="button" onclick="deleteAllIPAddress()" id="btnCleanIP"/></span></div>
        <div class="listHead"><span class="first"><label name="laSerialNumber"></label></span><span class="second"><label name="">IP</label></span></div>
        <div id="divIPAddressFilterList"></div>
    </div>
</div>
<div id="divAddIpAddress" class="displaynone ipcontent">
	<div class="windowtile">
        <span id="spAddIPAddress"></span>
    </div>
    <div class="subparamswhite margintop26">
        <span class="firstspan"><label name="laIpAddress"></label></span>
        <span>
            <input id="inIPAddress" type="text" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onblur="CheckDIPadd(this.value,'spCheckResultTips','laIpAddress')" />
        </span>
    </div>
    <div class="userfoot">
        <span class='formtips' id="spCheckResultTips"></span>
        <span><input type="button" class="savebtn" id="btnIPFilterOK" name="laOK" /></span>
        <span><input type="button" class="savebtn" id="" name="laCancel" onclick="$.modal.impl.close();" /></span>
    </div>
</div>