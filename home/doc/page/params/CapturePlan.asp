<div class="mainparams">
	<label id="laTimingCapture" name="laTimingCapture"></label>
</div>
<div class="subparamswhite margintop10">
	<input id="IsUseTimingCapture" class="checkbox" type="checkbox" onclick="EnableTimingCapture()"/>&nbsp;
	<label id="laUseTimingCapture" name="laUseTimingCapture"></label>
</div>
<div class="subparamsgray">
	<span class="firstspan">
	    <label id="laPictureCodecType" name="laPictureCodecType"></label>
	</span>
	<span>
	    <select id="selectTimingPictureCodecType" class="selectwidth"></select>	  
	</span>
</div>
<div class="subparamswhite">
	<span class="firstspan">
	    <label name="laVideoResolution"></label>
	</span>
	<span>
	    <select id="selectTimingPictureResolution" class="selectwidth"></select>
	</span>
</div>
<div class="subparamsgray">
	<span class="firstspan">
	    <label id="laPictureQuality" name="laPictureQuality"></label>
	</span>
	<span>
	    <select id="selectTimingPictureQuality" class="selectwidth"></select>
	</span>
</div>
<div class="subparamswhite">
	<span class="firstspan">
	    <label id="laCaptureInterval" name="laCaptureInterval"></label>
	</span>
	<span>
	    <input id="inputTimingCaptureInterval" type="text" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'spanTimingCaptureIntervalTips','laCaptureInterval',g_iTimingIntervalMinTmp, g_iTimingIntervalMaxTmp,$('#selectTimingTimeUnit').find('option:selected').text())" onkeydown="CheckKeyDown(event)"/>
	    <select id="selectTimingTimeUnit" class="width100" onChange="changeTimingUnit(this)">
		    <option value="0" id="optionMillisecond" name="optionMillisecond"></option>
		    <option value="1" id="optionSecond" name="optionSecond"></option>
		    <option value="2" id="optionMinute" name="optionMinute"></option>
		    <option value="3" id="optionHour" name="optionHour"></option>
		    <option value="4" id="optionDay" name="laDay"></option>
		</select>		
	</span>	  
	<span id="spanTimingCaptureIntervalTips"></span>
</div>
<!--<div class="subparamsgray displaynone" id="dvCaptureNum">
	<span class="firstspan">
	    <label name="laCaptureNum"></label>
	</span>
	<span>
	    <input type="text" id="inCaptureNum" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'spTimingCaptureNumTips','laCaptureNum',g_iTimingCaptureNumMin,g_iTimingCaptureNumMax)"/>
	</span>
	<span id="spTimingCaptureNumTips"></span>
</div>-->
<div class="mainparams margintop26">
	<label id="laEventCapture" name="laEventCapture"></label>
</div>
<div class="subparamswhite margintop10">
	<input id="IsUseEventCapture" class="checkbox" type="checkbox" onclick="EnableEventCapture()"/>&nbsp;
	<label id="laUseEventCapture" name="laUseEventCapture"></label>
</div>
<div class="subparamsgray">
	<span class="firstspan">
	    <label id="laPictureCodecType" name="laPictureCodecType"></label>
	</span>
	<span>
	    <select id="selectEventPictureCodecType" class="selectwidth"></select>	  
	</span>
</div>
<div class="subparamswhite">
	<span class="firstspan">
	    <label name="laVideoResolution"></label>
	</span>
	<span>
	    <select id="selectEventPictureResolution" class="selectwidth"/>
		</select>
	</span>
</div>
<div class="subparamsgray">
	<span class="firstspan">
	    <label id="laPictureQuality" name="laPictureQuality"></label>
	</span>
	<span>
	    <select id="selectEventPictureQuality" class="selectwidth"/></select>
	</span>
</div>
<div class="subparamswhite">
	<span class="firstspan">
	    <label id="laCaptureInterval" name="laCaptureInterval"></label>
	</span>
	<span>
	    <input id="inputEventCaptureInterval" type="text" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'spanEventCaptureIntervalTips','laCaptureInterval',g_iEventIntervalMinTmp,g_iEventIntervalMaxTmp, $('#selectEventTimeUnit').find('option:selected').text())" onkeydown="CheckKeyDown(event)"/>
	    <select id="selectEventTimeUnit" class="width100" onChange="changeEventUnit(this)">
		    <option value="0" id="optionMillisecond" name="optionMillisecond"></option>
		    <option value="1" id="optionSecond" name="optionSecond"></option>
		</select>			
	</span>  
	<span id="spanEventCaptureIntervalTips"></span>
</div>
<div class="subparamsgray displaynone" id="dvCaptureNum">
	<span class="firstspan">
	    <label id="c" name="laCaptureNum"></label>
	</span>
	<span>
	    <input type="text" id="inCaptureNum" class="inputwidth" onblur="CheackServerIDIntNum(this.value,'spEventCaptureNumTips','laCaptureNum',g_iEventCaptureNumMin,g_iEventCaptureNumMax)"/>
	</span>
	<span id="spEventCaptureNumTips"></span>
</div>