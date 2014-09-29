var sliderBright = null;
var sliderContrast = null;
var sliderSaturation = null;
var sliderHue = null;
var sliderGain = null;
var sliderSharpness = null;
var sliderDayNightFilterTime = null;
var sliderWDRLevel1 = null;
var sliderWDRLevel2 = null;
var sliderWDRContrastLevel = null;
var sliderBLCLevel = null;
var sliderWhiteBlanceRed = null;
var sliderWhiteBlanceBlue = null;
var sliderAutoIrisLevel = null;
var generalLevel = null;
var interFrameNoiseReduceLevel = null;
var frameNoiseReduceLevel = null;
var g_oSliderDehazeLevel = null;
var g_oSliderEISLevel = null;
var g_oSliderCSLevel = null;
var g_oSliderHLCLevel = null;
var g_oSliderExpCompLevel = null;
var g_oIRLightBrightSlider = null;
var g_oIRLightSenSlider = null;
var g_oSliderGamaCorrLevel = null;

var m_VideoEffectBright = 0;                //视频亮度信息
var m_VideoEffectContrast = 0;              //视频对比度信息
var m_VideoEffectSaturation = 0;      		//视频饱和度信息
var m_VideoEffectHue = 0;             		//视频色度信息
var isSupportGain = false;            		//是否支持增益
var isSupportWDR = false;        		//是否支持宽动态
var isSupportWDRLevel = false;        		//是否支持宽动态等级
var isSupportWDRLevel1 = false;       		//是否支持宽动态等级1
var isSupportWDRLevel2 = false;       		//是否支持宽动态等级2
var isSupportWDRContrastLevel = false;		//是否支持宽动态对比度等级
var isSupportBLCLevel = false;        		//是否支持背光补偿等级
var isSupportBLCMode = false;       		//是否支持背光补偿区域
var isSupportWhiteBlanceRed = false;		//是否支持白平衡红增益
var isSupportWhiteBlanceBlue = false;		//是否支持白平衡蓝增益
var isSupportAutoIrisLevel = false;		//是否支持自动光圈灵敏度
var g_IsSupportDehaze = false;		    //是否支持去雾
var g_IsSupportDehazeLevel = false;		//是否支持去雾等级
var g_IsSupportDayNightLevel = false;   //是否支持日夜转换灵敏度
var g_IsSupportDayNightFilterTime = false;   //是否支持日夜转换时间
var g_bSupportShutter = false;          //是否支持快门
var g_bSupportIris = false;          //是否支持光圈
var g_bSupportSharpness = false;     //是否支持锐度
var g_bIrcutFilterExt = false;       //是否支持扩展版日夜切换

var DSSLevelEnabled = 0;

