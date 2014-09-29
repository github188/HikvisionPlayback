// JavaScript Document

var VideoSettings = {
	tabs: null,	// 保存VideoSettings配置页面的tabs对象引用
	beforeLeave: function(iTabIndex) {
		switch (iTabIndex)
		{
			case 0:
				ia(BaseVideoSettings).beforeLeave();
				break;
			case 1:
				ia(OSDSettings).beforeLeave();
				break;
			case 2:
				ia(TextOverlay).beforeLeave();
				break;
			case 3:
				ia(VideoMask).beforeLeave();
				break;
			case 4:
				ia(PictureOverlay).beforeLeave();
				break;
			default:
				break;
		}
	}
};

/*************************************************
Function:		BaseVideoSettings
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function BaseVideoSettings() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(BaseVideoSettings);

(function() { // BaseVideoSettings implementation

	BaseVideoSettings.prototype.initCSS = function()
	{
		InitSlider();
		$("#chEnableDehaze").click(function()
		{
			if($(this).prop("checked"))
			{
				if(g_IsSupportDehazeLevel)
				{
					$("#dvDehazeLevel").show();
				}
			}
			else
			{
				$("#dvDehazeLevel").hide();
			}
		});
		//如果是球机
		if(window.parent.g_bIsIPDome)
		{
			$("#laIrisMode").attr("name", "laExposureType").html(getNodeValue("laExposureType"));
			$("#laShutter").attr("name", "laShutterLevel").html(getNodeValue("laShutterLevel"));
			$("#IrisMode").change(function()
			{
				if("auto"==this.value && "auto"==$("#DayNightFilterType").val())
				{
					if(g_IsSupportDayNightLevel)
					{
						$("#DayToNightFilterLevel_tr").show();
					}
				}
				else
				{
					$("#DayToNightFilterLevel_tr").hide();
				}
				if(this.value != "ShutterFirst" && this.value != "manual")
				{
					$("#Shutter_tr").hide();
				}
				else
				{
					if(g_bSupportShutter)
					{
						$("#Shutter_tr").show();
					}
				}
				if(this.value != "IrisFirst" && this.value != "manual")
				{
					$("#IrisLevel_tr").hide();
				}
				else
				{
					if(g_bSupportIris)
					{
						$("#IrisLevel_tr").show();
					}
				}
				if(this.value == "manual" || this.value == "gainFirst")
				{
					if(isSupportGain)
					{
						$("#VideoGain_tr").show();
					}
				}
				else
				{
					$("#VideoGain_tr").hide();
				}
			});
			$("#DayNightFilterType").change(function()
			{
				if("auto"==this.value && "auto"==$("#IrisMode").val())
				{
					if(g_IsSupportDayNightLevel)
					{
						$("#DayToNightFilterLevel_tr").show();
					}
				}
				else
				{
					$("#DayToNightFilterLevel_tr").hide();
				}
			});
			$("#selSharpnessMode").change(function()
			{
				if(this.value == "manual")
				{
					if(g_bSupportSharpness)
					{
						$("#Sharpness_tr").show();
					}
				}
				else
				{
					$("#Sharpness_tr").hide();
				}
				SetSharpness();
			});
		}
		else//非球机下不同的关联关系
		{
			$("#DayNightFilterType").change(function()
			{
				if(this.value != "auto")
				{
					if(isSupportGain)
					{
						$("#VideoGain_tr").show();
					}
					$("#DayToNightFilterLevel_tr").hide();
					$("#DayNightFilterTime_tr").hide();
				}
				else
				{
					$("#VideoGain_tr").hide();
					if(g_IsSupportDayNightLevel){
						$("#DayToNightFilterLevel_tr").show();
					}
					if(g_IsSupportDayNightFilterTime){
						$("#DayNightFilterTime_tr").show();
					}
				}
				//计划
				if(this.value == "schedule")
				{
					$("#dvFilterStartTime").show();
					$("#dvFilterEndTime").show();
				}
				else
				{
					$("#dvFilterStartTime").hide();
					$("#dvFilterEndTime").hide();
				}
				//事件
				if(this.value == "eventTrigger")
				{
					$("#dvDayOrNight").show();
				}
				else
				{
					$("#dvDayOrNight").hide();
				}
			});
		}
	}

	BaseVideoSettings.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
			$("#taBaseVideoSettings select").show();
			$("#OSDFontSize").hide();
		}
        if ($("#CoverStartMapbutton").val() != getNodeValue('CoverStartMapbutton'))
		{
		    HWP.SetDrawStatus(false);	
		}
		$("#SaveConfigBtn").hide();
		$("#SetResultTips").html("");
		$("#taBaseVideoSettings select").not($("#taBaseVideoSettings select[class$='noempty']")).empty();
		
		var that = this;
		g_transStack.clear();
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["VideoSettings", "BaseVideoSettings"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		}, false);
		g_transStack.push(function() { parent.translator.translatePage(that.getLxd(), document); }, false);
		GetFrontParaConfig(); //获取前端参数
	}
	
	BaseVideoSettings.prototype.beforeLeave = function()
	{
		HWP.ClearRegion();
		HWP.SetDrawStatus(false);
	}
	
})(); // BaseVideoSettings implementation


/*************************************************
Function:		OSDSettings
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function OSDSettings() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(OSDSettings);

(function() { // OSDSettings implementation

	OSDSettings.prototype.initCSS = function()
	{
		$("#taOSDSettings :text").addClass("text");
		$("#taOSDSettings :checkbox").addClass("checkbox");
	}

	OSDSettings.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
		    $("#taBaseVideoSettings select").hide();
		}
        if ($("#CoverStartMapbutton").val() != getNodeValue('CoverStartMapbutton'))
		{
		    HWP.SetDrawStatus(false);	
		}		
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["VideoSettings", "OSDSettings"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		}, true);
		RecordDisplayInit();
		g_transStack.push(function() {
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		//自适应高度
		autoResizeIframe();
	}
	
	OSDSettings.prototype.submit = function()
	{
		if(!CheckDeviceName($("#ChannelName").val(),'SetResultTips',1))
		{
			$("#ChannelName").val("").focus();
			return;
		}
		if ($("#IsShowChanNme")[0].checked)
		{
			SetChannelName();
		}			
		SetOSDInfoAll();
	}
	
	OSDSettings.prototype.beforeLeave = function()
	{
		var szTextOverlay = HWP.GetTextOverlay();
		if (szTextOverlay ==="")
		{
			return;
		}
		var xmlDoc = parseXmlFromStr(szTextOverlay);
		try
		{
			xmlDoc.documentElement.getElementsByTagName('channelNameOverlay')[0].getElementsByTagName('enabled')[0].childNodes[0].nodeValue = "false";
			xmlDoc.documentElement.getElementsByTagName('DateTimeOverlay')[0].getElementsByTagName('enabled')[0].childNodes[0].nodeValue = "false";
		}
		catch (e)
		{
			return;
		}
		HWP.SetTextOverlay(xmlToStr(xmlDoc));
	}

})(); // OSDSettings implementation


/*************************************************
Function:		TextOverlay
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function TextOverlay() {
	SingletonInheritor.implement(this);
	this.m_arrTextX = [-1, -1, -1, -1];
	this.m_arrTextY = [-1, -1, -1, -1];
}
SingletonInheritor.declare(TextOverlay);

(function() { // TextOverlay implementation

	TextOverlay.prototype.initCSS = function()
	{
		$("#taTextOverlay :text").addClass("text");
		$("#taTextOverlay :checkbox").addClass("checkbox");
	}

	TextOverlay.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
		    $("#taBaseVideoSettings select").hide();
			$("#OSDFontSize").hide();
		}
        if ($("#CoverStartMapbutton").val() != getNodeValue('CoverStartMapbutton'))
		{
		    HWP.SetDrawStatus(false);	
		}		
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["VideoSettings", "TextOverlay"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		}, true);
		RecordOverlayInit();
		autoResizeIframe();
		g_transStack.push(function() {
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		//自适应高度
		autoResizeIframe();
	}
	
	TextOverlay.prototype.submit = function()
	{
		SetOverlayInfo();
	}

	TextOverlay.prototype.beforeLeave = function()
	{
		var szTextOverlay = HWP.GetTextOverlay();
		if (szTextOverlay ==="")
		{
			return;
		}
		var xmlDoc = parseXmlFromStr(szTextOverlay);
		try
		{
			var arrTextOverlay = xmlDoc.documentElement.getElementsByTagName('TextOverlayList')[0].getElementsByTagName("TextOverlay");
			for (var i = 0, len = arrTextOverlay.length; i != len; ++i)
			{
				arrTextOverlay[i].getElementsByTagName('enabled')[0].childNodes[0].nodeValue = "false";
			}
		}
		catch (e)
		{
			return;
		}
		HWP.SetTextOverlay(xmlToStr(xmlDoc));
	}

})(); // TextOverlay implementation


/*************************************************
Function:		VideoMask
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function VideoMask() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(VideoMask);

(function() { // VideoMask implementation

	VideoMask.prototype.initCSS = function()
	{
		$("#taVideoMask :checkbox").addClass("checkbox");
		$("#taVideoMask :button").addClass("button");
	}

	VideoMask.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
		    $("#taBaseVideoSettings select").hide();
			$("#OSDFontSize").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");

		RecordCoverInitDay();
		
		var that = this;
		g_transStack.clear();
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["VideoSettings", "VideoMask"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		//自适应高度
		autoResizeIframe();
	}
	
	VideoMask.prototype.submit = function()
	{
		SaveCoverInfo();
	}

	VideoMask.prototype.beforeLeave = function()
	{
		HWP.ClearRegion();
		HWP.SetDrawStatus(false);
	}

})(); // VideoMask implementation
/*************************************************
Function:		PictureOverlay
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function PictureOverlay() {
	SingletonInheritor.implement(this);
	this.m_xmlDoc = null;
	this.m_iPosX = 0;
	this.m_iPosY = 0;
	this.m_iResolutionH = 704;
	this.m_iResolutionV = (m_iVideoOutNP=='PAL'?576:480);
}
SingletonInheritor.declare(PictureOverlay);

(function() { // Overlay implementation

	PictureOverlay.prototype.initCSS = function()
	{
		$("#txtPicXPos").bind("keyup", function(){
			var szVal = $(this).val();
			if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
				if(szVal.length > 1) {
					$(this).val(szVal.substring(0, szVal.length - 1));
				} else {
					$(this).val('0');
				}
			}
			var iVal = parseInt(szVal, 10);
			if(iVal > 704) {
				$(this).val('704');
			}
		});
		$("#txtPicYPos").bind("keyup", function(){
			var szVal = $(this).val();
			if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
				if(szVal.length > 1) {
					$(this).val(szVal.substring(0, szVal.length - 1));
				} else {
					$(this).val('0');
				}
			}
			var iVal = parseInt(szVal, 10);
			var iMax = (m_iVideoOutNP=='PAL'?576:480);
			if(iVal > iMax) {
				$(this).val(iMax);
			}
		});
	}

	PictureOverlay.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
		    $("#taBaseVideoSettings select").hide();
			$("#OSDFontSize").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");

		this.initPictureOverlay();
		
		var that = this;
		g_transStack.clear();
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["VideoSettings", "PictureOverlay"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		//自适应高度
		autoResizeIframe();
	}
	
	PictureOverlay.prototype.submit = function()
	{
		if (this.m_xmlDoc === null)
		{
			return;
		}
		var szAreaXml = HWP.GetRegionInfo();
		if("" == szAreaXml){
			return;
		}
		var oAreaXml = parseXmlFromStr(szAreaXml);
		var iPosX = parseInt($(oAreaXml).find("positionX").eq(3).text(), 10);
		var iPosY = (m_iVideoOutNP=='PAL'?576:480) - parseInt($(oAreaXml).find("positionY").eq(3).text(), 10);
		var xmlDoc = this.m_xmlDoc;
		$(xmlDoc).find("ImageOverlay").eq(0).find("enabled").eq(0).text($("#chEnablePicOverlay").prop("checked").toString());
		$(xmlDoc).find("ImageOverlay").eq(0).find("positionX").eq(0).text(iPosX);/*$("#txtPicXPos").val()*/
		$(xmlDoc).find("ImageOverlay").eq(0).find("positionY").eq(0).text(iPosY);/*$("#txtPicYPos").val()*/
		$.ajax({
			type: "PUT",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/Image",
			beforeSend: function(xhr){
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			data: xmlDoc,
			processData: false,
			complete: function(xhr, textStatus) {
				SaveState(xhr);
			},
			success: function(){
				$("#txtPicXPos").val(iPosX);
				$("#txtPicYPos").val(iPosY);
			}
		});
	}

	PictureOverlay.prototype.beforeLeave = function()
	{
		HWP.ClearRegion();
		HWP.SetDrawStatus(false);
	}
	/*************************************************
	Function:		initPictureOverlay
	Description:	初始化图片叠加界面
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	PictureOverlay.prototype.initPictureOverlay = function()
	{
		var szInfo = getNodeValue('laPlugin');
		if(!checkPlugin('1', szInfo, 1, 'tamperdetect'))
		{
			return;
		}
		
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
		m_PreviewOCX = document.getElementById("PreviewActiveX");
		ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
		var oStreamInfo = $.ajax({
			type: "GET",
			url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
			async: false,
			timeout: 15000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			}
		}).responseXML;
		if($(oStreamInfo).find("videoResolutionWidth").length > 0) {
			this.m_iResolutionH = parseInt($(oStreamInfo).find('videoResolutionWidth').eq(0).text(), 10);
			this.m_iResolutionV = parseInt($(oStreamInfo).find('videoResolutionHeight').eq(0).text(), 10);
		}
		m_iPicinform = 1;
		setTimeout(function() {
			if (HWP.Play() !== 0) {
				alert(getNodeValue("previewfailed"));
			}
		}, 10);
		this.getPicOverlayInfo();
	}
	/*************************************************
	Function:		getPicOverlayInfo
	Description:	获取图片叠加信息
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	PictureOverlay.prototype.getPicOverlayInfo = function()
	{
		var that = this;
		$.ajax({
			type: "GET",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/Image",
			beforeSend: function(xhr){
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr){
				that.m_xmlDoc = xmlDoc;
				$("#chEnablePicOverlay").prop("checked", ($(xmlDoc).find("ImageOverlay").eq(0).find("enabled").eq(0).text() == "true"));
				that.m_iPosX = parseInt($(xmlDoc).find("ImageOverlay").eq(0).find("positionX").eq(0).text(), 10);
				that.m_iPosY = parseInt($(xmlDoc).find("ImageOverlay").eq(0).find("positionY").eq(0).text(), 10);
				$("#txtPicXPos").val(that.m_iPosX);
				$("#txtPicYPos").val(that.m_iPosY);
				var iImageWidth = parseInt($(xmlDoc).find("ImageOverlay").eq(0).find("imageWidth").eq(0).text(), 10);
				$("#txtPicWidth").val(iImageWidth);
				iImageWidth = Math.ceil(iImageWidth*704/that.m_iResolutionH);
				var iImageHeight = parseInt($(xmlDoc).find("ImageOverlay").eq(0).find("imageHeight").eq(0).text(), 10);
				$("#txtPicHeight").val(iImageHeight);
				iImageHeight = Math.ceil(iImageHeight*576/that.m_iResolutionV);
				if(iImageWidth > 0 && iImageHeight > 0){
					setPicRegionToPlugin(that.m_iPosX, that.m_iPosY, iImageWidth, iImageHeight);
				}
				
			},
			error: function(xhr, textStatus, errorThrown){
				
			}
		});
	}
	/*************************************************
	Function:		uploadPic
	Description:	上传图片
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	PictureOverlay.prototype.uploadPic = function() {
		var that = this;
		if(m_PreviewOCX === null) {
			return;
		}
		var szFilePath = $("#txtPictureFliePath").val();
		if("" == szFilePath){
			return;
		}
		var szFileSuffix = szFilePath.substring(szFilePath.length -4, szFilePath.length).toLocaleLowerCase(); //文件后缀名
		if(/*".yuv" != szFileSuffix && */".bmp" != szFileSuffix){
			return;
		}
		var szUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/Image/picture";
		
		if(0 !== m_PreviewOCX.HWP_UploadFile(szUrl, m_szUserPwdValue, $("#txtPictureFliePath").val(), "IMAGE/BMP", 0)) {
			$("#SetResultTips").html(m_szErrorState+getNodeValue("jsUploadFailed"));
			setTimeout(function () {
				$("#SetResultTips").html("");
			}, 5000);
			return;
		} else {
			$("#SetResultTips").html(m_szSuccessState+getNodeValue("jsUploadSuc"));
			setTimeout(function () {
				$("#SetResultTips").html("");
			}, 5000);
			this.getPicOverlayInfo();
		}
	}

})();
/************************************************
Function:		setPicRegionToPlugin
Description:	设置图片叠加区域
Input:			无			
Output:			无
return:			无				
************************************************/
function setPicRegionToPlugin(iX, iY, iWidth, iHeight)
{
	var szXml = "<?xml version='1.0' encoding='utf-8' ?><DetectionRegionInfo><videoFormat>"+m_iVideoOutNP+"</videoFormat><RegionType>roi</RegionType><ROI><HorizontalResolution>704</HorizontalResolution><VerticalResolution>"+(m_iVideoOutNP=='PAL'?576:480)+"</VerticalResolution></ROI><DisplayMode>transparent</DisplayMode><MaxRegionNum>1</MaxRegionNum><DetectionRegionList><DetectionRegion><RegionCoordinatesList><RegionCoordinates><positionX>"+iX+"</positionX><positionY>"+((m_iVideoOutNP=='PAL'?576:480) - (iY + iHeight))+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+(iX + iWidth)+"</positionX><positionY>"+((m_iVideoOutNP=='PAL'?576:480) - (iY + iHeight))+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+(iX + iWidth)+"</positionX><positionY>"+((m_iVideoOutNP=='PAL'?576:480) - iY)+"</positionY></RegionCoordinates><RegionCoordinates><positionX>"+iX+"</positionX><positionY>"+((m_iVideoOutNP=='PAL'?576:480) - iY)+"</positionY></RegionCoordinates></RegionCoordinatesList></DetectionRegion></DetectionRegionList></DetectionRegionInfo>";
	HWP.SetRegionInfo(szXml);
}