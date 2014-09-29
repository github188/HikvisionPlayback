var g_oXmlCapturePlan = null;
var g_iTimingIntervalMin = 0;
var g_iTimingIntervalMax = 0;
var g_iEventIntervalMin = 0;
var g_iEventIntervalMax = 0;
var g_iTimingInterval = 0;
var g_iEventInterval = 0;
var g_iEventCaptureNumMin = 0;
var g_iEventCaptureNumMax = 0;
var g_iEventCaptureNumDef = 0;

/*************************************************
Function:		EnableTimingCapture
Description:	启用定时抓图
Input:			无
Output:			无
return:			无
*************************************************/
function EnableTimingCapture()
{
    if($('#IsUseTimingCapture').prop('checked'))
	{
	    $('#selectTimingPictureCodecType').prop('disabled', false);
		$('#selectTimingPictureResolution').prop('disabled', false);
		$('#selectTimingPictureQuality').prop('disabled', false);
		$('#inputTimingCaptureInterval').prop('disabled', false);
		$('#selectTimingTimeUnit').prop('disabled', false);
	}
	else
	{
	    $('#selectTimingPictureCodecType').prop('disabled', true);
		$('#selectTimingPictureResolution').prop('disabled', true);
		$('#selectTimingPictureQuality').prop('disabled', true);
		$('#inputTimingCaptureInterval').prop('disabled', true);
		$('#selectTimingTimeUnit').prop('disabled', true);
		$('#spanTimingCaptureIntervalTips').html('');
	}
}
/*************************************************
Function:		EnableEventCapture
Description:	启用事件抓图
Input:			无
Output:			无
return:			无
*************************************************/
function EnableEventCapture()
{
    if($('#IsUseEventCapture').prop('checked'))
	{
	    $('#selectEventPictureCodecType').prop('disabled', false);
		$('#selectEventPictureResolution').prop('disabled', false);
		$('#selectEventPictureQuality').prop('disabled', false);
		$('#inputEventCaptureInterval').prop('disabled', false);
		$('#selectEventTimeUnit').prop('disabled', false);
		$("#inCaptureNum").prop('disabled', false);
	}
	else
	{
	    $('#selectEventPictureCodecType').prop('disabled', true);
		$('#selectEventPictureResolution').prop('disabled', true);
		$('#selectEventPictureQuality').prop('disabled', true);
		$('#inputEventCaptureInterval').prop('disabled', true);
		$('#selectEventTimeUnit').prop('disabled', true);
		$('#spanEventCaptureIntervalTips').html('');
		$("#inCaptureNum").prop('disabled', true);
	}
}
/*************************************************
Function:		getCapturePlanAbility
Description:	获取抓图计划能力
Input:			无
Output:			无
return:			无
*************************************************/
function getCapturePlanAbility()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Snapshot/channels/1/capabilities",
		async: false,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureCodecType').length > 0)
			{
				var timingCaptureOptions = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureCodecType')[0].getAttribute("opt").split(",");
				$('#selectTimingPictureCodecType').empty();
			    for(var i = 0;i < timingCaptureOptions.length; i++)
			    {
				    $("<option value='"+ timingCaptureOptions[i] +"'>"+ timingCaptureOptions[i] +"</option>").appendTo("#selectTimingPictureCodecType");
			    }				
			}
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureWidth').length > 0)
			{
			    var pictrureResolutionW = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureWidth')[0].getAttribute("opt").split(",");			
			}
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureHeight').length > 0)
			{
				var pictrureResolutionY = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureHeight')[0].getAttribute("opt").split(",");				
			}
			var szOptionInfo = "";
			$('#selectTimingPictureResolution').empty();
			for(var i = 0;i < pictrureResolutionW.length; i++)
			{
			    szOptionInfo += "<option value ='"+pictrureResolutionW[i] +"*"+pictrureResolutionY[i]+"'>"+pictrureResolutionW[i] +"*"+pictrureResolutionY[i]+"</option>";
			}
			$(szOptionInfo).appendTo("#selectTimingPictureResolution");
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('quality').length > 0)
			{
				var timingCaptureOptions = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('quality')[0].getAttribute("opt").split(",");
				var strTimingCaptureOptions;
				$('#selectTimingPictureQuality').empty();
			    for(var i = 0;i < timingCaptureOptions.length; i++)
			    {
				    strTimingCaptureOptions = getNodeValue('BlockSensitiveOpt' + (i+1));	
					$("<option name='BlockSensitiveOpt" + (i + 1) + "' value='"+ timingCaptureOptions[i] +"'>"+ strTimingCaptureOptions +"</option>").appendTo("#selectTimingPictureQuality");
			    }
			}
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval').length > 0)
			{
				g_iTimingIntervalMin = parseInt(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval')[0].getAttribute("min"), 10);
				g_iTimingIntervalMax = parseInt(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval')[0].getAttribute("max"), 10);
				g_iTimingIntervalMinTmp = g_iTimingIntervalMin;
                g_iTimingIntervalMaxTmp = g_iTimingIntervalMax;
			}
			//定时抓图数量
			if($(xmlDoc).find('timingCapture').eq(0).find('captureNumber').length > 0)
			{
				$("#dvCaptureNum").show();
				var oCaptureNumberCab = $(xmlDoc).find('timingCapture').eq(0).find('captureNumber').eq(0);
				g_iEventCaptureNumMin = parseInt(oCaptureNumberCab.attr("min"));
				g_iEventCaptureNumMax = parseInt(oCaptureNumberCab.attr("max"));
				g_iEventCaptureNumDef = parseInt(oCaptureNumberCab.attr("def"));
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureCodecType').length > 0)
			{
				var eventCaptureOptions = xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureCodecType')[0].getAttribute("opt").split(",");
				$('#selectEventPictureCodecType').empty();
			    for(var i = 0;i < eventCaptureOptions.length; i++)
			    {
				    $("<option value='"+ eventCaptureOptions[i] +"'>"+ eventCaptureOptions[i] +"</option>").appendTo("#selectEventPictureCodecType");
			    }				
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureWidth').length > 0)
			{
				var pictrureResolutionW = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureWidth')[0].getAttribute("opt").split(",");
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureHeight').length > 0)
			{
				var pictrureResolutionY = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureHeight')[0].getAttribute("opt").split(",");			
			}
			var szOptionInfo = "";
			$('#selectEventPictureResolution').empty();
			for(var i = 0;i < pictrureResolutionW.length; i++)
			{
			    szOptionInfo += "<option value ='"+pictrureResolutionW[i] +"*"+pictrureResolutionY[i]+"'>"+pictrureResolutionW[i] +"*"+pictrureResolutionY[i]+"</option>";
			}
			$(szOptionInfo).appendTo("#selectEventPictureResolution");	
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('quality').length > 0)
			{
				var eventCaptureOptions = xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('quality')[0].getAttribute("opt").split(",");
				var strEventCaptureOptions;
				$('#selectEventPictureQuality').empty();
			    for(var i = 0;i < eventCaptureOptions.length; i++)
			    {
					strEventCaptureOptions = getNodeValue('BlockSensitiveOpt' + (i+1));	
					$("<option name='BlockSensitiveOpt" + (i + 1) + "' value='"+ eventCaptureOptions[i] +"'>"+ strEventCaptureOptions +"</option>").appendTo("#selectEventPictureQuality");
			    }
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval').length > 0)
			{
				g_iEventIntervalMin = parseInt(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval')[0].getAttribute("min"), 10);
				g_iEventIntervalMax = parseInt(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval')[0].getAttribute("max"), 10);
				g_iEventIntervalMinTmp = g_iEventIntervalMin;
                g_iEventIntervalMaxTmp = g_iEventIntervalMax;
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			
		}
	});
}
/*************************************************
Function:		getCapturePlanInfo
Description:	获取抓图计划信息
Input:			无
Output:			无
return:			无
*************************************************/
function getCapturePlanInfo()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Snapshot/channels/1",
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_oXmlCapturePlan = xmlDoc;
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('enabled').length > 0)
			{
				if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('enabled')[0].childNodes[0].nodeValue == "true")
				{
				    $('#IsUseTimingCapture').prop('checked', true);	
				}
				else
				{
				    $('#IsUseTimingCapture').prop('checked', false);		
				}
			}			
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureCodecType').length > 0)
			{
				$('#selectTimingPictureCodecType').val(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureCodecType')[0].childNodes[0].nodeValue);
				
			}
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureWidth').length > 0)
			{
			    var pictureResolutionX = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureWidth')[0].childNodes[0].nodeValue;
				var pictureResolutionY = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('pictureHeight')[0].childNodes[0].nodeValue;
				$('#selectTimingPictureResolution').val(pictureResolutionX + '*' +  pictureResolutionY);
			}
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('quality').length > 0)
			{
			    $('#selectTimingPictureQuality').val(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('quality')[0].childNodes[0].nodeValue);
			}			
			if(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval').length > 0)
			{
			    $('#inputTimingCaptureInterval').val(xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval')[0].childNodes[0].nodeValue);
				g_iTimingInterval = xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('captureInterval')[0].childNodes[0].nodeValue;
			}
			EnableTimingCapture();
			//
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('enabled').length > 0)
			{
				if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('enabled')[0].childNodes[0].nodeValue == "true")
				{
				    $('#IsUseEventCapture').prop('checked', true);	
				}
				else
				{
				    $('#IsUseEventCapture').prop('checked', false);		
				}
			}				
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureCodecType').length > 0)
			{
				$('#selectEventPictureCodecType').val(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureCodecType')[0].childNodes[0].nodeValue);
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureWidth').length > 0)
			{
			    var pictureResolutionX = xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureWidth')[0].childNodes[0].nodeValue;
				var pictureResolutionY = xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('pictureHeight')[0].childNodes[0].nodeValue;
				$('#selectEventPictureResolution').val(pictureResolutionX + '*' +  pictureResolutionY);
			}
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('quality').length > 0)
			{
			    $('#selectEventPictureQuality').val(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('quality')[0].childNodes[0].nodeValue);
			}			
			if(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval').length > 0)
			{
			    $('#inputEventCaptureInterval').val(xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval')[0].childNodes[0].nodeValue);
				g_iEventInterval = xmlDoc.documentElement.getElementsByTagName('eventCapture')[0].getElementsByTagName('captureInterval')[0].childNodes[0].nodeValue;
			}
			if($(xmlDoc).find('eventCapture').eq(0).find('captureNumber').length > 0)
			{
				var iCaptureNum = parseInt($(xmlDoc).find('eventCapture').eq(0).find('captureNumber').eq(0).text());
				$('#inCaptureNum').val(iCaptureNum < g_iEventCaptureNumMin ? g_iEventCaptureNumDef:iCaptureNum);
			}
			EnableEventCapture();

		},
		error: function(xhr, textStatus, errorThrown)
		{

		}
	});	    	
}
/*************************************************
Function:		setCapturePlanInfo
Description:	设置抓图计划
Input:			无
Output:			无
return:			无
*************************************************/
function setCapturePlanInfo()
{	
	var xmlDoc = g_oXmlCapturePlan;
	//定时抓图
	var oTimingCapture = $(xmlDoc).find('timingCapture').eq(0);
	if($('#IsUseTimingCapture').prop('checked'))
	{
		if(!CheackServerIDIntNum($('#inputTimingCaptureInterval').val(),'spanTimingCaptureIntervalTips','laCaptureInterval',g_iTimingIntervalMinTmp, g_iTimingIntervalMaxTmp, $('#selectTimingTimeUnit').find('option:selected').text()))
		{
			return;	
		}
		var pictionResolution = ($('#selectTimingPictureResolution').val()).split("*");
		oTimingCapture.find('enabled').eq(0).text("true");
		oTimingCapture.find('pictureCodecType').eq(0).text($('#selectTimingPictureCodecType').val());
		oTimingCapture.find('pictureWidth').eq(0).text(pictionResolution[0]);
		oTimingCapture.find('pictureHeight').eq(0).text(pictionResolution[1]);
		oTimingCapture.find('quality').eq(0).text($('#selectTimingPictureQuality').val());
		var iTimingCaptureInterval;
		if($('#selectTimingTimeUnit').val() == '0')
		{
			iTimingCaptureInterval = parseInt($('#inputTimingCaptureInterval').val(), 10);
		}
		if($('#selectTimingTimeUnit').val() == '1')
		{
		    iTimingCaptureInterval = parseInt($('#inputTimingCaptureInterval').val(), 10) * 1000;	
		}
		if($('#selectTimingTimeUnit').val() == '2')
		{
		    iTimingCaptureInterval = parseInt($('#inputTimingCaptureInterval').val(), 10) * 1000 * 60;	
		}
		if($('#selectTimingTimeUnit').val() == '3')
		{
		    iTimingCaptureInterval = parseInt($('#inputTimingCaptureInterval').val(), 10) * 1000 * 60 * 60;	
		}
		if($('#selectTimingTimeUnit').val() == '4')
		{
		    iTimingCaptureInterval = parseInt($('#inputTimingCaptureInterval').val(), 10) * 1000 * 60 * 60 * 24;	
		}
		oTimingCapture.find('captureInterval').eq(0).text(iTimingCaptureInterval);
	}
	else
	{
		xmlDoc.documentElement.getElementsByTagName('timingCapture')[0].getElementsByTagName('enabled')[0].childNodes[0].nodeValue = "false";
	}
	//事件抓图
	var oEventCapture = $(xmlDoc).find('eventCapture').eq(0);
	if($('#IsUseEventCapture').prop('checked'))
	{
		if(!CheackServerIDIntNum($('#inputEventCaptureInterval').val(),'spanEventCaptureIntervalTips','laCaptureInterval',g_iEventIntervalMinTmp,g_iEventIntervalMaxTmp, $('#selectEventTimeUnit').find('option:selected').text()))
		{
			return;	
		}	    
		var pictionResolution = ($('#selectEventPictureResolution').val()).split("*");
		oEventCapture.find('enabled').eq(0).text("true");
		oEventCapture.find('pictureCodecType').eq(0).text($('#selectEventPictureCodecType').val());
		oEventCapture.find('pictureWidth').eq(0).text(pictionResolution[0]);
		oEventCapture.find('pictureHeight').eq(0).text(pictionResolution[1]);
		oEventCapture.find('quality').eq(0).text($('#selectEventPictureQuality').val());
		var iEventCaptureInterval;
		if($('#selectEventTimeUnit').val() == '0')
		{
			iEventCaptureInterval = parseInt($('#inputEventCaptureInterval').val(), 10);
		}
		if($('#selectEventTimeUnit').val() == '1')
		{
		    iEventCaptureInterval = parseInt($('#inputEventCaptureInterval').val(), 10) * 1000;	
		}
		oEventCapture.find('captureInterval').eq(0).text(iEventCaptureInterval);
		if($("#dvCaptureNum").css("display") != "none")
		{
			if(!CheackServerIDIntNum($("#inCaptureNum").val(),'spEventCaptureNumTips','laCaptureNum',g_iEventCaptureNumMin,g_iEventCaptureNumMax))
			{
				return;
			}
			oEventCapture.find('captureNumber').eq(0).text($("#inCaptureNum").val());
		}
	}
	else
	{
		oEventCapture.find('enabled').eq(0).text("false");
	}	
	
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/Custom/SelfExt/Snapshot/channels/1",
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) 
		{

		},
		error:function()
		{ 
			
		},
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});	
}
/*************************************************
Function:		changeTimingUnit
Description:	改变定时时间单位
Input:			无
Output:			无
return:			无
*************************************************/
var g_iTimingIntervalMinTmp;
var g_iTimingIntervalMaxTmp;
function changeTimingUnit(oCur)
{
    if(oCur.value == "0")
	{
	    $('#inputTimingCaptureInterval').val(g_iTimingInterval);
		g_iTimingIntervalMinTmp = g_iTimingIntervalMin;
        g_iTimingIntervalMaxTmp = g_iTimingIntervalMax;;
	}
    else if(oCur.value == "1")
	{
		$('#inputTimingCaptureInterval').val(Math.ceil(g_iTimingInterval/1000));
		g_iTimingIntervalMinTmp = Math.ceil(g_iTimingIntervalMin/1000);
        g_iTimingIntervalMaxTmp = parseInt(g_iTimingIntervalMax/1000);	
	}
    else if(oCur.value == "2")
	{
		$('#inputTimingCaptureInterval').val(Math.ceil(g_iTimingInterval/(1000 * 60)));
		g_iTimingIntervalMinTmp = Math.ceil(g_iTimingIntervalMin/(1000 * 60));
        g_iTimingIntervalMaxTmp = parseInt(g_iTimingIntervalMax/(1000 * 60));		
	}
    else if(oCur.value == "3")
	{
	    $('#inputTimingCaptureInterval').val(Math.ceil(g_iTimingInterval/(1000 * 60 * 60)));
		g_iTimingIntervalMinTmp = Math.ceil(g_iTimingIntervalMin/(1000 * 60 * 60));
        g_iTimingIntervalMaxTmp = parseInt(g_iTimingIntervalMax/(1000 * 60 * 60));
	}
    else if(oCur.value == "4")
	{
	    $('#inputTimingCaptureInterval').val(Math.ceil(g_iTimingInterval/(1000 * 60 * 60 * 24)));	
		g_iTimingIntervalMinTmp = Math.ceil(g_iTimingIntervalMin/(1000 * 60 * 60 * 24));
        g_iTimingIntervalMaxTmp = parseInt(g_iTimingIntervalMax/(1000 * 60 * 60 * 24));			
	}
	$('#inputTimingCaptureInterval').focus();
	$('#inputTimingCaptureInterval').blur();
}
/*************************************************
Function:		changeEventUnit
Description:	改变事件时间单位
Input:			无
Output:			无
return:			无
*************************************************/
var g_iEventIntervalMinTmp;
var g_iEventIntervalMaxTmp;
function changeEventUnit(oCur)
{
    if(oCur.value == "0")
	{
	    $('#inputEventCaptureInterval').val(g_iEventInterval);
		g_iEventIntervalMinTmp = g_iEventIntervalMin;
        g_iEventIntervalMaxTmp = g_iEventIntervalMax;		
	}
    else if(oCur.value == "1")
	{
	    $('#inputEventCaptureInterval').val(Math.ceil(g_iEventInterval/1000));
		g_iEventIntervalMinTmp = Math.ceil(g_iEventIntervalMin/1000);
        g_iEventIntervalMaxTmp = parseInt(g_iEventIntervalMax/1000);			
	}
	$('#inputEventCaptureInterval').focus();
	$('#inputEventCaptureInterval').blur();
}