//var m_szDefaultFlipStyle = "";              //存储默认镜像翻转方向
var m_szDefaultBLCMode = "";                //存储默认背光补偿模式
var g_BLCRegionXml = null;    //自定义背光补偿区域信息
/*************************************************
Function:		GetFrontParaConfig
Description:	获取前端参数
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetFrontParaConfig()
{
	var szInfo = getNodeValue('laPlugin');
	if(checkPlugin('1', szInfo, 1, 'privacymask'))
	{
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
		
		if (!HWP.wnds[0].isPlaying)
		{
			setTimeout(function() {
				if (HWP.Play() !== 0) {
					alert(getNodeValue("previewfailed"));
				}
			}, 10);
		}
	}
	/*var szXml = '<?xml version="1.0"?><DetectionRegionInfo><videoFormat>PAL</videoFormat><RegionType>roi</RegionType><ROI><HorizontalResolution>704</HorizontalResolution><VerticalResolution>576</VerticalResolution></ROI><DisplayMode>transparent</DisplayMode><MaxRegionNum>1</MaxRegionNum><DetectionRegionList><DetectionRegion><RegionCoordinatesList><RegionCoordinates><positionX>182</positionX><positionY>214</positionY></RegionCoordinates><RegionCoordinates><positionX>182</positionX><positionY>254</positionY></RegionCoordinates><RegionCoordinates><positionX>338</positionX><positionY>254</positionY></RegionCoordinates><RegionCoordinates><positionX>338</positionX><positionY>214</positionY></RegionCoordinates></RegionCoordinatesList></DetectionRegion></DetectionRegionList></DetectionRegionInfo>';
	HWP.SetRegionInfo(szXml);*/
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1",
		async: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			GetFrontParaCapabilities(xmlDoc);
			if($(xmlDoc).find("BLCRegionList").length > 0) {
				g_BLCRegionXml = $(xmlDoc).find("BLCRegionList").get(0);
			} else {
				g_BLCRegionXml = null;
			}
		}
	});
}
/*************************************************
Function:		延时赋值
Description:	setValueDelay
Input:			无			
Output:			无
return:			无				
*************************************************/
function setValueDelayIE6(szId, oXml, szXmlNode, szValue)
{
	if($.browser.msie && parseInt($.browser.version, 10) == 6)
	{
		setTimeout(function()
	    {
		    if(szValue == undefined || szValue == null || szValue == "")
		    {
			    $("#" + szId).val( $(oXml).find(szXmlNode).eq(0).text() );
		    }
		    else
		    {
			    $("#" + szId).val(szValue);
		    }
	   },  20);
	}
	else
	{
		if(szValue == undefined || szValue == null || szValue == "")
		{
			$("#" + szId).val( $(oXml).find(szXmlNode).eq(0).text() );
		}
		else
		{
			$("#" + szId).val(szValue);
		}
	}
}
// 往select里插option，不刷新页面翻译的方式，要求每个option都有自己的Id，wuyang
// szCapabilitySet: 从设备获取的能力集
// szOptionalSet: 可选能力集
// szIds: 用来翻译的option的Id
// szSelectId: select的Id
function insertOptions2Select(szCapabilitySet, szOptionalSet, szOptionIds, szSelectId) {
	$.each(szCapabilitySet, function(i, szCapability) {
		var index = $.inArray(szCapability, szOptionalSet);
		if (index !== -1) {
			$("<option id='" + szOptionIds[index] + "' name='" + szOptionIds[index] + "' value='" + szCapability +"'></option>").appendTo("#" + szSelectId);
		}
		else {
			if (szOptionalSet[szOptionalSet.length - 1] === "*") {
				$("<option id='" + szOptionIds[szOptionalSet.length - 1] + "' name='" + szOptionIds[szOptionalSet.length - 1] + "' value='" + szCapability +"'></option>").appendTo("#" + szSelectId);
			}
		}
	});
}
/*************************************************
Function:		GetFrontParaCapabilities
Description:	获取设备前端参数能力集
Input:			xmlDocVal 前端参数的实际值			
Output:			无
return:			无				
*************************************************/
function GetFrontParaCapabilities(xmlDocVal)
{
	var xmlDoc1 = xmlDocVal;
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/capabilities",
		async: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			//亮度
			if($(xmlDoc).find("Color").eq(0).find('brightnessLevel').length > 0)
			{
				$("#VideoBright_tr").show();
				sliderBright.wsetValue(parseInt($(xmlDoc1).find('brightnessLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderBright.setTitle(getNodeValue('laBrightness') + ":" + sliderBright.getValue()); }, true);
			}
			//对比度
			if($(xmlDoc).find("Color").eq(0).find('contrastLevel').length > 0)
			{
				$("#VideoContrast_tr").show();
				sliderContrast.wsetValue(parseInt($(xmlDoc1).find('contrastLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderContrast.setTitle(getNodeValue('laContrast') + ":" + sliderContrast.getValue()); }, true);
			}
			//饱和度
			if($(xmlDoc).find("Color").eq(0).find('saturationLevel').length > 0)
			{
				$("#VideoSaturation_tr").show();
				sliderSaturation.wsetValue(parseInt($(xmlDoc1).find('saturationLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderSaturation.setTitle(getNodeValue('laSaturation') + ":" + sliderSaturation.getValue()); }, true);
			}
			//色度
			if($(xmlDoc).find("Color").eq(0).find('hueLevel').length > 0)
			{
				$("#VideoHue_tr").show();
				sliderHue.wsetValue(parseInt($(xmlDoc1).find('hueLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderHue.setTitle(getNodeValue('laHue') + ":" + sliderHue.getValue()); }, true);
			}
			//增益
			if($(xmlDoc).find('GainLevel').length > 0)
			{
				isSupportGain = true;
				$("#VideoGain_tr").show();
				sliderGain.wsetValue(parseInt($(xmlDoc1).find('GainLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderGain.setTitle(getNodeValue('laGain') + ":" + sliderGain.getValue()); }, true);
			}
			//锐度模式
			if($(xmlDoc).find('SharpnessMode').length > 0)
			{
				$("#dvSharpnessMode").show();
				var szSharpnessModeOptions = $(xmlDoc).find('SharpnessMode').eq(0).attr("opt").split(",");
				insertOptions2Select(szSharpnessModeOptions, ["auto", "manual"], ["aModeAuto", "aModeManual"], "selSharpnessMode");
				setValueDelayIE6("selSharpnessMode", xmlDoc1, "SharpnessMode");
			}
			//锐度
			if($(xmlDoc).find('SharpnessLevel').length > 0)
			{
				g_bSupportSharpness = true;
				$("#Sharpness_tr").show();
				sliderSharpness.wsetValue(parseInt($(xmlDoc1).find('SharpnessLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderSharpness.setTitle(getNodeValue('laSharpness') + ":" + sliderSharpness.getValue()); }, true);
			}
			if($(xmlDoc).find('resetImage').length > 0)
			{
				$("#ImageReset_tr").show();
			}
			//IPC强制不支持focus，只有球机才判断支不支持
			if(window.parent.g_bIsIPDome) {
				//聚焦模式
				if($(xmlDoc).find('FocusStyle').length > 0)
				{
					$("#FocusMode_tr").show();
					var szFocusStyleOptions = $(xmlDoc).find('FocusStyle').eq(0).attr("opt").split(",");
					insertOptions2Select(szFocusStyleOptions, ["AUTO", "MANUAL", "SEMIAUTOMATIC"], ["aModeAuto", "aModeManual", "FocusModeAutoManual"], "FocusMode");
					setValueDelayIE6("FocusMode", xmlDoc1, "FocusStyle");
				}
				//最小聚焦限制
				if($(xmlDoc).find('FocusLimited').length > 0)
				{
					FocusLimitedenable = 1;
					$("#FocusLimited").empty();
					$("#FocusLimited_tr").show();
					var FocusLimitedOptions = $(xmlDoc).find('FocusLimited').eq(0).attr("opt").split(",");
					for(i = 0;i < FocusLimitedOptions.length; i++)
					{
						if("close" == FocusLimitedOptions[i]) {
							$("<option value='close' name='aStyleClose'></option>").appendTo("#FocusLimited");
						} else {
							$("<option value='"+ FocusLimitedOptions[i] +"'>"+ FocusLimitedOptions[i] +"</option>").appendTo("#FocusLimited");
						}
					}
					setValueDelayIE6("FocusLimited", xmlDoc1, "FocusLimited");
				}
			}
			//曝光模式
			if($(xmlDoc).find('ExposureType').length > 0)
			{
				$("#IrisMode_tr").show();
				var szExposureTypeOptions = $(xmlDoc).find('ExposureType').eq(0).attr("opt").split(",");
				insertOptions2Select(szExposureTypeOptions, ["auto", "IrisFirst", "manual", "ShutterFirst", "gainFirst"], ["aModeAuto", "IrisFirst", "aModeManual", "ShutterFirst", "GainFirst"], "IrisMode");
				setValueDelayIE6("IrisMode", xmlDoc1, "ExposureType");
			}
			//防过曝
			if($(xmlDoc).find("OverexposeSuppress").length > 0){
				$("#dvOverExposeSuppress").show();
				$("#seOverExposeSuppress").val($(xmlDoc1).find("OverexposeSuppress").eq(0).find("enabled").eq(0).text());
			}
			//自动光圈灵敏度
			if($(xmlDoc).find('autoIrisLevel').length > 0)
			{
				isSupportAutoIrisLevel = true;
				$("#AutoIrisLevel_tr").show();
				sliderAutoIrisLevel.wsetValue(parseInt($(xmlDoc1).find('autoIrisLevel').eq(0).text(), 10));
				g_transStack.push(function() { sliderAutoIrisLevel.setTitle(getNodeValue('laAutoIrisLevel') + ":" + sliderAutoIrisLevel.getValue()); }, true);
			}
			//曝光时间
			if($(xmlDoc).find('ShutterLevel').length > 0)
			{
				g_bSupportShutter = true;
				$("#Shutter_tr").show();
				var ShutterOptions = $(xmlDoc).find('ShutterLevel').eq(0).attr("opt").split(",");
				for(i = 0;i < ShutterOptions.length; i++)
				{
					$("<option value='"+ ShutterOptions[i] +"'>"+ ShutterOptions[i] +"</option>").appendTo("#Shutter");
				}
				setValueDelayIE6("Shutter", xmlDoc1, "ShutterLevel");
			}
			//光圈
			if($(xmlDoc).find('IrisLevel').length > 0)
			{
				g_bSupportIris = true;
				$("#IrisLevel_tr").show();
				var IrisLevelOptions = $(xmlDoc).find('IrisLevel').eq(0).attr("opt").split(",");
				for(i = 0;i < IrisLevelOptions.length; i++)
				{
					if("close" == IrisLevelOptions[i])
					{
						$("<option value='close' name='aStyleClose'></option>").appendTo("#IrisLevel");
					}
					else
					{
						$("<option value='"+ IrisLevelOptions[i] +"'>"+ IrisLevelOptions[i] +"</option>").appendTo("#IrisLevel");
					}
				}
				setValueDelayIE6("IrisLevel", xmlDoc1, "IrisLevel");
			}
			//低照度电子快门
			if($(xmlDoc).find('DSS').length > 0)
			{
				if($(xmlDoc).find('DSS').eq(0).children().length > 0)
				{
					$("#DSS_tr").show();	
					if("true" == $(xmlDoc1).find('DSS').eq(0).find('enabled').eq(0).text())
					{
						$("#DSSEnabled").prop("checked",true);
						$("#DSSLevel").prop("disabled",false);
					}
					else
					{
						$("#DSSEnabled").prop("checked",false);
						$("#DSSLevel").prop("disabled",true);
					}
				}
				//低照度电子快门等级
				if($(xmlDoc).find('DSSLevel').length > 0)
				{
					$("#DSSLevel").empty();
					DSSLevelEnabled = 1;
					$("#DSSLevel_tr").show();
					var DSSLevelOptions = $(xmlDoc).find('DSSLevel').eq(0).attr("opt").split(",");
					insertOptions2Select(DSSLevelOptions, ["low", "normal", "*"], ["aLevelLow", "aLevelNormal", "aLevelHigh"], "DSSLevel");
					if($(xmlDoc1).find('DSSLevel').length > 0)
					{
				        setValueDelayIE6("DSSLevel", xmlDoc1, "DSSLevel");
					}
				}
			}
			//视频制式
			if($(xmlDoc).find('powerLineFrequencyMode').length > 0)
			{
				$("#powerLine_tr").show();
				var powerLineFrequencyModeOptions = $(xmlDoc).find('powerLineFrequencyMode').eq(0).attr("opt").split(",");
				for(i = 0;i < powerLineFrequencyModeOptions.length; i++)
				{
					$("<option value='"+ powerLineFrequencyModeOptions[i] +"'>"+ powerLineFrequencyModeOptions[i] +"</option>").appendTo("#PowerLineFrequencyMode");
				}
				setValueDelayIE6("PowerLineFrequencyMode", xmlDoc1, "powerLineFrequencyMode");
			}
			if($(xmlDoc).find("IrcutFilterExt").length > 0) {
				g_bIrcutFilterExt = true;
			} else {
				g_bIrcutFilterExt = false;
			}
			//日夜切换
			if($(xmlDoc).find('IrcutFilterType').length > 0)
			{
				$("#DayNightFilterType_tr").show();
				var IrcutFilterTypeOptions = $(xmlDoc).find('IrcutFilterType').eq(0).attr("opt").split(",");
				insertOptions2Select(IrcutFilterTypeOptions, ["auto", "day", "night", "schedule", "eventTrigger"], ["aModeAuto", "IrcutFilterTypeDay", "IrcutFilterTypeNight", "Schedule", "EventTrigger"], "DayNightFilterType");
				setValueDelayIE6("DayNightFilterType", xmlDoc1, "IrcutFilterType");
			}
			//日夜转换等级
			if(!g_bIrcutFilterExt)
			{
				if($(xmlDoc).find('IrcutFilterLevel').length > 0)
				{
					g_IsSupportDayNightLevel = true;
					$("#DayToNightFilterLevel_tr").show();
					var IrcutFilterLevelOptions = $(xmlDoc).find('IrcutFilterLevel').eq(0).attr("opt").split(",");
					insertOptions2Select(IrcutFilterLevelOptions, ["low", "normal", "high"], ["aLevelLow", "aLevelNormal", "aLevelHigh"], "DayToNightFilterLevel");
					setValueDelayIE6("DayToNightFilterLevel", xmlDoc1, "IrcutFilterLevel");
				}
			}
			else
			{
				if($(xmlDoc).find('nightToDayFilterLevel').length > 0)
				{
					g_IsSupportDayNightLevel = true;
					$("#DayToNightFilterLevel_tr").show();
					var IrcutFilterLevelOptions = $(xmlDoc).find('nightToDayFilterLevel').eq(0).attr("opt").split(",");
					insertOptions2Select(IrcutFilterLevelOptions, ["low", "normal", "high"], ["aLevelLow", "aLevelNormal", "aLevelHigh"], "DayToNightFilterLevel");
					setValueDelayIE6("DayToNightFilterLevel", xmlDoc1, "nightToDayFilterLevel");
				}
			}
			//日夜转换时间
			if($(xmlDoc).find('IrcutFilterTime').length > 0)
			{
				g_IsSupportDayNightFilterTime = true;
				$("#DayNightFilterTime_tr").show();
				if($("#DayNightFilterTime").html() == "" || sliderDayNightFilterTime === null) {
					DayNightFilterTimeMin = parseInt($(xmlDoc).find('IrcutFilterTime').eq(0).attr("min"), 10);
					DayNightFilterTimeMax = parseInt($(xmlDoc).find('IrcutFilterTime').eq(0).attr("max"), 10);
					sliderDayNightFilterTime = new neverModules.modules.slider(
					{
						targetId: "DayNightFilterTime",
						sliderCss: "imageslider1",
						barCss: "imageBar2",
						boxCss: "boxBar",
						bBox:true,
						min: DayNightFilterTimeMin,
						max: DayNightFilterTimeMax,
						hints:""
					}); 
					sliderDayNightFilterTime.create();
					//sliderDayNightFilterTime.wsetValue(60);
					
					sliderDayNightFilterTime.onchange = function ()
					{
						sliderDayNightFilterTime.setTitle(getNodeValue('laFilterTime') + ':' + sliderDayNightFilterTime.getValue());
					};
					sliderDayNightFilterTime.onend = function ()
					{	
						SetIrcutFilter();
					};
				}
				
				sliderDayNightFilterTime.wsetValue(parseInt($(xmlDoc1).find('IrcutFilterTime').eq(0).text(), 10));
				g_transStack.push(function() { sliderDayNightFilterTime.setTitle(getNodeValue('laFilterTime') + ":" + sliderDayNightFilterTime.getValue()); }, true);
			}
			
			//镜像翻转方向
			if($(xmlDoc).find('ImageFlip').length > 0)
			{
				var szEnableImageFlip = $(xmlDoc1).find('ImageFlip').eq(0).find('enabled').eq(0).text();
				$("#ImageFlipStyle_tr").show();
				if($(xmlDoc).find('ImageFlipStyle').length > 0)
				{
					var ImageFlipStyleOptions = $(xmlDoc).find('ImageFlipStyle').eq(0).attr("opt").split(",");
					insertOptions2Select(ImageFlipStyleOptions, ["LEFTRIGHT", "UPDOWN", "CENTER"], ["ImageFlipStyleLR", "ImageFlipStyleUD", "aModeCenter"], "ImageFlipStyle");
					$("<option id='aStyleClose' name='aStyleClose' value='false'></option>").appendTo("#ImageFlipStyle");
					//是否启用镜像翻转
					if(szEnableImageFlip == "true")
					{
						setValueDelayIE6("ImageFlipStyle", xmlDoc1, "ImageFlipStyle");
					}
					else
					{
						setValueDelayIE6("ImageFlipStyle", null, "", "false");
					}
				}
				else
				{
					$("<option name='laEnable' value='true'></option><option name='aStyleClose' value='false'></option>").appendTo("#ImageFlipStyle");
					//是否启用镜像翻转
					if(szEnableImageFlip == "true")
					{
						setValueDelayIE6("ImageFlipStyle", null,"", "true");
					}
					else
					{
						setValueDelayIE6("ImageFlipStyle", null, "", "false");
					}
				}
			}
			//宽动态
			if(!window.parent.g_bIsIPDome)
			{
				if($(xmlDoc).find('WDR').length > 0)//支持宽动态
				{
					if($(xmlDoc).find('WDR').eq(0).find('enabled').length > 0) 
					{
						isSupportWDR = true;
						$("#WDR_tr").show();
						//2011-07-14 [guibo] add  宽动态支持3种模式   START
						var szWDROptions = $(xmlDoc).find('WDR').eq(0).find('enabled').eq(0).attr("opt").split(",");
						insertOptions2Select(szWDROptions, ["false", "true", "auto"], ["aStyleClose", "laEnable", "aModeAuto"], "WDREnabled");
						//2011-07-14 [guibo] add  宽动态支持3种模式   END
						
						if($(xmlDoc).find('WDRLevel').length > 0)  //2012-02-08 [chenxiangzhen] 条件修改
						{
							isSupportWDRLevel = true;
							var szWDRLevelOpt = $(xmlDoc).find('WDRLevel').eq(0).attr("opt");
							if(szWDRLevelOpt)
							{
								var rMatch = szWDRLevelOpt.match(/B/ig); 
								if(rMatch)
								{
									isSupportWDRLevel2 = true;
									if(rMatch.length < szWDRLevelOpt.split(",").length)
									{
										isSupportWDRLevel1 = true;
									}
								}
								else
								{
									isSupportWDRLevel1 = true;
								}
							}
						}
						
						if($(xmlDoc).find('WDRContrastLevel').length > 0)  //支持宽动态对比度等级
						{
							isSupportWDRContrastLevel = true;
						}
						//宽动态当前参数值
						var WDRCurValue = $(xmlDoc1).find('WDR').eq(0).find('enabled').eq(0).text();
						if((WDRCurValue == "true") || (WDRCurValue == "auto")) //启用宽动态
						{
							setValueDelayIE6("WDREnabled", null, "", WDRCurValue);
							
							if(isSupportWDRLevel)    //支持宽动态等级
							{
								if(isSupportWDRLevel1)  //支持宽动态等级1
								{
									$("#WDRLevel_tr1").show();
									sliderWDRLevel1.wsetValue(parseInt($(xmlDoc1).find('WDRLevel').eq(0).text().split(',')[0], 10));
									g_transStack.push(function() { sliderWDRLevel1.setTitle(getNodeValue('laWDRLevel1') + ":" + sliderWDRLevel1.getValue()); }, true);
								}
								if(isSupportWDRLevel2)  //支持宽动态等级2
								{
									$("#WDRLevel_tr2").show();
									sliderWDRLevel2.wsetValue(parseInt($(xmlDoc1).find('WDRLevel').eq(0).text().split('B')[1], 10));
									g_transStack.push(function() { sliderWDRLevel2.setTitle(getNodeValue('laWDRLevel2') + ":" + sliderWDRLevel2.getValue()); }, true);
								}
							}
												
							if(isSupportWDRContrastLevel)  //支持宽动态对比度等级
							{
								$("#WDRContrastLevel_tr").show();
								sliderWDRContrastLevel.wsetValue(parseInt($(xmlDoc1).find('WDRContrastLevel').eq(0).text(), 10));
								g_transStack.push(function() { sliderWDRContrastLevel.setTitle(getNodeValue('laWDRContrast') + ":" + sliderWDRContrastLevel.getValue()); }, true);
							}
							//if(WDRCurValue == "auto")
							//{
								//$("#WDRLevel_tr1").hide();
								//$("#WDRLevel_tr2").hide();
							//}
						}
						else   //禁用宽动态
						{
							setValueDelayIE6("WDREnabled", null, "", "false");
							
							$("#WDRLevel_tr1").hide();
							$("#WDRLevel_tr2").hide();
							$("#WDRContrastLevel_tr").hide();
						}	
					}
				}
			}
			else   //球机
			{
				if($(xmlDoc).find('WDRExt').length > 0)//支持宽动态
				{
					if($(xmlDoc).find('WDRExt').eq(0).find('mode').length > 0) 
					{
						$("#WDR_tr").show();
						//2011-07-14 [guibo] add  宽动态支持3种模式   START
						var szWDROptions = $(xmlDoc).find('WDRExt').eq(0).find('mode').eq(0).attr("opt").split(",");
						insertOptions2Select(szWDROptions, ["close", "open", "auto"], ["aStyleClose", "laEnable", "aModeAuto"], "WDREnabled");
						//2011-07-14 [guibo] add  宽动态支持3种模式   END
						
						if($(xmlDoc).find("WDRExt").eq(0).find('WDRLevel').length > 0)
						{
							isSupportWDRLevel = true;
							isSupportWDRLevel1 = true;
						}
						if($(xmlDoc).find("WDRExt").eq(0).find('WDRLevelExt').eq(0).find("Level2").length > 0)
						{
							isSupportWDRLevel = true;
							isSupportWDRLevel2 = true;
						}
						if($(xmlDoc).find("WDRExt").eq(0).find('WDRContrastLevel').length > 0)  //支持宽动态对比度等级
						{
							isSupportWDRContrastLevel = true;
						}
						//宽动态当前参数值
						var WDRCurValue = $(xmlDoc1).find('WDRExt').eq(0).find('mode').eq(0).text();
						if((WDRCurValue == "open") || (WDRCurValue == "auto")) //启用宽动态
						{
							setValueDelayIE6("WDREnabled", null, "", WDRCurValue);
							
							if(isSupportWDRLevel)    //支持宽动态等级
							{
								if(isSupportWDRLevel1)  //支持宽动态等级1
								{
									$("#WDRLevel_tr1").show();
									sliderWDRLevel1.wsetValue(parseInt($(xmlDoc1).find("WDRExt").eq(0).find('WDRLevel').eq(0).text(), 10));
									g_transStack.push(function() { sliderWDRLevel1.setTitle(getNodeValue('laWDRLevel1') + ":" + sliderWDRLevel1.getValue()); }, true);
								}
								if(isSupportWDRLevel2)  //支持宽动态等级2
								{
									$("#WDRLevel_tr2").show();
									sliderWDRLevel2.wsetValue(parseInt($(xmlDoc1).find("WDRExt").eq(0).find('Level2').eq(0).text(), 10));
									g_transStack.push(function() { sliderWDRLevel2.setTitle(getNodeValue('laWDRLevel2') + ":" + sliderWDRLevel2.getValue()); }, true);
								}
							}
												
							if(isSupportWDRContrastLevel)  //支持宽动态对比度等级
							{
								$("#WDRContrastLevel_tr").show();
								sliderWDRContrastLevel.wsetValue(parseInt($(xmlDoc1).find('WDRContrastLevel').eq(0).text(), 10));
								g_transStack.push(function() { sliderWDRContrastLevel.setTitle(getNodeValue('laWDRContrast') + ":" + sliderWDRContrastLevel.getValue()); }, true);
							}
						}
						else   //禁用宽动态
						{
							setValueDelayIE6("WDREnabled", null, "", "close");
							$("#WDRLevel_tr1").hide();
							$("#WDRLevel_tr2").hide();
							$("#WDRContrastLevel_tr").hide();
						}	
					}
				}
			}
			//镜头初始化
			if($(xmlDoc).find('LensInitialization').length > 0)
			{
				if($(xmlDoc).find('LensInitialization').eq(0).find('enabled').length > 0)
				{
					$("#LensInit_tr").show();
					$("#LensInitEnabled").prop("checked", $(xmlDoc1).find('LensInitialization').eq(0).find('enabled').eq(0).text() == "true"?true:false);
				}
			}
			//背光补偿
			if($(xmlDoc).find('BLC').length > 0)
			{
				if($(xmlDoc).find('BLC').eq(0).find('enabled').length > 0)
				{
					if(window.parent.g_bIsIPDome)
					{
						$("#BLCMode_tr").show();
						if($(xmlDoc).find('BLCMode').length > 0)
						{
							$("<option name='aStyleClose' value='false'></option>").appendTo("#BLCMode");
							var BLCModeOptions = $(xmlDoc).find('BLCMode').eq(0).attr("opt").split(",");
							insertOptions2Select(BLCModeOptions, ["UP", "DOWN", "LEFT", "RIGHT", "CENTER", "Region", "OPEN", "AUTO"], ["BLCModeUp", "BLCModeDown", "BLCModeLeft", "BLCModeRight", "aModeCenter", "constantBitRateOpt23", "laEnable", "aModeAuto"], "BLCMode");
							isSupportBLCMode = true;
						}
						else
						{
							$("#laBLCMode").attr("name", "laBLC").html(getNodeValue("laBLC"));
							$("<option name='laEnable' value='true'></option><option name='aStyleClose' value='false'></option>").appendTo("#BLCMode");
						}
					}
					else
					{
						$("#BLCMode_tr").show();
						$("<option id='aStyleClose' name='aStyleClose' value='false'></option>").appendTo("#BLCMode");
						if($(xmlDoc).find('BLCMode').length > 0)
						{
							var BLCModeOptions = $(xmlDoc).find('BLCMode').eq(0).attr("opt").split(",");
							insertOptions2Select(BLCModeOptions, ["UP", "DOWN", "LEFT", "RIGHT", "CENTER", "Region"], ["BLCModeUp", "BLCModeDown", "BLCModeLeft", "BLCModeRight", "aModeCenter", "constantBitRateOpt23"], "BLCMode");
							isSupportBLCMode = true;
						}
					}
					//是否支持背光补偿等级
					if($(xmlDoc).find('BLCLevel').length > 0)
					{
						isSupportBLCLevel = true;
						$("#BLCLevel_tr").show();
						sliderBLCLevel.wsetValue(parseInt($(xmlDoc1).find('BLCLevel').eq(0).text(), 10));
						g_transStack.push(function() { sliderBLCLevel.setTitle(getNodeValue('laBLCLevel') + ":" + sliderBLCLevel.getValue()); }, true);
						$("#BLCLevel_tr").hide();
					}
					var szEnableBLC = $(xmlDoc1).find('BLC').eq(0).find('enabled').eq(0).text();
					if(szEnableBLC == "true")  //启用背光补偿
					{
						if(isSupportBLCMode)
						{							
				            setValueDelayIE6("BLCMode", xmlDoc1, "BLCMode");
						}
						else
						{
							setValueDelayIE6("BLCMode", null, "", "true");
						}
						if(isSupportBLCLevel)
						{
							if(WDRCurValue == "false" || $("#WDR_tr").css("display") == "none")
							{
								$("#BLCLevel_tr").show();
							}
						}
					}
					else
					{
						setValueDelayIE6("BLCMode", null, "", "false");
						$("#BLCLevel_tr").hide();
					}
				}
			}
			//白平衡
			if($(xmlDoc).find('WhiteBlanceStyle').length > 0)
			{
				$("#WhiteBlanceStyle_tr").show();
				var WhiteBlanceStyleOptions = $(xmlDoc).find('WhiteBlanceStyle').eq(0).attr("opt").split(",");
				insertOptions2Select(WhiteBlanceStyleOptions, ["auto", "indoor", "outdoor", "manual", "autotrace", "sodiumlight", "mercurylight", "onece", "daylightLamp", "auto1", "auto2","autooutdoor","autosodiumlight", "locked", "incandescentlight", "warmlight", "naturallight"], ["WhiteBlanceStyleAuto", "SceneOptionIndoor", "SceneOptionOutdoor", "WhiteBlanceStyleManual", "autoTrack", "SodiumLight", "MercuryLight", "Onepush", "daylightLamp", "WhiteBlanceStyle1", "WhiteBlanceStyle2","OutdoorAuto","SodiumLightAuto", "WBLocked","IncandescentLamp","WarmLightLamp","NaturalLight"], "WhiteBlanceStyle");
				setValueDelayIE6("WhiteBlanceStyle", xmlDoc1, "WhiteBlanceStyle");
			}
			//是否支持白平衡红色增益
			if($(xmlDoc).find('WhiteBlanceRed').length > 0)
			{
				isSupportWhiteBlanceRed = true;
				$("#WhiteBlanceRed_tr").show();
				if($("#WhiteBlanceRed").html() == "" || sliderWhiteBlanceRed === null) {  //未创建滑动条
					var iRedMax = $(xmlDoc).find('WhiteBlanceRed').eq(0).attr("max");
					sliderWhiteBlanceRed = new neverModules.modules.slider(
					{
						targetId: "WhiteBlanceRed",
						sliderCss: "imageslider1",
						barCss: "imageBar2",
						boxCss: "boxBar",
						bBox:true,
						min: 0,
						max: window.parent.g_bIsIPDome?100:(iRedMax?parseInt(iRedMax, 10):255),
						hints:""
					}); 
					sliderWhiteBlanceRed.create();
					
					sliderWhiteBlanceRed.onchange = function ()
					{
						sliderWhiteBlanceRed.setTitle(getNodeValue('laWhiteBlanceRed') + ':' + sliderWhiteBlanceRed.getValue());
					};
					sliderWhiteBlanceRed.onend = function ()
					{	
						SetWhiteBlance();
					};
				}
				sliderWhiteBlanceRed.wsetValue(parseInt($(xmlDoc1).find('WhiteBlanceRed').eq(0).text(), 10));
				g_transStack.push(function() { sliderWhiteBlanceRed.setTitle(getNodeValue('laWhiteBlanceRed') + ":" + sliderWhiteBlanceRed.getValue()); }, true);
			}
			//是否支持白平衡蓝色增益
			if($(xmlDoc).find('WhiteBlanceBlue').length > 0)
			{
				isSupportWhiteBlanceBlue = true;
				$("#WhiteBlanceBlue_tr").show();
				if($("#WhiteBlanceBlue").html() == "" || sliderWhiteBlanceBlue === null) {    //未创建滑动条
					var iBlueMax = $(xmlDoc).find('WhiteBlanceBlue').eq(0).attr("max");
					sliderWhiteBlanceBlue = new neverModules.modules.slider(
					{
						targetId: "WhiteBlanceBlue",
						sliderCss: "imageslider1",
						barCss: "imageBar2",
						boxCss: "boxBar",
						bBox:true,
						min: 0,
						max: window.parent.g_bIsIPDome?100:(iBlueMax?parseInt(iBlueMax, 10):255),
						hints:""
					}); 
					sliderWhiteBlanceBlue.create();
					sliderWhiteBlanceBlue.wsetValue(parseInt($(xmlDoc1).find('WhiteBlanceBlue').eq(0).text(), 10));
					
					sliderWhiteBlanceBlue.onchange = function ()
					{
						sliderWhiteBlanceBlue.setTitle(getNodeValue('laWhiteBlanceBlue') + ':' + sliderWhiteBlanceBlue.getValue());
					};
					sliderWhiteBlanceBlue.onend = function ()
					{	
						SetWhiteBlance();
					};
				}
				sliderWhiteBlanceBlue.wsetValue(parseInt($(xmlDoc1).find('WhiteBlanceBlue').eq(0).text(), 10));
				g_transStack.push(function() { sliderWhiteBlanceBlue.setTitle(getNodeValue('laWhiteBlanceBlue') + ":" + sliderWhiteBlanceBlue.getValue()); }, true);
			}
			//数字降噪
			if($(xmlDoc).find('NoiseReduceExt').length > 0)
			{
				if($(xmlDoc).find('NoiseReduceExt').eq(0).find('mode').length > 0)
				{
					$("#NosiseReduceExt_tr").show();
					var szNosiseReduceModeOptions = $(xmlDoc).find('NoiseReduceExt').eq(0).find('mode').eq(0).attr("opt").split(",");
					insertOptions2Select(szNosiseReduceModeOptions, ["general", "advanced", "*"], ["NosiseReduceGeneral", "NosiseReduceAdvanced", "aStyleClose"], "NosiseReduceExtMode");

					var szCurNosiseMode = $(xmlDoc1).find('NoiseReduceExt').eq(0).find('mode').eq(0).text();
					setValueDelayIE6("NosiseReduceExtMode", null, "", szCurNosiseMode);
					
					$("#GeneralLevel_tr").show();
					generalLevel.wsetValue(parseInt($(xmlDoc).find('generalLevel').eq(0).text(), 10));
					g_transStack.push(function() { generalLevel.setTitle(getNodeValue('laGeneralLevel') + ":" + generalLevel.getValue()); }, true);
					
					$("#InterFrameNoiseReduceLevel_tr").show();
					interFrameNoiseReduceLevel.wsetValue(parseInt($(xmlDoc).find('InterFrameNoiseReduceLevel').eq(0).text(), 10));
					g_transStack.push(function() { interFrameNoiseReduceLevel.setTitle(getNodeValue('laInterFrameNoiseReduce') + ":" + interFrameNoiseReduceLevel.getValue()); }, true);
					
					$("#FrameNoiseReduceLevel_tr").show();
					frameNoiseReduceLevel.wsetValue(parseInt($(xmlDoc).find('FrameNoiseReduceLevel').eq(0).text(), 10));
					g_transStack.push(function() { frameNoiseReduceLevel.setTitle(getNodeValue('laFrameNoiseReduce') + ":" + frameNoiseReduceLevel.getValue()); }, true);
				}
			}
			//电子云台
			if($(xmlDoc).find('EPTZ').length > 0)
			{
				$("#EPTZ_tr").show();
				var EPTZEnableOptions = $(xmlDoc).find('EPTZ').eq(0).find('enabled').eq(0).attr("opt").split(",");
				insertOptions2Select(EPTZEnableOptions, ["true", "false"], ["laEnable", "aStyleClose"], "selEPTZEnable");
				setValueDelayIE6("selEPTZEnable", $(xmlDoc1).find('EPTZ').eq(0), "enabled");
			}
			//室内外模式
			if($(xmlDoc).find('Scene').length > 0)
			{
				$("#Scene_tr").show();
				var SceneOptions = $(xmlDoc).find('Scene').eq(0).find('mode').eq(0).attr("opt").split(",");
				insertOptions2Select(SceneOptions, ["indoor", "outdoor"], ["SceneOptionIndoor", "SceneOptionOutdoor"], "selScene");
				setValueDelayIE6("selScene", $(xmlDoc1).find('Scene').eq(0), "mode");
			}
			//去雾
			if($(xmlDoc).find("Dehaze").length > 0)
			{
				g_IsSupportDehaze = true;
			}
			if($(xmlDoc).find("dehazeLevel").length > 0)
			{
				g_IsSupportDehazeLevel = true;
			}
			if(g_IsSupportDehaze)
			{
				$("#dvEnableDehaze").show();
				$("#chEnableDehaze").prop("checked", $(xmlDoc).find("Dehaze").eq(0).find("enabled").eq(0).text()=="true"?true:false);
			}
			if(g_IsSupportDehazeLevel)
			{
				$("#dvDehazeLevel").show();
			}
			//变倍限制
			if($(xmlDoc).find('ZoomLimit').length > 0)
			{
				$("#dvZoomLimit").show();
				var ZoomLimitOptions = $(xmlDoc).find('ZoomLimitRatio').eq(0).attr("opt").split(",");
				for(i = 0;i < ZoomLimitOptions.length; i++)
				{
					$("<option value='"+ ZoomLimitOptions[i] +"'>"+ ZoomLimitOptions[i] +"</option>").appendTo("#selZoomLimit");
				}
				setValueDelayIE6("selZoomLimit", xmlDoc1, "ZoomLimitRatio");
			}
			//电子防抖等级
			if($(xmlDoc).find('EIS').length > 0)
			{
				$("#dvEIS").show();
				$("#inEnableEIS").prop("checked", $(xmlDoc1).find("EIS").eq(0).find("enabled").eq(0).text()=="true"?true:false);
				if($(xmlDoc).find('EIS').eq(0).find("EISLevel").length >　0)
				{
					$("#dvEISLevel").show();
					g_oSliderEISLevel.wsetValue(parseInt($(xmlDoc1).find('EISLevel').eq(0).text(), 10));
					g_transStack.push(function() { g_oSliderEISLevel.setTitle(getNodeValue('laEISLevel') + ":" + g_oSliderEISLevel.getValue()); }, true);
				}
				
			}
			//色彩抑制等级
			if($(xmlDoc).find('ChromaSuppress').length > 0)
			{
				$("#dvChromaSuppress").show();
				g_oSliderCSLevel.wsetValue(parseInt($(xmlDoc1).find('ChromaSuppressLevel').eq(0).text(), 10));
				g_transStack.push(function() { g_oSliderCSLevel.setTitle(getNodeValue('laChromaSuppress') + ":" + g_oSliderCSLevel.getValue()); }, true);
			}
			//强光抑制等级
			if($(xmlDoc).find('HLC').length > 0)
			{
				$("#dvHLC").show();
				var szHLCEnable = $(xmlDoc1).find('HLC').eq(0).find('enabled').eq(0).text();
				$("#selEnableHLC").val(szHLCEnable);
				if($(xmlDoc).find('HLCLevel').length > 0) {
					$("#dvHLCLevel").show();
					if($("#dvHLCLevelSlider").html() == "" || g_oSliderHLCLevel === null) {
						var iHLCMin = $(xmlDoc).find('HLCLevel').eq(0).attr("min");
						var iHLCMax = $(xmlDoc).find('HLCLevel').eq(0).attr("max");
						//强光抑制
						g_oSliderHLCLevel = new neverModules.modules.slider(
						{
							targetId: "dvHLCLevelSlider",
							sliderCss: "imageslider1",
							barCss: "imageBar2",
							boxCss: "boxBar",
							bBox:true,
							min: (iHLCMin?parseInt(iHLCMin, 10):0),
							max: (iHLCMax?parseInt(iHLCMax, 10):100),
							hints:""
						}); 
						g_oSliderHLCLevel.create();
						
						g_oSliderHLCLevel.onchange = function ()
						{
							g_oSliderHLCLevel.setTitle(getNodeValue('laHLC') + ':' + g_oSliderHLCLevel.getValue());
						};
						g_oSliderHLCLevel.onend = function ()
						{	
							setHLCLevel();
						};
					}
					
					g_oSliderHLCLevel.wsetValue(parseInt($(xmlDoc1).find('HLCLevel').eq(0).text(), 10));
					g_transStack.push(function() { g_oSliderHLCLevel.setTitle(getNodeValue('laHLC') + ":" + g_oSliderHLCLevel.getValue()); }, true);
				}
			}
			//曝光补偿等级
			if($(xmlDoc).find('ExpComp').length > 0)
			{
				$("#dvExpComp").show();
				g_oSliderExpCompLevel.wsetValue(parseInt($(xmlDoc1).find('ExpCompLevel').eq(0).text(), 10));
				g_transStack.push(function() { g_oSliderExpCompLevel.setTitle(getNodeValue('laExpComp') + ":" + g_oSliderExpCompLevel.getValue()); }, true);
			}
			//伽马校正等级
			if($(xmlDoc).find('gammaCorrection').length > 0)
			{
				$("#dvGamaCorrect").show();
				g_oSliderGamaCorrLevel.wsetValue(parseInt($(xmlDoc1).find('gammaCorrectionLevel').eq(0).text(), 10));
				g_transStack.push(function() { g_oSliderGamaCorrLevel.setTitle(getNodeValue('laGamaCorrect') + ":" + g_oSliderGamaCorrLevel.getValue()); }, true);
			}
			//红外灯
			if($(xmlDoc).find('IrLight').length > 0)
			{
				$("#dvIRLight").show();
				//红外灯模式
				var aIRLightMode = $(xmlDoc).find('IrLight').eq(0).find("mode").eq(0).attr("opt").split(",");
				insertOptions2Select(aIRLightMode, ["auto", "manual"], ["aModeAuto", "aModeManual"], "selIRLightMode");
				setValueDelayIE6("selIRLightMode", $(xmlDoc1).find('IrLight').eq(0), "mode");
				
				//红外灯灵敏度
				$("#dvIRLightSen").show();
				g_oIRLightSenSlider.wsetValue(parseInt($(xmlDoc).find('IrLight').eq(0).find('sensitivityLevel').eq(0).text(), 10));
				g_transStack.push(function() { g_oIRLightSenSlider.setTitle(getNodeValue('laIRLightSen') + ":" + g_oIRLightSenSlider.getValue()); }, true);

				//红外灯亮度
				$("#dvIRLightBright").show();
				g_oIRLightBrightSlider.wsetValue(parseInt($(xmlDoc).find('IrLight').eq(0).find('brightnessLevel').eq(0).text(), 10));
				g_transStack.push(function() { g_oIRLightBrightSlider.setTitle(getNodeValue('laIRLightBright') + ":" + g_oIRLightBrightSlider.getValue()); }, true);
				
			}
			//低照度增强
			if($(xmlDoc).find('ImageEnhancement').length > 0)
			{
				$("#dvEnhancement").show();
				$("#selEnableEnHancement").val($(xmlDoc1).find('ImageEnhancement').eq(0).find("enabled").eq(0).text());
			}
			//灰度范围
			if($(xmlDoc).find('grayScale').length > 0)
			{
				$("#dvGrayScale").show();
				$("#selGrayScale").val($(xmlDoc1).find("grayScaleMode").eq(0).text());
			}
			//自适应高度
			autoResizeIframe();
			
			/***********关联关系 start*********/
			//锐度模式和锐度关联关系
			if($(xmlDoc1).find('SharpnessMode').eq(0).text() == "auto")
			{
				$("#Sharpness_tr").hide();
			}
			//球机下曝光模式和增益的关联关系
			if(window.parent.g_bIsIPDome)
			{
				if($(xmlDoc1).find("ExposureType").eq(0).text() != "manual" && $(xmlDoc1).find("ExposureType").eq(0).text() != "gainFirst")
				{
					$("#VideoGain_tr").hide();    //当日夜切换为"自动"时，增益无效
				}
			}
			//自动光圈和灵敏度的关联关系
			if("auto" != $(xmlDoc1).find('ExposureType').eq(0).text())
			{
				$("#AutoIrisLevel_tr").hide();
			}
			//球机下曝光模式和曝光时间的关联关系
			if(window.parent.g_bIsIPDome)
			{
				if($(xmlDoc1).find("ExposureType").eq(0).text() != "ShutterFirst" && $(xmlDoc1).find("ExposureType").eq(0).text() != "manual")
				{
					$("#Shutter_tr").hide();
				}
			}
			//球机下曝光模式和光圈的关联关系
			if(window.parent.g_bIsIPDome)
			{
				if($(xmlDoc1).find("ExposureType").eq(0).text() != "IrisFirst" && $(xmlDoc1).find("ExposureType").eq(0).text() != "manual")
				{
					$("#IrisLevel_tr").hide();
				}
			}
			//非球机日夜切换模式与增益的关联关系
			if(!window.parent.g_bIsIPDome)
			{
				if($(xmlDoc1).find("IrcutFilterType").eq(0).text() == "auto")
				{
					$("#VideoGain_tr").hide();    //当日夜切换为"自动"时，增益无效
				}
				else
				{
					$("#DayToNightFilterLevel_tr").hide();
					$("#DayNightFilterTime_tr").hide();
				}
				//计划
				if($(xmlDoc1).find("IrcutFilterType").eq(0).text() == "schedule")
				{
					$("#dvFilterStartTime").show();
					$("#dvFilterEndTime").show();
					var szStartTime = $(xmlDoc1).find('Schedule').eq(0).find('beginTime').eq(0).text();
					var szEndTime = $(xmlDoc1).find('Schedule').eq(0).find('endTime').eq(0).text();
					if(szStartTime != "")
					{
						$('#inFilterStartTime').val(szStartTime);
					}
					else
					{
						$('#inFilterStartTime').val('00:00:00');
					}
					if(szEndTime != "")
					{
						$('#inFilterEndTime').val(szEndTime);
					}
					else
					{
						$('#inFilterEndTime').val('00:00:00');
					}
				}
				//事件
				if($(xmlDoc1).find("IrcutFilterType").eq(0).text() == "eventTrigger")
				{
					$("#dvDayOrNight").show();
					$("#selIrcutFilterAction").val($(xmlDoc1).find("IrcutFilterAction").eq(0).text());
				}
			}
			//球机下曝光模式和日夜转换模式的关联关系
			if(window.parent.g_bIsIPDome)
			{
				if("auto"!=$(xmlDoc1).find("IrcutFilterType").eq(0).text() || "auto"!=$(xmlDoc1).find("ExposureType").eq(0).text())
				{
					$("#DayToNightFilterLevel_tr").hide();
				}
			}
			//非球机背光补偿与宽动态关联关系
			if(!window.parent.g_bIsIPDome) {
				if($(xmlDoc1).find('WDR').eq(0).find('enabled').length > 0 && $(xmlDoc1).find('WDR').eq(0).find('enabled').eq(0).text() !== "false") {
					$("#BLCMode_tr").hide();
					$("#BLCLevel_tr").hide();
				}
				if($(xmlDoc1).find('BLC').eq(0).find('enabled').length > 0 && $(xmlDoc1).find('BLC').eq(0).find('enabled').eq(0).text() !== "false") {
					$("#WDR_tr").hide();
					$("#WDRLevel_tr1").hide();
					$("#WDRLevel_tr2").hide();
					$("#WDRContrastLevel_tr").hide();
				}
			}
			//白平衡关联关系
			if($(xmlDoc1).find('WhiteBlanceStyle').eq(0).text() !== "manual")
			{				
				$("#WhiteBlanceRed_tr").hide();
				$("#WhiteBlanceBlue_tr").hide();
			}
			//数字降噪关联关系
			if(szCurNosiseMode == "general")				//普通模式
			{
				$("#InterFrameNoiseReduceLevel_tr").hide();
				
				$("#FrameNoiseReduceLevel_tr").hide();

				generalLevel.wsetValue(parseInt($(xmlDoc1).find('generalLevel').eq(0).text(), 10));
			}
			else if(szCurNosiseMode == "advanced")			//专家模式
			{
				$("#GeneralLevel_tr").hide();
				
				interFrameNoiseReduceLevel.wsetValue(parseInt($(xmlDoc1).find('InterFrameNoiseReduceLevel').eq(0).text(), 10));
				
				frameNoiseReduceLevel.wsetValue(parseInt($(xmlDoc1).find('FrameNoiseReduceLevel').eq(0).text(), 10));
			}
			else											//关闭
			{
				$("#GeneralLevel_tr").hide();
				
				$("#InterFrameNoiseReduceLevel_tr").hide();
				
				$("#FrameNoiseReduceLevel_tr").hide();
			}
			if($(xmlDoc1).find('BLC').eq(0).find('BLCMode').eq(0).text() == "Region"){
				setBLCRegionToPlugin(xmlDoc1);
				HWP.SetDrawStatus(true);
				$("#btnSetBLCRegion").css({"position":"absolute","left":($("#BLCMode").position().left+$("#BLCMode").width()+3)+"px","top":($("#BLCMode").position().top-2)+"px"}).show();
			}else{
				$("#btnSetBLCRegion").hide();
				HWP.SetDrawStatus(false);
			}
			//强光抑制关联关系
			if("false" == szHLCEnable){
				$("#dvHLCLevel").hide();
			}
			//红外灯关联关系
			if($(xmlDoc1).find('IrLight').eq(0).find("mode").eq(0).text() == "auto")
			{
				$("#dvIRLightBright").hide();
				$("#dvIRLightSen").show();
				g_oIRLightSenSlider.wsetValue(parseInt($(xmlDoc1).find('IrLight').eq(0).find('sensitivityLevel').eq(0).text(), 10));
			}
			else
			{
				$("#dvIRLightBright").show();
				$("#dvIRLightSen").hide();
				g_oIRLightBrightSlider.wsetValue(parseInt($(xmlDoc1).find('IrLight').eq(0).find('brightnessLevel').eq(0).text(), 10));
			}
			/***********关联关系 end*********/
			//翻译页面
			g_transStack.translate();
		}
	});
}
/*************************************************
Function:		SetVideoParamColor
Description:	设置视频参数的亮度
Input:					
Output:			无
return:			无				
*************************************************/
function SetVideoParamColor()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Color><brightnessLevel>" + sliderBright.getValue() + "</brightnessLevel><contrastLevel>" + sliderContrast.getValue() +"</contrastLevel><saturationLevel>" + sliderSaturation.getValue() + "</saturationLevel><hueLevel>" + sliderHue.getValue() + "</hueLevel></Color>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Color";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetVideoGain
Description:	设置增益参数
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetVideoGain()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Gain><GainLevel>" + sliderGain.getValue() + "</GainLevel></Gain>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Gain";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetSharpness
Description:	设置锐度参数
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetSharpness()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?><Sharpness version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>";
	if($("#dvSharpnessMode").css("display") != "none")
	{
		if($("#selSharpnessMode").val() == "auto")
		{
			szXml += "<SharpnessMode>auto</SharpnessMode><SharpnessLevel>0</SharpnessLevel></Sharpness>";
		}
		else
		{
			szXml += "<SharpnessMode>manual</SharpnessMode><SharpnessLevel>" + sliderSharpness.getValue() + "</SharpnessLevel></Sharpness>";
		}
	}
	else
	{
		szXml += "<SharpnessLevel>" + sliderSharpness.getValue() + "</SharpnessLevel></Sharpness>";
	}
	xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Sharpness",
		processData: false,
		data: xmlDoc,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetIrcutFilter
Description:	设置转换参数
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetIrcutFilter()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	//球机使用EXT版本
	if(g_bIrcutFilterExt)
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IrcutFilterExt>";
	}
	else
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IrcutFilter>";
	}
	if($("#DayNightFilterType_tr").css("display")!="none")
	{
		szXml += "<IrcutFilterType>" + $("#DayNightFilterType").val() + "</IrcutFilterType>";
	}
	if($("#DayNightFilterType").val() != "schedule" && $("#DayNightFilterType").val() != "eventTrigger")
	{
		if($("#DayToNightFilterLevel_tr").css("display")!="none")
		{
			if(g_bIrcutFilterExt)
			{
				szXml += "<nightToDayFilterLevel>" + $("#DayToNightFilterLevel").val() + "</nightToDayFilterLevel>";
			}
			else
			{
				szXml += "<IrcutFilterLevel>" + $("#DayToNightFilterLevel").val() + "</IrcutFilterLevel>";
			}
			
		}
		if(sliderDayNightFilterTime != null)
		{
			if(g_bIrcutFilterExt)
			{
				szXml += "<nightToDayFilterTime>" + sliderDayNightFilterTime.getValue() + "</nightToDayFilterTime>";
			}
			else
			{
				szXml += "<IrcutFilterTime>" + sliderDayNightFilterTime.getValue() + "</IrcutFilterTime>";
			}
		}
	}
	else
	{
		if($("#DayNightFilterType").val() == "schedule")
		{
			var szBeginTime = $("#inFilterStartTime").val();
			var iBeginTimeSec = parseInt(szBeginTime.split(":")[0], 10)*3600 + parseInt(szBeginTime.split(":")[1], 10)*60 + parseInt(szBeginTime.split(":")[2], 10);
			var szEndTime = $("#inFilterEndTime").val();
			var iEndTimeSec = parseInt(szEndTime.split(":")[0], 10)*3600 + parseInt(szEndTime.split(":")[1], 10)*60 + parseInt(szEndTime.split(":")[2], 10);
			if(iEndTimeSec - iBeginTimeSec < 10) {
				$("#SetResultTips").html(m_szErrorState + getNodeValue("jsScheduleTimeRange"));
				setTimeout(function(){$("#SetResultTips").html("");},10000);  //10秒后自动清除
				return;
			}
			szXml += "<Schedule><scheduleType>day</scheduleType><TimeRange><beginTime>"+szBeginTime+"</beginTime><endTime>"+szEndTime+"</endTime></TimeRange></Schedule>";
			$("#inFilterStartTime").blur();
			$("#inFilterEndTime").blur();
		}
		if($("#DayNightFilterType").val() == "eventTrigger")
		{
			szXml += "<EventTrigger><eventType>IO</eventType><IrcutFilterAction>"+$("#selIrcutFilterAction").val()+"</IrcutFilterAction></EventTrigger>";
		}
	}
	if(g_bIrcutFilterExt)
	{
		szXml += "</IrcutFilterExt>";
	}
	else
	{
		szXml += "</IrcutFilter>";
	}
	
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = "";
	if(g_bIrcutFilterExt)
	{
		szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/IrcutFilterExt";
	}
	else
	{
		szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/IrcutFilter";
	}
	
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetDefault
Description:	恢复默认参数
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetDefault()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	if(!confirm(getNodeValue('jsVideoDefault'), getNodeValue('jsTrue'), getNodeValue('jsFalse')))
	{
		return;
	}
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/restoreImageparam";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetShutter
Description:	设置曝光时间
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetShutter()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
"<Shutter version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
"<ShutterLevel>" + $("#Shutter").val() + "</ShutterLevel>" +
"</Shutter>";
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Shutter";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetFocus
Description:	设置聚焦模式
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetFocus()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Focus><FocusStyle>" + $("#FocusMode").val() + "</FocusStyle>";
	if($("#FocusLimited_tr").css("display") != "none")
	{
		szXml += "<FocusLimited>" + $("#FocusLimited").val() + "</FocusLimited>";
	}
	else
	{
		szXml += "<FocusLimited>1m</FocusLimited>";
	}
	szXml += "</Focus>";
	xmlDoc = parseXmlFromStr(szXml);
	
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Focus";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetExposure
Description:	设置曝光
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetExposure()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Exposure><ExposureType>" + $("#IrisMode").val() + "</ExposureType></Exposure>";
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Exposure";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		},
		success: function()
		{
			if(!window.parent.g_bIsIPDome)
			{
				$.ajax(
				{
					type: "GET",
					url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/capabilities",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0");
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					},
					success: function(xmlDoc, textStatus, xhr)
					{
						if($(xmlDoc).find('autoIrisLevel').length > 0)
						{
							isSupportAutoIrisLevel = true;
							$("#AutoIrisLevel_tr").show();
							sliderAutoIrisLevel.wsetValue(parseInt($(xmlDoc).find('autoIrisLevel').eq(0).text(), 10));
							g_transStack.push(function() { sliderAutoIrisLevel.setTitle(getNodeValue('laAutoIrisLevel') + ":" + sliderAutoIrisLevel.getValue()); }, true);
						}
						else
						{
							isSupportAutoIrisLevel = false;
						}
						if($("#IrisMode").val() != "auto" || !isSupportAutoIrisLevel)
						{
							$("#AutoIrisLevel_tr").hide();
						}
						$("#Shutter").empty();
						if($(xmlDoc).find('ShutterLevel').length > 0)
						{
							g_bSupportShutter = true;
							$("#Shutter_tr").show();
							var ShutterOptions = $(xmlDoc).find('ShutterLevel').eq(0).attr("opt").split(",");
							for(i = 0;i < ShutterOptions.length; i++)
							{
								$("<option value='"+ ShutterOptions[i] +"'>"+ ShutterOptions[i] +"</option>").appendTo("#Shutter");
							}
							var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Shutter";
							$.ajax(
							{
								type: "GET",
								beforeSend: function(xhr) {
									xhr.setRequestHeader("If-Modified-Since", "0");
									xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
								},
								url: szURL,
								success: function(xmlDocValue, textStatus, xhr)
								{
									$("#Shutter").val($(xmlDocValue).find("ShutterLevel").eq(0).text());
								}
							});
						}
					}
				});
			}
		}
	});
}
/*************************************************
Function:		SetIrisLevel
Description:	设置光圈
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetIrisLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
"<Iris version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
"<IrisLevel>" + $("#IrisLevel").val() + "</IrisLevel>" +
"</Iris>";
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Iris";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		EnableLensInit
Description:	镜头初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
function EnableLensInit()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
"<LensInitialization version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
"<enabled>" + $("#LensInitEnabled").prop("checked").toString() + "</enabled>" +
"</LensInitialization>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/LensInitialization";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetImageFlip
Description:	设置镜像翻转
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetImageFlip()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	if($("#ImageFlipStyle").val() != "false" && $("#ImageFlipStyle").val() != "true")  //设置镜像翻转方向
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<ImageFlip>" +
				"<enabled>true</enabled>" +
				"<ImageFlipStyle>" + $("#ImageFlipStyle").val() + "</ImageFlipStyle>" +
				"</ImageFlip>";
	}
	else   //禁用镜像翻转
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<ImageFlip>" +
				"<enabled>"+$("#ImageFlipStyle").val()+"</enabled>" +
				"</ImageFlip>";
	}
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/ImageFlip";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetWDR
Description:	设置宽动态
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetWDR()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	var szURL = "";
	var WDRCurValue = $("#WDREnabled").val();
	if(!window.parent.g_bIsIPDome)
	{
		if((WDRCurValue == "true") || (WDRCurValue == "auto"))
		{
			if(isSupportWDRLevel1 && isSupportWDRLevel2)
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
						"<WDR>" +
						"<enabled>" + $("#WDREnabled").val() + "</enabled>" +
						"<WDRLevel>" + sliderWDRLevel1.getValue() + ",B" + sliderWDRLevel2.getValue() + "</WDRLevel>" +
						"<WDRContrastLevel>" + sliderWDRContrastLevel.getValue() + "</WDRContrastLevel>" +
						"</WDR>";
			}
			else if(isSupportWDRLevel1 && !isSupportWDRLevel2)
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
						"<WDR>" +
						"<enabled>" + $("#WDREnabled").val() + "</enabled>" +
						"<WDRLevel>" + sliderWDRLevel1.getValue() + "</WDRLevel>" +
						"<WDRContrastLevel>" + sliderWDRContrastLevel.getValue() + "</WDRContrastLevel>" +
						"</WDR>";
			}
			else if(!isSupportWDRLevel1 && isSupportWDRLevel2)
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
						"<WDR>" +
						"<enabled>" + $("#WDREnabled").val() + "</enabled>" +
						"<WDRLevel>" + ",B" + sliderWDRLevel2.getValue() + "</WDRLevel>" +
						"<WDRContrastLevel>" + sliderWDRContrastLevel.getValue() + "</WDRContrastLevel>" +
						"</WDR>";
			}
			else
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
						"<WDR>" +
						"<enabled>" + $("#WDREnabled").val() + "</enabled>" +
						"<WDRLevel></WDRLevel>" +
						"<WDRContrastLevel>" + sliderWDRContrastLevel.getValue() + "</WDRContrastLevel>" +
						"</WDR>";
			}
		}
		else
		{
			szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
					"<WDR version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
					"<enabled>false</enabled>" +
					"</WDR>";
		}
		szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/WDR";
	}
	else
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><WDRExt><mode>" + $("#WDREnabled").val() + "</mode>";
		if((WDRCurValue == "open") || (WDRCurValue == "auto"))
		{
			if(isSupportWDRLevel1)
			{
				szXml += "<WDRLevel>" + sliderWDRLevel1.getValue() + "</WDRLevel>";
			}
			if(isSupportWDRLevel2)
			{
				szXml += "<WDRLevelExt><Level2>"+sliderWDRLevel2.getValue()+"</Level2></WDRLevelExt>";
			}
			if(isSupportWDRContrastLevel)
			{
				szXml += "<WDRContrastLevel>"+sliderWDRContrastLevel.getValue()+"</WDRContrastLevel>";
			}
		}
		szXml += "</WDRExt>";
		szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/WDRExt";
	}
	xmlDoc = parseXmlFromStr(szXml); 
	
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SetBLC
Description:	设置背光补偿
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetBLC()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	if(!window.parent.g_bIsIPDome) {
		if($("#BLCMode").val() != 'false') {
			$("#WDR_tr").hide();
			$("#WDRLevel_tr1").hide();
			$("#WDRLevel_tr2").hide();
			$("#WDRContrastLevel_tr").hide();
		} else {
			if(isSupportWDR) {
				$("#WDR_tr").show();
				var bRes = false;
				var WDRCurVal = $("#WDREnabled").val();
				if((WDRCurVal == "true") || (WDRCurVal == "auto")) {
					bRes = true;
				}
				if(bRes) {
					if(isSupportWDRLevel) {
						if(isSupportWDRLevel1) {
							$("#WDRLevel_tr1").show();
						}
						if(isSupportWDRLevel2) {
							$("#WDRLevel_tr2").show();
						}
					}
					if(isSupportWDRContrastLevel) {
						$("#WDRContrastLevel_tr").show();
					}
				}
			}
		}
	}
	if($("#BLCMode").val() == "Region") {
		if(g_BLCRegionXml == null) {
			var szXml = "<?xml version='1.0' encoding='utf-8' ?><DetectionRegionInfo><videoFormat>"+m_iVideoOutNP+"</videoFormat><RegionType>roi</RegionType><ROI><HorizontalResolution>704</HorizontalResolution><VerticalResolution>"+(m_iVideoOutNP=='PAL'?576:480)+"</VerticalResolution></ROI><DisplayMode>transparent</DisplayMode><MaxRegionNum>1</MaxRegionNum></DetectionRegionInfo>";
			HWP.SetRegionInfo(szXml);
		} else {
			setBLCRegionToPlugin(g_BLCRegionXml);
			setBLCRegion();
		}
		HWP.SetDrawStatus(true);
		$("#btnSetBLCRegion").css({"position":"absolute","left":($("#BLCMode").position().left+$("#BLCMode").width()+3)+"px","top":$("#BLCMode").position().top+"px"}).show();
		return;
	} else {
		HWP.ClearRegion();
		$("#btnSetBLCRegion").hide();
	}
	var xmlDoc = null;
	var szXml = "";
	if(isSupportBLCLevel)		
	{		
		if($("#BLCMode").val() != 'false')
		{
			$("#BLCLevel_tr").show();
		}
		else
		{
			$("#BLCLevel_tr").hide();
		}
	}
	if($("#BLCMode").val() != 'false' && $("#BLCMode").val() != 'true')
	{
		if($("#BLCLevel_tr").css("display") != 'none')
		{
		    szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<BLC>" +
				"<enabled>true</enabled>" +
				"<BLCMode>" + $("#BLCMode").val() + "</BLCMode>" +
				"<BLCLevel>" + sliderBLCLevel.getValue() + "</BLCLevel>" +
				"</BLC>";
		}
		else
		{
			szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<BLC>" +
				"<enabled>true</enabled>" +
				"<BLCMode>" + $("#BLCMode").val() + "</BLCMode>" +
				"</BLC>";
		}
	}
	else
	{
		if($("#BLCLevel_tr").css("display") != 'none')
		{
			szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
					"<BLC>" +
					"<enabled>"+$("#BLCMode").val()+"</enabled>" +
					"<BLCLevel>" + sliderBLCLevel.getValue() + "</BLCLevel>" +
					"</BLC>";
		}
		else
		{
			szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
					"<BLC>" +
					"<enabled>"+$("#BLCMode").val()+"</enabled>" +
					"</BLC>";
		}
	}
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/BLC";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			
		}
	});
}
/*************************************************
Function:		SetWhiteBlance
Description:	设置白平衡
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetWhiteBlance()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	if($("#WhiteBlanceStyle").val() == "manual")
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<WhiteBlance version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
				"<enabled>true</enabled>" +
				"<WhiteBlanceStyle>" + $("#WhiteBlanceStyle").val() + "</WhiteBlanceStyle>" +
				"<WhiteBlanceRed>" + sliderWhiteBlanceRed.getValue() + "</WhiteBlanceRed>" +
				"<WhiteBlanceBlue>" + sliderWhiteBlanceBlue.getValue() + "</WhiteBlanceBlue>" +
				"</WhiteBlance>";
	}
	else
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<WhiteBlance version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
				"<WhiteBlanceStyle>" + $("#WhiteBlanceStyle").val() + "</WhiteBlanceStyle>" +
				"</WhiteBlance>";
	}
	xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/WhiteBlance",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}


/*************************************************
Function:		SetPowerLineFrequencyMode
Description:	设置视频制式
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetPowerLineFrequencyMode()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var xmlDoc = null;
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<powerLineFrequency version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
			"<powerLineFrequencyMode>" + $("#PowerLineFrequencyMode").val() + "</powerLineFrequencyMode>" +
			"</powerLineFrequency>";
	xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/powerLineFrequency";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		},
		success: function() {
			if("50hz" == $("#PowerLineFrequencyMode").val()) {
				m_iVideoOutNP = "PAL";
			} else {
				m_iVideoOutNP = "NTSC";
			}
			if($("#BLCMode").val() == "Region"){
				var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/BLC";
				$.ajax(
				{
					type: "GET",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0");
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					},
					url: szURL,
					success:function(xmlDoc, textStatus, xhr) {
						setBLCRegionToPlugin(xmlDoc);
						g_BLCRegionXml = xmlDoc;
					}
				});
			}
			$.ajax( {
				type: "GET",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("If-Modified-Since", "0");
					xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				},
				url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/capabilities",
				success: function(xmlDoc, textStatus, xhr) {
					if($(xmlDoc).find('ShutterLevel').length > 0) {
						g_bSupportShutter = true;
						$("#Shutter_tr").show();
						var ShutterOptions = $(xmlDoc).find('ShutterLevel').eq(0).attr("opt").split(",");
						$("#Shutter").empty();
						for(i = 0;i < ShutterOptions.length; i++)
						{
							$("<option value='"+ ShutterOptions[i] +"'>"+ ShutterOptions[i] +"</option>").appendTo("#Shutter");
						}
						setValueDelayIE6("Shutter", xmlDoc, "ShutterLevel");
					}
				}
			});
		}
	});
}
/*************************************************
Function:		EnableImageFlip
Description:	启用（禁用）镜像翻转 -- 已无效
Input:			无		
Output:			无
return:			无				
*************************************************/
/*
function  EnableImageFlip()
{
	//镜像翻转
	if($("#flipEnabled").prop("checked"))  //需替换
	{
		document.getElementById("ImageFlipStyle_tr").style.display = "";
		document.getElementById("ImageFlipStyle").value = m_szDefaultFlipStyle;  //能力级默认值
	}
	else
	{
		document.getElementById("ImageFlipStyle_tr").style.display = "none";
		m_szDefaultFlipStyle = document.getElementById("ImageFlipStyle").value;
	}
	SetImageFlip();
}*/


/*************************************************
Function:		EnableWDR
Description:	设置宽动态的值
Input:			无		
Output:			无
return:			无				
*************************************************/
function EnableWDR()
{
	var WDRCurVal = $("#WDREnabled").val();
	/*if((WDRCurVal == "true") || (WDRCurVal == "auto"))
	{
		$("#BLCMode").val('OFF');
	}*/
	SetWDRAndBLC();
}
/*************************************************
Function:		SetWDRAndBLC
Description:	设置宽动态与背光补偿
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetWDRAndBLC()
{
	var bRes = false;
	var WDRCurVal = $("#WDREnabled").val();
	if(!window.parent.g_bIsIPDome)
	{
		if((WDRCurVal == "true") || (WDRCurVal == "auto"))
		{
			bRes = true;
		}
	}
	else
	{
		if((WDRCurVal == "open") || (WDRCurVal == "auto"))
		{
			bRes = true;
		}
	}
	//宽动态
	if(bRes)
	{
		if(isSupportWDRLevel)
		{
			if(isSupportWDRLevel1)
			{
				$("#WDRLevel_tr1").show();
			}
			if(isSupportWDRLevel2)
			{
				$("#WDRLevel_tr2").show();
			}
		}
		if(isSupportWDRContrastLevel)
		{
			$("#WDRContrastLevel_tr").show();
		}
		/*if(WDRCurVal == "auto")
		{
		    $("#WDRLevel_tr1").hide();
			$("#WDRLevel_tr2").hide();
		}*/
		if(!window.parent.g_bIsIPDome)
		{
			$("#BLCMode_tr").hide();
			$("#BLCLevel_tr").hide();
		}
	}
	else
	{
		$("#WDRLevel_tr1").hide();
		$("#WDRLevel_tr2").hide();
		$("#WDRContrastLevel_tr").hide();
		if(!window.parent.g_bIsIPDome)
		{
			if(isSupportBLCMode)
			{
				$("#BLCMode_tr").show();
			}
			if($("#BLCMode").val() != "false" && isSupportBLCLevel)
			{
				$("#BLCLevel_tr").show();
			}
		}
	}
	SetWDR();
	//SetBLC();
}
/*************************************************
Function:		ChangeWhiteBlance
Description:	切换白平衡模式
Input:			无		
Output:			无
return:			无				
*************************************************/
function ChangeWhiteBlance()
{
	//白平衡
	if($("#WhiteBlanceStyle").val() == "manual")
	{
		if(isSupportWhiteBlanceBlue)
		{
			$("#WhiteBlanceBlue_tr").show();
		}
		if(isSupportWhiteBlanceRed)
		{
			$("#WhiteBlanceRed_tr").show();
		}
	}
	else
	{
		$("#WhiteBlanceBlue_tr").hide();
		$("#WhiteBlanceRed_tr").hide();
	}
	SetWhiteBlance();
}


/*************************************************
Function:		ChangeNosiseReduceExtMode
Description:	切换数字降噪模式
Input:			无		
Output:			无
return:			无				
*************************************************/
function ChangeNosiseReduceExtMode()
{
	var szNosiseReduceMode = $("#NosiseReduceExtMode").val();
	if(szNosiseReduceMode == "general")  			//普通模式
	{
		$("#GeneralLevel_tr").show();
		$("#InterFrameNoiseReduceLevel_tr").hide();
		$("#FrameNoiseReduceLevel_tr").hide();
	}
	else if(szNosiseReduceMode == "advanced")		//专家模式
	{
		$("#GeneralLevel_tr").hide();
		$("#InterFrameNoiseReduceLevel_tr").show();
		$("#FrameNoiseReduceLevel_tr").show();
	}
	else											//关闭
	{
		$("#GeneralLevel_tr").hide();
		$("#InterFrameNoiseReduceLevel_tr").hide();
		$("#FrameNoiseReduceLevel_tr").hide();
	}
	
	SetNosiseReduceExt();
}

/*************************************************
Function:		SetNosiseReduceExt
Description:	设置数字降噪
Input:			无		
Output:			无
return:			无				
*************************************************/
function SetNosiseReduceExt()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szNosiseReduceExtMode = $("#NosiseReduceExtMode").val();
	var xmlDoc = null;
	var szXml = "";
	if(szNosiseReduceExtMode == "general")   		//普通模式
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<NoiseReduceExt version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
				"<mode>general</mode>" +
				"<GeneralMode>" + 
				"<generalLevel>" + generalLevel.getValue() + "</generalLevel>" + 
				"</GeneralMode>" +
				"</NoiseReduceExt>";
	}
	else if(szNosiseReduceExtMode == "advanced")   //专家模式
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<NoiseReduceExt version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
				"<mode>advanced</mode>" +
				"<AdvancedMode>" + 
				"<FrameNoiseReduceLevel>" + frameNoiseReduceLevel.getValue() + "</FrameNoiseReduceLevel>" + 
				"<InterFrameNoiseReduceLevel>" + interFrameNoiseReduceLevel.getValue() + "</InterFrameNoiseReduceLevel>" + 
				"</AdvancedMode>" +
				"</NoiseReduceExt>";
	}
	else										   //关闭
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				"<NoiseReduceExt version='1.0' xmlns='urn:selfextension:psiaext-ver10-xsd'>" +
				"<mode>close</mode>" +
				"</NoiseReduceExt>";
	}
	xmlDoc = parseXmlFromStr(szXml); 
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/NoiseReduceExt";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		InitSlider
Description:	初始化预览页面滑动条
Input:			无
Output:			无
return:			无
*************************************************/
function InitSlider()
{
	sliderBright = new neverModules.modules.slider(
	{targetId: "VideoBright",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderBright.create();
	//sliderBright.wsetValue(50);
	
	sliderBright.onchange = function ()
	{
		sliderBright.setTitle(getNodeValue('laBrightness') + ':' + sliderBright.getValue());
	};
	sliderBright.onend = function ()
	{	
		SetVideoParamColor();
	};
	
	sliderContrast = new neverModules.modules.slider(
	{targetId: "VideoContrast",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderContrast.create();
	//sliderContrast.wsetValue(50);
	
	sliderContrast.onchange = function ()
	{
		sliderContrast.setTitle(getNodeValue('laContrast') + ':' + sliderContrast.getValue());
	};
	sliderContrast.onend = function ()
	{	
		SetVideoParamColor();
	};
	
	sliderSaturation = new neverModules.modules.slider(
	{targetId: "VideoSaturation",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderSaturation.create();
	//sliderSaturation.wsetValue(50);
	
	sliderSaturation.onchange = function ()
	{
		sliderSaturation.setTitle(getNodeValue('laSaturation') + ':' + sliderSaturation.getValue());
	};
	sliderSaturation.onend = function ()
	{
		SetVideoParamColor();
	};
	
	sliderHue = new neverModules.modules.slider(
	{targetId: "VideoHue",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderHue.create();
	//sliderHue.wsetValue(50);
	
	sliderHue.onchange = function ()
	{
		sliderHue.setTitle(getNodeValue('laHue') + ':' + sliderHue.getValue());
	};
	sliderHue.onend = function ()
	{	
		SetVideoParamColor();
	};
	
	sliderGain = new neverModules.modules.slider(
	{targetId: "VideoGain",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderGain.create();
	sliderGain.wsetValue(50);
	
	sliderGain.onchange = function ()
	{
		sliderGain.setTitle(getNodeValue('laGain') + ':' + sliderGain.getValue());
	};
	sliderGain.onend = function ()
	{	
		SetVideoGain();
	};
	
	sliderSharpness = new neverModules.modules.slider(
	{targetId: "Sharpness",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderSharpness.create();
	//sliderBright.wsetValue(50);
	
	sliderSharpness.onchange = function ()
	{
		sliderSharpness.setTitle(getNodeValue('laSharpness') + ':' + sliderSharpness.getValue());
	};
	sliderSharpness.onend = function ()
	{	
		SetSharpness();
	};
	
	sliderWDRLevel1 = new neverModules.modules.slider(
	{targetId: "WDRLevel1",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderWDRLevel1.create();
	//sliderBright.wsetValue(50);
	
	sliderWDRLevel1.onchange = function ()
	{
		sliderWDRLevel1.setTitle(getNodeValue('laWDRLevel1') + ':' + sliderWDRLevel1.getValue());
	};
	sliderWDRLevel1.onend = function ()
	{	
		SetWDR();
	};
	
	sliderWDRLevel2 = new neverModules.modules.slider(
	{targetId: "WDRLevel2",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderWDRLevel2.create();
	//sliderBright.wsetValue(50);
	
	sliderWDRLevel2.onchange = function ()
	{
		sliderWDRLevel2.setTitle(getNodeValue('laWDRLevel2') + ':' + sliderWDRLevel2.getValue());
	};
	sliderWDRLevel2.onend = function ()
	{	
		SetWDR();
	};
	
	sliderWDRContrastLevel = new neverModules.modules.slider(
	{targetId: "WDRContrastLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderWDRContrastLevel.create();
	//sliderBright.wsetValue(50);
	
	sliderWDRContrastLevel.onchange = function ()
	{
		sliderWDRContrastLevel.setTitle(getNodeValue('laWDRContrast') + ':' + sliderWDRContrastLevel.getValue());
	};
	sliderWDRContrastLevel.onend = function ()
	{	
		SetWDR();
	};
	
	sliderBLCLevel = new neverModules.modules.slider(
	{targetId: "BLCLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderBLCLevel.create();
	//sliderBright.wsetValue(50);
	
	sliderBLCLevel.onchange = function ()
	{
		sliderBLCLevel.setTitle(getNodeValue('laBLCLevel') + ':' + sliderBLCLevel.getValue());
	};
	sliderBLCLevel.onend = function ()
	{	
		SetBLC();
	};
	
	generalLevel = new neverModules.modules.slider(
	{targetId: "GeneralLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	generalLevel.create();
	
	generalLevel.onchange = function ()
	{
		generalLevel.setTitle(getNodeValue('laGeneralLevel') + ':' + generalLevel.getValue());
	};
	generalLevel.onend = function ()
	{	
		SetNosiseReduceExt();
	};
	
	interFrameNoiseReduceLevel = new neverModules.modules.slider(
	{targetId: "InterFrameNoiseReduceLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	interFrameNoiseReduceLevel.create();
	
	interFrameNoiseReduceLevel.onchange = function ()
	{
		interFrameNoiseReduceLevel.setTitle(getNodeValue('laInterFrameNoiseReduce') + ':' + interFrameNoiseReduceLevel.getValue());
	};
	interFrameNoiseReduceLevel.onend = function ()
	{	
		SetNosiseReduceExt();
	};
	
	frameNoiseReduceLevel = new neverModules.modules.slider(
	{targetId: "FrameNoiseReduceLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	frameNoiseReduceLevel.create();
	
	frameNoiseReduceLevel.onchange = function ()
	{
		frameNoiseReduceLevel.setTitle(getNodeValue('laFrameNoiseReduce') + ':' + frameNoiseReduceLevel.getValue());
	};
	frameNoiseReduceLevel.onend = function ()
	{	
		SetNosiseReduceExt();
	};
	
	sliderAutoIrisLevel = new neverModules.modules.slider(
	{targetId: "AutoIrisLevel",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	sliderAutoIrisLevel.create();
	
	sliderAutoIrisLevel.onchange = function ()
	{
		sliderAutoIrisLevel.setTitle(getNodeValue('laAutoIrisLevel') + ':' + sliderAutoIrisLevel.getValue());
	};
	sliderAutoIrisLevel.onend = function ()
	{	
		SetAutoIrisLevel();
	};
	//去雾等级
	g_oSliderDehazeLevel = new neverModules.modules.slider(
	{targetId: "dvDehazeLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderDehazeLevel.create();
	
	g_oSliderDehazeLevel.onchange = function ()
	{
		g_oSliderDehazeLevel.setTitle(getNodeValue('laDehazeLevel') + ':' + g_oSliderDehazeLevel.getValue());
	};
	g_oSliderDehazeLevel.onend = function ()
	{	
		SetDehaze();
	};
	//色彩抑制
	g_oSliderCSLevel = new neverModules.modules.slider(
	{targetId: "dvCSLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderCSLevel.create();
	
	g_oSliderCSLevel.onchange = function ()
	{
		g_oSliderCSLevel.setTitle(getNodeValue('laChromaSuppress') + ':' + g_oSliderCSLevel.getValue());
	};
	g_oSliderCSLevel.onend = function ()
	{	
		setCSLevel();
	};
	
	//曝光补偿
	g_oSliderExpCompLevel = new neverModules.modules.slider(
	{targetId: "dvExpCompLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderExpCompLevel.create();
	
	g_oSliderExpCompLevel.onchange = function ()
	{
		g_oSliderExpCompLevel.setTitle(getNodeValue('laExpComp') + ':' + g_oSliderExpCompLevel.getValue());
	};
	g_oSliderExpCompLevel.onend = function ()
	{	
		setExpCompLevel();
	};
	//电子防抖等级
	g_oSliderEISLevel = new neverModules.modules.slider(
	{targetId: "dvEISLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderEISLevel.create();
	
	g_oSliderEISLevel.onchange = function ()
	{
		g_oSliderEISLevel.setTitle(getNodeValue('laEISLevel') + ':' + g_oSliderEISLevel.getValue());
	};
	g_oSliderEISLevel.onend = function ()
	{	
		setEISLevel();
	};
	//伽马校正等级
	g_oSliderGamaCorrLevel = new neverModules.modules.slider(
	{targetId: "dvGamaCorrectLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderGamaCorrLevel.create();
	
	g_oSliderGamaCorrLevel.onchange = function ()
	{
		g_oSliderGamaCorrLevel.setTitle(getNodeValue('laGamaCorrect') + ':' + g_oSliderGamaCorrLevel.getValue());
	};
	g_oSliderGamaCorrLevel.onend = function ()
	{	
		setGamaCorrLevel();
	};
	//红外灯亮度
	g_oIRLightBrightSlider = new neverModules.modules.slider(
	{targetId: "dvIRLightBrightSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oIRLightBrightSlider.create();
	
	g_oIRLightBrightSlider.onchange = function ()
	{
		g_oIRLightBrightSlider.setTitle(getNodeValue('laIRLightBright') + ':' + g_oIRLightBrightSlider.getValue());
	};
	g_oIRLightBrightSlider.onend = function ()
	{	
		setIR();
	};
	//红外灯灵敏度
	g_oIRLightSenSlider = new neverModules.modules.slider(
	{targetId: "dvIRLightSenSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oIRLightSenSlider.create();
	
	g_oIRLightSenSlider.onchange = function ()
	{
		g_oIRLightSenSlider.setTitle(getNodeValue('laIRLightSen') + ':' + g_oIRLightSenSlider.getValue());
	};
	g_oIRLightSenSlider.onend = function ()
	{	
		setIR();
	};
	//低照度增强
	/*g_oSliderEnhancementLevel = new neverModules.modules.slider(
	{targetId: "dvEnhancementLevelSlider",
	sliderCss: "imageslider1",
	barCss: "imageBar2",
	boxCss: "boxBar",
	bBox:true,
	min: 0,
	max: 100,
	hints:""
	}); 
	g_oSliderEnhancementLevel.create();
	
	g_oSliderEnhancementLevel.onchange = function ()
	{
		g_oSliderEnhancementLevel.setTitle(getNodeValue('laEnhancement') + ':' + g_oSliderEnhancementLevel.getValue());
	};
	g_oSliderEnhancementLevel.onend = function ()
	{	
		SetEnhancement();
	};*/
}
/*************************************************
Function:		ToResetimage
Description:	机芯复位
Input:			无			
Output:			无
return:			无				
*************************************************/
function ToResetimage()
{
	if(!confirm(getNodeValue('jsResetimage')))
	{
		return;
	}
	else
	{
		ToResetimage1();
	}
}
function ToResetimage1()
{
	szXmlhttp = new getXMLHttpRequest();   
	szXmlhttp.onreadystatechange = ToResetimageCallBack;   
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/resetImage";
	szXmlhttp.open("PUT", szURL, true); 
	szXmlhttp.setRequestHeader("If-Modified-Since","0");  
	szXmlhttp.setRequestHeader("Authorization",  "Basic " + m_szUserPwdValue);
	szXmlhttp.send(null); 
}

function ToResetimageCallBack()
{
	var szTips1 = getNodeValue('jsResetSucceed'); 
	var szTips2 = getNodeValue('jsResetFailed'); 
	var szTips3 = getNodeValue('jsResetWaiting');
	
	var szPic = "<img src='../images/config/wait.gif' class='verticalmiddle'>&nbsp;";
	$("#SetResultTips").html(szPic+szTips3);
	
	if(szXmlhttp.readyState == 4)
	{   
		if(szXmlhttp.status == 403)
		{
			szRetInfo = m_szErrorState + m_szError8;
		}else if(szXmlhttp.status == 200)
		{
			var xmlDoc = parseXmlFromStr(szXmlhttp.responseText);
			
			if("1" == xmlDoc.documentElement.getElementsByTagName('statusCode')[0].childNodes[0].nodeValue)
			{
				szRetInfo = m_szSuccessState + szTips1;
			}
			else
			{
				szRetInfo = m_szErrorState + szTips2;
			}
		}
		else
		{
			szRetInfo = m_szErrorState + m_szError9;
		}
		$("#SetResultTips").html(szRetInfo); 
	}
}
/*************************************************
Function:		ToRestoreimage()
Description:	恢复机芯默认值
Input:			无			
Output:			无
return:			无				
*************************************************/
function ToRestoreimage()
{
	if(!confirm(getNodeValue('jsRestoreimage')))
	{
		return;
	}
	else
	{
		ToRestoreimage1();
	}
}
function ToRestoreimage1()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/restoreImageparam";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		complete:function(xhr, textStatus)
		{
			var szTips1 = getNodeValue('jsRestoreSucceed'); 
			var szTips2 = getNodeValue('jsRestoreFailed'); 
			var szTips3 = getNodeValue('jsRestoreWaiting'); 
			
			var szPic = "<img src='../images/config/wait.gif' class='verticalmiddle'>&nbsp;";
			$("#SetResultTips").html(szPic+szTips3);
			
			if(xhr.status == 403)
			{
				szRetInfo = m_szErrorState + m_szError8;
			}
			else if(xhr.status == 200)
			{
				var xmlDoc = xhr.responseXML;
				if("1" == xmlDoc.documentElement.getElementsByTagName('statusCode')[0].childNodes[0].nodeValue)
				{
					szRetInfo = m_szSuccessState + szTips1;
				}
				else
				{
					szRetInfo = m_szErrorState + szTips2;
				}
			}
			else
			{
				szRetInfo = m_szErrorState + m_szError9;
			}
			$("#SetResultTips").html(szRetInfo);
		}
	});
}
/************************************************
Function:		SetDSS
Description:	设置低照度电子快门
Input:			无			
Output:			无
return:			无				
************************************************/
function SetDSS()
{	
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
    var XmlDoc = new createxmlDoc();
	var Instruction = XmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlDoc.appendChild(Instruction);
	var Root = XmlDoc.createElement("DSS");
	
	Element = XmlDoc.createElement("enabled");

	if($("#DSSEnabled").prop("checked"))
	{
		text = XmlDoc.createTextNode("true");
	    Element.appendChild(text);
		$("#DSSLevel").prop("disabled",false);
	}
	else
	{
		text = XmlDoc.createTextNode("false");
	    Element.appendChild(text);
		$("#DSSLevel").prop("disabled",true);
	}
	Root.appendChild(Element);
	
	if(DSSLevelEnabled)
	{
		Element = XmlDoc.createElement("DSSLevel");
		text = XmlDoc.createTextNode($("#DSSLevel").val());
	    Element.appendChild(text);
		Root.appendChild(Element);
	}
	
	XmlDoc.appendChild(Root);
	 
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/DSS";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: XmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setEPTZEnable
Description:	设置是否启用电子云台
Input:			无			
Output:			无
return:			无				
************************************************/
function SetEPTZEnable()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><EPTZ version='1.0'><enabled>" + $("#selEPTZEnable").val() + "</enabled></EPTZ>";
	var xmlDoc = parseXmlFromStr(szXml); 
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/EPTZ";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		SetScene
Description:	设置室内外模式
Input:			无			
Output:			无
return:			无				
************************************************/
function SetScene()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Scene><mode>" + $("#selScene").val() + "</mode></Scene>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Scene";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		SetAutoIrisLevel
Description:	设置自动光圈灵敏度
Input:			无			
Output:			无
return:			无				
************************************************/
function SetAutoIrisLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Exposure><ExposureType>auto</ExposureType><autoIrisLevel>" + sliderAutoIrisLevel.getValue() + "</autoIrisLevel></Exposure>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Exposure";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		SetDehaze
Description:	设置去雾
Input:			无			
Output:			无
return:			无				
************************************************/
function SetDehaze()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?><Dehaze><enabled>"+$("#chEnableDehaze").prop("checked").toString()+"</enabled>";
	if(g_IsSupportDehazeLevel)
	{
   		szXml += "<dehazeLevel>" + g_oSliderDehazeLevel.getValue() + "</dehazeLevel>";
	}
    szXml += "</Dehaze>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/dehaze",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setZoomLimit
Description:	设置变倍限制
Input:			无			
Output:			无
return:			无				
************************************************/
function setZoomLimit()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?><ZoomLimit><ZoomLimitRatio>" + $("#selZoomLimit").val() + "</ZoomLimitRatio></ZoomLimit>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/ZoomLimit",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setEISLevel
Description:	设置电子防抖等级
Input:			无			
Output:			无
return:			无				
************************************************/
function setEISLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	if($("#dvEISLevel").css("display") != "none")
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><EIS><enabled>"+$("#inEnableEIS").prop("checked").toString()+"</enabled><EISLevel>" + g_oSliderEISLevel.getValue() + "</EISLevel></EIS>";
	}
	else
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><EIS><enabled>"+$("#inEnableEIS").prop("checked").toString()+"</enabled></EIS>";
	}
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/EIS",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setCSLevel
Description:	色彩抑制等级
Input:			无			
Output:			无
return:			无				
************************************************/
function setCSLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?><ChromaSuppress><enabled>true</enabled><ChromaSuppressLevel>" + g_oSliderCSLevel.getValue() + "</ChromaSuppressLevel></ChromaSuppress>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/ChromaSuppress",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setHLCLevel
Description:	强光抑制等级
Input:			无			
Output:			无
return:			无				
************************************************/
function setHLCLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	if("true" == $("#selEnableHLC").val()) {
		if($("#dvHLCLevelSlider").html() == "" || g_oSliderHLCLevel === null) {
			szXml = "<?xml version='1.0' encoding='UTF-8'?><HLC><enabled>true</enabled></HLC>";
		} else {
			$("#dvHLCLevel").show();
			szXml = "<?xml version='1.0' encoding='UTF-8'?><HLC><enabled>true</enabled><HLCLevel>" + g_oSliderHLCLevel.getValue() + "</HLCLevel></HLC>";
		}
	} else {
		$("#dvHLCLevel").hide();
		szXml = "<?xml version='1.0' encoding='UTF-8'?><HLC><enabled>false</enabled></HLC>";
	}
	
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/HLC",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setExpCompLevel
Description:	曝光补偿等级
Input:			无			
Output:			无
return:			无				
************************************************/
function setExpCompLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?><ExpComp><enabled>true</enabled><ExpCompLevel>" + g_oSliderExpCompLevel.getValue() + "</ExpCompLevel></ExpComp>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/ExpComp",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setIR
Description:	设置红外灯
Input:			无			
Output:			无
return:			无				
************************************************/
function setIR()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "";
	if($("#selIRLightMode").val() == "auto")
	{
		$("#dvIRLightBright").hide();
		$("#dvIRLightSen").show();
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IrLight><mode>auto</mode><sensitivityLevel>" + g_oIRLightSenSlider.getValue() + "</sensitivityLevel></IrLight>";
	}
	else
	{
		$("#dvIRLightBright").show();
		$("#dvIRLightSen").hide();
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IrLight><mode>manual</mode><brightnessLevel>" + g_oIRLightBrightSlider.getValue() + "</brightnessLevel></IrLight>";
	}
	
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/IrLight",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setGamaCorrLevel
Description:	设置伽马校正
Input:			无			
Output:			无
return:			无				
************************************************/
function setGamaCorrLevel()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><gammaCorrection><gammaCorrectionEnabled>true</gammaCorrectionEnabled><gammaCorrectionLevel>" + g_oSliderGamaCorrLevel.getValue() + "</gammaCorrectionLevel></gammaCorrection>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/gamaCorrection",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		SetOverExposeSuppress
Description:	设置防过曝
Input:			无			
Output:			无
return:			无				
************************************************/
function SetOverExposeSuppress()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Exposure><ExposureType>"+$("#IrisMode").val()+"</ExposureType><OverexposeSuppress><enabled>"+$("#seOverExposeSuppress").val()+"</enabled></OverexposeSuppress></Exposure>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Exposure";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		SetEnhancement
Description:	设置低照度增强等级
Input:			无			
Output:			无
return:			无				
************************************************/
function SetEnhancement()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><ImageEnhancement><enabled>"+$("#selEnableEnHancement").val()+"</enabled></ImageEnhancement>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/ImageEnhancement";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setGrayScale
Description:	设置灰度范围
Input:			无			
Output:			无
return:			无				
************************************************/
function setGrayScale()
{
	if (!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Color><grayScale><grayScaleMode>"+$("#selGrayScale").val()+"</grayScaleMode></grayScale></Color>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/Color";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/************************************************
Function:		setBLCRegionToPlugin
Description:	设置插件自定义背光补偿区域
Input:			无			
Output:			无
return:			无				
************************************************/
function setBLCRegionToPlugin(xmlDoc)
{
	var oBLCRegion = $(xmlDoc).find("BLCRegion").eq(0);
	var szXml = "<?xml version='1.0' encoding='utf-8' ?><DetectionRegionInfo><videoFormat>"+m_iVideoOutNP+"</videoFormat><RegionType>roi</RegionType><ROI><HorizontalResolution>704</HorizontalResolution><VerticalResolution>"+(m_iVideoOutNP=='PAL'?576:480)+"</VerticalResolution></ROI><DisplayMode>transparent</DisplayMode><MaxRegionNum>1</MaxRegionNum><DetectionRegionList><DetectionRegion><RegionCoordinatesList><RegionCoordinates><positionX>"+oBLCRegion.find("positionX").eq(0).text()+"</positionX><positionY>"+(oBLCRegion.find("positionY").eq(0).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+oBLCRegion.find("positionX").eq(3).text()+"</positionX><positionY>"+(oBLCRegion.find("positionY").eq(3).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+oBLCRegion.find("positionX").eq(2).text()+"</positionX><positionY>"+(oBLCRegion.find("positionY").eq(2).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+oBLCRegion.find("positionX").eq(1).text()+"</positionX><positionY>"+(oBLCRegion.find("positionY").eq(1).text())+"</positionY></RegionCoordinates></RegionCoordinatesList></DetectionRegion></DetectionRegionList></DetectionRegionInfo>";
	HWP.SetRegionInfo(szXml);
}
/************************************************
Function:		setBLCRegion
Description:	设置自定义背光补偿区域
Input:			无			
Output:			无
return:			无				
************************************************/
function setBLCRegion()
{
	var szAreaXml = HWP.GetRegionInfo();
	var oAreaXml = parseXmlFromStr(szAreaXml);
	if($(oAreaXml).find("RegionCoordinatesList").length > 0){
		var szXml = "<?xml version='1.0' encoding='utf-8' ?><BLC><enabled>true</enabled><BLCMode>Region</BLCMode>";
		if($("#BLCLevel_tr").css("display") != 'none')
		{
			szXml += "<BLCLevel>" + sliderBLCLevel.getValue() + "</BLCLevel>";
		}
		szXml += "<BLCRegionList><BLCRegion><id>1</id><RegionCoordinatesList><RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(0).text()+"</positionX><positionY>"+($(oAreaXml).find("positionY").eq(0).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(3).text()+"</positionX><positionY>"+($(oAreaXml).find("positionY").eq(3).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(2).text()+"</positionX><positionY>"+($(oAreaXml).find("positionY").eq(2).text())+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(1).text()+"</positionX><positionY>"+($(oAreaXml).find("positionY").eq(1).text())+"</positionY></RegionCoordinates></RegionCoordinatesList></BLCRegion></BLCRegionList>";
		szXml += "</BLC>"
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/BLC";
		$.ajax(
		{
			type: "PUT",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			processData: false,
			data: xmlDoc,
			complete:function(xhr, textStatus){
				SaveState(xhr);
			},
			success:function() {
				g_BLCRegionXml = xmlDoc;
			}
		});
	}
}
/************************************************
Function:		CreateTimePicker
Description:	创建时间选择器
Input:			callback 确认回调函数			
Output:			无
return:			无				
************************************************/
function CreateTimePicker(event, callback)
{
	var szLanguage = '';
	if(parent.translator.szCurLanguage == 'zh')
	{
		szLanguage = 'zh-cn';
	}
	else
	{
		$.each(parent.translator.languages, function(i) {
			    if (this.value === parent.translator.szCurLanguage) {
				    szLanguage = this.value;
			    }
		});
		if(szLanguage === '') {
			szLanguage = 'en';
		}
	}
	WdatePicker({dateFmt:'HH:mm:ss',alwaysUseStartDate:false,readOnly:true,lang:szLanguage,onpicked:callback});
}