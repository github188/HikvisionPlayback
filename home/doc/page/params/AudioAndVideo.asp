<ul id="tabAudioAndVideo" class="tabs">
    <li><a id="aVideo" name="aVideo" href="javascript:ia(Video).update();"></a></li>
	<li><a id="aAudio" name="aAudio" href="javascript:ia(Audio).update();"></a></li>	
</ul>
<div class="panes panewidth" id="divAudioAndVideo">
    <div id="divVideo" class="pane">
	    <div id='InputResolution_tr' class="subparamswhite displaynone">
            <span class="firstspan"><label id="laInputResolution" name="laInputResolution"></label></span>
            <span><input id="InputResolution" type="text" class="inputwidth" disabled="disabled" /></span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="laStreamType"></label></span>
            <span>
		        <select id="StreamTypeIn" class="selectwidth" onchange="jump_VideoStream(this.value)">
                    <option value="01" name="StreamTypeInOpt1"></option>
                    <option value="02" name="StreamTypeInOpt2"></option>
                </select>
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="trVideoType"></label></span>
            <span>
		        <select id="StreamType" class="selectwidth">
                    <option value="0" id="StreamTypeOpt1" name="StreamTypeOpt1"></option>
                    <option value="1" id="StreamTypeOpt2" name="StreamTypeOpt2"></option>
                </select>
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label name="laVideoResolution"></label></span>
            <span>
		        <select id="videoResolution" class="selectwidth">
			        <option value="0" >DCIF</option>
			        <option value="1" >CIF</option>
			        <option value="2" >QCIF</option>
			        <option value="3" >4CIF</option>
			        <option value="4" >2CIF</option>
			        <option value="16" >640*480</option>
			        <option value="17" >1600*1200</option>
			        <option value="18" >800*600</option>
			        <option value="19" >1280*720</option>
			        <option value="20" >1600*900</option>
			        <option value="21" >1280*960</option>
                </select>
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laVideoQualityControlType" name="laVideoQualityControlType"></label></span>
            <span>
		        <select id="videoQualityControlType" class="selectwidth" onchange="ChangeBirateType()">
                    <option value="vbr" id="videoQualityControlTypeOpt1" name="videoQualityControlTypeOpt1"></option>
                    <option value="cbr" id="videoQualityControlTypeOpt2" name="videoQualityControlTypeOpt2"></option>
                </select>
            </span>
        </div>
	    <div class="subparamswhite">
            <span class="firstspan"><label id="lafixedQuality" name="lafixedQuality"></label></span>
            <span>
		        <select id="fixedQuality" class="selectwidth">
			        <option value="90" id="fixedQualityOpt1" name="fixedQualityOpt1"></option>
			        <option value="75" id="fixedQualityOpt2" name="fixedQualityOpt2"></option>
			        <option value="60" id="fixedQualityOpt3" name="fixedQualityOpt3"></option>
			        <option value="45" id="fixedQualityOpt4" name="fixedQualityOpt4"></option>
			        <option value="30" id="fixedQualityOpt5" name="fixedQualityOpt5"></option>
			        <option value="20" id="fixedQualityOpt6" name="fixedQualityOpt6"></option>
                </select>
            </span>
        </div>
        <div class="subparamswhite">
            <span class="firstspan"><label id="laVideoFrameRate" name="laVideoFrameRate"></label></span>
            <span>
		        <select id="maxFrameRate" class="selectwidth">
			        <option value="0" id="maxFrameRateOpt1" name="maxFrameRateOpt1"></option>
					<option value="1" >1/16</option>
					<option value="2" >1/8</option>
					<option value="3" >1/4</option>
					<option value="4" >1/2</option>
					<option value="5" >1</option>
					<option value="6" >2</option>
					<option value="7" >4</option>
					<option value="8" >6</option>
					<option value="9" >8</option>
					<option value="10" >10</option>
					<option value="11" >12</option>
					<option value="12" >16</option>
					<option value="13" >20</option>
					<option value="14" >15</option>
					<option value="15" >18</option>
					<option value="16" >22</option>
                </select>
            </span>
        </div>   
        <div class="subparamswhite">
            <span class="firstspan"><label id="laconstantBitRate" name="laconstantBitRate"></label></span>
            <span>
                <input id="constantBitRate" type="text" class="inputwidth" onkeydown="CheckKeyDown(event)" maxlength="5" />&nbsp;Kbps
		    </span>
            <span id="MaxBitRatetips"></span>
        </div>
	    <div class="subparamswhite">
            <span class="firstspan"><label name="laVideoCodeType"></label></span>
            <span>
		        <select id="videoCodecType" class="selectwidth" onchange="ia(Video).changeVideoCodeType();">
			        <option value="H.264" >H.264</option>
                </select>
            </span>
        </div>
        <div id="CodecComplexity_tr" class="subparamswhite displaynone">
            <span class="firstspan"><label name="laCodecComplexity"></label></span>
            <span>
		        <select id="selectCodecComplexity" class="selectwidth">
		            <option name="optionQuality1" value="Baseline"></option>
			        <option name="optionQuality2" value="Main"></option>
			        <option name="optionQuality3" value="High"></option>
                </select>
            </span>
        </div>	  
        <div class="subparamswhite displaynone">
            <span class="firstspan"><label id="laIntervalBPFrame" name="laIntervalBPFrame"></label></span>
            <span>
		        <select id="IntervalBPFrame" class="selectwidth">
                    <option value="0" >BBP</option>
                    <option value="2" >P</option>
                </select>
            </span>
        </div>   
        <div id="IntervalFrameI_tr" class="subparamswhite displaynone">
            <span class="firstspan"><label id="laIntervalFrameI" name="laIntervalFrameI"></label></span>
            <span>
			    <input type="text" id="IntervalFrameI" class="inputwidth" onBlur="CheackServerIDIntNum(this.value,'IntervalFrameItips','laIntervalFrameI',g_iMinIntervalFrameI, g_iMaxIntervalFrameI)" maxlength="3" value="100" />
		    </span>
            <span id="IntervalFrameItips"></span>
        </div>
        <div id="divDecodeMode" class="subparamswhite displaynone">
            <span class="firstspan"><label name="laDecodeMode"></label></span>
            <span>
		        <select id="selDecodeMode" class="selectwidth">
                    <option name="laSoftware" value="software" ></option>
                    <option name="laHardware" value="hardware" ></option>
                </select>
            </span>
        </div> 
        <div id="divMountType" class="subparamswhite displaynone">
            <span class="firstspan"><label name="laMountType"></label></span>
            <span>
		        <select id="selMountType" class="selectwidth">
                    <option name="laWall" value="0"></option>
                    <option name="laCelling" value="1"></option>
					<option name="laFloor" value="2"></option>
                </select>
            </span>
        </div> 						   		    
    </div>
  
    <div class="pane" id="divAudio">
        <div class="displaynone"><input id="inputEnableAudio" type="checkbox" onclick="enableAudio();" /></div>
	    <div id="divAudioCompressionType" class="subparamswhite displaynone">
	        <span class="firstspan"><label id="laAudioEncoding" name="laAudioEncoding"></label></span>
	        <span>
	            <select id="selectAudioCompressionType" class="selectwidth">
		            <option value="G.711ulaw">G.711ulaw</option>
		            <option value="G.711alaw">G.711alaw</option>
		            <option value="G.726">G.726</option>
		        </select>
	        </span>	  
	    </div>
	    <div id="divAudioInputType" class="subparamsgray displaynone">
	        <span class="firstspan"><label id="laAudioInput" name="laAudioInput"></label></span>
	  	    <span>
		        <select id="selectAudioInputType" class="selectwidth">
		            <option value="MicIn">MicIn</option>
		            <option value="LineIn">LineIn</option>
		        </select>
		    </span>
	    </div>
        <div id="divAudioVolume" class="subparamswhite displaynone">
	        <span class="firstspan"><label id="laAudioVolume" name="laAudioVolume"></label></span>
	  	    <span>
		        <input type="text" class="inputwidth" maxlength="3" id="inAudioVolume"/>
		    </span>
	    </div>
    </div>
	<div id="main_plugin" name="main_plugin" class="plugin0"></div>      
</div>