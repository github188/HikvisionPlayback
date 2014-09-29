<div id="userContent" class="usercontent">
    <div class="windowtile">
        <span id="laUserTitle"></span>
    </div>
    <div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laUserName" name="geUserName"></label></span>
            <span>
			    <input type="text" id="UserNameKing"  class="inputwidth" maxlength="16" onblur="CheckDevUserName(this.value,'CheckResultTips','geUserName',0)" />
			</span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="laUserType"></label></span>
            <span>
                <select id="Priority" class="selectwidth" onchange="ia(User).ChangeUserTypePriority(this.value)">
	                <option value="admin" id='PriorityOpt1' name='PriorityOpt1'></option>
	                <option value="operator" id='PriorityOpt2' name='PriorityOpt2'></option>
	                <option value="viewer" id='PriorityOpt3' name='PriorityOpt3'></option>
                </select>
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="gePassword"></label></span>
            <span>
                <input id="UserPsw" type="password" class="inputwidth" maxlength="16" onfocus="oCheckPassword.focusPassword($('#UserPsw'), $('#UserPswConfirm'))" onblur="oCheckPassword.blurPassword($('#UserNameKing'), $('#UserPsw'), $('#UserPswConfirm')); CheckDevUserName(this.value,'CheckResultTips','gePassword',1)" />
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laCheckPwd" name="laCheckPwd"></label></span>
            <span>
                <input id="UserPswConfirm" type="password" class="inputwidth" maxlength="16" onfocus="oCheckPassword.focusPassword($('#UserPsw'), $('#UserPswConfirm'))" onblur="oCheckPassword.blurPassword($('#UserNameKing'), $('#UserPsw'), $('#UserPswConfirm')); CheckDevUserName(this.value,'CheckResultTips','gePassword',1)" />
            </span>
        </div>
        <div>
            <table cellspacing="0" cellpadding="0" class="usertable" id="taUserPermission">
	            <tr>
	                <td valign="top" class="borderc0c0c0">
		                <table cellpadding="0" cellspacing="0" class="widthpersent100">
		                    <tr class="height25">
			                    <td class="permissiontitle"><label id="laBasicPermissionBtn" name="laBasicPermissionBtn"></label></td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteSetParam" class="usercheckbox" type="checkbox" id="RemoteSetParam" />&nbsp;
			                        <label id='laRemoteSetParam' name='laRemoteSetParam'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
		                        <td>
		                            <input name="RemoteLog" class="usercheckbox" type="checkbox" id="RemoteLog" />&nbsp;
			                        <label id='laRemoteLog' name='laRemoteLog'></label>
		                        </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteUpgrade" class="usercheckbox" type="checkbox" id="RemoteUpgrade" />&nbsp;
			                        <label name='laRemoteUpgrade'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteTalk" class="usercheckbox" type="checkbox" id="RemoteTalk" />&nbsp;
			                        <label id='laRemoteTalk' name='laRemoteTalk'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteReboot" class="usercheckbox" type="checkbox" id="RemoteReboot" />&nbsp;
			                        <label id='laRemoteReboot' name='laRemoteReboot'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteAlarm" class="usercheckbox" type="checkbox" id="RemoteAlarm" />&nbsp;
			                        <label id='laRemoteAlarm' name='laRemoteAlarm'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteCtrl" class="usercheckbox" type="checkbox" id="RemoteCtrl" />&nbsp;
			                        <label id='laRemoteCtrl' name='laRemoteCtrl'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemoteRS" class="usercheckbox" type="checkbox" id="RemoteRS" />&nbsp;
			                        <label id='laRemoteRS' name='laRemoteRS'></label>
		                        </td>
		                    </tr>
		                </table>
	                </td>
	                <td valign="top" class="borderc0c0c0">
		                <table cellpadding="0" cellspacing="0" id="LocalBasicPermission" class="widthpersent100">
		                    <tr class="height25">
			                    <td class="permissiontitle"><label name="laChanPermissionBtn"></label></td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemotePreview" class="usercheckbox" type="checkbox" id="RemotePreview" />&nbsp;
			                        <label id='laRemotePreview' name='laRemotePreview'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemotePTZControl" class="usercheckbox" type="checkbox" id="RemotePTZControl" />&nbsp;
			                        <label id='laRemotePTZControl' name='laRemotePTZControl'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>   
								    <input name="RemoteManualRecord" class="usercheckbox" type="checkbox" id="RemoteManualRecord" />&nbsp;
			                        <label id='laRemoteManualRecord' name='laRemoteManualRecord'></label>
			                    </td>
		                    </tr>
		                    <tr class="height25">
			                    <td>
			                        <input name="RemotePlayback" class="usercheckbox" type="checkbox" id="RemotePlayback" />&nbsp;
									<label id='laRemotePlayback' name='laRemotePlayback'></label>
			                    </td>
		                    </tr>
		                </table>
	                </td>
	            </tr>
            </table>
        </div>
        <div class="userfoot">
            <span class='formtips' id="CheckResultTips"></span>
            <span><input type="button" class="savebtn" id="setUserInfoBtn" name="laOK" onclick="ia(User).SaveUserInfo()" /></span>
            <span><input name="laCancel" type="button" class="savebtn" id= "GoBackListBtn" onclick="ia(User).GoBackUserList()" /></span>
        </div>
    </div>
</div>
