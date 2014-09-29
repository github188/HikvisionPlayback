// JavaScript Document
// 
var System = {
	tabs: null	// 保存System配置页面的tabs对象引用
};
function XmlUtils(xmlDoc) {
	this.doc = xmlDoc;
}
XmlUtils.prototype = {
	constructor: XmlUtils,
	elems: function(name) {
		return this.doc.documentElement.getElementsByTagName(name);
	},
	elem: function(name) {
		return this.elems(name)[0];
	},
	val: function(name, value) {
		if (arguments.length === 1){
			try {
				return this.elem(name).childNodes[0].nodeValue;
			} catch (e) {
				return "";
			}
		}else{
			this.elem(name).childNodes[0].nodeValue = value;
		}
	}
};

/*************************************************
Function:		DeviceInfo
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeviceInfo() {
	SingletonInheritor.implement(this);
	this.m_xmlDoc = null;		// "/PSIA/System/deviceInfo"返回
	this.m_iChannelNum = -1;	// 通道个数，缓存（原m_iAnalogChannelNum）
	this.m_szVideoFormat = null;// 通道视频制式（原m_iVideoOutNP）
	this.m_iDiskNum = -1;		// 硬盘个数
	this.m_iAlarmInNum = -1;	// 报警输入数，缓存（原m_iAnalogAlarmNum）
	this.m_iAlarmOutNum = -1;	// 报警输出数，缓存（原m_iAlarmOutputAnalogNum）
}
SingletonInheritor.declare(DeviceInfo);

(function() { // DeviceInfo implementation

	/*************************************************
	Function:		update
	Description:	更新设备基本信息
	Input:			无
	Output:			无
	return:			无
	*************************************************/
	DeviceInfo.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "DeviceInfo"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);

		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/deviceInfo",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0"); 
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr) {
				that.m_xmlDoc = xmlDoc;
				var xmlU = new XmlUtils(that.m_xmlDoc);
				if (xmlU.elem("deviceName").hasChildNodes())
				{
					$("#teDeviceName").val(xmlU.val("deviceName"));
				}
				else
				{
					$("#teDeviceName").val("");
				}
				if (xmlU.elems("Extensions").length > 0)
				{
					$("#dvDeviceID").show();
					try
					{
						$("#teDeviceID").val(xmlU.val("telecontrolID"));
					}
					catch (oError)
					{
						$("#teDeviceID").val("");
						$("#teDeviceID").prop("disabled", true);
					}
				}
				else
				{
					$("#dvDeviceID").hide();
				}
				try
				{
					$("#tdDeviceTypeValue").html(xmlU.val("model"));
				}
				catch (e)
				{
					$("#tdDeviceTypeValue").html("");
				}
				$("#tdDeviceSnValue").html(xmlU.val("serialNumber"));
				$("#tdFirmwareVersionValue").html(xmlU.val("firmwareVersion") + "  " + xmlU.val("firmwareReleasedDate"));
				if (xmlU.elems("logicVersion").length > 0)
				{
					$("#tdLogicVersionValue").html(xmlU.val("logicVersion") + "  " + xmlU.val("logicReleasedDate"));
				}
				
				try
				{
					var oChannelInfo = pr(DeviceInfo).queryChannelInfo();
					that.m_iChannelNum = oChannelInfo.iChannelNum;
					that.m_szVideoFormat = oChannelInfo.szVideoFormat;
					$("#tdChannelNumValue").html(that.m_iChannelNum);
					that.m_iDiskNum = pr(DeviceInfo).queryDiskNum();
					$("#tdDiskNumValue").html(that.m_iDiskNum);
					// 下面这2个方法和2个属性，之后要封装到AlarmIn和AlarmOut对象中，wuyang
					if (that.m_iAlarmInNum === -1)
					{
						that.m_iAlarmInNum = pr(DeviceInfo).queryAlarmInNum();
					}
					$("#tdAlarmInNumValue").html(that.m_iAlarmInNum);
					if (that.m_iAlarmOutNum === -1)
					{
						that.m_iAlarmOutNum = pr(DeviceInfo).queryAlarmOutNum();
					}
					$("#tdAlarmOutNumValue").html(that.m_iAlarmOutNum);
				}
				catch (error)
				{
					alert(error);
				}
				autoResizeIframe();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert(m_szError400);
				return;
			}
		});
	}
	
	/*************************************************
	Function:		submit
	Description:	提交设备基本信息
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	DeviceInfo.prototype.submit = function()
	{
		if (this.m_xmlDoc === null)
		{
			return;
		}
		var xmlDoc = this.m_xmlDoc;
		if (!pr(DeviceInfo).checkDeviceNameValidity($("#teDeviceName").val(), "devicenametips", 1))
		{
			return;
		}
		if ($("#dvDeviceID").css("display")!="none" && !$("#teDeviceID").prop("disabled"))
		{
			if (!pr(DeviceInfo).checkDeviceIDValidity($("#teDeviceID").val(), "Equipmenttips", "laDeviceID", 1, 255))
			{
				return;
			}
		}
		$(xmlDoc).find("deviceName").eq(0).text($("#teDeviceName").val());
		
		if ($("#dvDeviceID").css("display")!="none")
		{
			if ($(xmlDoc).find("Extensions").length > 0)
			{
				$(xmlDoc).find("telecontrolID").eq(0).text($("#teDeviceID").val()); 
			}
			else
			{
				var extensions = xmlU.doc.createElement("Extensions");
				var element = xmlU.doc.createElement("telecontrolID");
				var text = xmlU.doc.createTextNode($("#teDeviceID").val());
				element.appendChild(text);
				extensions.appendChild(element);
				xmlDoc.documentElement.appendChild(extensions);
			}
		}
		
		$.ajax({
			type: "PUT",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/deviceInfo",
			data: xmlDoc,
			processData: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			complete: function(xhr, textStatus) {
				SaveState(xhr);
			}
		});
	}
	
	/*************************************************
	  Function:    	checkDeviceNameValidity 类方法
	  Description:	检查设备名称是否合法
	  Input:        szInfo:			传入的参数
					szTipsId:		提示信息ID
					bAllowEmpty:	是否可以为空
	  Output:      	无
	  Return:		bool:true false
	*************************************************/
	DeviceInfo.prototype.checkDeviceNameValidity = function(szInfo, szTipsId, bAllowEmpty)
	{
		var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		if (!bAllowEmpty && $.isEmpty(szInfo))
		{ // 为空时提示
			szAreaNameInfo += parent.translator.translateNode(this.getLxd(), "DevNameNullTips");
			$("#" + tipsId).html(szAreaNameInfo);
			return false;
		}
		if (/[':\*\?<>\|\/%\\\"]/.test(szInfo))
		{ // 包含特殊字符时提示
			szAreaNameInfo += parent.translator.translateNode(this.getLxd(), "DevNameWrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + szTipsId).html(szAreaNameInfo);
			return false;
		}
		if ($.lengthw(szInfo) > 32)
		{
			szAreaNameInfo += parent.translator.translateNode(this.getLxd(), "DevNameLengthTips");
			$("#" + szTipsId).html(szAreaNameInfo);
			return false;
		}
		$("#" + szTipsId).html("");
		return true;
	}
	
	/*************************************************
	  Function:    	checkDeviceIDValidity 类方法
	  Description:	检查设备号是否合法
	  Input:        szInfo:		传入的参数
					szTipsId:	提示信息
					szName:		标题
					iMin:		最小数
					iMax:		最大数
	  Output:      	无
	  Return:		bool:true false
	*************************************************/
	DeviceInfo.prototype.checkDeviceIDValidity = function(szInfo, szTipsId, szName, iMin, iMax)
	{
		var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		if ($.isEmpty(szInfo))
		{
			szTipsInfo += parent.translator.translateNode(this.getLxd(), "InputTips") + parent.translator.translateNode(this.getLxd(), szName);
			$("#" + szTipsId).html(szTipsInfo); 
			return false;
		}
		if (!$.isCosinaIntNum(szInfo, iMin, iMax))
		{
			szTipsInfo += parent.translator.translateNode(this.getLxd(), szName) + parent.translator.translateNode(this.getLxd(), "RangeTips") + iMin + "-" + iMax;
			$("#" + szTipsId).html(szTipsInfo); 
			return false;
		}
		$("#" + szTipsId).html(""); 
		return true;
	}
	
	/*************************************************
	Function:		queryChannelInfo 类方法
	Description:	查询获取通道信息，同步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	DeviceInfo.prototype.queryChannelInfo = function()
	{
		var ret = {
			iChannelNum: -1,
			szVideoFormat: ""
		};
		var that = this;
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs",
			async: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				ret.iChannelNum = xmlU.elems("VideoInputChannel").length;
				m_iAChannelNum = ret.iChannelNum;
			    m_iAllChannelNum = m_iAChannelNum;
				try
				{
					ret.szVideoFormat = xmlU.val("videoFormat");
					m_iVideoOutNP = ret.szVideoFormat;
				}
				catch (oError)
				{
				}
			},
			error: function() {
				throw m_szError400;
			}
		});
		return ret;
	}
		
	/*************************************************
	Function:		getDiskNum 类方法
	Description:	获取设备已接硬盘数，同步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	DeviceInfo.prototype.queryDiskNum = function()
	{
		var iDiskNum = -1;
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/ContentMgmt/Storage",
			async: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				iDiskNum = xmlU.elems("hdd").length;
				for (var i = 0; i < xmlU.elems("nas").length; i++)
				{
					if (xmlU.elems("nas")[i].getElementsByTagName('status')[0].childNodes[0].nodeValue != 'offline')
					{
						++iDiskNum;
					}
				}
			},
			error: function() {
				throw m_szError400;
			}
		});
		return iDiskNum;
	}
	
	//////////////////////////////////////////////////
	// 下面这几个方法之后要放到AlarmIn和AlarmOut类中
	
	/*************************************************
	Function:		queryAlarmInNum
	Description:	获取报警输入数，同步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	DeviceInfo.prototype.queryAlarmInNum = function()
	{
		var iAlarmInNum = -1;
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/IO/inputs",
			async: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				iAlarmInNum = xmlU.elems('IOInputPort').length;
			},
			error: function(xhr, textStatus, errorThrown) {
				throw m_szError400;
			}
		});
		return iAlarmInNum;
	}
	
	/*************************************************
	Function:		queryAlarmOutNum 类方法
	Description:	获取报警输出数，同步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	DeviceInfo.prototype.queryAlarmOutNum = function()
	{
		var iAlarmOutNum = -1;
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/IO/outputs",
			async: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				iAlarmOutNum = xmlU.elems("IOOutputPort").length;
			},
			error: function(xhr, textStatus, errorThrown) {
				throw m_szError400;
			}
		});
		return iAlarmOutNum;
	}
	
	//////////////////////////////////////////////////

})(); // DeviceInfo implementation



/*************************************************
Function:		TimeSettings
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function TimeSettings() {
	SingletonInheritor.implement(this);
	this.m_dtDeviceTime = null; // 获得的设备时间的Date对象，原systemTimeInit为String类型
	this.m_timerPerSecond = null; // 秒钟定时器
	this.m_timerSyncDeviceTime = null; // 设备时间同步时钟
	this.m_szDeviceTimeZone = null; // 获得的设备时区，原timeZoneInit
}
SingletonInheritor.declare(TimeSettings);

(function() { // TimeSettings implementation

	/*************************************************
	Function:		initCSS 类方法
	Description:	初始化CSS
	Input:			无
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.initCSS = function() {
		$("#diTimeConfig :radio").addClass("radio");
		$("#diTimeConfig :text").addClass("timetext");
		$("#diTimeConfig :button").addClass("button");
		$("#diTimeConfig :checkbox").addClass("checkbox");
		/*if(window.parent.g_bIsIPDome)
		{
			$("#DSTBias option").each(function(){
				if($(this).val() != "01:00:00")
				{
					$(this).remove();
				}
			})
		}*/
	};
	
	/*************************************************
	Function:		setRadioItem 类方法
	Description:	设置单选框的选中项
	Input:			parentId: 单选框父id
					index: 选中项的序号，从0开始
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.setRadioItem = function(parentId, index) {
		ia(TimeSettings).setTimeSyncMode(index);
		pr(SingletonInheritor.base).setRadioItem.apply(this, arguments);
	}
	
	/*************************************************
	Function:		dateFormat 类方法
	Description:	格式化Date对象
					月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
					年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
					eg:
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
					pr(TimeSettings).DateFormat((new Date()), "yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	Input:			date: Date对象
					format: 格式
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.dateFormat = function(date, format) {
		var o = {
		"M+" : date.getMonth()+1, //月份
		"d+" : date.getDate(), //日
		"h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时
		"H+" : date.getHours(), //小时
		"m+" : date.getMinutes(), //分
		"s+" : date.getSeconds(), //秒
		"q+" : Math.floor((date.getMonth()+3)/3), //季度
		"S" : date.getMilliseconds() //毫秒
		};
		var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(format)) {
			format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
		}
		for (var k in o){
			if (new RegExp("("+ k +")").test(format)){
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	}

	/*************************************************
	Function:		clickTimeSyncWithPC 类方法
	Description:	点击chTimeSyncWithPC复选框
	Input:			无
	Output:			this.m_dtDeviceTime的字符串表示
	return:			无
	*************************************************/	
	TimeSettings.prototype.clickTimeSyncWithPC = function()
	{
		if ($("#chTimeSyncWithPC").prop("checked"))
		{ // 与本地时间同步
			var dtNow = new Date();
			$("#teSelectTime").val(this.dateFormat(dtNow, "yyyy-MM-ddTHH:mm:ss")); // 电脑时间
			$("#teSelectTime").prop("disabled", true);
			var iTZOffset = dtNow.getTimezoneOffset();
			var iHour = Math.abs(parseInt(iTZOffset / 60));
			var iSecond = iTZOffset % 60;
			var szPCTZ = "CST" + ((iTZOffset >= 0) ? "+" : "-") + iHour + ((iSecond >= 30) ? ":30:00" : ":00:00");
			$("#seTimeZone").val(szPCTZ).prop("disabled", true);
		}
		else
		{
			$("#teSelectTime").prop("disabled", false);
			$("#seTimeZone").prop("disabled", false);
		}
	}
	
	/*************************************************
	Function:		update
	Description:	更新
	Input:			无	
	Output:			无
	return:			无				
	*************************************************/
	TimeSettings.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
			$("#diTimeConfig").find("select").show();
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "TimeSettings"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		
		$("#chTimeSyncWithPC").prop("checked", false); // 从其它tab页切换回来的情况
		// 设置秒钟定时器
		function updatePCTime() {
			if ($("#chTimeSyncWithPC").prop("checked"))
			{
				$("#teSelectTime").val(that.dateFormat(new Date(), "yyyy-MM-ddTHH:mm:ss"));
			}
			if (that.m_dtDeviceTime !== null)
			{
				that.m_dtDeviceTime = new Date(that.m_dtDeviceTime.getTime() + 1000);
				$("#teDeviceTime").val(that.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss"));
			}
		}
		updatePCTime();
		if (this.m_timerPerSecond !== null)
		{
			clearInterval(this.m_timerPerSecond);
		}
		this.m_timerPerSecond = setInterval(updatePCTime, 1000);
		// 设置设备时间同步定时器
		if (this.m_timerSyncDeviceTime !== null)
		{
			clearInterval(this.m_timerSyncDeviceTime);
		}
		this.m_timerSyncDeviceTime = setInterval(this.syncDeviceTime, 300000); // 五分钟同步一次
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				var timeMode = xmlU.val("timeMode");
				
				var szDeviceTime = xmlU.val("localTime").substring(0, 19);
				var arDTms = szDeviceTime.match(/(\d+)-(\d+)-(\d+)(\D+)(\d+):(\d+):(\d+)/);
				if (arDTms.length !== 8)
				{
					return;
				}
				that.m_dtDeviceTime = new Date(arDTms[1], arDTms[2] - 1, arDTms[3], arDTms[5], arDTms[6], arDTms[7]);
				
				that.m_szDeviceTimeZone = xmlU.val("timeZone");
				var arDTZms = that.m_szDeviceTimeZone.match(/\D+([+-])(\d+):(\d+):(\d+)/);
				if(arDTZms.length > 0) {
					$("#seTimeZone").val(arDTZms[0]);
				}
				that.updateNtpInfo();
				if (timeMode == "NTP")
				{
					$("#diTimeConfig :radio").eq(0).prop("checked", true);
					$("#diTimeConfig :radio").eq(1).prop("checked", false);
					that.setTimeSyncMode(0);
				}
				else
				{
					$("#diTimeConfig :radio").eq(0).prop("checked", false);
					$("#diTimeConfig :radio").eq(1).prop("checked", true);
					that.setTimeSyncMode(1);
					$("#teDeviceTime").val((that.dateFormat(that.m_dtDeviceTime, "yyyy-MM-ddTHH:mm:ss")));
				}
				autoResizeIframe();
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(m_szError400);
			}
		});
	}
	/*************************************************
	Function:		updateDST
	Description:	更新夏令时
	Input:			无	
	Output:			无
	return:			无				
	*************************************************/
	TimeSettings.prototype.updateDST = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
			$("#diTimeConfig").find("select").hide();
			$(".timehidden").show();
            //$("#dvDST").find(".timehidden").show();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}		
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "TimeSettings"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		
		$.ajax({
			type: "GET",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				
				that.m_szDeviceTimeZone = $(xmlDoc).find("timeZone").eq(0).text();
				$("#diDST").show();
				var iDSTPos = that.m_szDeviceTimeZone.indexOf("DST");
				if (iDSTPos != -1)
				{
					$("#IsEnableDST").prop("checked", true);
					$("#seTimeZone").val(that.m_szDeviceTimeZone.substring(0, iDSTPos));
					
					var startTime = that.m_szDeviceTimeZone.split(",")[1];
					var stopTime = that.m_szDeviceTimeZone.split(",")[2];
					$("#StartMonth").val(startTime.split(".")[0]);
					$("#StartWeek").val(startTime.split(".")[1]);
					$("#StartWeekDay").val(startTime.split(".")[2].split("/")[0]);
					$("#StartTime").val(startTime.split(".")[2].split("/")[1].split(":")[0]);
					$("#StopMonth").val(stopTime.split(".")[0]);
					$("#StopWeek").val(stopTime.split(".")[1]);
					$("#StopWeekDay").val(stopTime.split(".")[2].split("/")[0]);
					$("#StopTime").val(stopTime.split(".")[2].split("/")[1].split(":")[0]);
					
					$("#DSTBias").val(that.m_szDeviceTimeZone.substring(iDSTPos+3,iDSTPos+11));
				}
				else
				{
					$("#seTimeZone").val(that.m_szDeviceTimeZone);
					$("#IsEnableDST").prop("checked", false);
				}
				$("#dvDST select").prop("disabled", !$("#IsEnableDST").prop("checked"));
				autoResizeIframe();
			},
			error: function(xhr, textStatus, errorThrown) {
				alert(m_szError400);
			}
		});
	}
	/*************************************************
	Function:		syncDeviceTime
	Description:	同步设备时间到m_dtDeviceTime，异步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	TimeSettings.prototype.syncDeviceTime = function() {
		var that = this;
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				var timeMode = xmlU.val("timeMode");
				var szDeviceTime = xmlU.val("localTime").substring(0, 19);
				var arDTms = szDeviceTime.match(/(\d+)-(\d+)-(\d+)(\D+)(\d+):(\d+):(\d+)/);
				if (arDTms.length !== 8)
				{
					return;
				}
				that.m_dtDeviceTime = new Date(arDTms[1], arDTms[2] - 1, arDTms[3], arDTms[5], arDTms[6], arDTms[7]);
				that.m_szDeviceTimeZone = xmlU.val("timeZone");
			}
		});
	}
	
	/*************************************************
	Function:		updateNtpInfo 类方法
	Description:	更新NTP服务器配置信息，异步
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	TimeSettings.prototype.updateNtpInfo = function()
	{
		$.ajax({
			type: "get",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time/ntpServers/1",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) {
				var xmlU = new XmlUtils(xmlDoc);
				if (xmlU.doc.documentElement.hasChildNodes())
				{
				   if ("hostname" == xmlU.val("addressingFormatType"))
				   {
						$("#teNtpServer").val(xmlU.val("hostName")); 
				   }
				   else
				   {
						try
						{
							$("#teNtpServer").val(xmlU.val("ipAddress"));
						}
						catch (oError)
						{
							$("#teNtpServer").val(xmlU.val("ipv6Address"));
						}
				   }
				   $("#teNtpPort").val(xmlU.val("portNo")); 
				   if (xmlU.elem("Extensions").hasChildNodes())
				   {
					   $("#teNtpInterval").val(xmlU.val("synchronizeInterval"));
				   }
				   else
				   {
						$("#teNtpInterval").val("");
				   }
				   /*$("#teNtpServer").prop("disabled", false);
				   $("#teNtpPort").prop("disabled", false);
				   $("#teNtpInterval").prop("disabled", false);*/
				}	
			}
		});
	}
	
	/*************************************************
	Function:		setTimeSyncMode
	Description:	设置校时方式
	Input:			mode 校时方式	，0-自动校时，1-手动校时		
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.setTimeSyncMode = function(mode)
	{
		if (mode == 0)
		{ // 自动校时
			$("#teNtpServer").prop("disabled", false);
			$("#teNtpPort").prop("disabled", true);
			$("#teNtpInterval").prop("disabled", false);
			$("#chTimeSyncWithPC").prop("disabled", true);
			$("#teSelectTime").prop("disabled", true);
			$("#seTimeZone").prop("disabled", false);
		}
		else
		{ // 手动校时
			$("#teNtpServer").prop("disabled", true);
			$("#teNtpPort").prop("disabled", true);
			$("#teNtpInterval").prop("disabled", true);
			$("#chTimeSyncWithPC").prop("disabled", false);
			if (!$("#chTimeSyncWithPC").prop("checked"))
			{
				$("#teSelectTime").prop("disabled", false);
				$("#seTimeZone").prop("disabled", false);
			}
			this.updateSystemTime();
			TimeSettings.prototype.clickTimeSyncWithPC();
		}
	}
	
	/*************************************************
	Function:		updateSystemTime
	Description:	根据所选时区，更新$("#teDeviceTime").val()，并非通过设备来更新
	Input:			无
	Output:			无
	return:			无	
	*************************************************/
	TimeSettings.prototype.updateSystemTime = function()
	{
		if ($("#chTimeSyncWithPC").prop("checked"))
		{
			return;
		}
		var iDeviceTime = this.m_dtDeviceTime.getTime(); // ms
		var arDTZms = this.m_szDeviceTimeZone.match(/\D+([+-])(\d+):(\d+):(\d+)/);
		if (arDTZms !== null && arDTZms.length === 5)
		{
			var iDInc = (parseInt(arDTZms[2]) * 3600 + parseInt(arDTZms[3]) * 60 + parseInt(arDTZms[4])) * 1000; // ms
			iDInc = (arDTZms[1] === "+") ? iDInc : -iDInc;
		}
		else
		{
			arDTZms = this.m_szDeviceTimeZone.match(/\D+([+-])(\d+)/);
			var iDInc = parseInt(arDTZms[2]) * 3600000; // ms
			iDInc = (arDTZms[1] === "+") ? iDInc : -iDInc;
		}
		var szTimeZone = $("#seTimeZone").val(); // 当前选择时区
		if (szTimeZone == null)
		{ // 刷新时，$("#seTimeZone")尚未得到？？
			return;
		}
		var arTZms = szTimeZone.match(/\D+([+-])(\d+):(\d+):(\d+)/);
		var iInc = (parseInt(arTZms[2]) * 3600 + parseInt(arTZms[3]) * 60 + parseInt(arTZms[4])) * 1000; // ms
		if (arTZms.length !== 5)
		{
			return;
		}
		iInc = (arTZms[1] === "+") ? iInc : -iInc;
		var dtTime = new Date(iDeviceTime + iDInc - iInc);
		$("#teSelectTime").val(this.dateFormat(dtTime, "yyyy-MM-ddTHH:mm:ss"));
	}
	
	/*************************************************
	Function:		clickDST 类方法
	Description:	点击IsEnableDST复选框
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	TimeSettings.prototype.clickDST = function()
	{
		$("#dvDST select").prop("disabled", !$("#IsEnableDST").prop("checked"));
	}
	
	/*************************************************
	Function:		submit
	Description:	提交时间设置
	Input:			无
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.submit = function()
	{
		$("#laNtpServerTips").html("");
		$("#laNtpPortTips").html("");
		$("#laNtpIntervalTips").html("");
		$("#laDeviceTimeTips").html("");
		
		var szXml = "<?xml version='1.0' encoding='utf-8'?><Time>";
		
		if ($("#diTimeConfig :radio")[0].checked)
		{ // 自动校时
			if (!CheackStringLenthNull($("#teNtpServer").val(), "laNtpServerTips", "laServerAdd", 64))
			{
				return;
			}
			/*if (!CheackServerIDIntNum($("#teNtpPort").val(), "laNtpPortTips", "NtpPortRangeTips", 1, 65535))
			{
				return;
			}*/
			if (!CheackServerIDIntNum($("#teNtpInterval").val(), "laNtpIntervalTips", "NTPIntervalRangeTips", 1, 10080))
			{
				return;
			}
			szXml+="<timeMode>NTP</timeMode><localTime>"+$("#teDeviceTime").val()+"</localTime>";
		}
		else
		{ // 手动校时
			szXml+="<timeMode>manual</timeMode>";
			if ($.isEmpty($("#teDeviceTime").val()))   
			{
				var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
				$("#laDeviceTimeTips").html(szAreaNameInfo + parent.translator.translateNode(this.getLxd(), "TimeIsNuLLTips")); 
				return;
			}
			szXml+="<localTime>"+$("#teSelectTime").val()+"</localTime>";
		}
		var iDSTPos = this.m_szDeviceTimeZone.indexOf("DST");
		if(iDSTPos != -1)
		{
			szXml+="<timeZone>"+$("#seTimeZone").val()+this.m_szDeviceTimeZone.substring(iDSTPos, this.m_szDeviceTimeZone.length)+"</timeZone>";
		}
		else
		{
			szXml+="<timeZone>"+$("#seTimeZone").val()+"</timeZone>";
		}
		szXml+="</Time>";
		
		var xmlDoc = parseXmlFromStr(szXml);
		
		var that = this;
		$.ajax({
			type: "put",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time",
			data: xmlDoc,
			processData: false,
			async: true,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr) {
				that.syncDeviceTime(); // 重新获取设备时间
				//that.m_szDeviceTimeZone = $("#seTimeZone").val();
				var xmlU = new XmlUtils(xmlDoc);
				var state = xmlU.val("statusCode");
				var szRetInfo = "";
				switch (state)
				{
					case "1": // OK
						if ($("#diTimeConfig :radio")[0].checked)
						{
							submitNtpInfo();
							return;
						}
						else
						{
							szRetInfo = m_szSuccessState + m_szSuccess1;
						}
						break;
					case "2": // Device Busy
						szRetInfo = m_szErrorState + m_szError7;
						break;
					case "3": // Device Error
						szRetInfo = m_szErrorState + m_szError6;
						break;
					case "4": // Invalid Operation
						szRetInfo = m_szErrorState + m_szError5;
						break;
					case "5": // Invalid XML Format
						szRetInfo = m_szErrorState + m_szError4;
						break;
					case "6": // Invalid XML Content
						szRetInfo = m_szErrorState + m_szError13;
						break;
					case "7": // Reboot Required
						if($("#diTimeConfig :radio")[0].checked)
						{
							submitNtpInfo();
						}
						else
						{
							pr(Maintain).confirmAndRestart();
						}
						szRetInfo = m_szSuccessState + m_szSuccess5;
						break;
					default: // 不应该到这里
						break;
				}
				$("#SetResultTips").html(szRetInfo);
			},
			error: function(xhr, textStatus, errorThrown) {
				if (xhr.status === 403) {
					var szRetInfo = m_szErrorState + m_szError8;
					$("#SetResultTips").html(szRetInfo);
				}
				else {
					var szRetInfo = m_szErrorState + m_szError1;
					$("#SetResultTips").html(szRetInfo);
				};
			},
			complete: function()
			{
				setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
			}
		});
	}
	/*************************************************
	Function:		submitDST
	Description:	提交夏令时设置
	Input:			无
	Output:			无
	return:			无
	*************************************************/
	TimeSettings.prototype.submitDST = function()
	{
		var iDSTPos = this.m_szDeviceTimeZone.indexOf("DST");
		var szTimeZone = "";
		if(iDSTPos == -1)
		{
			szTimeZone = this.m_szDeviceTimeZone;
		}
		else
		{
			szTimeZone = this.m_szDeviceTimeZone.substring(0, iDSTPos);
		}
		if($("#IsEnableDST").prop("checked"))
		{
			if ($("#DSTBias").val() == null)
			{
				$("#SetResultTips").html(m_szErrorState + parent.translator.translateNode(this.getLxd(), "DSTBiasIsNullTips"));
				return;
			}
			if ($("#StartMonth").val() == $("#StopMonth").val())
			{
				$("#SetResultTips").html(m_szErrorState + parent.translator.translateNode(this.getLxd(), "DSTMonthSameTips"));
				return;
			}
			var szTemp = "";
			if ($("#DSTBias").val() == null)
			{
				szTemp = szTimeZone + "DST" + "00:00:00";
			}
			else
			{
				szTemp = szTimeZone + "DST" + $("#DSTBias").val();
			}
			var szStartTime = $("#StartMonth").val() + "." + $("#StartWeek").val() + "." + $("#StartWeekDay").val() + "/" + $("#StartTime").val() + ":00:00";
			var szStopTime = $("#StopMonth").val() + "." + $("#StopWeek").val() + "." + $("#StopWeekDay").val() + "/" + $("#StopTime").val() + ":00:00";
			szTimeZone = szTemp + "," + szStartTime + "," + szStopTime;
		}
		
		$.ajax({
			type: "PUT",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time/timeZone",
			data: szTimeZone,
			processData: false,
			async: true,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			complete: function(xhr, textStatus){
				SaveState(xhr);
			}
		});
	}
	/*************************************************
	Function:		submitNtpInfo
	Description:	提交NTP服务器信息
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	function submitNtpInfo()
	{
		var xmlDoc = new createxmlDoc();
		var instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
		xmlDoc.appendChild(instruction);
		var root = xmlDoc.createElement("NTPServer");	
		
		var element = xmlDoc.createElement("id");
		var text = xmlDoc.createTextNode("1");
		element.appendChild(text);
		root.appendChild(element);
		
		element = xmlDoc.createElement("addressingFormatType"); // 服务器地址类型
		var szIpAddressType = CheckAddressingType($("#teNtpServer").val());
		if (szIpAddressType === "hostName")
		{
			text = xmlDoc.createTextNode("hostname");
		}
		else
		{
			text = xmlDoc.createTextNode("ipaddress");
		}	
		element.appendChild(text);
		root.appendChild(element);
	
		element = xmlDoc.createElement(szIpAddressType);		
		text = xmlDoc.createTextNode($("#teNtpServer").val());
		element.appendChild(text);	
		root.appendChild(element);
		
		element = xmlDoc.createElement("portNo");
		text = xmlDoc.createTextNode($("#teNtpPort").val() == ""?"123":$("#teNtpPort").val());
		element.appendChild(text);
		root.appendChild(element);
		
		var extensions = xmlDoc.createElement("Extensions");
		element = xmlDoc.createElement("synchronizeInterval");
		text = xmlDoc.createTextNode($("#teNtpInterval").val());
		element.appendChild(text);	
		extensions.appendChild(element);
		root.appendChild(extensions);

		xmlDoc.appendChild(root);
		
		$.ajax({
			type: "put",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/time/ntpServers/1",
			data: xmlDoc,
			processData: false,
			async: true,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			complete:function(xhr, textStatus)
			{
				SaveState(xhr);
			}
		});
	}
	
})(); // TimeSettings implementation


/*************************************************
Function:		Maintain
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function Maintain() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Maintain);

(function() { // Maintain implementation

	/*************************************************
	Function:		initCSS 类方法
	Description:	初始化CSS
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.initCSS = function()
	{
		$("#diMaintain :button").addClass("button");
		$("#diMaintain :text").addClass("maintaintext");
	};
	
	/*************************************************
	Function:		update
	Description:	更新
	Input:			无	
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}		
		$("#SaveConfigBtn").hide();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "Maintain"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
	
		var szInfo = parent.translator.translateNode(this.getLxd(), 'laPlugin');
		if(!checkPlugin('0', szInfo, 1, 'normal'))
		{
			return;
		}
		
		m_PreviewOCX = document.getElementById("PreviewActiveX");
		<!--$("#PreviewActiveX")[0]. = document.getElementById("PreviewActiveX");-->
		$("#PreviewActiveX").css('width','1'); 
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
		
		autoResizeIframe();
	}
	
	/*************************************************
	Function:		restoreDefault 类方法
	Description:	恢复默认值
	Input:			szMode: "basic"-简单重启, "full"-完全重启
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.restoreDefault = function(szMode)
	{
		Warning = confirm(getNodeValue('tipsRestoreReboot1'));
		if (!Warning)
		{
			return;
		}
		var that = this;
		$.ajax({
			type: "put",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/factoryReset?mode=" + szMode,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) 
			{
				var szStatus = $(xmlDoc).find('statusString').eq(0).text();
				if ("OK" == szStatus)
				{
					var szRetInfo = m_szSuccessState + parent.translator.translateNode(that.getLxd(), 'tipsRestoreSucc');
					$("#SetResultTips").html(szRetInfo);
				}
				else if ("Reboot Required" == szStatus)
				{
					//var szRetInfo = m_szSuccessState + parent.translator.translateNode(that.getLxd(), 'tipsRestoreReboot');
					if(szMode == "full"){
						that.restart("YWRtaW46MTIzNDU=");
					}else{
						that.restart();
					}
					/*that.restart();*/
				}
				else
				{
					var szRetInfo = m_szErrorState + parent.translator.translateNode(that.getLxd(), 'tipsRestoreFailed');
					$("#SetResultTips").html(szRetInfo); 
				}
			},
			error: function(xhr, textStatus, errorThrown) 
			{
				if (xhr.status === 403) 
				{
					var szRetInfo = m_szErrorState + m_szError8;
					$("#SetResultTips").html(szRetInfo);
				};
			}
		});
	}
	
	/*************************************************
	Function:		confirmAndRestart 类方法
	Description:	弹出提示并重启
	Input:			无		
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.confirmAndRestart = function()
	{
		if (window.confirm(m_szRestartAsk))
		{
			pr(Maintain).restart();
			return true;
		}
		else 
		{
			return false;
		}
	}
	
	/*************************************************
	Function:		restart 类方法
	Description:	重启设备
	Input:			szAuth认证信息			
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.restart = function(szAuth)
	{
		if(szAuth == undefined){
			szAuth = m_szUserPwdValue;
		}
		$.ajax({
			type: "PUT",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/reboot",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + szAuth);
			},
			success: function(xmlDoc, textStatus, xhr) 
			{
				if ("OK" == xmlDoc.documentElement.getElementsByTagName('statusString')[0].childNodes[0].nodeValue)
				{
					var szRetInfo = m_szWaitState + m_szRestartSuccess;
					window.parent.$("#ConfigDivUpdateBlock").show().html("<div style='position:relative; top:50%; margin:0 auto; height:30px; width:100%; text-align:center;'>"+szRetInfo+"</div>");
					setTimeout("Maintain.prototype.reconnect()",20000);
				}
				else
				{
					var szRetInfo = m_szErrorState + m_szRestartFailed;
					$("#SetResultTips").html(szRetInfo);
				}
			},
			error: function(xhr, textStatus, errorThrown) 
			{
				if (xhr.status === 403) {
					var szRetInfo = m_szErrorState + m_szError8;
					$("#SetResultTips").html(szRetInfo);
				};
			}
		});
	}
	/*************************************************
	Function:		reconnect 类方法
	Description:	重连设备
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.reconnect = function()
	{
		$.ajax(
		{
			type: "GET",
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/userCheck",
			async: true,
			timeout: 60000,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) 
			{
				window.parent.$("#ConfigDivUpdateBlock").hide();
				window.parent.$("#ConfigDivUpdateBlock").empty();
			},
			error: function(xhr, textStatus, errorThrown)
			{
				setTimeout(function()
				{
					Maintain.prototype.reconnect();
				},5000);
			}
		});
	}
	
	/*************************************************
	Function:		StartUp
	Description:	开始远程升级
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.StartUp = function()
	{
		var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		var szFileName = $("#teUpgradeFile").val();
		
		if(!window.confirm(parent.translator.translateNode(this.getLxd(), 'tipsUpgradeReboot')))
		{
			return;
		}
		
		if(szFileName == "")
		{
			szAreaNameInfo += parent.translator.translateNode(this.getLxd(), 'tipsUpgradeFailed');
			$("#laServerUping").html(szAreaNameInfo);
			return;
		}
		
		var szUpgradeURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/updateFirmware";
		var szStatusURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/upgradeStatus";
		
		var iRet = m_PreviewOCX.HWP_StartUpgrade(szUpgradeURL, szStatusURL, m_szUserPwdValue, szFileName);
		if(iRet == -1)
		{
			szAreaNameInfo += parent.translator.translateNode(this.getLxd(), 'tipsUpgradeFailed');
			$("#laServerUping").html(szAreaNameInfo);
			return;
		}
		window.parent.$("#ConfigDivUpdateBlock").show();
		m_iUpdateTimerID = setInterval("Maintain.prototype.GetUpgradeStatus()",1000);
		$("#laServerUping").html("");
	}
	
	/*************************************************
	Function:		GetUpgradeStatus
	Description:	获取设备升级状态
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/	
	Maintain.prototype.GetUpgradeStatus = function()
	{
		var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		var iStatus = m_PreviewOCX.HWP_UpgradeStatus();
		if (iStatus == 0)
		{
			var iProcess = m_PreviewOCX.HWP_UpgradeProgress();
			if (iProcess < 0)
			{
				clearInterval(m_iUpdateTimerID);
				window.parent.$("#ConfigDivUpdateBlock").hide();
				alert(parent.translator.translateNode(this.getLxd(), 'tipsGetProgress'));
				return;
			}
			else if (iProcess < 100)
			{
				$("#laServerUping").html(m_szWaitState + parent.translator.translateNode(this.getLxd(), 'tipsUpdating') + parent.translator.translateNode(this.getLxd(), 'laProcess') + iProcess + "%");
				/*$("#upgradeProcess").width(parseInt(iProcess * $("#ServerUping").width() / 100));*/
			}
			else
			{
				/*$("#laServerUping").html(m_szWaitState + parent.translator.translateNode(this.getLxd(), 'tipsUpdating') + parent.translator.translateNode(this.getLxd(), 'laProcess') + iProcess + "%");*/
				$("#laServerUping").html(parent.translator.translateNode(this.getLxd(), 'tipsUpdateSucc'));
				m_PreviewOCX.HWP_StopUpgrade();
				clearInterval(m_iUpdateTimerID);		
				window.parent.$("#ConfigDivUpdateBlock").hide();
				//升级后自动重启
				pr(Maintain).restart();
/*				if (window.confirm(parent.translator.translateNode(this.getLxd(), 'tipsUpgradeReboot')))
				{
					$("#laServerUping").html('');
					ToRestart();
				}else 
				{
					$("#laServerUping").html(parent.translator.translateNode(this.getLxd(), 'tipsUpdateSucc'));
				} */
			}
		}
		else if (iStatus == 1)
		{
			m_PreviewOCX.HWP_StopUpgrade();
			$("#laServerUping").html(szAreaNameInfo + parent.translator.translateNode(this.getLxd(), 'tipsUpgradeFailed'));
			clearInterval(m_iUpdateTimerID);
			window.parent.$("#ConfigDivUpdateBlock").hide();
			return;
		}
		else if (iStatus == 2)
		{
			m_PreviewOCX.HWP_StopUpgrade();
			$("#laServerUping").html(szAreaNameInfo + parent.translator.translateNode(this.getLxd(), 'tipsLanguageMismatch'));
			clearInterval(m_iUpdateTimerID);
			window.parent.$("#ConfigDivUpdateBlock").hide();
			return;
		}
		else
		{
			clearInterval(m_iUpdateTimerID);
			window.parent.$("#ConfigDivUpdateBlock").hide();
			alert(parent.translator.translateNode(this.getLxd(), 'tipsGetStatus'));
			return;
		}
	}
	
	/*************************************************
	Function:		ImportParam
	Description:	导入配置参数
	Input:			无			
	Output:			无
	return:			无				
	*************************************************/
	Maintain.prototype.ImportParam = function()
	{
		if (window.confirm(parent.translator.translateNode(this.getLxd(), 'ImportRebootTips')))
		{
			var szFileName = $("#inImportFile").val();
			if (szFileName == "")
			{
				szAreaNameInfo = m_szErrorState + parent.translator.translateNode(this.getLxd(), 'ImportFailedTips');
				$("#laImportUping").html(szAreaNameInfo);
				return;
			}
			var szImportURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/configurationData";
			var iRet = m_PreviewOCX.HWP_ImportDeviceConfig(szImportURL, m_szUserPwdValue, szFileName, 0);
			if (iRet == -1)
			{
				szAreaNameInfo = m_szErrorState + parent.translator.translateNode(this.getLxd(), 'ImportFailedTips');
				$("#laImportUping").html(szAreaNameInfo);
				return;
			}
			else
			{
				 szAreaNameInfo = m_szSuccessState + parent.translator.translateNode(this.getLxd(), 'ImportSuccessTips');
				 $("#laImportUping").html(szAreaNameInfo);
				 this.restart();
				 return;
			}
		}
		else 
		{
			return;
		} 
	}
	
	/*************************************************
	Function:		ExportParam
	Description:	导出配置参数
	Input:			无			
	Output:			无
	return:			无
	*************************************************/	
	Maintain.prototype.ExportParam = function()	
	{
		var szExportURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/configurationData";
		var iRet = m_PreviewOCX.HWP_ExportDeviceConfig(szExportURL, m_szUserPwdValue, '', 0);
		if (iRet < 0)
		{
			szAreaNameInfo = m_szErrorState + parent.translator.translateNode(this.getLxd(), 'ExportFailedTips');
			$("#laExportUping").html(szAreaNameInfo);
			return;
		}
		else if(iRet == 0)
		{
			 var a = parent.translator.translateNode(this.getLxd(), 'ExportSuccessTips');
			 szAreaNameInfo = m_szSuccessState + parent.translator.translateNode(this.getLxd(), 'ExportSuccessTips');
			 $("#laExportUping").html(szAreaNameInfo);
			 return;
		}
	}

})(); // Maintain implementation


