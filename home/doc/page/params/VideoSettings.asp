<ul id="tabVideoSettings" class="tabs">
	<li><a id="aBaseVideoSettings" name="aBaseVideoSettings" href="javascript: ia(BaseVideoSettings).update();">&nbsp;</a></li>
	<li><a id="aOSDSettings" name="aOSDSettings" href="javascript: ia(OSDSettings).update();">&nbsp;</a></li>
	<li><a id="aTextOverlay" name="aTextOverlay" href="javascript: ia(TextOverlay).update();">&nbsp;</a></li>
	<li><a id="aVideoMask" name="aVideoMask" href="javascript: ia(VideoMask).update();">&nbsp;</a></li>
    <li><a id="aPictureOverlay" name="aPictureOverlay" href="javascript: ia(PictureOverlay).update();">&nbsp;</a></li>
</ul>
<!-- panes -->
<div class="panes panewidth" id="divImage">
	<div id="imageLeft" class="imageleft">
		<div id="main_plugin" class="paramplugin marginleft10"/>
	</div>
	<div id="imageRight" class="imageright">
		<div id="taBaseVideoSettings" class="pane">
			<div id="VideoBright_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laBrightness"></label></span>
				<span class="imagesecondspan"><div id="VideoBright" class="slider"/></span>
			</div>
			<div id="VideoContrast_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laContrast" name="laContrast"></label></span>
				<span class="imagesecondspan"><div id="VideoContrast" class="slider"/></span>
			</div>
			<div id="VideoSaturation_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laSaturation" name="laSaturation"></label></span>
				<span class="imagesecondspan"><div id="VideoSaturation" class="slider"/></span>
			</div>
			<div id="VideoHue_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laHue" name="laHue"></label></span>
				<span class="imagesecondspan"><div id="VideoHue" class="slider"/></span>
			</div>
			<div id="VideoGain_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laGain" name="laGain"></label></span>
				<span class="imagesecondspan"><div id="VideoGain" class="slider"/></span>
			</div>
			<div id="dvSharpnessMode" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laSharpnessMode"></label></span>
				<span class="imagesecondspan"><select id="selSharpnessMode" class="imgselectwidth"></select></span>
			</div>
			<div id="Sharpness_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laSharpness" name="laSharpness"></label></span>
				<span class="imagesecondspan"><div id="Sharpness" class="slider"/></span>
			</div>
			<div id="FocusMode_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laFocusMode" name="laFocusMode"></label></span>
				<span class="imagesecondspan"><select id="FocusMode" class="imgselectwidth" onchange="SetFocus()"/></span>
			</div>
			<div id="FocusLimited_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laFocusLimited"></label></span>
				<span class="imagesecondspan"><select id="FocusLimited" class="imgselectwidth" onchange="SetFocus()"/></span>
			</div>
			<div id="IrisMode_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laIrisMode" name="laIrisMode"></label></span>
				<span class="imagesecondspan"><select id="IrisMode" class="imgselectwidth" onchange="SetExposure()"/></span>
			</div>
            <div id="dvOverExposeSuppress" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laOverExposeSuppress"></label></span>
				<span class="imagesecondspan"><select id="seOverExposeSuppress" class="imgselectwidth noempty" onchange="SetOverExposeSuppress()"><option value="true" name="laEnable"></option><option value="false" name="trDisabled"></option></select></span>
			</div>
			<div id="AutoIrisLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laAutoIrisLevel" name="laAutoIrisLevel"></label></span>
				<span class="imagesecondspan"><div id="AutoIrisLevel" class="slider"/></span>
			</div>
			<div id="IrisLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laIrisLevel" name="laIrisLevel"></label></span>
				<span class="imagesecondspan"><select id="IrisLevel" class="imgselectwidth" onchange="SetIrisLevel()"/></span>
			</div>
            <div id="Shutter_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laShutter" name="laShutter"></label></span>
				<span class="imagesecondspan"><select id="Shutter" class="imgselectwidth" onchange="SetShutter()"/></span>
			</div>
			<div id="powerLine_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laPowerLine" name="laPowerLine"></label></span>
				<span class="imagesecondspan"><select id="PowerLineFrequencyMode" class="imgselectwidth" onchange="SetPowerLineFrequencyMode()"/></span>
			</div>
			<div id="DayNightFilterType_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laDayNightFilter" name="laDayNightFilter"></label></span>
				<span class="imagesecondspan"><select id="DayNightFilterType" class="imgselectwidth" onchange="SetIrcutFilter()"/></span>
			</div>
            <div id="dvFilterStartTime" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laStartTime"></label></span>
				<span class="imagesecondspan"><input type="text" id="inFilterStartTime" class="videoinputwidth" value="07:00:00" onclick="CreateTimePicker(event, SetIrcutFilter)"/></span>
			</div>
			<div id="dvFilterEndTime" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laEndTime"></label></span>
				<span class="imagesecondspan"><input type="text" id="inFilterEndTime" class="videoinputwidth" value="18:00:00" onclick="CreateTimePicker(event, SetIrcutFilter)"/></span>
			</div>
            <div id="dvDayOrNight" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laTriggerMode"></label></span>
				<span class="imagesecondspan"><select id="selIrcutFilterAction" onchange="SetIrcutFilter()" class="imgselectwidth noempty"><option value="day" name="IrcutFilterTypeDay"></option><option value="night" name="IrcutFilterTypeNight"></option></select></span>
			</div>
			<div id="DayToNightFilterLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laDayToNight" name="laDayToNight"></label></span>
				<span class="imagesecondspan"><select id="DayToNightFilterLevel" class="imgselectwidth" onchange="SetIrcutFilter()"/></span>
			</div>
			<div id="DayNightFilterTime_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laFilterTime" name="laFilterTime"></label></span>
				<span class="imagesecondspan"><div id="DayNightFilterTime" class="slider"/></span>
			</div>
			<div id="ImageFlipStyle_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laImageFlip" name="laImageFlip"></label></span>
				<span class="imagesecondspan"><select id="ImageFlipStyle" class="imgselectwidth" onchange="SetImageFlip()"/></span>
			</div>
			<div id="DSS_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laDSS" name="laDSS"></label></span>
				<span class="imagesecondspan"><input type="checkbox" id="DSSEnabled" onclick="SetDSS()"/></span>
			</div>
			<div id="DSSLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laDSSLevel" name="laDSSLevel"></label></span>
				<span class="imagesecondspan"><select id="DSSLevel" class="imgselectwidth" onchange="SetDSS()" disabled="disabled"/></span>
			</div>
			<div id="WDR_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWDR" name="laWDR"></label></span>
				<span class="imagesecondspan">
					<select id="WDREnabled" class="imgselectwidth" onchange="EnableWDR()"/>
				</span>
			</div>
			<div id="WDRLevel_tr1" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWDRLevel1" name="laWDRLevel1"></label></span>
				<span class="imagesecondspan"><div id="WDRLevel1" class="slider"/></span>
			</div>
			<div id="WDRLevel_tr2" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWDRLevel2" name="laWDRLevel2"></label></span>
				<span class="imagesecondspan"><div id="WDRLevel2" class="slider"/></span>
			</div>
			<div id="WDRContrastLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWDRContrast" name="laWDRContrast"></label></span>
				<span class="imagesecondspan"><div id="WDRContrastLevel" class="slider"/></span>
			</div>
			<div id="LensInit_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laLensInit" name="laLensInit"></label></span>
				<span class="imagesecondspan"><input type="checkbox" id="LensInitEnabled" onclick="EnableLensInit()"/></span>
			</div>
			<div id="BLCMode_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laBLCMode" name="laBLCMode"></label></span>
				<span class="imagesecondspan"><select id="BLCMode" class="imgselectwidth" onchange="SetBLC()"/><input type="button" name="SetPreset" onclick="setBLCRegion()" id="btnSetBLCRegion"/></span>
			</div>
			<div id="BLCLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laBLCLevel" name="laBLCLevel"></label></span>
				<span class="imagesecondspan"><div id="BLCLevel" class="slider"/></span>
			</div>
			<div id="WhiteBlanceStyle_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWhiteBlance" name="laWhiteBlance"></label></span>
				<span class="imagesecondspan"><select id="WhiteBlanceStyle" class="imgselectwidth" onchange="ChangeWhiteBlance()"/></span>
			</div>
			<div id="WhiteBlanceRed_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWhiteBlanceRed" name="laWhiteBlanceRed"></label></span>
				<span class="imagesecondspan"><div id="WhiteBlanceRed" class="slider"/></span>
			</div>
			<div id="WhiteBlanceBlue_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laWhiteBlanceBlue" name="laWhiteBlanceBlue"></label></span>
				<span class="imagesecondspan"><div id="WhiteBlanceBlue" class="slider"/></span>
			</div>
			<div id="NosiseReduceExt_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laNosiseReduce" name="laNosiseReduce"></label></span>
				<span class="imagesecondspan"><select id="NosiseReduceExtMode" class="imgselectwidth" onchange="ChangeNosiseReduceExtMode()"/></span>
			</div>
			<div id="GeneralLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laGeneralLevel" name="laGeneralLevel"></label></span>
				<span class="imagesecondspan"><div id="GeneralLevel" class="slider"/></span>
			</div>
			<div id="InterFrameNoiseReduceLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laInterFrameNoiseReduce" name="laInterFrameNoiseReduce"></label></span>
				<span class="imagesecondspan"><div id="InterFrameNoiseReduceLevel" class="slider"/></span>
			</div>
			<div id="FrameNoiseReduceLevel_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laFrameNoiseReduce" name="laFrameNoiseReduce"></label></span>
				<span class="imagesecondspan"><div id="FrameNoiseReduceLevel" class="slider"/></span>
			</div>
			<div id="EPTZ_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laEPTZ" name="laEPTZ"></label></span>
				<span class="imagesecondspan"><select id="selEPTZEnable" class="imgselectwidth" onchange="SetEPTZEnable()"/></span>
			</div>
			<div id="Scene_tr" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laScene" name="laScene"></label></span>
				<span class="imagesecondspan"><select id="selScene" class="imgselectwidth" onchange="SetScene()"/></span>
			</div>
			<div id="dvEnableDehaze" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laEnableDehaze"></label></span>
				<span class="imagesecondspan"><input type="checkbox" id="chEnableDehaze" onclick="SetDehaze()"/></span>
			</div>
			<div id="dvDehazeLevel" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laDehazeLevel"></label></span>
				<span class="imagesecondspan"><div id="dvDehazeLevelSlider" class="slider"/></span>
			</div>
			<div id="dvZoomLimit" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laZoomLimit"></label></span>
                <span class="imagesecondspan"><select id="selZoomLimit" class="imgselectwidth" onchange="setZoomLimit()"></select></span>
			</div>
			<div id="dvEIS" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laEIS"></label></span>
                <span class="imagesecondspan"><input type="checkbox" id="inEnableEIS" onclick="setEISLevel()"/></span>
			</div>
			<div id="dvEISLevel" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laEISLevel"></label></span>
                <span class="imagesecondspan"><div id="dvEISLevelSlider" class="slider"/></span>
			</div>
			<div id="dvChromaSuppress" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laChromaSuppress"></label></span>
                <span class="imagesecondspan"><div id="dvCSLevelSlider" class="slider"/></span>
			</div>
            <div id="dvHLC" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laHLC"></label></span>
                <span class="imagesecondspan"><select id="selEnableHLC" class="imgselectwidth noempty" onchange="setHLCLevel()"><option value="true" name="laEnable"></option><option value="false" name="trDisabled"></option></select></span>
			</div>
			<div id="dvHLCLevel" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laHLCLevel"></label></span>
                <span class="imagesecondspan"><div id="dvHLCLevelSlider" class="slider"/></span>
			</div>
			<div id="dvExpComp" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laExpComp"></label></span>
                <span class="imagesecondspan"><div id="dvExpCompLevelSlider" class="slider"/></span>
			</div>
			<div id="dvGamaCorrect" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laGamaCorrect"></label></span>
                <span class="imagesecondspan"><div id="dvGamaCorrectLevelSlider" class="slider"/></span>
			</div>
			<div id="dvIRLight" class="displaynone">
				<div class="imgsubparamswhite">
				    <span class="imagefirstspan"><label name="laIRLightMode"></label></span>
					<span class="imagesecondspan">
					    <select id="selIRLightMode" class="imgselectwidth" onchange="setIR()"/>
					</span>
				</div>
				<div id="dvIRLightBright" class="imgsubparamswhite">
				    <span class="imagefirstspan"><label name="laIRLightBright"></label></span>
					<span class="imagesecondspan"><div id="dvIRLightBrightSlider" class="slider"/></span>
				</div>
				<div id="dvIRLightSen" class="imgsubparamswhite">
				    <span class="imagefirstspan"><label name="laIRLightSen"></label></span>
					<span class="imagesecondspan"><div id="dvIRLightSenSlider" class="slider"/></span>
				</div>
			</div>
            <div id="dvEnhancement" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laEnhancement"></label></span>
                <span class="imagesecondspan"><select id="selEnableEnHancement" onchange="SetEnhancement()" class="imgselectwidth noempty"><option value="true" name="laEnable"></option><option value="false" name="trDisabled"></option></select></span>
			</div>
            <div id="dvGrayScale" class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label name="laGrayScale"></label></span>
                <span class="imagesecondspan"><select id="selGrayScale" class="imgselectwidth noempty" onchange="setGrayScale()"><option value="outdoor">[0-255]</option><option value="indoor">[16-235]</option></select></span>
			</div>
		</div>
		
		<div id="taOSDSettings" class="pane">
			<div class="imgsubparamswhite">
				<span>
                    <input name="ChannelNameXPos" id="ChannelNameXPos" type="text" maxlength="3" class="displaynone" />
                    <input name="ChannelNameYPos" id="ChannelNameYPos" type="text" maxlength="3" class="displaynone" />
					<input id="IsShowChanNme" type="checkbox" onclick="EnabledChanNme()"/>&nbsp;
					<label id="laIsShowChanNme" name="laIsShowChanNme"></label>
                </span>
			</div>
			<div class="imgsubparamswhite">
				<span>
                    <input name="OSDXPos"  id="OSDXPos" type="text" maxlength="3" class="displaynone" />
                    <input name="OSDYPos"  id="OSDYPos" type="text" maxlength="3" class="displaynone" />
					<input id="IsShowOSD" type="checkbox" onclick="EnableDate()"/>&nbsp;
					<label id="laIsShowOSD" name="laIsShowOSD"></label>
                </span>
			</div>
			<div class="imgsubparamswhite">
				<span>
				    <input id="IsShowWeek" type="checkbox" onclick="EnabledWeek()"/>&nbsp;
				    <label id="laIsShowWeek" name="laIsShowWeek"></label>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span class="imagefirstspan"><label name="laChannelName" id="laChannelName"></label></span>
				<span>
					<input id="ChannelName" class="videoinputwidth" type="text" maxlength="32" onBlur="CheckDeviceName(this.value,'ChannelNametips',1)"/>
				</span>
			</div>			
			<div class="imgsubparamswhite">
				<span class="imagefirstspan"><label id="laHourOSDType" name="laHourOSDType"></label></span>
				<span><select id="HourOSDType" class="imgselectwidth" onchange="SetHourOSDType()">
						<option value="12hour" id="HourOSDTypeOpt1" name="HourOSDTypeOpt1"></option>
						<option value="24hour" id="HourOSDTypeOpt2" name="HourOSDTypeOpt2"></option>
					</select>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span class="imagefirstspan"><label id="laOSDType" name="laOSDType"></label></span>
				<span>
				  <select id="OSDType" class="imgselectwidth" onchange="SetOSDType()">
						<option value="0" id="OSDTypeOpt1" name="OSDTypeOpt1"></option>
						<option value="1" id="OSDTypeOpt2" name="OSDTypeOpt2"></option>
						<option value="2" id="OSDTypeOpt3" name="OSDTypeOpt3"></option>
						<option value="3" id="OSDTypeOpt4" name="OSDTypeOpt4"></option>
						<option value="4" id="OSDTypeOpt5" name="OSDTypeOpt5"></option>
						<option value="5" id="OSDTypeOpt6" name="OSDTypeOpt6"></option>
				  </select>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span class="imagefirstspan"><label id="laOSDAttrib" name="laOSDAttrib"></label></span>
				<span><select id="OSDAttrib" class="imgselectwidth">
						<option value="1" id="OSDAttribOpt1" name="OSDAttribOpt1"></option>
						<option value="2" id="OSDAttribOpt2" name="OSDAttribOpt2"></option>
						<option value="3" id="OSDAttribOpt3" name="OSDAttribOpt3"></option>
						<option value="4" id="OSDAttribOpt4" name="OSDAttribOpt4"></option>
					</select></span>
			</div>
			<div id='OSDFontSize_tr' class="imgsubparamswhite displaynone">
				<span class="imagefirstspan"><label id="laOSDFontSize" name="laOSDFontSize"></label></span>
				<span>
				  <select id="OSDFontSize" class="imgselectwidth" onchange="CreateOSDDateInfo()">
						<option value="0" id="OSDFontSizeOpt1" name="OSDFontSizeOpt1"></option>
						<option value="1" id="OSDFontSizeOpt2" name="aOSDFontSizeOpt2"></option>
						<option value="2" id="OSDFontSizeOpt3" name="OSDFontSizeOpt3"></option>
			      </select>
				</span>
			</div>
		</div>
		
		<div id="taTextOverlay" class="pane">
			<div class="imgsubparamswhite">
				<span>
					<input id="IsShowString1" class="checkbox" type="checkbox" onclick="CheckOverlayInfo()"/>&nbsp;<label>1</label>
					&nbsp;&nbsp;&nbsp;
					<input id="String1" class="videoinputwidth" type="text" maxlength="44" onblur="CheckOverlayInfo()"/>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span>
					<input id="IsShowString2" class="checkbox" type="checkbox" onclick="CheckOverlayInfo()"/>&nbsp;<label>2</label>
					&nbsp;&nbsp;&nbsp;
					<input id="String2" class="videoinputwidth" type="text" maxlength="44" onblur="CheckOverlayInfo()"/>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span>
					<input id="IsShowString3" class="checkbox" type="checkbox" onclick="CheckOverlayInfo()"/>&nbsp;<label>3</label>
					&nbsp;&nbsp;&nbsp;
					<input id="String3" class="videoinputwidth" type="text" maxlength="44" onblur="CheckOverlayInfo()"/>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span>
					<input id="IsShowString4" class="checkbox" type="checkbox" onclick="CheckOverlayInfo()"/>&nbsp;<label>4</label>
					&nbsp;&nbsp;&nbsp;
					<input id="String4" class="videoinputwidth" type="text" maxlength="44" onblur="CheckOverlayInfo()"/>
				</span>
			</div>
            <div class="imgsubparamswhite">
				<span id="ThisCharTips"></span>
			</div>
		</div>
		
		<div id="taVideoMask" class="pane">
			<div class="imgsubparamswhite">
				<span>
					<input name="IsUseCover" type="checkbox" id="IsUseCover" class="verticalmiddle"/>
					<label id="laUseCover" name="laUseCover"></label>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span>
					<input id="CoverStartMapbutton" name="CoverStartMapbutton" class="button" type="button" onclick="StartHuaCover()"/>
				</span>
			</div>
			<div class="imgsubparamswhite">
				<span>
					<input id="CoverTimebutton" name="CoverTimebutton" class="button" type="button" onclick="ClearMapCover('Cover')"/>
				</span>
			</div>
		</div>
        <!--Overlay-->
        <div id="divPictureOverlay" class="pane">
        	<div class="mainparams">
				<span><label name="laPicUpload"></label></span>
			</div>
            <div class="imgsubparamswhite">
                <span>
                    <input id="txtPictureFliePath" type="text" readonly="readonly"  class="videoinputwidth"/><input name="btnBrowse" type="button" class="imgbutton" onclick="browseFilePath('txtPictureFliePath', 1, 'bmp')" /><input name="laUploadCertificate" type="button" class="imgbutton" onclick="ia(PictureOverlay).uploadPic()" />
                </span>	
            </div>
            <div class="mainparams margintop26">
				<span><label name="laOverlaySetting"></label></span>
			</div>
            <div class="imgsubparamswhite">
                <span>
					<input type="checkbox" id="chEnablePicOverlay" class="verticalmiddle checkbox"/>&nbsp;
					<label name="laEnablePicOverlay"></label>
				</span>
            </div>
            <div id="" class="imgsubparamswhite">
                <span class="imagefirstspan"><label name="laXpos"></label></span>
                <span class="imagesecondspan"><input id="txtPicXPos" type="text" class="videoinputwidth" maxlength="3" disabled/></span>
            </div>
            <div id="" class="imgsubparamswhite">
                <span class="imagefirstspan"><label name="laYpos"></label></span>
                <span class="imagesecondspan"><input id="txtPicYPos" type="text" class="videoinputwidth" maxlength="3" disabled/></span>
            </div>
            <div id="" class="imgsubparamswhite">
                <span class="imagefirstspan"><label name="laPicWidth"></label></span>
                <span class="imagesecondspan"><input id="txtPicWidth" type="text" class="videoinputwidth" maxlength="3" disabled/></span>
            </div>
            <div id="" class="imgsubparamswhite">
                <span class="imagefirstspan"><label name="laPicHeight"></label></span>
                <span class="imagesecondspan"><input id="txtPicHeight" type="text" class="videoinputwidth" maxlength="3" disabled/></span>
            </div>
        </div>
    </div>		
    <div class="clear"></div>
</div><!--<div class="panes">--> 
