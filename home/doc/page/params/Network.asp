<ul id="tabNetwork" class="tabs">
	<li><a href="javascript:ia(IpConfig).update();">TCP/IP</a></li>
	<li><a id="aPortConfig" name="gePort" href="javascript:ia(PortConfig).update();"></a></li>
	<li><a href="javascript:ia(DDNS).update();">DDNS</a></li>
	<li><a href="javascript:ia(PPPoE).update();">PPPoE</a></li>
	<li><a href="javascript:ia(SNMP).update();">SNMP</a></li>
	<li><a href="javascript:ia(P8021x).update();">802.1X</a></li>
	<li><a href="javascript:ia(QoS).update();">QoS</a></li>
    <li><a href="javascript:ia(FTP).update();">FTP</a></li>
    <li><a href="javascript:ia(WIFI).update();">Wi-Fi</a></li>
    <li><a href="javascript:ia(UPNP).update();">UPnP™</a></li>
</ul>
<div id="divNetwork" class="panes panewidth">
    <div id="divIpConfig" class="pane">
        <div>
	        <div class="mainparams"><label id="laNetCardConfig" name="laNetCardConfig"></label></div>
            <div id="dvSelectNetCard" class="displaynone">
                <span class="firstspan"><label name="laSelectNetCard"></label></span>
                <span>
		            <select id="NetworkNo" class="inputwidth" onchange="GetNetBasicInfo(this.value)">
                        <option value="1">lan</option>
                        <option value="2">wlan</option>
                    </select>
		        </span>
            </div>
	        <div id="dvNetworkType">
	            <span class="firstspan"><label id="laNetworkType" name="laNetworkType"></label></span>
		        <span>
		            <select id="NetworkType" class="selectwidth">
			            <option value="1" id="NetworkTypeOpt1" name="NetworkTypeOpt1"></option>
			            <option value="2" id="NetworkTypeOpt2" name="NetworkTypeOpt2"></option>
			            <option value="3" id="NetworkTypeOpt3" name="NetworkTypeOpt3"></option>
			            <option value="4" id="NetworkTypeOpt4" name="NetworkTypeOpt4"></option>
			            <option value="5" id="NetworkTypeOpt5" name="NetworkTypeOpt5"></option>
			            <!--<option value="6" id="NetworkTypeOpt6" name="NetworkTypeOpt6"></option>-->
		            </select>
		        </span>
	        </div>
	        <div>
	            <span class="firstspan"><label id="laDeviceIpAdd" name="laDeviceIpAdd"></label></span>
		        <span>
				    <input type="text" id="ipAddress" class="inputwidth" onblur="CheckDIPadd(this.value,'ServerIPtips','laIpAddress')" onkeydown="CheckKeyDown(event)" maxlength="16" />
				</span>
		        <span id="ServerIPtips"></span>
	        </div>
	        <div>
	            <span class="firstspan"><label id="laSubNetMask" name="laSubNetMask"></label></span>
		        <span>
				    <input type="text" id="subnetMask" class="inputwidth" onblur="CheckMaskIP(this.value,'ServerMaskIPtips','jsMaskAdd')" onkeydown="CheckKeyDown(event)" maxlength="16" />
				</span>
		        <span id="ServerMaskIPtips"></span>
	        </div>
	        <div>
	            <span class="firstspan"><label id="laDefaultGateWay" name="laDefaultGateWay"></label></span>
		        <span><input type="text" id="DefaultGateway" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="16" /></span>
		        <span id="ServerGateWayIPtips"></span>
	        </div>
	        <div>
		        <span>
				    <input class="checkbox" type="checkbox" id="IsUseDHCP" onclick="CheckIsDhcp()">&nbsp;
					<label id="laDHCP" name="laDHCP"></label>
				</span>
	        </div>
	        <div id="dvMacAddress">
	            <span class="firstspan"><label id="laMacAddress" name="laMacAddress"></label></span>
		        <span><input type="text" id="MacAddress" class="inputwidth" maxlength="16" disabled="disabled"/></span>
		        <span id="ServerMacAddresstips"></span>
	        </div>
	        <div id="9000MTU">
	            <span class="firstspan ie6bug1">MTU</span>
		        <span>
		            <input id="MTU" type="text" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'MTUtips','jsMtuParam',100,1500)" onkeydown="CheckKeyDown(event)" maxlength="4" />
		        </span>
		        <span id="MTUtips"></span>
	        </div>
	        <div id="dvMulticast" class="displaynone">
                <span class="firstspan"><label name="laMulticast"></label></span>
                <span>
		            <input type="text" id="Multicast" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="15" value="0.0.0.0" />
		        </span>
                <span id="Multicasttips"></span>
            </div>
        </div>
        <div>
	        <div class="mainparams margintop26">
	            <span><label id="laDNSServerConfig" name="laDNSServerConfig"></label></span>
	        </div>
	        <div class="subparamswhite">
	            <span class="firstspan"><label id="laPrimaryDNS" name="laPrimaryDNS"></label></span>
		        <span>
		            <input type="text" id="PrimaryDNS" class="inputwidth" onblur="javascript:if(this.value != '' ){CheckDIPadd(this.value,'DNSServerIPtips','jsFirstDNS');}else{$('#DNSServerIPtips').html(''); }" onkeydown="CheckKeyDown(event)" maxlength="16" />
		        </span>
		        <span id="DNSServerIPtips"></span>
	        </div>
	        <div class="subparamsgray" id="dvDNSServer2">
	            <span class="firstspan"><label name="laDNSServer2IP"></label></span>
		        <span>
		            <input id="DNSServer2IP" type="text" class="inputwidth" onblur="javascript:if(this.value != '' ){CheckDIPadd(this.value,'DNSServer2IPtips','jsSecondDNS');}else{$('#DNSServer2IPtips').html(''); }" onkeydown="CheckKeyDown(event)" maxlength="16" />
		        </span>
		        <span id="DNSServer2IPtips"></span>
	        </div>
        </div>	
    </div>
    <div id="divPortConfiguration" class="pane">
        <div id="divHttpPort" class="subparamswhite displaynone">
	        <span class="firstspan"><label id="laHttpPort" name="laHttpPort"></label></span>
	        <span>
			    <input id="inputHttpPort" type="text" class="inputwidth" value="80" onblur="CheackServerIDIntNum(this.value,'HttpPortTips','jsHttpPortParam',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5" />
			</span>
	        <span id="HttpPortTips"></span>
	    </div>
	    <div id="divRtspPort" class="subparamsgray displaynone">
	        <span class="firstspan"><label id="laRtspPort" name="laRtspPort"></label></span>
	        <span>
			    <input id="inputRtspPort" type="text" class="inputwidth" value="554" onblur="CheackServerIDIntNum(this.value,'RtspPortTips','jsRtspPortParam',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5" />
			</span>
	        <span id="RtspPortTips"></span>
	    </div>
	    <div id="divHttpsPort" class="subparamswhite displaynone">
	        <span class="firstspan"><label id="laHttpsPort" name="laHttpsPort"></label></span>
	        <span>
			    <input id="inputHttpsPort" type="text" class="inputwidth" value="443" onblur="CheackServerIDIntNum(this.value,'HttpsPortTips','jsHttpsPortParam',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5" />
			</span>
	        <span id="HttpsPortTips"></span>
	    </div>
        <div id="divSDKPort" class="subparamsgray displaynone">
	        <span class="firstspan"><label id="laSDKPort" name="laSDKPort"></label></span>
	        <span>
			    <input id="inputSDKPort" type="text" class="inputwidth" value="8000" onblur="CheackServerIDIntNum(this.value,'SDKPortTips','laSDKPort',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5" />
			</span>
	        <span id="SDKPortTips"></span>
	    </div>
    </div>
    <div id="divDDNS" class="pane">
        <div class="subparamswhite">
            <span>
		        <input class="checkbox" type="checkbox" id="DDNSenabled" onclick="EnableDDNS()" />
		        <label id="laUseDDNS" name="laUseDDNS"></label>
		    </span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laDDNSType" name="laDDNSType"></label></span>
		    <span>
		        <select id="provider" class="selectwidth" onchange="SelectDDNSType(this.value)">
                    <option value="IPServer">IPServer</option>
                    <option value="DynDNS">DynDNS</option>
			        <option value="PeanutHall">PeanutHull</option>
                </select>
		    </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laServerAdd" name="laServerAdd"></label></span>
		    <span>
		        <input type="text" id="serverIPAddress" class="inputwidth" onblur="CheackStringLenthNull(this.value,'ServerIPAddressStips','laServerAdd',64)" onkeydown="CheckKeyDown(event)" maxlength="64" />
		    </span>
		    <span id="ServerIPAddressStips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laDeviceDomain" name="laDeviceDomain"></label></span>
		    <span>
		        <input type="text" id="domainName" class="inputwidth" onblur="CheackStringLenthNull(this.value,'ServerNameDDNStips2','laDeviceDomain',64)" onkeydown="CheckKeyDown(event)" maxlength="64"  />
		    </span>
		    <span id="ServerNameDDNStips2"></span>
        </div>
        <div id="portNoDDNS_tr" class="subparamswhite displaynone">
            <span class="firstspan"><label name="gePort"></label></span>
		    <span>
		        <input type="text" id="portNo" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'Porttips','gePort',1,65535)" onkeydown="CheckKeyDown(event)" maxlength="5" />
		    </span>
		    <span id="Porttips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laUserName" name="geUserName"></label></span>
		    <span>
		        <input id="UserName" class="inputwidth" maxlength="32" onkeydown="CheckKeyDown(event)" onblur="CheackStringLenth(this.value,'UserNametips','geUserName',32)" onkeyup="CheckInput(event)" />
		    </span>
		    <span id="UserNametips"></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="gePassword" name="gePassword"></label></span>
		    <span>
		        <input id="Password" type="password" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="16" onfocus="oCheckPassword.focusPassword($('#Password'), $('#ConfirmPassword'))" onblur="oCheckPassword.blurPassword($('#UserName'), $('#Password'), $('#ConfirmPassword'))" />
		    </span>
		    <span id="Passwordtips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laCheckPwd" name="laCheckPwd"></label></span>
		    <span>
		        <input id="ConfirmPassword" type="password" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="16" onfocus="oCheckPassword.focusPassword($('#Password'), $('#ConfirmPassword'))" onblur="oCheckPassword.blurPassword($('#UserName'), $('#Password'), $('#ConfirmPassword'))" />
		    </span>
		    <span id="ConfirmPasswordtips"></span>
        </div>
    </div>
    <div class="pane">
        <div class="subparamswhite">
            <span>
		        <input class="checkbox" type="checkbox" id="PPPOEenabled" onclick="EnablePPPOE()" />
                <label id="laUsePPPOE" name="laUsePPPOE"></label>
		    </span>	
        </div>
	    <div class="subparamsgray">
            <span class="firstspan"><label id="laDevicePPPOEIP" name="laDevicePPPOEIP"></label></span>
            <span><input type="text" id="PPPoEIP" class="inputwidth" disabled="disabled" /></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laUserName" name="geUserName"></label></span>
            <span>
		        <input id="PPPOEUserName" class="inputwidth" maxlength="32" onkeydown="CheckKeyDown(event)" onblur="CheackStringLenth(this.value,'PPPOEUserNametips','jsPPPOEName',32)" onkeyup="CheckInput(event)" />
		    </span>
            <span id="PPPOEUserNametips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label name="gePassword"></label></span>
            <span>
		        <input id="PPPOEUserPsw" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onfocus="oCheckPassword.focusPassword($('#PPPOEUserPsw'), $('#PswConfirm'))" onblur="oCheckPassword.blurPassword($('#PPPOEUserName'), $('#PPPOEUserPsw'), $('#PswConfirm'))" />
		    </span>
            <span id="PPPOEUserPswtips"></span>
        </div>
	    <div class="subparamswhite">
            <span class="firstspan"><label id="laCheckPwd" name="laCheckPwd"></label></span>
            <span>
		        <input id="PswConfirm" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onfocus="oCheckPassword.focusPassword($('#PPPOEUserPsw'), $('#PswConfirm'))" onblur="oCheckPassword.blurPassword($('#PPPOEUserName'), $('#PPPOEUserPsw'), $('#PswConfirm'))" />
		    </span>
            <span id="PswConfirmtips"></span>
        </div>
    </div>
    <div class="pane" id="snmp">
        <div id="snmpv1v2c" class="displaynone">
            <div class="mainparams">SNMP v1/v2</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laEnableV1" name="laEnableV1"></label></span>
				<span><input class="checkbox" type="checkbox" id="enablev1" /></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laEnableV2c" name="laEnableV2c"></label></span>
				<span><input class="checkbox" type="checkbox" id="enablev2c" /></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laRwCommunity" name="laRwCommunity"></label></span>
				<span><input type="text" id="rwCommunity" maxlength="16" /></span><span id="rwCommunityTips"></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laRCommunity" name="laRCommunity"></label></span>
				<span><input type="text" id="rCommunity" maxlength="16" /></span><span id="rCommunityTips"></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laTrapIP" name="laTrapIP"></label></span>
				<span><input type="text" id="trapIP" maxlength="16" /></span><span id="trapIPTips"></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laTrapPort" name="laTrapPort"></label></span>
				<span><input type="text" id="trapPort" maxlength="5" /></span><span id="trapPortTips"></span>
			</div>
            <div class="subparamswhite" id="trapCommunityArea">
			    <span class="firstspan"><label id="laTrapCommunity" name="laTrapCommunity"></label></span>
				<span><input type="text" id="trapCommunity" maxlength="16" /></span><span id="trapCommunityTips"></span>
			</div>
        </div>
        <div id="snmpv3c" class="displaynone">
            <div class="mainparams margintop26">SNMP v3</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laEnableV3c" name="laEnableV3c"></label></span>
				<span><input class="checkbox" type="checkbox" id="enablev3c" /></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laRUserName" name="laRUserName"></label></span>
				<span><input type="text" id="rUserName" maxlength="16" /></span><span id="rUserNameTips"></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laSecurityLevel" name="laSecurityLevel"></label></span>
				<span>
				    <select id="rSecurityLevel">
					    <option value="1_1">auth, priv</option>
						<option value="1_0">auth, no priv</option>
						<option value="0_0">no auth, no priv</option>
					</select>
				</span>
				<span></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laAuthAlg" name="laAuthAlg"></label></span>
				<span>
				    <input type="radio" name="rAuthAlg" value="MD5" checked class="netradio" />
					<label>MD5</label>
					<input type="radio" name="rAuthAlg" value="SHA" class="netradio" />
					<label>SHA</label>
			    </span>
				<span></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laAuthPsd" name="laAuthPsd"></label></span>
				<span><input type="password" id="rAuthPsd" maxlength="16" /></span>
				<span id="rAuthPsdTips"></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laPrivacyAlg" name="laPrivacyAlg"></label></span>
				<span>
				    <input type="radio" name="rPrivacyAlg" value="DES" checked class="netradio" />
					<label>DES</label>
					<input type="radio" name="rPrivacyAlg" value="AES" class="netradio" /><label>AES</label>
				</span>
				<span></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laPrivacyPsd" name="laPrivacyPsd"></label></span>
				<span><input type="password" id="rPrivacyPsd" maxlength="16" /></span>
				<span id="rPrivacyPsdTips"></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laRwUserName" name="laRwUserName"></label></span>
				<span><input type="text" id="rwUserName" maxlength="16" /></span>
				<span id="rwUserNameTips"></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laSecurityLevel" name="laSecurityLevel"></label></span>
				<span>
				    <select id="rwSecurityLevel">
					    <option value="1_1">auth, priv</option>
						<option value="1_0">auth, no priv</option>
						<option value="0_0">no auth, no priv</option>
					</select>
				</span>
				<span></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label name="laAuthAlg" id="laAuthAlg"></label></span>
				<span>
				    <input type="radio" name="rwAuthAlg" value="MD5" checked class="netradio" /><label>MD5</label>
					<input type="radio" name="rwAuthAlg" value="SHA" class="netradio" /><label>SHA</label>
				</span>
				<span></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laAuthPsd" name="laAuthPsd"></label></span>
				<span><input type="password" id="rwAuthPsd" maxlength="16" /></span>
				<span id="rwAuthPsdTips"></span>
			</div>
            <div class="subparamsgray">
			    <span class="firstspan"><label id="laPrivacyAlg" name="laPrivacyAlg"></label></span>
				<span>
				    <input type="radio" name="rwPrivacyAlg" value="DES" checked class="netradio" />
					<label>DES</label>
					<input type="radio" name="rwPrivacyAlg" value="AES" class="netradio" />
					<label>AES</label>
				</span>
				<span></span>
			</div>
            <div class="subparamswhite">
			    <span class="firstspan"><label id="laPrivacyPsd" name="laPrivacyPsd"></label></span>
				<span><input type="password" id="rwPrivacyPsd" maxlength="16" /></span>
				<span id="rwPrivacyPsdTips"></span>
			</div>  
        </div>
        <div id="snmpmore">
            <div class="mainparams margintop26"><label id="laSNMPMore" name="laSNMPMore"></label></div>
            <div class="subparamswhite">
			    <span class="firstspan"><label name="laSNMPPort" id="laSNMPPort"></label></span>
				<span><input type="text" id="snmpPort" maxlength="5" /></span>
				<span id="snmpPortTips"></span>
			</div>
        </div>
    </div>

    <div class="pane">
        <div class="subparamswhite">
            <span class="firstspan">
		        <input class="checkbox" type="checkbox" id="enable8021x" />&nbsp;
		        <label id="laEnable8021x" name="laEnable8021x"></label>
		    </span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laProtocolType" name="laProtocolType"></label></span>
		    <span><select name="ProtocolType" id="ProtocolType" class="selectwidth"></select></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laEAPOLVersion" name="laEAPOLVersion"></label></span>
		    <span><select name="EAPOLVersion"  id="EAPOLVersion" class="selectwidth"></select></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laUserName" name="geUserName"></label></span>
		    <span>
		        <input id="userName" type="text" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="32" onblur="CheackStringLenth(this.value,'userNametips','geUserName',32)" onkeyup="CheckInput(event)" />
		    </span>
		    <span id="userNametips"></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="gePassword"></label></span>
		    <span>
		        <input id="password8021" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onfocus="oCheckPassword.focusPassword($('#password8021'), $('#password8021Confirm'))" onblur="oCheckPassword.blurPassword($('#userName'), $('#password8021'), $('#password8021Confirm'))" />
		    </span>
		    <span id="passwordtips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label name="laCheckPwd"></label></span>
		    <span>
		        <input id="password8021Confirm" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onfocus="oCheckPassword.focusPassword($('#password8021'), $('#password8021Confirm'))" onblur="oCheckPassword.blurPassword($('#userName'), $('#password8021'), $('#password8021Confirm'))" />
		    </span>
		    <span id="passwordConfirmtips"></span>
        </div>	  
    </div>
  
    <div class="pane">
        <div class="subparamswhite">
            <span class="firstspan"><label id="laVideoDSCP" name="laVideoDSCP"></label></span>
            <span>
		        <input id="VideoDSCP" type="text" class="inputwidth" onkeydown="CheckKeyDown(event)" onblur="CheackServerIDIntNum(this.value,'VideoDSCPtips','laVideoDSCP',0,63)" />
		    </span>
            <span id="VideoDSCPtips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laEADSCP" name="laEADSCP"></label></span>
            <span>
		        <input id="EADSCP" type="text" class="inputwidth" onkeydown="CheckKeyDown(event)" onblur="CheackServerIDIntNum(this.value,'EADSCPtips','laEADSCP',0,63)" />
		    </span>
            <span id="EADSCPtips"></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laManageDSCP" name="laManageDSCP"></label></span>
            <span>
		        <input id="ManageDSCP" type="text" class="inputwidth" onkeydown="CheckKeyDown(event)" onblur="CheackServerIDIntNum(this.value,'ManageDSCPtips','laManageDSCP',0,63)" />
		    </span>
            <span id="ManageDSCPtips"></span>
        </div>
    </div> 
    <div class="pane" id="ftp">
        <div class="subparamswhite">
            <span class="firstspan"><label name="laServerAdd"></label></span>
			<span><input name="FtpAddress" id="FtpAddress" class="inputwidth" type="text" maxlength="64" /></span>
			<span id="FtpAddresstips"></span>
        </div>
        <div class="subparamsgray">
            <span  class="firstspan"><label name="gePort"></label></span>
			<span><input name="FtpPort" id="FtpPort" type="text" class="inputwidth" maxlength="32" /></span>
			<span id="FtpPorttips"></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laFtpUserName" name="geUserName"></label></span>
			<span><input name="FtpUserName" type="text" id="FtpUserName" class="inputwidth" maxlength="32" /></span>
            <span id="spAnonyFtp"><input type="checkbox" id="chAnonyFtp" class="checkbox"/>&nbsp;<label name="laAnonymous"></label></span>
			<span id="FtpUserNametips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label name="gePassword"></label></span>
			<span>
			    <input id="FtpPassword" type="password" class="inputwidth" maxlength="16" onfocus="oCheckPassword.focusPassword($('#FtpPassword'), $('#FtpPasswordConfirm'))" onblur="oCheckPassword.blurPassword($('#FtpUserName'), $('#FtpPassword'), $('#FtpPasswordConfirm'))" />
			</span>
			<span id="FtpPasswordtips"></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="laCheckPwd"></label></span>
			<span>
			    <input id="FtpPasswordConfirm" type="password" class="inputwidth" maxlength="16" onfocus="oCheckPassword.focusPassword($('#FtpPassword'), $('#FtpPasswordConfirm'))" onblur="oCheckPassword.blurPassword($('#FtpUserName'), $('#FtpPassword'), $('#FtpPasswordConfirm'))" />
			</span>
			<span id="FtpPasswordConfirmtips"></span>
        </div>	
        <div class="subparamsgray displaynone">
            <span class="firstspan"></span>
			<span><input name="FtpPath" type="text" id="FtpPath" class="inputwidth" maxlength="32" /></span>
			<span id="FtpPathtips"></span>
        </div>
        <div class="subparamswhite displaynone">
            <span class="firstspan"></span>
			<span><input name="baseFileName" type="text" id="baseFileName" class="inputwidth" maxlength="32" /></span>
			<span id="baseFileNametips"></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laPathDepth" name="laPathDepth"></label></span>
			<span>
			    <select class="inputwidth" id="selPathDepth">
				    <option value="0" id="optPathDepth1" name="optPathDepth1"></option>
					<option value="1" id="optPathDepth2" name="optPathDepth2"></option>
					<option value="2" id="optPathDepth3" name="optPathDepth3"></option>
				</select>
			</span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laTopPath" name="laTopPath"></label></span>
			<span>
			    <select class="inputwidth" id="selTopPath">
				    <option value="devName" id="optTopPath1" name="optTopPath1"></option>
					<option value="devId" id="optTopPath2" name="optTopPath2"></option>
					<option value="devIp" id="optTopPath3" name="optTopPath3"></option>
				</select>
			</span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label id="laSubPath" name="laSubPath"></label></span>
			<span>
			    <select class="inputwidth" id="selSubPath">
				    <option value="chanName" id="optSubPath1" name="optSubPath1"></option>
					<option value="chanId" id="optSubPath2" name="optSubPath2"></option>
				</select>
			</span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laUploadType" name="laUploadType"></label></span>
			<span>
			    <input class="checkbox" type="checkbox" id="uploadPicture" />&nbsp;
				<label id="laUploadPicture" name="laUploadPicture"></label>
			</span>
	        <span id="FtpPathtips"></span>
        </div>
    </div>
	
    <div class="pane" id="dvWifi">
        <div id="dvSearchWifi">
            <div class="wifihead">
                <span class="left"><label name="laWirelessList"></label></span>
				<span class="right">
				    <input name="laSearch" class="button" type="button" onClick="getWIFIList()" id="btnSearchWiFi" />
				</span>
            </div>
            <div class="wifilisttitle">
                <span class="wifiline width54"><label name="laSerialNumber"></label></span>
				<span class="wifiline width156"><label>SSID</label></span>
				<span class="wifiline width100"><label name="laNetWorkMode"></label></span>
				<span class="wifiline width100"><label name="laSecurityMode"></label></span>
				<span class="wifiline width65"><label name="laChannel"></label></span>
				<span class="wifiline width85"><label name="laSignalStrength"></label></span>
				<span class="wifiline width75"><label name="laSpeed"></label>(Mbps)</span>
            </div>
            <div id="dvWifiList"></div>
        </div>
        <div id="dvWifiSetting">
            <div class="mainparams margintop26">
			    <label>Wi-Fi</label>
	        </div>
            <div>
			    <span class="firstspan"><label name="laSSID"></label></span>
				<span><input type="text" id="teSSID" class="inputwidth" maxlength="32" /></span>
				<span id="spSSIDTips"></span>
			</div>
            <div class="displaynone">
			    <span class="firstspan"><label name="laChannel"></label></span>
				<span><select id="wifiChannel" class="inputwidth" disabled="disabled"></select></span>
			</div>
            <div>
			    <span class="firstspan"><label name="laWirelessNetworkMode"></label></span>
				<span><input type="radio" name="networkMode" value="infrastructure" class="netradio" />Manage</span>
				<span><input type="radio" name="networkMode" value="adhoc" class="netradio" />Ad-Hoc</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laSecurityMode"></label></span>
				<span>
				    <select id="securityMode" class="inputwidth">
                        <option value="disable">not-encrypted</option>
                        <option value="WEP">WEP</option>
                        <option value="WPA-personal">WPA-personal</option>
                        <option value="WPA-enterprise">WPA-enterprise</option>
                        <option value="WPA2-personal">WPA2-personal</option>
                        <option value="WPA2-enterprise">WPA2-enterprise</option>
                    </select>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laEncryptionType"></label></span>
				<span>
				    <select id="algorithmType" class="inputwidth">
                        <option value="TKIP">TKIP</option>
                        <option value="AES">AES</option>
                        <!--<option value="TKIP/AES">TKIP/AES</option>-->
                    </select>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laAuthType"></label></span>
				<span>
				    <input type="radio" name="authenticationType" value="open" checked="checked" class="netradio" />
					<label name="laOpen"></label>
				</span>
				<span>
				    <input type="radio" name="authenticationType" value="sharedkey" class="netradio" />
					<label name="laShared"></label>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laKeyLength"></label></span>
				<span><input type="radio" name="KeyLength" value="64" checked="checked" class="netradio" />64bit</span>
				<span><input type="radio" name="KeyLength" value="128" class="netradio" />128bit</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laKeyType"></label></span>
				<span>
				    <input type="radio" name="KeyType" value="HEX" class="netradio" />
					<label name="laHex"></label>
				</span>
				<span><input type="radio" name="KeyType" value="ASC" class="netradio" />ASCII</span>
			</div>
            <div>
			    <span class="firstspan">
				    <label name="laKey"></label>&nbsp;1
					<input type="radio" name="encryptionKey" value="1" class="netradio" />
				</span>
				<span><input type="text" id="encryptionKey1" class="inputwidth" /></span>
				<span id="spEncryptKeyTips1"></span>
			</div>
            <div>
			    <span class="firstspan">
				    <label name="laKey"></label>&nbsp;2
					<input type="radio" name="encryptionKey" value="2" class="netradio" />
				</span>
				<span>
				    <input type="text" id="encryptionKey2" class="inputwidth" />
				</span>
				<span id="spEncryptKeyTips2"></span>
			</div>
            <div>
			    <span class="firstspan">
				    <label name="laKey"></label>&nbsp;3
					<input type="radio" name="encryptionKey" value="3" class="netradio" />
				</span>
				<span><input type="text" id="encryptionKey3" class="inputwidth" /></span>
				<span id="spEncryptKeyTips3"></span>
			</div>
            <div>
			    <span class="firstspan">
				    <label name="laKey"></label>&nbsp;4
					<input type="radio" name="encryptionKey" value="4" class="netradio" />
				</span>
				<span>
				    <input type="text" id="encryptionKey4" class="inputwidth" />
				</span>
				<span id="spEncryptKeyTips4"></span>
			</div>
            <div>
			    <span class="firstspan"><label name="laAuthType"></label></span>
				<span>
				    <select id="enterpriseType" class="inputwidth">
                        <option value="EAP-TLS">EAP-TLS</option>
                        <option value="EAP-PEAP">EAP-PEAP</option>
                        <option value="EAP-TTLS">EAP-TTLS</option>
                    </select>
				</span>
			</div>						
            <div>
			    <span class="firstspan"><label name="geUserName"></label></span>
				<span>
				    <input type="text" id="wifiUser" maxlength="32" class="inputwidth" onkeyup="CheckInput(event)"/>
				</span>
				<span id="wifiUserTips"></span>	
			</div>
            <div>
			    <span class="firstspan"><label name="gePassword"></label></span>
				<span>
				    <input type="password" id="wifiPassword" maxlength="32" class="inputwidth" />
				</span>
				<span id="wifiPasswordTips"></span>	
			</div>
            <div>
			    <span class="firstspan"><label name="laPEAPVersion"></label></span>
				<span>
				    <select id="PEAPVersion" class="inputwidth">
                        <option value="0">0</option>
                        <option value="1">1</option>
                    </select>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laPEAPLabel"></label></span>
				<span>
				    <select id="PEAPLabel" class="inputwidth">
                        <option value="old">old</option>
                        <option value="new">new</option>
                    </select>
				</span>
			</div>			
            <div>
			    <span class="firstspan"><label name="laInnerAuthenticationMode"></label></span>
				<span>
				    <select id="innerEAPProtocolType" class="inputwidth">
                        <option value="EAP-GTC">GTC</option>
                        <option value="EAP-MD5">MD5</option>
						<option value="MS-CHAPv2">MSCHAPv2</option>
                    </select>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laInnerAuthenticationMode"></label></span>
				<span>
				    <select id="innerAuthenticationMode" class="inputwidth">
                        <option value="PAP">PAP</option>
                        <option value="MS-CHAPv2">MSCHAPv2</option>
                    </select>
				</span>
			</div>					
            <div>
			    <span class="firstspan"><label name="laAnonymousID"></label></span>
				<span>
				    <input id="anonymousID" class="inputwidth" maxlength="32" onkeyup="CheckInput(event)" />
				</span>
				<span id="anonymousIDTips"></span>	
			</div>
            <div>
			    <span class="firstspan"><label name="laIdentify"></label></span>
				<span>
				    <input id="enterprise1Identify" maxlength="32" class="inputwidth" />
				</span>
				<span id="identifyTips"></span>				
			</div>
            <div>
			    <span class="firstspan"><label name="laPrivateKeyPassword"></label></span>
				<span>
				    <input id="privateKeyPassword" type="password" maxlength="32" class="inputwidth" />
				</span>
				<span id="identifyPasswordTips"></span>	
			</div>
            <div>
			    <span class="firstspan"><label name="laEAPOLVersion"></label></span>
				<span>
				    <select id="wifiEAPOLVersion" class="inputwidth">
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
				</span>
			</div>
            <div>
			    <span class="firstspan"><label name="laCACertificate"></label></span>
				<span>
				    <input id="certificatePath1" class="inputwidth" readonly="true" />
				</span>
				<span>
				    <input type="button" name="btnBrowse" class="button" onclick="browseFilePath('certificatePath1', 1)" />
				</span>				
				<span>
				    <input type="button" name="laUploadCertificate" class="button" onclick="uploadCertificate(0)" />
				</span>
				<span id="certificateTips1"></span>
			</div>
            <div>
			    <span class="firstspan"><label name="laUserCertificate"></label></span>
				<span>
				    <input id="certificatePath2" class="inputwidth" readonly="true" />
				</span>
				<span>
				    <input type="button" name="btnBrowse" class="button" onclick="browseFilePath('certificatePath2', 1)" />
				</span>				
				<span>
				    <input type="button" name="laUploadCertificate" class="button" onclick="uploadCertificate(1)" />
				</span>
				<span id="certificateTips2"></span>
			</div>
            <div>
			    <span class="firstspan"><label name="laPrivateKeyCertificate"></label></span>
				<span>
				    <input id="certificatePath3" class="inputwidth" readonly="true" />
				</span>
				<span>
				    <input type="button" name="btnBrowse" class="button" onclick="browseFilePath('certificatePath3', 1)" />
				</span>
				<span>
				    <input type="button" name="laUploadCertificate" class="button" onclick="uploadCertificate(2)" />
				</span>
				<span id="certificateTips3"></span>
			</div>																																														
        </div>
		<div id="wpsSetting">
		    <div class="mainparams margintop26">
			    <label>WPS</label>
	        </div>
		    <div class="subparamswhite">
			    <input type="checkbox" id="checkEnableWPS" class="checkbox" onclick="enableWPS();" />
				<label name="laEnableWPS"></label>
	        </div>
		    <div class="subparamsgray">
				<span class="firstspan"><label name="laPinCode"></label></span>
				<span>
			        <input type="text" id="devicePinCode" class="inputwidth" readonly="true" />
				    <input type="button" id="pinCodeGenerate" name="pinCodeGenerate" class="button" onclick="generagePINCode();" />
				</span>
	        </div>
		    <div class="subparamswhite">
			    <span class="firstspan">
					<input type="radio" id="radioAutoConnect" class="radio" checked="checked" onclick="chooseConnectMode(0);" />
					<label name="autoConnect"></label>				
				</span>
				<span>
				    <input type="button" id="btnAutoConnect" name="laConnect" class="button" onclick="pbcConnect();" />
				</span>
				<span id="pbcConnectTips"></span>
	        </div>			
		    <div class="subparamswhite">
			    <span class="firstspan">
					<input type="radio" id="radioManuConnect" class="radio" onclick="chooseConnectMode(1);" />
					<label name="manuConnect"></label>		
				</span>
				<span>
				   <input type="button" id="btnManuConnect" name="laConnect" class="button" onclick="manuConnect();" /> 
				</span>
                <span id="doManuConnectTips"></span>
	        </div>	
		    <div class="subparamsgray">
			    <span class="firstspan"><label name="laSSID"></label></span>
				<span>
				    <input type="text" id="txtWPSSSID" class="inputwidth" maxlength="32" />
				</span>
				<span id="spWPSSSIDTips"></span>
	        </div>								
		    <div class="subparamswhite">
			    <span class="firstspan"><label name="laApPinCode"></label></span>
				<span>
				    <input type="text" id="txtApPinCode" class="inputwidth" maxlength="8" onkeyup="CheckInput(event)" />
				</span>
				<span id="manuConnectTips"></span>
	        </div>
			<div id="main_plugin" name="main_plugin" class="plugin0"></div>						
		</div>
    </div>
    <div id="dvUPNP" class="pane">
        <div class="subparamswhite">
          <span class="firstspan"><input type="checkbox" id="chEnableUPnP" class="checkbox"/>&nbsp;<label id="laEnableUPnP" name="laEnableUPnP"></label></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label name="laFriendlyName"></label></span>
            <span>
                <input type="text" id="txtUPnPName" class="inputwidth" maxlength="64" onblur="!CheackStringLenth(this.value, 'spUPnPNameTips', 'laUPnPName', 64)" />
            </span>
            <span id="spUPnPNameTips"></span>
        </div>
        <div class="mainparams margintop26">
            <span><label name="laPortsMap"></label></span>
        </div>
        <div class="subparamswhite">
          <span class="firstspan"><input type="checkbox" class="checkbox" id="chEnablePortMap"/>&nbsp;<label name="laEnablePortMap"></label></span>
        </div>
        <div class="subparamsgray">
            <span class="firstspan"><label name="laUPnPMapType"></label></span>
            <span>
                <select id="selUPnPMapType" class="inputwidth">
                    <option value="auto" name="aModeAuto"></option>
                    <option value="manual" name="aModeManual"></option>
                </select>
            </span>
        </div>
        <div class="listHead" style="margin-top:10px;"><span class="upnpfirst"></span><span class="upnpsecond"><label name="laProtocolName"></label></span><span class="upnpthird"><label name="laExternalPort"></label></span><span class="upnpfouth"><label name="laState"></label></span></div>
        <div id="divPortsMapList">
        	<div><span class="upnpfirst"><input type="checkbox" class="checkbox" id="chHTTPPortMap" disabled/></span><span class="upnpsecond">HTTP</span><span class="upnpthird"></span><span class="upnpfouth"></span></div>
            <div><span class="upnpfirst"><input type="checkbox" class="checkbox" id="chRTSPPortMap" disabled/></span><span class="upnpsecond">RTSP</span><span class="upnpthird"></span><span class="upnpfouth"></span></div>
            <div><span class="upnpfirst"><input type="checkbox" class="checkbox" id="chSDKPortMap" disabled/></span><span class="upnpsecond">SDK</span><span class="upnpthird"></span><span class="upnpfouth"></span></div>
        </div>
  	</div>
</div>