/************************************************
Function:		RS232Config
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
************************************************/
function RS232Config() {
	SingletonInheritor.implement(this);
	this.m_iRS232Index = 0;
	this.m_iRS232Count = 0;
	this.m_xmLDoc = null;
}
SingletonInheritor.declare(RS232Config);

(function () {  // RS232Config implementation

	/************************************************
	Function:		initCSS 类方法
	Description:	初始化CSS
	Input:			无			
	Output:			无
	return:			无				
	************************************************/
	RS232Config.prototype.initCSS = function()
	{
	}
	
	/************************************************
	Function:		RS232Config
	Description:	更新RS232信息
	Input:			无	
	Output:			无
	return:			无				
	************************************************/
	RS232Config.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
            $(".timehidden").hide();
			$(".232hidden").show();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").hide();
		}		
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "RS232Config"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);

		var that = this;
		$.ajax({
				   type: 'GET',
				   url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/3/capabilities",
				   beforeSend: function(xhr) {
					   xhr.setRequestHeader("If-Modified-Since", "0"); 
					   xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					   xhr.setRequestHeader("Content-Type", "text/xml");
				   },
				   success: function(xmlDoc, textStatus, xhr) {
					   var xmlU = new XmlUtils(xmlDoc);
					   if(xmlU.elems("baudRate").length > 0)
					   {
						   var strbaudRate = xmlU.elem("baudRate").getAttribute("opt").split(",");
						   if(strbaudRate != 'NOT_AVALIABLE')
						   {
							   var szOptionInfo = "";
							   $("#baudRate232").empty();
							   for(i = 0; i < strbaudRate.length; i++)
							   {
								   szOptionInfo += "<option value ='"+strbaudRate[i]+"'>"+strbaudRate[i]+" bps</option>";
							   }
							   $(szOptionInfo).appendTo("#baudRate232");
						   }
						   else
						   {
							   alert(m_szError400);
							   return;
						   }
						   that.Get232Serial();
					   }
					   autoResizeIframe();
				   },
				   error: function(XMLHttpRequest, textStatus, errorThrown) {
					   that.Get232Serial();
				   }
			   });
	}
	
	/************************************************
	 Function:		Get232Serial 
	Description:	获取232串口信息
	Input:			无		
	Output:			无
	return:			无				
	************************************************/
	RS232Config.prototype.Get232Serial = function()
	{
		var that = this;
		$.ajax({
			type: "get",
			url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports",
			beforeSend: function(xhr)
			{
			   xhr.setRequestHeader("If-Modified-Since", "0");
			   xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			   xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr)
			{
			   that.m_xmlDoc = xmlDoc;
			   var xmlU = new XmlUtils(that.m_xmlDoc);
			   var iNo = xmlU.elems('serialPortType').length;
			   
			   that.m_iRS232Count = 0;
			   for(var i = 0; i < iNo; i++)
			   {
				   if(xmlU.elems('serialPortType')[i].childNodes[0].nodeValue == "RS232")
				   {
					   that.m_iRS232Index = xmlU.elems('id')[i].childNodes[0].nodeValue;
					   that.m_iRS232Count++;
				   }
			   }
			   
			   if(that.m_iRS232Count > 0)
			   {
				   that.Get232SerialInEach();
			   }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
			   alert(m_szError400);
			}
		})
	}
	
	/************************************************
	Function:		Get232SerialInEach
	Description:	获取每个RS232信息
	Input:			无
	Output:			无
	return:			无		
	************************************************/
	RS232Config.prototype.Get232SerialInEach = function()
	{
		var that = this;
		$.ajax(
		{
			 type: "get",
			 url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/" + that.m_iRS232Index,
			 beforeSend: function(xhr)
			 {
				 xhr.setRequestHeader("If-Modified-Since", "0");
				 xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				 xhr.setRequestHeader("Content-Type", "text/xml");
			 },
			 success: function(xmlDoc, textStatus, xhr)
			 {
				 that.m_xmlDoc = xmlDoc;
				 var xmlU = new XmlUtils(that.m_xmlDoc);
				 
				 $("#baudRate232").val(xmlU.val("baudRate"));
				 $("#dataBits232").val(xmlU.val("dataBits"));
				 $("#stopRate232").val(xmlU.val("stopBits"));
				 $("#parityType232").val(xmlU.val("parityType"));
				 if(xmlU.elems('workMode').length > 0)
				 {
					 $("#workMode232").val(xmlU.val("workMode"));
				 }
				 if(xmlU.elems('flowCtrl').length > 0)
				 {
					 $("#flowControl232").val(xmlU.val("flowCtrl"));
				 }
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown)
			 {
				 alert(m_szError400);
			 }
		});
	}
	
	/************************************************
	Function:		submit
	Description:	设置232串口信息
	Input:			无		
	Output:			无
	return:			无				
	************************************************/
	RS232Config.prototype.submit = function()
	{
		var XmlDoc = new createxmlDoc();
		var Instruction = XmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
		XmlDoc.appendChild(Instruction);
		
		var Root = XmlDoc.createElement("SerialPort");	
		
		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode($('#232SerialNo').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("enabled");
		text = XmlDoc.createTextNode('true');
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("duplexMode");
		text = XmlDoc.createTextNode('half');
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("serialPortType");
		text = XmlDoc.createTextNode('RS232');
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("direction");
		text = XmlDoc.createTextNode('monodirectional');
		Element.appendChild(text);
		Root.appendChild(Element);
		
		Element = XmlDoc.createElement("baudRate");
		text = XmlDoc.createTextNode($('#baudRate232').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("dataBits");
		text = XmlDoc.createTextNode($('#dataBits232').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("parityType");
		text = XmlDoc.createTextNode($('#parityType232').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("stopBits");
		text = XmlDoc.createTextNode($('#stopRate232').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("workMode");
		text = XmlDoc.createTextNode($('#workMode232').val());
		Element.appendChild(text);
		Root.appendChild(Element); 
		
		Element = XmlDoc.createElement("flowCtrl");
		text = XmlDoc.createTextNode($('#flowControl232').val());
		Element.appendChild(text);
		Root.appendChild(Element);
		
		XmlDoc.appendChild(Root);
		
		var that = this;
		var a = that.m_iRS232Index;
		$.ajax(
		{
			type:"PUT",
			url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/" + that.m_iRS232Index,
			data:XmlDoc,
			processData: false,
			async:true,
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
		    },
			success: function(xmlDoc, textStatus, xhr) 
			{
				SaveState(xhr);
			},
			error: function(xhr, textStatus, errorThrown)
			{
				if(xhr.status == 403)
				{
					szRetInfo = m_szErrorState + m_szError8;
					$("#SetResultTips").html(szRetInfo);
					setTimeout(function(){$("#SetResultTips").html("");}, 5000);
					return;
				}
				SaveState(xhr);
			}
		});
	}
	
})(); // RS232Config implementation

/************************************************
Function:		RS485Config
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
************************************************/
function RS485Config() {
	SingletonInheritor.implement(this);
	this.m_xmLDoc = null;
	this.m_bSupportStandard485 = false;
}
SingletonInheritor.declare(RS485Config);

(function() { // RS485Config implementation
	/************************************************
	Function:		initCSS 类方法
	Description:	初始化CSS
	Input:			无			
	Output:			无
	return:			无				
	************************************************/
	RS485Config.prototype.initCSS = function()
	{
		
	};
		  
	/***********************************************
	Function:		RS485Config
	Description:	更新RS485信息
	Input:			无	
	Output:			无
	return:			无				
	***********************************************/
	RS485Config.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").show();
			$("#dvTelecontrol").find("select").hide();
		}
		$("#SaveConfigBtn").show();
		$("#SetResultTips").html("");
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "RS485Config"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
		
		$.ajax({
			type: "GET",
			url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/1/capabilities",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0"); 
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr) {
				that.m_bSupportStandard485 = true;
				var xmlU = new XmlUtils(xmlDoc);
				var szOptionInfo = "";
				
				if(xmlU.elems("baudRate").length > 0) {
					var strbaudRate = xmlU.elem("baudRate").getAttribute("opt").split(",")
					if(strbaudRate != 'NOT_AVALIABLE') {
						var szOptionInfo = "";
						$("#baudRate485").empty();
						for(i = 0; i < strbaudRate.length; i++) {
							szOptionInfo += "<option value ='"+strbaudRate[i]+"'>"+strbaudRate[i]+" bps</option>";
						}
						$(szOptionInfo).appendTo("#baudRate485");
					}
				}
				
				$.ajax({
					type: "GET",
					url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/capabilities",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0"); 
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
						xhr.setRequestHeader("Content-Type", "text/xml");
					},
					async: false,
					success: function(xmlDoc, textStatus, xhr) {
						var xmlU = new XmlUtils(xmlDoc);
						var szOptionInfo = "";
						
						var controlProtocol = xmlU.elem('controlProtocol').getAttribute("opt").split(",");
						if(controlProtocol != 'NOT_AVALIABLE') {
							$("#controlProtocol485").empty();
							var notValid = " ";
							var szTemp = controlProtocol;
							var szOptionInfo = "";
							for(i = 0; i < szTemp.length; i++) {
								if(szTemp[i].indexOf(notValid) >= 0) {
									szTemp[i] = szTemp[i].replace(/\s+/g, '');
									<!--szTemp[i] = $.trim(szTemp[i]);-->
								}	
							}
							
							szTemp = szTemp.sort();
							for(i = 0;i < szTemp.length; i++) {
								szOptionInfo += "<option value ='"+szTemp[i]+"'>"+szTemp[i]+"</option>";
							}
							$(szOptionInfo).appendTo("#controlProtocol485");
						}
					},
					complete: function() {
						that.Get485Serial();
						autoResizeIframe();
					}
				});
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				that.m_bSupportStandard485 = false;
				$.ajax({
					type: "GET",
					url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/capabilities",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0"); 
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
						xhr.setRequestHeader("Content-Type", "text/xml");
					},
					success: function(xmlDoc, textStatus, xhr) {
						var xmlU = new XmlUtils(xmlDoc);
						var szOptionInfo = "";
						
						var controlProtocol = xmlU.elem('controlProtocol').getAttribute("opt").split(",");
						if(controlProtocol != 'NOT_AVALIABLE') {
							$("#controlProtocol485").empty();
							var notValid = " ";
							var szTemp = controlProtocol;
							var szOptionInfo = "";
							for(i = 0; i < szTemp.length; i++) {
								if(szTemp[i].indexOf(notValid) >= 0) {
									szTemp[i] = szTemp[i].replace(/\s+/g, '');
									<!--szTemp[i] = $.trim(szTemp[i]);-->
								}	
							}
							
							szTemp = szTemp.sort();
							for(i = 0;i < szTemp.length; i++) {
								szOptionInfo += "<option value ='"+szTemp[i]+"'>"+szTemp[i]+"</option>";
							}
							$(szOptionInfo).appendTo("#controlProtocol485");
						}
						
						if(xmlU.elems("baudRate").length > 0) {
							var strbaudRate = xmlU.elem("baudRate").getAttribute("opt").split(",")
							if(strbaudRate != 'NOT_AVALIABLE') {
								var szOptionInfo = "";
								$("#baudRate485").empty();
								for(i = 0; i < strbaudRate.length; i++) {
									szOptionInfo += "<option value ='"+strbaudRate[i]+"'>"+strbaudRate[i]+" bps</option>";
								}
								$(szOptionInfo).appendTo("#baudRate485");
							}
						}
						
						that.Get485Serial();
						autoResizeIframe();
					}
				});
			}
		});
		
	}
	
	/************************************************
    Function:		Get485Serial
    Description:	获取单个485串口信息
    Input:			无		
    Output:			无
    return:			无				
    ************************************************/
	RS485Config.prototype.Get485Serial = function()
	{
		var szUrl = "";
		if(!this.m_bSupportStandard485) {
			szUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels";
		} else {
			szUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1";
		}
		var that = this;
		$.ajax({
			type: "GET",
			url: szUrl,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0"); 
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr) {
				that.m_xmlDoc = xmlDoc;
				var xmlU = new XmlUtils(xmlDoc);
				
				if(!that.m_bSupportStandard485) {
					$("#baudRate485").val(xmlU.val("baudRate"));
					$("#dataBits485").val(xmlU.val("dataBits"));
					$("#stopRate485").val(xmlU.val("stopBits"));
					$("#parityType485").val(xmlU.val("parityType"));
					$("#flowControl485").val(xmlU.val("flowCtrl"));
					$("#controlProtocol485").val(xmlU.val("controlProtocol"));
					$("#controlAddress485").val(xmlU.val("controlAddress"));
				} else {
					$("#controlProtocol485").val(xmlU.val("controlProtocol"));
					$("#controlAddress485").val(xmlU.val("controlAddress"));
					$.ajax({
						type: "GET",
						url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/1",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("If-Modified-Since", "0"); 
							xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
							xhr.setRequestHeader("Content-Type", "text/xml");
						},
						success: function(xmlDoc, textStatus, xhr) {
							var xmlU = new XmlUtils(xmlDoc);
							$("#baudRate485").val(xmlU.val("baudRate"));
							$("#dataBits485").val(xmlU.val("dataBits"));
							$("#stopRate485").val(xmlU.val("stopBits"));
							$("#parityType485").val(xmlU.val("parityType"));
							$("#flowControl485").val(xmlU.val("flowCtrl"));
						}
					});
				}
				
			}
		});
	}
	
    /************************************************
    Function:		submit
    Description:	设置485串口信息
    Input:			无		
    Output:			无
    return:			无				
    ************************************************/
	RS485Config.prototype.submit = function()
	{
		if (this.m_xmlDoc === null)
		{
			return;
		}
		var xmlU = new XmlUtils(this.m_xmlDoc);
		
		/*if(($("#controlProtocol485").val() == "PELCO_P") || ($("#controlProtocol485").val() == "PELCO-P"))
		{
			if(!CheackServerIDIntNum($("#controlAddress485").val(),'controlAddresstips','DecoderaddrTips',1,255))
			{
				return;
			}
		}
		else*/
		{
			if(!CheackServerIDIntNum($("#controlAddress485").val(),'controlAddresstips','DecoderaddrTips',0,255))
			{
				return;
			}
		}
		if(!this.m_bSupportStandard485) {
			xmlU.val("baudRate", $('#baudRate485').val());
			xmlU.val("dataBits", $('#dataBits485').val());
			xmlU.val("stopBits", $('#stopRate485').val());
			xmlU.val("parityType", $('#parityType485').val());
			xmlU.val("flowCtrl", $('#flowControl485').val());
		}
		xmlU.val("controlProtocol", $('#controlProtocol485').val());
		xmlU.val("controlAddress", $('#controlAddress485').val());
		
		var XmlDoc = xmlU.doc;
		var that = this;
		var szUrl = "";
		if(!this.m_bSupportStandard485) {
			szUrl = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels";
		} else {
			szUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1";
		}
		$.ajax({
			type:"PUT",
			url:szUrl,
			data:XmlDoc,
			processData: false,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				xhr.setRequestHeader("Content-Type", "text/xml");
			},
			success: function(xmlDoc, textStatus, xhr) {
				if(that.m_bSupportStandard485) {
					var szXml = "<?xml version='1.0' encoding='UTF-8'?><SerialPort><id>1</id><enabled>true</enabled><serialPortType>RS485</serialPortType><duplexMode>half</duplexMode><baudRate>"+$('#baudRate485').val()+"</baudRate><dataBits>"+$('#dataBits485').val()+"</dataBits><parityType>"+$('#parityType485').val()+"</parityType><stopBits>"+$('#stopRate485').val()+"</stopBits><flowCtrl>"+$('#flowControl485').val()+"</flowCtrl></SerialPort>";
					var xmlDoc = parseXmlFromStr(szXml);
					$.ajax({
						type:"PUT",
						url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports/1",
						data:xmlDoc,
						processData: false,
						beforeSend: function(xhr) {
							xhr.setRequestHeader("If-Modified-Since", "0");  
							xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
							xhr.setRequestHeader("Content-Type", "text/xml");
						},
						success: function(xmlDoc, textStatus, xhr) {
								SaveState(xhr);
						},
						error: function(xhr, textStatus, errorThrown)
						{
							if(xhr.status == 403)
							{
								szRetInfo = m_szErrorState + m_szError8;
								$("#SetResultTips").html(szRetInfo);
								setTimeout(function(){$("#SetResultTips").html("");}, 5000);
								return;
							}
							SaveState(xhr);
						}
					});
				} else {
					SaveState(xhr);
				}
			},
			error: function(xhr, textStatus, errorThrown)
			{
				if(xhr.status == 403)
				{
					szRetInfo = m_szErrorState + m_szError8;
					$("#SetResultTips").html(szRetInfo);
					setTimeout(function(){$("#SetResultTips").html("");}, 5000);
					return;
				}
				SaveState(xhr);
			}
		});
	}
})(); // RS485Config implementation

