<div class="mainparams">
	<span><label id="laSender" name="laSender"></label></span>
</div>
<div class="subparamswhite margintop10">
	<span class="firstspan"><label id="laSenderName" name="laSenderName"></label></span>
	<span> 
	    <input name="SenderName"  id="SenderName" type="text" class="inputwidth" value="" maxlength="32"  onblur="CheackStringLenth(this.value,'SenderNametips','laSenderName',32)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="SenderNametips"></span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label id="laSenderAddress" name="laSenderAddress"></label></span>
	<span> 
	    <input name="SenderAddress"  id="SenderAddress" type="text" class="inputwidth" value="" maxlength="48" onblur="CheackStringLenth(this.value,'SenderAddresstips','laSenderAddress',48)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="SenderAddresstips"></span>
</div>
<div class="subparamswhite">
	<span class="firstspan"><label name="laSMTPServer"></label></span>
	<span> 
	    <input type="text" name="SMTPServerAddress" id="SMTPServerAddress" class="inputwidth" onBlur="CheackStringLenth(this.value,'SMTPServerAddressStips','laServerAdd',32)" onkeydown="CheckKeyDown(event)" onkeyup="CheckInput(event)" maxlength="32" />
	</span>
	<span id="SMTPServerAddressStips"></span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label name="laSMTPPort"></label></span>
	<span> 
	    <input name="SMTPPort"  id="SMTPPort" type="text" class="inputwidth" value="" maxlength="5" onblur="CheackServerIDIntNum(this.value,'SMTPPorttips','laSMTPPort',1,65535)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="SMTPPorttips"></span>
</div>
<div class="subparamswhite">
	<span><input type="checkbox" class="checkbox" name="SSL" id="SSL" width="80px"/>&nbsp;
	<label id="laUseSSL" name="laUseSSL"></label></span>
</div>	
<div class="subparamsgray">
	<span class="firstspan"><label id="laMailInterval" name="laMailInterval"></label></span>
	<span> 
	    <select name="MailInterval"  id="MailInterval" class="selectwidth">
		    <option value="2" id="MailIntervalOpt1" name="MailIntervalOpt1"></option>
		    <option value="3" id="MailIntervalOpt2" name="MailIntervalOpt2"></option>
		    <option value="4" id="MailIntervalOpt3" name="MailIntervalOpt3"></option>
		    <option value="5" id="MailIntervalOpt4" name="MailIntervalOpt4"></option>
		</select>
	</span>
	<span>
	    <input type="checkbox" name="Attachment" id="Attachment" class="checkbox" onclick="EnableAttachment()"/>&nbsp;
		<label id="laAttachment" name="laAttachment"></label>
	</span>
</div>
<div class="subparamswhite">
	<span> 
	    <input type="checkbox" name="authenticationMode" id="authenticationMode" class="checkbox" onclick="EnableAuthen()"/>&nbsp;
		<label id="laServerAuthentication" name="laServerAuthentication"></label>
	</span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label id="laUserName" name="geUserName"></label></span>
	<span> 
	    <input id="UserName" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="32" onblur="CheackStringLenthNull(this.value,'UserNametips','geUserName',32)" onkeyup="CheckInput(event)"/>
	</span>
	<span id="UserNametips"></span>
</div>
<div class="subparamswhite">
	<span class="firstspan"><label id="gePassword" name="gePassword"></label></span>
	<span> 
	    <input id="Password" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)" onfocus="oCheckPassword.focusPassword($('#Password'), $('#PwdConfirm'))" onblur="oCheckPassword.blurPassword($('#UserName'), $('#Password'), $('#PwdConfirm'))"/>
	</span>
	<span id="Passwordtips"></span>
</div>
<div class="subparamsgray">
	<span class="firstspan"><label id="laCheckPwd" name="laCheckPwd"></label></span>
	<span> 
	    <input id="PwdConfirm" type="password" class="inputwidth" maxlength="16" onkeydown="CheckKeyDown(event)"onfocus="oCheckPassword.focusPassword($('#Password'), $('#PwdConfirm'))" onblur="oCheckPassword.blurPassword($('#UserName'), $('#Password'), $('#PwdConfirm'))"/>
	</span>
	<span id="PwdConfirmtips"></span>
</div>
<div class="mainparams margintop26">
	<span><label id="laReceiver" name="laReceiver"></label></span>
</div>										
<div class="subparamswhite margintop10">
	<span class="firstspan"><label name="laReceiverName1"></label></span>
	<span> 
	    <input id="ReceiverName1" type="text" class="inputwidth" maxlength="32"  onblur="CheackStringLenth(this.value,'ReceiverNametips1','laReceiverName',32)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="ReceiverNametips1"></span>
</div>	
<div class="subparamsgray">
	<span class="firstspan"><label name="laReceiverAddress1"></label></span>
	<span> 
	    <input id="ReceiverAddress1" type="text" class="inputwidth" maxlength="48"  onblur="CheackStringLenth(this.value,'ReceiverAddresstips1','laReceiverAddress',48)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="ReceiverAddresstips1"></span>
</div>
<div class="subparamswhite">
	<span class="firstspan"><label name="laReceiverName2"></label></span>
	<span> 
	    <input id="ReceiverName2" type="text" class="inputwidth" maxlength="32" onblur="CheackStringLenth(this.value,'ReceiverNametips2','laReceiverName',32);" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="ReceiverNametips2"></span>
</div>	
<div class="subparamsgray">
	<span class="firstspan"><label name="laReceiverAddress2"></label></span>
	<span> 
	    <input id="ReceiverAddress2" type="text" class="inputwidth" maxlength="48"  onblur="CheackStringLenth(this.value,'ReceiverAddresstips2','laReceiverAddress',48)" onkeydown="CheckKeyDown(event)"/>
	</span>
	<span id="ReceiverAddresstips2"></span>
</div>	