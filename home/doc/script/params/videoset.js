var g_szVideoInfoXml = "";
var g_IsSupportCodecCom = false; //是否支持编码复杂度
var AudioAndVideo = {
	tabs: null   // 保存音视频配置页面的tabs对象引用
};
/*************************************************
继承，未完成，wuyang
*************************************************/
function Video() {
	this.m_szMainStreamVideoCodecType = "H.264"; // 码流类型
	this.m_oXmlFisheye = null;
	this.m_oXmlLocalConfig = null;
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Video);
pr(Video).update = function() {
	var szInfo = parent.translator.translateNode(this.getLxd(), 'laPlugin');
	if (!checkPlugin('0', szInfo)) {
		return;
	}
	m_PreviewOCX = document.getElementById("PreviewActiveX");
	if (!CompareFileVersion()) {
		UpdateTips();
	}	
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["VideoAudio", "Video"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initVideoSetting();
}
/*************************************************
Function:		initCSS
Description:	初始化页面样式
Input:			无			
Output:			无
return:			无				
*************************************************/
pr(Video).initCSS = function() 
{
	var p = 1;
	$('#divVideo div').each(function(i)
	{
		if($(this).css('display') != 'none')
		{
			$(this).removeClass();
			if(p%2 == 1)
			{
				$(this).addClass('subparamswhite');	
			}
			else
			{
				$(this).addClass('subparamsgray');		
			}
			p++;	
		}
	});
}
/*************************************************
Function:		changeVideoCodeType
Description:	改变编码方式
Input:			无			
Output:			无
return:			无				
*************************************************/
pr(Video).changeVideoCodeType = function()
{
    if($('#videoCodecType').val() == 'H.264')
	{
		if(g_IsSupportCodecCom)
		{
			$('#CodecComplexity_tr').show();
		}
	}
	else
	{
		$('#CodecComplexity_tr').hide();
	}
	this.initCSS();	
}

function Audio() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Audio);
pr(Audio).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["VideoAudio", "Audio"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initAudio();
}
var iMinRate = 0;
var iMaxRate = 0;
var m_iResolution = "704*576";
var m_szChanStreamNum = 0;
var g_iMinIntervalFrameI = 0;
var g_iMaxIntervalFrameI = 0;
/*************************************************
Function:		GetVideoAbility
Description:	获取视频信息能力集
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVideoAbility()
{
	$("#SetResultTips").html("");
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/1" +  $('#StreamTypeIn').val() + "/capabilities",
		async: false,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			//逐行和隔行
			if($(xmlDoc).find('videoScanType').length > 0)
			{
				videoScanType = $(xmlDoc).find('videoScanType').eq(0).attr("opt").split(",");
			}
			else
			{
				videoScanType = "";
			}
			//分辨率
			document.getElementById("videoResolution").options.length = 0;
			var videoResolutionW = $(xmlDoc).find('videoResolutionWidth').eq(0).attr("opt").split(",");
			var videoResolutionY = $(xmlDoc).find('videoResolutionHeight').eq(0).attr("opt").split(",");
			var szOptionInfo = "";
			for(i = 0;i < videoResolutionW.length; i++)
			{
				 if((videoResolutionW[i] == "1920" &&  videoResolutionY[i] == "1080") || (videoResolutionW[i] == "1280" && videoResolutionY[i] == "720"))
				 {
					 if(videoScanType != "")
					 {
						 for(var j = 0; j < videoScanType.length; j++)
						 {
							 if(videoScanType[j] == "progressive")
							 {
								 szOptionInfo = "<option value ='"+videoResolutionW[i] +"*"+videoResolutionY[i]+"P'>"+videoResolutionW[i] +"*"+videoResolutionY[i]+"P</option>";
							 }
							 else if(videoScanType[j] == "interlaced")
							 {
								 szOptionInfo = "<option value ='"+videoResolutionW[i] +"*"+videoResolutionY[i]+"I'>"+videoResolutionW[i] +"*"+videoResolutionY[i]+"I</option>";
							 }
						 }
					 }
					 else
					 {
						 szOptionInfo = "<option value ='"+videoResolutionW[i] +"*"+videoResolutionY[i]+"'>"+videoResolutionW[i] +"*"+videoResolutionY[i]+"</option>";
					 }
				 }
				 else
				 {
					 szOptionInfo = "<option value ='"+videoResolutionW[i] +"*"+videoResolutionY[i]+"'>"+videoResolutionW[i] +"*"+videoResolutionY[i]+"</option>";
				 }
				 $(szOptionInfo).appendTo("#videoResolution");
			}
			
			//图像质量
			var fixedQuality = "";
			if($(xmlDoc).find('fixedQuality').eq(0).attr("opt"))
			{
				fixedQuality = $(xmlDoc).find('fixedQuality').eq(0).attr("opt").split(",");
			}
			if(fixedQuality.length > 0)
			{
				document.getElementById("fixedQuality").options.length = 0;
				var ifixedQuality = 0;
				szOptionInfo = '';
				for(i = 0;i < fixedQuality.length; i++)
				{
				   szOptionInfo += "<option value ='"+fixedQuality[i]+"' name='fixedQualityOpt"+(fixedQuality.length - i)+"'>"+getNodeValue('fixedQualityOpt'+(fixedQuality.length - i))+"</option>";
				}
				$(szOptionInfo).appendTo("#fixedQuality");
			}
			//视频帧率
			document.getElementById("maxFrameRate").options.length = 0;
			var maxFrameRate = $(xmlDoc).find('maxFrameRate').eq(0).attr("opt").split(",");
			var imaxFrameRate = 0;
			for(i = 0;i < maxFrameRate.length; i++)
			{
				imaxFrameRate = parseInt(maxFrameRate[i]);
				if(imaxFrameRate >= 100)
				{
					imaxFrameRate /= 100;
					$("<option value='"+ maxFrameRate[i] +"'>"+ imaxFrameRate +"</option>").appendTo("#maxFrameRate");
				}
				else
				{
					imaxFrameRate = Math.floor(100/imaxFrameRate);
					$("<option value='"+ maxFrameRate[i] +"'>1/"+ imaxFrameRate +"</option>").appendTo("#maxFrameRate");
				}
			}
			iMinRate = parseInt($(xmlDoc).find('constantBitRate').eq(0).attr("min"), 10);
			iMaxRate = parseInt($(xmlDoc).find('constantBitRate').eq(0).attr("max"), 10);
			
			if(iMinRate == iMaxRate)
			{
				$("#constantBitRate").prop('disabled', true);
				$("#RangeTips").html();
			}
			else
			{
				$("#constantBitRate").prop('disabled', false);
				$("#RangeTips").html("(" + getNodeValue('RangeTips') + ":" + iMinRate + "-" + iMaxRate + ")");
			}
			//码流类型
			var StreamTypeLength = document.getElementById('StreamType').length;
			if($(xmlDoc).find('Audio').length > 0)
			{
				if(StreamTypeLength == 1)
				{
					$("<option value='1'>" + getNodeValue('StreamTypeOpt2') +"</option>").appendTo("#StreamType");
				}
			}
			else
			{
				if(StreamTypeLength == 2)
				{
					document.getElementById('StreamType').remove(1);
				}
			}
			
			//编码类型
			document.getElementById("videoCodecType").options.length = 0;
			var CodecType = $(xmlDoc).find('videoCodecType').eq(0).attr("opt").split(",");
			if(window.parent.g_bIsIPDome)
			{
				$.each(CodecType, function(i, CodecTypeValue) {
					$("<option value='"+ CodecTypeValue +"'>"+ CodecTypeValue +"</option>").appendTo("#videoCodecType");
				});
			}
			else
			{
				$.each(CodecType, function(i, CodecTypeValue) {
					if($("#StreamTypeIn").val() !== "01" && ia(Video).m_szMainStreamVideoCodecType !== "MJPEG" && ia(Video).m_szMainStreamVideoCodecType !== CodecTypeValue && CodecTypeValue !== "MJPEG")
					{
						return;
					}
					$("<option value='"+ CodecTypeValue +"'>"+ CodecTypeValue +"</option>").appendTo("#videoCodecType");
				});
			}
			
			
			$("#constantBitRate").blur(function () {CheackServerIDIntNum($('#constantBitRate').val(),'MaxBitRatetips','jsCustonBitRate',iMinRate,iMaxRate);});
			//I帧间隔
			if($(xmlDoc).find('Video').eq(0).find('GovLength').length != 0)
			{
				try
				{
					g_iMinIntervalFrameI = parseInt($(xmlDoc).find('Video').eq(0).find('GovLength').eq(0).attr("min"), 10);
				}
				catch(e)
				{
					g_iMinIntervalFrameI = 1;
				}
				try
				{
					g_iMaxIntervalFrameI = parseInt($(xmlDoc).find('Video').eq(0).find('GovLength').eq(0).attr("max"), 10);
				}
				catch(e)
				{
					g_iMaxIntervalFrameI = 400; 	
				}
			}
			
			//编码复杂度
			if($(xmlDoc).find('Video').eq(0).find('H264Profile').length > 0)
			{
				g_IsSupportCodecCom = true;
				var H264Profile = $(xmlDoc).find('Video').eq(0).find('H264Profile').eq(0).attr("opt").split(",");
				$('#selectCodecComplexity').empty();
				for(i = 0;i < H264Profile.length; i++)
				{
					$("<option name='optionQuality" + (i + 1) + "' value='"+ H264Profile[i] +"'>"+ getNodeValue('optionQuality'+(i + 1)) +"</option>").appendTo("#selectCodecComplexity");
				}				
			}
			else
			{
				g_IsSupportCodecCom = false;
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{

		}
	});
} 
/*************************************************
Function:		GetVideoInfo
Description:	获取视频信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVideoInfo()
{
	g_szVideoInfoXml = "";
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/1" + $('#StreamTypeIn').val(),
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_szVideoInfoXml = xhr.responseText;
		  
			if($(xmlDoc).find('Audio').length > 0) 
			{
				var AudioEnabled = $(xmlDoc).find('Audio').eq(0).find('enabled').eq(0).text();
				if(AudioEnabled == 'true')
				{
					$("#StreamType").val('1');		
				}
				else
				{
					$("#StreamType").val('0');
				}
			}
			else
			{
				$("#StreamType").val('0');
			}
			videoBitRate = $(xmlDoc).find('videoQualityControlType').eq(0).text();
			var ivideoResolutionWidth = $(xmlDoc).find('videoResolutionWidth').eq(0).text();
			var ivideoResolutionHeight = $(xmlDoc).find('videoResolutionHeight').eq(0).text();
			if((ivideoResolutionWidth == "1920" &&  ivideoResolutionHeight == "1080") || (ivideoResolutionWidth == "1280" && ivideoResolutionHeight == "720"))
			{
				if($(xmlDoc).find('videoScanType').length > 0)
				{
					if($(xmlDoc).find('videoScanType').eq(0).text() == 'progressive')
					{
						m_iResolution = ivideoResolutionWidth +"*"+ivideoResolutionHeight + "P";
					}
					else
					{
						m_iResolution = ivideoResolutionWidth +"*"+ivideoResolutionHeight + "I";
					}
				}
				else
				{
					m_iResolution = ivideoResolutionWidth +"*"+ivideoResolutionHeight;
				}
			}
			else
			{
				m_iResolution = ivideoResolutionWidth +"*"+ivideoResolutionHeight;
			}
			$("#videoCodecType").val($(xmlDoc).find('videoCodecType').eq(0).text());	
			if("01" == $('#StreamTypeIn').val()){
				ia(Video).m_szMainStreamVideoCodecType = $("#videoCodecType").val();
			}
			  
			if(videoBitRate.toLowerCase() == "cbr")
			{
				$("#fixedQuality").val($(xmlDoc).find('fixedQuality').eq(0).text());
				BitRate = parseInt($(xmlDoc).find('constantBitRate').eq(0).text(), 10);
				$("#constantBitRate").val(BitRate);
			}
			else
			{
				$("#fixedQuality").val($(xmlDoc).find('fixedQuality').eq(0).text());//图像质量
				BitRate = parseInt($(xmlDoc).find('vbrUpperCap').eq(0).text(), 10);
				$("#constantBitRate").val(BitRate);
			}
		  
			setTimeout(function() 
			{ 
				$("#videoResolution").val(m_iResolution);//分辨率
				$("#maxFrameRate").val($(xmlDoc).find('maxFrameRate').eq(0).text());
				$("#videoQualityControlType").val($(xmlDoc).find('videoQualityControlType').eq(0).text().toLowerCase()); //位率类型
				ChangeBirateType();
			}, 1);
			
			//I帧间隔
			if($(xmlDoc).find('Video').eq(0).find('GovLength').length > 0) 
			{
				$("#IntervalFrameI_tr").show();
				$("#IntervalFrameI").val($(xmlDoc).find('Video').eq(0).find('GovLength').eq(0).text());
			}
			//编码复杂度
			if($(xmlDoc).find('Video').eq(0).find('H264Profile').length > 0) 
			{
				if($('#videoCodecType').val() == 'H.264' )
				{
					$("#CodecComplexity_tr").show();
					$("#selectCodecComplexity").val($(xmlDoc).find('Video').eq(0).find('H264Profile').eq(0).text());
				}
				else
				{
					$("#CodecComplexity_tr").hide();
				}
			}
			else
			{
				$("#CodecComplexity_tr").hide();
			}
			pr(Video).initCSS();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);
		}
	});	
}
/*************************************************
Function:		CreateVideoInfoDoc
Description:	创建视频信息xml
Input:			iNo:通道号			
Output:			无
return:			无				
*************************************************/
function CreateVideoInfoDoc()
{
	if(g_szVideoInfoXml == "")
	{
		return null;
	}
	var xmlDoc = parseXmlFromStr(g_szVideoInfoXml);
	
	var oMulticast = $(xmlDoc).find("Multicast");
	if(oMulticast.length > 0)
	{
		oMulticast.eq(0).remove();
	}
	
	var oVideo = $(xmlDoc).find("Video").eq(0);
	oVideo.find("videoCodecType").eq(0).text($('#videoCodecType').val());
	if($('#CodecComplexity_tr').css('display') != 'none')
	{
		var H264Profile = oVideo.find("H264Profile");
		if(H264Profile.length > 0)
		{
			H264Profile.eq(0).text($('#selectCodecComplexity').val());
		}
		else
		{
			oVideo.find("selfExt").eq(0).append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><H264Profile>'+$('#selectCodecComplexity').val()+'</H264Profile></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
	}
	else
	{
		oVideo.find("H264Profile").remove();
	}
	
	var oVideoScanType = oVideo.find("videoScanType");
	var videoResolution = ($('#videoResolution').val()).split("*"); 
	if($('#videoResolution').val() == '1920*1080P' || $('#videoResolution').val() == '1920*1080I' || $('#videoResolution').val() == '1280*720P' || $('#videoResolution').val() == '1280*720I')
	{
		if($('#videoResolution').val().substring($('#videoResolution').val().length - 1) == 'P')
		{
			if(oVideoScanType.length > 0)
			{
				oVideoScanType.eq(0).text("progressive");
			}
			else
			{
				oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><videoScanType>progressive</videoScanType></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
			}
		}
		else if($('#videoResolution').val().substring($('#videoResolution').val().length - 1) == 'I')
		{
			if(oVideoScanType.length > 0)
			{
				oVideoScanType.eq(0).text("interlaced");
			}
			else
			{
				oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><videoScanType>interlaced</videoScanType></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
			}
		}
		else
		{
			oVideo.find("videoScanType").eq(0).remove();
		}
	}
	else
	{
		oVideo.find("videoScanType").eq(0).remove();
	}
	oVideo.find("videoResolutionWidth").eq(0).text(videoResolution[0]);
	
	var szVideoResolutionHeight;
	if($('#videoResolution').val() == '1920*1080P' || $('#videoResolution').val() == '1920*1080I' || $('#videoResolution').val() == '1280*720P' || $('#videoResolution').val() == '1280*720I')
	{
		if($('#videoResolution').val().substring($('#videoResolution').val().length - 1) == 'P' || $('#videoResolution').val().substring($('#videoResolution').val().length - 1) == 'I')
		{
			szVideoResolutionHeight = videoResolution[1].substring(0,videoResolution[1].length - 1);
		}
		else
		{
			szVideoResolutionHeight = videoResolution[1];
		}
	}
	else
	{
	    szVideoResolutionHeight = videoResolution[1];
	}
	oVideo.find("videoResolutionHeight").eq(0).text(szVideoResolutionHeight);
	
	oVideo.find("videoQualityControlType").eq(0).text($('#videoQualityControlType').val());
	
	var BitRate = $('#constantBitRate').val();
	
	if($('#videoQualityControlType').val() == 'cbr')
	{
		var oConstantBitRate = oVideo.find("constantBitRate");
		if(oConstantBitRate.length > 0)
		{
			oConstantBitRate.eq(0).text(BitRate);
		}
		else
		{
			oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><constantBitRate>'+BitRate+'</constantBitRate></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
	}
	else
	{
		oVideo.find("constantBitRate").eq(0).remove();
		
		var oFixedQuality = oVideo.find("fixedQuality");
		if(oFixedQuality.length > 0)
		{
			oFixedQuality.eq(0).text($('#fixedQuality').val());
		}
		else
		{
			oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><fixedQuality>'+$('#fixedQuality').val()+'</fixedQuality></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
		
		var oVbrUpperCap = oVideo.find("vbrUpperCap");
		if(oVbrUpperCap.length > 0)
		{
			oVbrUpperCap.eq(0).text(BitRate);
		}
		else
		{
			oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><vbrUpperCap>'+BitRate+'</vbrUpperCap></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
		
		var oVbrLowerCap = oVideo.find("vbrLowerCap");
		if(oVbrLowerCap.length > 0)
		{
			oVbrLowerCap.eq(0).text('32');
		}
		else
		{
			oVideo.append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><vbrLowerCap>32</vbrLowerCap></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
	}
	
	oVideo.find("maxFrameRate").eq(0).text($('#maxFrameRate').val());
	if($('#IntervalFrameI_tr').css("display") != 'none')
	{
		var oKeyFrameInterval = oVideo.find("keyFrameInterval");
		if(oKeyFrameInterval.length > 0)
		{
			oKeyFrameInterval.eq(0).remove();
		}
		var oGovLength = oVideo.find("GovLength");
		if(oGovLength.length > 0)
		{
			oGovLength.eq(0).text($('#IntervalFrameI').val());
		}
		else
		{
			oVideo.find("selfExt").eq(0).append($(parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel version="1.0" xmlns="urn:psialliance-org"><GovLength>'+$('#IntervalFrameI').val()+'</GovLength></StreamingChannel>')).find("StreamingChannel").eq(0).clone().children());
		}
	}
	if(document.getElementById('StreamType').options.length == 2)
	{
		if($("#StreamType").val() == '1')
		{
			$(xmlDoc).find("Audio").eq(0).find("enabled").eq(0).text("true");
		}
		else
		{
			$(xmlDoc).find("Audio").eq(0).find("enabled").eq(0).text("false");
		}
	}
	return xmlDoc;
}
/*************************************************
Function:		SetVideoInfo
Description:	设置视频信息
Input:			iNo:通道号			
Output:			无
return:			无				
*************************************************/
function SetVideoInfo()
{
	if($('#IntervalFrameI_tr').css("display") != 'none') {
		if(!CheackServerIDIntNum($("#IntervalFrameI").val(),'IntervalFrameItips','laIntervalFrameI',g_iMinIntervalFrameI, g_iMaxIntervalFrameI)) {
			return;
		}
	}
	if(!CheackServerIDIntNum($('#constantBitRate').val(),'MaxBitRatetips','jsCustonBitRate',iMinRate,iMaxRate)) {
		return;
	}
	var xmlDoc = CreateVideoInfoDoc();
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/1" + $('#StreamTypeIn').val(),
		processData: false,
		data: xmlDoc,
		success: function(){
			if("01" == $('#StreamTypeIn').val()){
				ia(Video).m_szMainStreamVideoCodecType = $("#videoCodecType").val();
			}
			if("H.264" == $('#videoCodecType').val()) {
				$.ajax({
					type: "GET",
					url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/1" +  $('#StreamTypeIn').val() + "/capabilities",
					async: false,
					timeout: 15000,
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0");
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					},
					success: function(xmlDoc, textStatus, xhr) {
						//编码复杂度
						if($(xmlDoc).find('Video').eq(0).find('H264Profile').length > 0) {
							$("#CodecComplexity_tr").show();
							g_IsSupportCodecCom = true;
							var H264Profile = $(xmlDoc).find('Video').eq(0).find('H264Profile').eq(0).attr("opt").split(",");
							$('#selectCodecComplexity').empty();
							for(i = 0;i < H264Profile.length; i++) {
								$("<option name='optionQuality" + (i + 1) + "' value='"+ H264Profile[i] +"'>"+ getNodeValue('optionQuality'+(i + 1)) +"</option>").appendTo("#selectCodecComplexity");
							}
							$("#selectCodecComplexity").val($(xmlDoc).find('Video').eq(0).find('H264Profile').eq(0).text());
						} else {
							$("#CodecComplexity_tr").hide();
							g_IsSupportCodecCom = false;
						}
					}
				});
			}
		},
		complete: function(xhr, textStatus) {
		    SaveState(xhr);
		}
	});	
}
/*************************************************
Function:		ChangeBirateType
Description:	切换位率类型
Input:			无			
Output:			无
return:			无				
*************************************************/
function ChangeBirateType()
{
	if($("#videoQualityControlType").val() == "cbr")  //定码率
	{
		$("#fixedQuality").prop("disabled", true);    //图像质量选项无效
	}
	else
	{
		$("#fixedQuality").prop("disabled", false);
	}
}
/*************************************************
Function:		jump_VideoStream
Description:	根据码流类型获取当前通道相关显示信息
Input:			iSet: select项的通道号			
Output:			无
return:			无				
*************************************************/
function jump_VideoStream(iSet)
{
	document.getElementById("videoResolution").disabled = 0;
	document.getElementById("fixedQuality").disabled = 0;
	document.getElementById("videoQualityControlType").disabled = 0;
	document.getElementById("constantBitRate").disabled = 0;
	document.getElementById("maxFrameRate").disabled = 0;
	
	GetVideoAbility();              //更新能力集
	GetVideoInfo();  				//获取相关信息
}
/*************************************************
Function:		initVideoSetting
Description:	初始化视频配置页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initVideoSetting()
{
	GetVideoAbility();
	GetVideoInfo();
	autoResizeIframe();
}
/*************************************************
Function:		initAudio
Description:	初始化音频配置页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initAudio()
{
	$('#inAudioVolume').bind('keyup', function() {
		var szVal = $(this).val();
		if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
			if(szVal.length > 1) {
				$(this).val(szVal.substring(0, szVal.length - 1));
			} else {
				$(this).val('1');
			}
		}
		if(parseInt(szVal, 10) > 100) {
			$(this).val('100');
		}
	});
	GetAudioAbility();
	/*GetAudioInfo();*/
	autoResizeIframe();
}
/*************************************************
Function:		GetAudioAbility
Description:	获取音频能力集
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAudioAbility()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1/capabilities",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if($(xmlDoc).find('audioCompressionType').length > 0)
			{
				$("#divAudioCompressionType").show();
				$("#selectAudioCompressionType").empty();
				var oAudioCompressionType = $(xmlDoc).find('audioCompressionType').eq(0).attr("opt").split(",");
				for(i = 0;i < oAudioCompressionType.length; i++)
				{
					$("<option value='"+ oAudioCompressionType[i] +"'>"+ oAudioCompressionType[i] +"</option>").appendTo("#selectAudioCompressionType");
				}
			}
			else
			{
				$("#divAudioCompressionType").hide();
			}
			if($(xmlDoc).find('audioInputType').length > 0)
			{
				$("#divAudioInputType").show();	
				$("#selectAudioInputType").empty();
				var oAudioInputType = $(xmlDoc).find('audioInputType').eq(0).attr("opt").split(",");
				for(i = 0;i < oAudioInputType.length; i++)
				{
					$("<option value='"+ oAudioInputType[i] +"'>"+ oAudioInputType[i] +"</option>").appendTo("#selectAudioInputType");
				}
			}
			else
			{
				$("#divAudioInputType").hide();
			}
			if($(xmlDoc).find('speakerVolume').length > 0)
			{
				$("#divAudioVolume").show();
			}
			GetAudioInfo();
		}
	});
}
/*************************************************
Function:		GetAudioAbility
Description:	获取音频信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAudioInfo()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if($(xmlDoc).find('audioCompressionType').length > 0)
			{ 
				$("#selectAudioCompressionType").val($(xmlDoc).find('audioCompressionType').eq(0).text());
			}
			if($(xmlDoc).find('audioInputType').length > 0)
			{
				$("#selectAudioInputType").val($(xmlDoc).find('audioInputType').eq(0).text());
			}
			if($(xmlDoc).find('speakerVolume').length > 0)
			{
				$("#inAudioVolume").val($(xmlDoc).find('speakerVolume').eq(0).text())
			}
		}
	});
}
/*************************************************
Function:		setAudioInfo
Description:	音频设置
Input:			无			
Output:			无
return:			无				
*************************************************/
function setAudioInfo()
{
	var xmlDoc = null;
	var szXml = "";
	szXml = "<?xml version='1.0' encoding='UTF-8'?>";
	szXml += "<TwoWayAudioChannel version='1.0' xmlns='http://www.hikvision.com/ver10/XMLSchema'>";
	szXml += "<id>1</id>";
	szXml +="<enabled>true</enabled>";
	if($("#divAudioCompressionType").css("display") != "none")
	{
		szXml += "<audioCompressionType>" + $("#selectAudioCompressionType").val() + "</audioCompressionType>";
	}
	if($("#divAudioInputType").css("display") != "none")
	{
		szXml += "<audioInputType>" + $("#selectAudioInputType").val() + "</audioInputType>";
	}
	if($("#divAudioVolume").css("display") != "none")
	{
		szXml += "<speakerVolume>" + $("#inAudioVolume").val() + "</speakerVolume>";
	}
	szXml += "</TwoWayAudioChannel>";
	xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