/************************************************
Function:		Telecontrol
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
************************************************/
function Telecontrol() {
	SingletonInheritor.implement(this);
	this.m_xmLDoc = null;
}
SingletonInheritor.declare(Telecontrol);

(function() { // RS485Config implementation
	/************************************************
	Function:		initCSS 类方法
	Description:	初始化CSS
	Input:			无			
	Output:			无
	return:			无				
	************************************************/
	Telecontrol.prototype.initCSS = function()
	{
		$("#dvTelecontrol").find("select[id='seDelayTime']").change(function()
		{
			if(this.value == '-1')
			{
				$(this).nextAll().show();
			}
			else
			{
				$(this).nextAll().hide();
			}
		});
		$("#seHardType").change(function()
		{
			if(this.value == 'tel')
			{
				$(this).next().hide();
			}
			else
			{
				$(this).next().show();
			}
		});
		//
		$("#seArmOrDisarm").change(function()
		{
			if(this.value == "arm")
			{
				if($("#seDelayTime").val() == "-1")
				{
					$("#seDelayTime").show();
					$("#teCustomizeDelay").show();
					$("#laCustomizeDelay").show();
				}
				else
				{
					$("#seDelayTime").show();
					$("#teCustomizeDelay").hide();
					$("#laCustomizeDelay").hide();
				}
			}
			else
			{
				$("#seDelayTime").hide();
				$("#teCustomizeDelay").hide();
				$("#laCustomizeDelay").hide();
			}
		});
		if(g_bSupportWLS)
		{
			$("#seHardType").append('<option value="wls" name="laWirelessAlarm">'+getNodeValue("laWirelessAlarm")+'</option>').after('<select id="seWLSID" style="display:none; width:100px; vertical-align:middle;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select>');
		}
	};	  
	/***********************************************
	Function:		Telecontrol
	Description:	更新遥控器
	Input:			无	
	Output:			无
	return:			无				
	***********************************************/
	Telecontrol.prototype.update = function()
	{
		if($.browser.msie && parseInt($.browser.version, 10) == 6)
		{
            $(".timehidden").hide();
			$(".232hidden").hide();
			$(".485hidden").hide();
			$("#dvTelecontrol").find("select").show();
			$("#seHardType").change();
		}
		$("#SaveConfigBtn").hide();
		$("#SetResultTips").html("");
		
		$.ajax(
		{
			type:"GET",
			url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Telecontrol",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			success: function(xmlDoc, textStatus, xhr) 
			{
				var arr = ["0", "10", "30", "60", "180", "300"];
				var szEnable = $(xmlDoc).find("enabled").eq(0).text();
				if(szEnable == "true")
				{
					$("#seArmOrDisarm").val("arm");
					var szArmingDelay = $(xmlDoc).find("armingdelay").eq(0).text();
					if($.inArray(szArmingDelay, arr) != -1)
					{
						$("#seDelayTime").val(szArmingDelay);
					}
					else
					{
						$("#seDelayTime").val('-1').change();
						$("#teCustomizeDelay").val(szArmingDelay);
					}
				}
				else
				{
					$("#seArmOrDisarm").val("disarm");
					$("#seDelayTime").hide();
					$("#teCustomizeDelay").hide();
					$("#laCustomizeDelay").hide();
				}
			}
		});	
		
		g_transStack.clear();
		var that = this;
		g_transStack.push(function() {
			that.setLxd(parent.translator.getLanguageXmlDoc(["System", "Telecontrol"]));
			parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
			parent.translator.translatePage(that.getLxd(), document);
		}, true);
	}
	/***********************************************
	Function:		study
	Description:	学习
	Input:			无	
	Output:			无
	return:			无				
	***********************************************/
	Telecontrol.prototype.study = function()
	{
		var szURL = "";
		if($("#seHardType").val() == "tel")
		{
			szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Telecontrol/study";
		}
		else
		{
			szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/WLSensors/"+$("#seWLSID").val()+"/study";
		}
		$.ajax(
		{
			type:"PUT",
			url: szURL,
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader("If-Modified-Since", "0");  
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			complete: function(xhr, textStatus) 
			{
				SaveState(xhr);
			}
		});	
	}
	/***********************************************
	Function:		set
	Description:	设置布/撤防
	Input:			无	
	Output:			无
	return:			无				
	***********************************************/
	Telecontrol.prototype.set = function()
	{
		var szXml = "";
		if($("#seArmOrDisarm").val() == "arm")
		{
			if($("#seDelayTime").val() == "-1")
			{
				if(!CheackServerIDIntNum($("#teCustomizeDelay").val(),'spDelayTips','laDelay',0,300))
				{
					return;
				}
				szXml = "<?xml version='1.0' encoding='UTF-8'?><telecontrol><enabled>true</enabled><delay><armingdelay>"+$("#teCustomizeDelay").val()+"</armingdelay></delay></telecontrol>";
			}
			else
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?><telecontrol><enabled>true</enabled><delay><armingdelay>"+$("#seDelayTime").val()+"</armingdelay></delay></telecontrol>";
			}
			var xmlDoc = parseXmlFromStr(szXml);
			$.ajax(
			{
				type:"PUT",
				url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Telecontrol",
				data:xmlDoc,
				processData: false,
				beforeSend: function(xhr)
				{
					xhr.setRequestHeader("If-Modified-Since", "0");  
					xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				},
				complete: function(xhr, textStatus) 
				{
					SaveState(xhr);
				}
			});	
		}
		else
		{
			/*if($("#seDelayTime").val() == "-1")
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?><telecontrol><enabled>false</enabled><delay><disarmingdelay>"+$("#teCustomizeDelay").val()+"</disarmingdelay></delay></telecontrol>";
			}
			else
			{
				szXml = "<?xml version='1.0' encoding='UTF-8'?><telecontrol><enabled>false</enabled><delay><disarmingdelay>"+$("#seDelayTime").val()+"</disarmingdelay></delay></telecontrol>";
			}*/
			$.ajax(
			{
				type:"PUT",
				url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Telecontrol/disarming",
				processData: false,
				beforeSend: function(xhr)
				{
					xhr.setRequestHeader("If-Modified-Since", "0");  
					xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				},
				complete: function(xhr, textStatus) 
				{
					SaveState(xhr);
				}
			});
		}
	}
})(); // Telecontrol
/*************************************************
Function:		GetNetworkVersion
Description:	获取设备是否支持IPV6
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNetworkVersion()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		async: false,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			m_strIpVersion = $(xmlDoc).find('ipVersion').eq(0).text();
		}
	});
}