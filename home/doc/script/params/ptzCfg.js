var sliderPtzSpd = null;      //PTZ速度滑动条
var m_bPTZAuto = false;         //云台是否自动轮询
var m_iPtzSpeed = 60;
var g_szPtzChannelXml = "";    //PTZ通道基本信息
var g_szPtzTimeTasksXml = "";    //PTZ定时任务信息
var g_oSelPMXml = null;        //某块PTZ隐私遮蔽块信息
var g_tTimeTasks = [];//定时任务信息数组

/*************************************************
Function:		initPtzCfg
Description:	初始化云台配置界面
Input:			无 
Output:			无
return:			无
*************************************************/
function initPtzCfg()
{
	if(checkPlugin('1', getNodeValue('laPlugin'), 1, 'privacymask'))
	{
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
	}
	sliderPtzSpd = new neverModules.modules.slider(
	{targetId: "ptzSlider",
	sliderCss: "speedSlider",
	barCss: "speedBar",
	min: 1,
	max: 7,
	hints: ""
	}); 
	sliderPtzSpd.create();
	sliderPtzSpd.wsetValue(4);
	
	sliderPtzSpd.onchange = function () 
	{
		var spd= sliderPtzSpd.getValue();
		if(spd < 7)
		{
		  m_iPtzSpeed = spd*15;
		}
		else
		{
		  m_iPtzSpeed = 100;
		}
		g_transStack.push(function() { sliderPtzSpd.setTitle(getNodeValue('ptzSpeed') + ':' + spd); }, true);  //云台活动条提示
	};
	//云台添加hover事件
	$(".ptzDir").find("span").each(function()
	{
		$(this).hover
		(
			function () 
			{
				$(this).addClass("sel");
			},
			function () 
			{
				$(this).removeClass("sel");
			}
		);
	});
	//自动扫描点击事件
	$("#auto").unbind().hover(function () 
	{
		if(!m_bPTZAuto)
		{
			$(this).addClass("sel");
		}
	},
	function()
	{
		if(!m_bPTZAuto)
		{
			$(this).removeClass("sel");
		}
	});
	
	$(".ptzBtnMid").find("span").each(function()
	{
		$(this).hover
		(
			function () 
			{
				$(this).addClass("sel");
			},
			function () 
			{
				$(this).removeClass("sel");
			}
		);
	});
	
	$(".ptzAidBg").find("span").each(function()
	{
		$(this).hover
		(
			function () 
			{
				$(this).addClass("sel");
			},
			function () 
			{
				$(this).removeClass("sel");
			}
		);
	});
	//预置点列表
	InitPreset();
	//为所有复选框添加checkbox类
	$("#ptzCfg").find(":checkbox").addClass("checkbox");
	/********基本设置*********/
	for(var i = 1; i <= 40; i ++)
	{
		$("<option value='"+ i +"'>"+ i +"</option>").appendTo("#autoScanSpeed");
	}
	/********限位初始化*********/
	/*$("#enableLimit").bind(
	{
		click:function()
		{
			if(this.checked)
			{
				$("#limitType").prop("disabled", false);
			}
			else
			{
				$("#limitType").prop("disabled", true);
			}
		}
	});*/
	//改变限位模式
	$("#limitType").bind("change",function()
	{
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds/" + this.value;
		$.ajax(
		{
			type: "GET",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			async: true,
			timeout: 15000,
			url: szURL,
			success: function(xmlDoc, textStatus, xhr) 
			{
				if(g_transStack.getLength() > 1)
				{
					g_transStack.pop();
				}
				g_transStack.push(function(){$("#limitStatus").val($(xmlDoc).find('enabled').eq(0).text() == "true"?getNodeValue('jsLimited'):getNodeValue('jsNoLimited'))},true);
			},
			error:function()
			{
				
			}
		});
	});
	/********守望*********/
	$('#enabledPark').bind("click",function()
	{
		if(this.checked)
		{
			$("#parkTime").prop("disabled", false);
			$("#actionType").prop("disabled", false);
			$("#actionNum").prop("disabled", false);
		}
		else
		{
			$("#parkTime").prop("disabled", true);
			$("#actionType").prop("disabled", true);
			$("#actionNum").prop("disabled", true);
		}
	});
	$("#actionType").bind("change", function()
	{
		var szVal = this.value;
		if(szVal == "patrol" || szVal == "pattern" || szVal == "preset")
		{
			$("#actionNumArea").show();
			if(szVal == "patrol" || szVal == "preset")
			{
				$("#actionNum").empty();
				for(var i = 1;i <= 8; i++)
				{
				   $("<option value ='"+i+"'>"+i+"</option>").appendTo("#actionNum");
				}
			}
			else
			{
				$("#actionNum").empty();
				for(var i = 1;i <= 4; i++)
				{
				   $("<option value ='"+i+"'>"+i+"</option>").appendTo("#actionNum");
				}
			}
		}
		else
		{
			$("#actionNumArea").hide();
		}
	});
	/********隐私遮蔽*********/
	$('#enablePrivacyMask').bind("click",function()
	{
		var szXml = "<?xml version='1.0' encoding='utf-8'?><PrivacyMask><enabled>"+this.checked.toString()+"</enabled></PrivacyMask>"
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask";
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
	});
	/*************定时任务**************/
	$("#btnEditingTasks").bind("click", function()
	{
		if(g_oEditWnd)
		{
			var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "TimeTasks"]);
		    parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		    parent.translator.translatePage(lan, document);
		
			$('#dvEditTimeTasks').modal();
			g_oEditWnd.selWeekDay(0);
		}
	});
	GetAlarmOutNo();//获取报警输出数
	/*************清除配置**************/
	//关联点击事件
	var oCheckBoxSet = $("#clearCfg").find("input[id!=clearCfgAll]");
	$("#clearCfgAll").unbind().bind("click", function()
	{
		if(this.checked)
		{
			oCheckBoxSet.prop("checked", true);
		}
		else
		{
			oCheckBoxSet.prop("checked", false);
		}
	});
	oCheckBoxSet.each(function()
	{
		$(this).unbind().bind("click", function()
		{
			for(var i = 0; i < oCheckBoxSet.length; i++)
			{
				if(!oCheckBoxSet[i].checked)
				{
					$("#clearCfgAll").prop("checked", false);
					return;
				}
			}
			$("#clearCfgAll").prop("checked", true);
		});
	});
}
/*************************************************
Function:		InitPreset
Description:	初始化预置点
Input:			无 
Output:			无
return:			无
*************************************************/
function InitPreset()
{
	for(var i = 0; i < 256; i++)
	{
		var szName = getNodeValue("laPreset");
		var iId = i+1;
		$("<div><span><label name='laPreset'>" + szName+ "</label> " + iId + "</span><span></span></div>").appendTo("#PresetArea").bind("click",{index: iId}, function(event)
		{
			if(!$(this).hasClass("select"))
			{
				$(this).siblings(".select").each(function()
				{
					$(this).removeClass("select");
					$(this).children("span").eq(1).removeClass("gotoPreset").unbind();
				});
				$(this).attr("class","select");
				$(this).children("span").eq(1).addClass("gotoPreset").attr("title", getNodeValue("ExcutePreset")).bind("click",{index: event.data.index},function(event)
				{
					GotoPreset(event.data.index);
				});
			}
		}).bind(
		{
			mouseover:function()
			{
				if(!$(this).hasClass("select"))
				{
					$(this).addClass("enter");
				}
			},
			mouseout:function()
			{
				$(this).removeClass("enter");
			}
		}).children("span").eq(0).addClass("firstchild");
	}
}
/*************************************************
Function:		initPtzBasic
Description:	初始化云台基本设置
Input:			无 
Output:			无
return:			无
*************************************************/
function initPtzBasic()
{
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "PtzBasic"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#ptzBasic").find("select").show();
		}
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').hide();
	$('#ptzArea').hide();
	getPtzBasic();
}
/*************************************************
Function:		getPtzBasic
Description:	获取云台基本设置
Input:			无 
Output:			无
return:			无
*************************************************/
function getPtzBasic()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_szPtzChannelXml = xhr.responseText;
			var xmlRoot = $(xmlDoc).find("PTZChannel").eq(0);
			$("#presetSpeed").val(xmlRoot.find("presetSpeed").eq(0).text());
			$("#keyBoardControlSpeed").val(xmlRoot.find("keyBoardControlSpeed").eq(0).text());
			
			var autoScanSpeed = xmlRoot.find("autoPatrolSpeed").eq(0).text();
			autoScanSpeed = Math.floor(autoScanSpeed/2.5);
			$("#autoScanSpeed").val(autoScanSpeed);
		},
		error:function()
		{
			g_szPtzChannelXml = "";
		}
	});
	//比例变倍
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/proportionalpan";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#enableProportionZoom").prop("checked",$(xmlDoc).find("enabled").eq(0).text()=="true"?true:false);
		},
		error:function()
		{
			
		}
	});
	//预置点视频冻结
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/ImageFreeze";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#enableImageFreeze").prop("checked",$(xmlDoc).find("enabled").eq(0).text()=="true");
		},
		error:function()
		{
			$("#enableImageFreeze").prop("disabled",true).prop("checked",false);
		}
	});
	//OSD显示
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/PTZOSDDisplay";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			var xmlRoot = $(xmlDoc).find("PTZOSDDisplay").eq(0);
			$("#zoomLable").val(xmlRoot.find("zoomlable").eq(0).text());
			$("#azimuth").val(xmlRoot.find("azimuth").eq(0).text());
			$("#presetLable").val(xmlRoot.find("presetlable").eq(0).text());
		},
		error:function()
		{
			
		}
	});
	//掉电模式
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/saveptzpoweroff";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			var xmlRoot = $(xmlDoc).find("savePtzPoweroff").eq(0);
			$("#savePowerType").val(xmlRoot.find("savePtzPoweroffType").eq(0).text());
		},
		error: function(xhr, textStatus, errorThrown)
		{
			
		}
	});
}
/*************************************************
Function:		setPtzBasic
Description:	设置云台基本设置
Input:			无 
Output:			无
return:			无
*************************************************/
function setPtzBasic()
{
	if(g_szPtzChannelXml == "")
	{
		return;
	}
	var iReturn = 0;
	
	var szXml = g_szPtzChannelXml;
	var xmlDoc = parseXmlFromStr(szXml);
	$(xmlDoc).find("presetSpeed").eq(0).text($("#presetSpeed").val());
	$(xmlDoc).find("keyBoardControlSpeed").eq(0).text($("#keyBoardControlSpeed").val());
	$(xmlDoc).find("autoPatrolSpeed").eq(0).text(Math.ceil($("#autoScanSpeed").val()*2.5));
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1";
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
			iReturn++;
			if(iReturn == 5)
			{
				SaveState(xhr);
			}
		}
	});
	//比例变倍
	szXml = "<?xml version='1.0' encoding='utf-8'?><proportionalpan version='1.0' xmlns='urn:psialliance-org'><enabled>"+$("#enableProportionZoom").prop("checked").toString()+"</enabled></proportionalpan>";
	xmlDoc = parseXmlFromStr(szXml);
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/proportionalpan";
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
			iReturn++;
			if(iReturn == 5)
			{
				SaveState(xhr);
			}
		}
	});
	//预置点视频冻结
	if(!$("#enableImageFreeze").prop("disabled")){
		szXml = "<?xml version='1.0' encoding='utf-8'?><ImageFreeze version='1.0' xmlns='urn:psialliance-org'><enabled>"+$("#enableImageFreeze").prop("checked").toString()+"</enabled></ImageFreeze>";
		xmlDoc = parseXmlFromStr(szXml);
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Image/channels/1/ImageFreeze";
		$.ajax({
			type: "PUT",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			processData: false,
			data: xmlDoc,
			complete:function(xhr, textStatus){
				iReturn++;
				if(iReturn == 5){
					SaveState(xhr);
				}
			}
		});
	}else{
		iReturn++;
	}
	//OSD显示
	szXml = "<?xml version='1.0' encoding='utf-8'?><PTZOSDDisplay version='1.0' xmlns='urn:psialliance-org'><zoomlable>"+$("#zoomLable").val()+"</zoomlable><azimuth>"+$("#azimuth").val()+"</azimuth><presetlable>"+$("#presetLable").val()+"</presetlable></PTZOSDDisplay>";
	xmlDoc = parseXmlFromStr(szXml);
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/PTZOSDDisplay";
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
			iReturn++;
			if(iReturn == 5)
			{
				SaveState(xhr);
			}
		}
	});
	//掉电模式
	szXml = "<?xml version='1.0' encoding='utf-8'?><savePtzPoweroff version='1.0' xmlns='urn:psialliance-org'><savePtzPoweroffType>"+$("#savePowerType").val()+"</savePtzPoweroffType></savePtzPoweroff>";
	xmlDoc = parseXmlFromStr(szXml);
	szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/saveptzpoweroff";
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
			iReturn++;
			if(iReturn == 5)
			{
				SaveState(xhr);
			}
		}
	});
}
/*************************************************
Function:		initParkAction
Description:	初始化守望配置
Input:			无 
Output:			无
return:			无
*************************************************/
function initParkAction()
{
	getParkActionCab();
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "ParkAction"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#parkaction").find("select").show();
		}
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').hide();
	$('#ptzArea').hide();
	getParkAction();	
}
/*************************************************
Function:		getParkActionCab
Description:	获取守望能力
Input:			无 
Output:			无
return:			无
*************************************************/
function getParkActionCab()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/parkaction/capabilities";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		async: false,
		success: function(xmlDoc, textStatus, xhr) {
			if(undefined != $(xmlDoc).find("ActionType").eq(0).attr("opt")){
				$("#actionType").empty();
				var optActionType = $(xmlDoc).find("ActionType").eq(0).attr("opt").split(",");
				insertOptions2Select(optActionType, ["autoscan","framescan","randomscan","patrol","pattern","preset","panoramascan","tiltscan","autotrack"], ["autoScan", "frameScan", "randomScan", "patrolScan", "Pattern", "laPreset", "panoramaScan", "tiltScan", "autoTrack"], "actionType");
			}
		}
	});
}
/*************************************************
Function:		getParkAction
Description:	获取守望配置
Input:			无 
Output:			无
return:			无
*************************************************/
function getParkAction()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/parkaction";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			var xmlRoot = $(xmlDoc);
			var szEnabled = xmlRoot.find("enabled").eq(0).text();
			if("true" == szEnabled)
			{
				$("#enabledPark")[0].checked = true;
				$("#parkTime").prop("disabled", false);
				$("#actionType").prop("disabled", false);
				$("#actionNum").prop("disabled", false);
			}
			else
			{
				$("#enabledPark")[0].checked = false;
				$("#parkTime").prop("disabled", true);
				$("#actionType").prop("disabled", true);
				$("#actionNum").prop("disabled", true);
			}
			$("#parkTime").val(xmlRoot.find("Parktime").eq(0).text());
			var szActionType = xmlRoot.find("ActionType").eq(0).text();
			$("#actionType").val(szActionType);
			if(szActionType == "patrol" || szActionType == "pattern" || szActionType == "preset")
			{
				$("#actionNumArea").show();
				if(szActionType == "patrol" || szActionType == "preset")
				{
					$("#actionNum").empty();
					for(var i = 1;i <= 8; i++)
					{
					   $("<option value ='"+i+"'>"+i+"</option>").appendTo("#actionNum");
					}
				}
				else
				{
					$("#actionNum").empty();
					for(var i = 1;i <= 4; i++)
					{
					   $("<option value ='"+i+"'>"+i+"</option>").appendTo("#actionNum");
					}
				}
				$("#actionNum").val(xmlRoot.find("ActionNum").eq(0).text());
			}
			else
			{
				$("#actionNumArea").hide();
			}
		},
		error:function()
		{
		}
	});
}
/*************************************************
Function:		setParkAction
Description:	设置守望配置
Input:			无 
Output:			无
return:			无
*************************************************/
function setParkAction()
{
	if(!CheackServerIDIntNum($("#parkTime").val(),'parkTimeTips','laParkTime',5,720))
	{
		return;
	}
	var szActionType = $("#actionType").val();
	var szXml = "<?xml version='1.0' encoding='utf-8' ?><ParkAction><enabled>"+$("#enabledPark").prop("checked")+"</enabled><Parktime>"+$("#parkTime").val()+"</Parktime><Action><ActionType>"+szActionType+"</ActionType>";
	if(szActionType == "patrol" || szActionType == "pattern" || szActionType == "preset")
	{
		szXml += "<ActionNum>"+$("#actionNum").val()+"</ActionNum></Action></ParkAction>";
	}
	else
	{
		szXml += "<ActionNum>0</ActionNum></Action></ParkAction>";
	}
	
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/parkaction";
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
Function:		initHomePos
Description:	初始化零方位角
Input:			无 
Output:			无
return:			无
*************************************************/
function initHomePos()
{
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
		changePTZLan();
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#homePos").find("select").show();
		}
		//开预览
		if(!HWP.wnds[0].isPlaying)
		{
			setTimeout(function() 
			{
				if (HWP.Play() !== 0) 
				{
					alert(getNodeValue("previewfailed"));
				}
			}, 100);
		}
	}
	else
	{
		HWP.Stop(0);
		setTimeout(function() 
		{
			HWP.Play();
		}, 100);	
	}
	$("#SaveConfigBtn").hide();
	$('#enablePMArea').hide();
	$('#ptzArea').show();
}
/*************************************************
Function:		SetHomePos
Description:	设置零方位角
Input:			无
Output:			无
return:			无
*************************************************/
function SetHomePos()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/homePosition";
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
Function:		CleanHomePos
Description:	清除零方位角
Input:			无
Output:			无
return:			无
*************************************************/
function CleanHomePos()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/homePosition";
	$.ajax(
	{
		type: "DELETE",
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
Function:		GotoHomePos
Description:	调用零方位角
Input:			无
Output:			无
return:			无
*************************************************/
function GotoHomePos()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/homePosition/goto";
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
			//SaveState(xhr);
		}
	});
}
/*************************************************
Function:		initLimit
Description:	初始化限位界面
Input:			无
Output:			无
return:			无
*************************************************/
function initLimit()
{
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "PtzLimiteds"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
		changePTZLan();
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#ptzlimiteds").find("select").show();
		}
		//开预览
		if(!HWP.wnds[0].isPlaying)
		{
			setTimeout(function() 
			{
				if (HWP.Play() !== 0) 
				{
					alert(getNodeValue("previewfailed"));
				}
			}, 100);
		}
	}
	else
	{
		HWP.Stop(0);
		setTimeout(function() 
		{
			HWP.Play();
		}, 100);	
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').hide();
	$('#ptzArea').show();
	getLimitInfo();
}
/*************************************************
Function:		getLimitInfo
Description:	获取限位信息
Input:			无
Output:			无
return:			无
*************************************************/
function getLimitInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#enableLimit")[0].checked = ($(xmlDoc).find("enabled").eq(0).text() == "true"?true:false);
			/*if($("#enableLimit")[0].checked)
			{
				$("#limitType").prop("disabled", false);
				if($("#limitType").val() != "")
				{
					var iId = parseInt($("#limitType").val(),10);
				}
				else
				{
					$("#limitType").val("1");
				}
			}
			else
			{
				$("#limitType").prop("disabled", true);
			}*/
			if($("#limitType").val() != "")
			{
				var iId = parseInt($("#limitType").val(),10);
			}
			else
			{
				$("#limitType").val("1");
				var iId = 1;
			}
			g_transStack.push(function(){$("#limitStatus").val($(xmlDoc).find('PTZLimited').eq(iId-1).find('enabled').eq(0).text() == "true"?getNodeValue('jsLimited'):getNodeValue('jsNoLimited'));}, true);
		},
		error:function()
		{
		}
	});
}
/*************************************************
Function:		setLimitInfo
Description:	设置限位信息
Input:			无
Output:			无
return:			无
*************************************************/
function setLimitInfo()
{
	var szXml = '<?xml version="1.0" encoding="utf-8"?><PTZLimitedList><enabled>'+$("#enableLimit")[0].checked.toString()+'</enabled></PTZLimitedList>';
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
	/*if(!$("#enableLimit")[0].checked)
	{
		return;
	}*/
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds/" + $("#limitType").val() +"/set";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
			$("#limitType").change();
		}
	});
}
/*************************************************
Function:		startLimitInfo
Description:	开始设置限位信息
Input:			无
Output:			无
return:			无
*************************************************/
function startLimitInfo()
{
	/*if(!$("#enableLimit")[0].checked)
	{
		return;
	}*/
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds/" + $("#limitType").val() +"/setstart";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		cleanLimitInfo
Description:	清除限位信息
Input:			无
Output:			无
return:			无
*************************************************/
function cleanLimitInfo()
{
	/*if(!$("#enableLimit")[0].checked)
	{
		return;
	}*/
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds/" + $("#limitType").val()
	$.ajax(
	{
		type: "DELETE",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			if(g_transStack.getLength() > 1)
			{
				g_transStack.pop();
			}
			g_transStack.push(function(){$("#limitStatus").val(getNodeValue('jsNoLimited'));}, true);
		}
	});
}
/*************************************************
Function:		initPrivacyMask
Description:	初始化隐私遮蔽
Input:			无
Output:			无
return:			无
*************************************************/
function initPrivacyMask()
{
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "PrivacyMask"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
		changePTZLan();
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#privacyMask").find("select").show();
		}
		//开预览
		if(!HWP.wnds[0].isPlaying)
		{
			setTimeout(function() 
			{
				if (HWP.Play() !== 0) 
				{
					alert(getNodeValue("previewfailed"));
				}
			}, 100);
		}
	}
	else //非IE每次都需要开预览
	{
		HWP.Stop(0);
		setTimeout(function() 
		{
			HWP.Play();
		}, 100);	
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').show();
	$('#ptzArea').show();
	
	var szXml = "<?xml version='1.0' encoding='utf-8' ?><DetectionRegionInfo><videoFormat>"+m_iVideoOutNP+"</videoFormat><RegionType>roi</RegionType><ROI><HorizontalResolution>"+/*704*/255+"</HorizontalResolution><VerticalResolution>"+/*(m_iVideoOutNP=='PAL'?576:480 )*/255+"</VerticalResolution></ROI><DisplayMode>shelter</DisplayMode><MaxRegionNum>1</MaxRegionNum></DetectionRegionInfo>";
	HWP.SetRegionInfo(szXml);
	getPrivacyMaskArea();
}
/*************************************************
Function:		getPrivacyMaskArea
Description:	获取隐私遮蔽区域信息
Input:			无
Output:			无
return:			无
*************************************************/
function getPrivacyMaskArea()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			/*if($(xmlDoc).find('enabled').eq(0).text() == "true")*/
			{
				$('#enablePrivacyMask').prop("checked", $(xmlDoc).find('enabled').eq(0).text() == "true"?true:false);
				$("#privacyMaskList").empty();
				var PMRegList = $(xmlDoc).find('PrivacyMaskRegionList').eq(0);
				var iLen = PMRegList.find('RegionCoordinatesList').length;
				for(var i = 0; i < iLen; i++)
				{
					insertPrivacyMask(i+1, PMRegList.find('id').eq(i).text(), PMRegList.find('privacymaskName').eq(i).text(), PMRegList.find('maskType').eq(i).text(), PMRegList.find('enabled').eq(i).text());
				}
			}
			/*else
			{
				$('#enablePrivacyMask').prop("checked", false);
			}*/
			
		},
		error:function()
		{ 
			
		}
	});
}
/*************************************************
Function:		insertPrivacyMask
Description:	插入一条隐私遮蔽信息
Input:			iNo：序号
                szId: 隐私块的ID
				szTitle : 标题
                szType : 类型
				szEnable : 是否启用
Output:			无
return:			无
*************************************************/
function insertPrivacyMask(iNo, szId, szTitle, szType, szEnable)
{
	var szEnablePrivacy = "";
	var szLaEnablename = ""
	if(szEnable == "true")
	{
		szEnablePrivacy = getNodeValue("jsTrue");
		szLaEnablename = "jsTrue";
	}
	else
	{
		szEnablePrivacy = getNodeValue("jsFalse");
		szLaEnablename = "jsFalse";
	}
	$("<div id="+szId+"><span class='first'>"+/*iNo*/szId+"</span><span class='second'>"+szTitle+"</span><span class='third'><label name='"+szType+"'>"+getNodeValue(szType)+"</label></span><span class='fouth'><label name='"+szLaEnablename+"'>"+szEnablePrivacy+"</label></span></div>").appendTo("#privacyMaskList").bind(
	{
		click:function()
		{
			if(!$(this).hasClass("select"))
			{
				$(this).siblings(".select").each(function()
				{
					$(this).removeClass("select");
					
					var oTitle = $(this).children(".second").eq(0);
					oTitle.html(oTitle.find(":text").eq(0).val());
					
					var oType = $(this).children(".third").eq(0);
					oType.html("<label name='"+oType.find("select").first().val()+"'>"+oType.find("select option:selected").first().text()+"</label>");
					
					/*var oEnable = $(this).children(".fouth").eq(0);
					oEnable.html("<label name='"+oEnable.find("select option:selected").first().attr("name")+"'>"+oEnable.find("select option:selected").first().text()+"</label>");*/
				});
				$(this).attr("class","select");
				
				var szSelTitle = $(this).children(".second").eq(0).text();
				$(this).children(".second").eq(0).html("<input type='text' style='margin:0 auto; width:"+($(this).children(".second").eq(0).width()-5)+"px;' maxlength='32'/>").find(":text").eq(0).val(szSelTitle).keyup(function(){
					if($.lengthw(this.value) > 16)
					{
						this.value = $.getStr(this.value, 16);
					}
				});
				
				var szSelType = $(this).children(".third").eq(0).text();
				$(this).children(".third").eq(0).html($("#selectPMType").html()).find("select option").each(function()
				{
					if($(this).text() == szSelType)
					{
						this.selected = true;
						return false;
					}
				});
				
				/*var szSelEnable = $(this).children(".fouth").eq(0).text();
				$(this).children(".fouth").eq(0).html($("#dvSelPMEnable").html()).find("select option").each(function()
				{
					if($(this).text() == szSelEnable)
					{
						this.selected = true;
						return;
					}
				});*/
			}
			/*else
			{
				return;
			}*/
			//调用此隐私块
			var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask/regions/"+this.id;
			$.ajax(
			{
				type: "GET",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("If-Modified-Since", "0");
					xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
				},
				url: szURL,
				success: function(xmlDoc, textStatus, xhr) 
				{
					/*if($(xmlDoc).find("enabled").eq(0).text() == "true")*/
					{
						g_oSelPMXml = xmlDoc;
					}
				},
				error:function()
				{ 
					g_oSelPMXml = null;
				}
			});
		},
		mouseover:function()
		{
			if(!$(this).hasClass("select"))
			{
				$(this).addClass("enter");
			}
		},
		mouseout:function()
		{
			$(this).removeClass("enter");
		}
	}).addClass((iNo%2 == 0?"even":"odd")).attr("title",getNodeValue('tipsSelectPrimary'));
	$("#privacyMaskList").scrollTop(1000); //大数值保证滚动条一直在底部
}
/*************************************************
Function:		deletePrivacyMask
Description:	删除选中的隐私遮蔽信息
Input:			无
Output:			无
return:			无
*************************************************/
function deletePrivacyMask()
{
	var iId = $("#privacyMaskList").children(".select").attr("id");
	if(!iId)
	{
		return;
	}
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask/regions/" + iId;
	$.ajax(
	{
		type: "DELETE",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#"+iId).detach();
			/*$("#privacyMaskList").children("div").each(function(i)
			{
				$(this).find(".first").eq(0).text(i+1);
			});*/
			HWP.ClearRegion();
		},
		error:function()
		{ 
			
		}
	});
}
/*************************************************
Function:		addPrivacyMask
Description:	添加一条隐私遮蔽信息
Input:			无
Output:			无
return:			无
*************************************************/
function addPrivacyMask()
{
	var szAreaXml = HWP.GetRegionInfo();
	var xmlDoc = parseXmlFromStr(szAreaXml);
	if(xmlDoc == null)
	{
		return;
	}
	var iAreaNum = xmlDoc.getElementsByTagName('DetectionRegion').length;
	if(0 == iAreaNum)
	{
		return;
	}
	
	var iId = 1;
	var aIdSet = new Array();
	$("#privacyMaskList").children("div").each(function()
	{
		aIdSet.push(parseInt($(this).attr("id"), 10));
	});
	while(iId <= 24 || aIdSet.length > 0)
	{
		if(jQuery.inArray(iId, aIdSet) < 0)
		{
			break;
		}
		iId++;
	}
	if(iId > 24)
	{
		return;
	}
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask/regions/" + iId;
	var szXml = "<?xml version='1.0' encoding='utf-8' ?><PrivacyMaskRegion><id>"+iId+"</id><enabled>true</enabled><RegionCoordinatesList>";
	
	szXml+="<RegionCoordinates><positionX>"+xmlDoc.getElementsByTagName('positionX')[0].childNodes[0].nodeValue+"</positionX><positionY>"+(255 - parseInt(xmlDoc.getElementsByTagName('positionY')[0].childNodes[0].nodeValue, 10))+"</positionY></RegionCoordinates>";
	szXml+="<RegionCoordinates><positionX>"+xmlDoc.getElementsByTagName('positionX')[3].childNodes[0].nodeValue+"</positionX><positionY>"+(255 - parseInt(xmlDoc.getElementsByTagName('positionY')[3].childNodes[0].nodeValue, 10))+"</positionY></RegionCoordinates>";
	szXml+="<RegionCoordinates><positionX>"+xmlDoc.getElementsByTagName('positionX')[2].childNodes[0].nodeValue+"</positionX><positionY>"+(255 - parseInt(xmlDoc.getElementsByTagName('positionY')[2].childNodes[0].nodeValue, 10))+"</positionY></RegionCoordinates>";
	szXml+="<RegionCoordinates><positionX>"+xmlDoc.getElementsByTagName('positionX')[1].childNodes[0].nodeValue+"</positionX><positionY>"+(255 - parseInt(xmlDoc.getElementsByTagName('positionY')[1].childNodes[0].nodeValue, 10))+"</positionY></RegionCoordinates>";
    szXml+="</RegionCoordinatesList>";
	
	szXml+="<Extensions><selfExt><privacymaskName>Privacy Mask "+iId+"</privacymaskName><maskType>gray</maskType></selfExt></Extensions>";

	szXml+="</PrivacyMaskRegion>";
	
	xmlDoc = parseXmlFromStr(szXml);
	if(xmlDoc == null)
	{
		return;
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
		success: function(xmlDoc, textStatus, xhr) 
		{
			insertPrivacyMask($("#privacyMaskList").children("div").length+1, iId, "Privacy Mask "+iId, "gray", "true");
			HWP.ClearRegion();
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
Function:		savePrivacyMask
Description:	保存修改一条隐私遮蔽信息
Input:			无
Output:			无
return:			无
*************************************************/
function savePrivacyMask()
{
	if($("#privacyMaskList").children(".select").length <= 0)
	{
		return;
	}
	var oPrivacyList = $("#privacyMaskList").children("div");
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PrivacyMask><enabled>"+$('#enablePrivacyMask').prop("checked").toString()+"</enabled><PrivacyMaskRegionList>";
	oPrivacyList.each(function()
	{
		var szAreaXml = HWP.GetRegionInfo();
		var oAreaXml = parseXmlFromStr(szAreaXml);
		szXml += "<PrivacyMaskRegion><id>"+$(this).attr("id")+"</id><enabled>true</enabled><RegionCoordinatesList>";
		if($(this).hasClass("select"))
		{
			if($(oAreaXml).find("RegionCoordinatesList").length > 0)
			{
				szXml += "<RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(0).text()+"</positionX><positionY>"+(255 - parseInt($(oAreaXml).find("positionY").eq(0).text(), 10))+"</positionY></RegionCoordinates>";
				szXml += "<RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(3).text()+"</positionX><positionY>"+(255 - parseInt($(oAreaXml).find("positionY").eq(3).text(), 10))+"</positionY></RegionCoordinates>"
				szXml += "<RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(2).text()+"</positionX><positionY>"+(255 - parseInt($(oAreaXml).find("positionY").eq(2).text(), 10))+"</positionY></RegionCoordinates>"
				szXml += "<RegionCoordinates><positionX>"+$(oAreaXml).find("positionX").eq(1).text()+"</positionX><positionY>"+(255 - parseInt($(oAreaXml).find("positionY").eq(1).text(), 10))+"</positionY></RegionCoordinates>";
			}
			else
			{
				szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>";
				szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>"
				szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>"
				szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>";
			}
			
			szXml += "</RegionCoordinatesList><Extensions><selfExt><privacymaskName>"+$(this).children(".second").eq(0).find(":text").eq(0).val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</privacymaskName><maskType>"+$(this).children(".third").eq(0).find("select").eq(0).val()+"</maskType></selfExt></Extensions></PrivacyMaskRegion>";
		}
		else
		{
			szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>";
			szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>"
			szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>"
			szXml += "<RegionCoordinates><positionX>0</positionX><positionY>0</positionY></RegionCoordinates>";
			szXml += "</RegionCoordinatesList><Extensions><selfExt><privacymaskName>"+$(this).children(".second").eq(0).text()+"</privacymaskName><maskType>"+$(this).children(".third").eq(0).find("label").eq(0).attr("name")+"</maskType></selfExt></Extensions></PrivacyMaskRegion>";
		}
		
	});
	szXml += "</PrivacyMaskRegionList></PrivacyMask>";
	var xmlDoc = parseXmlFromStr(szXml);
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask";
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
		success: function(xmlDoc, textStatus, xhr) 
		{
			HWP.ClearRegion();
		},
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		initClearCfg
Description:	清除配置项
Input:			无
Output:			无
return:			无
*************************************************/
function initClearCfg()
{
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "ClearCfg"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
	}, true);
	
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#clearCfg").find("select").show();
		}
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').hide();
	$('#ptzArea').hide();
}
/*************************************************
Function:		clearCfg
Description:	清除配置项
Input:			无
Output:			无
return:			无
*************************************************/
function clearCfg()
{
	var bRes = false; //是否已返回
	var szURL = "";
	//清除所有预置点
	if($("#clearAllPreset").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/PTZ/channels/1/presets";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除所有路径
	if($("#clearAllPatrol").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/PTZ/channels/1/patrols";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除所有轨迹
	if($("#clearAllPattern").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除所有隐私遮蔽块
	if($("#clearAllPrivacy").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask/regions";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
		var szXml = "<?xml version='1.0' encoding='utf-8'?><PrivacyMask><enabled>false</enabled></PrivacyMask>";
		var xmlDoc = parseXmlFromStr(szXml);
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/Video/inputs/channels/1/privacyMask";
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
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除所有限位
	if($("#clearAllLimit").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/ptzlimiteds";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除所有定时任务
	if($("#clearAllTask").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/timetasks";
		$.ajax(
		{
			type: "DELETE",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
	//清除守望配置
	szXml = "<?xml version='1.0' encoding='utf-8'?><ParkAction><enabled>false</enabled><Parktime>5</Parktime></ParkAction>";
	xmlDoc = parseXmlFromStr(szXml);
	if($("#clearAllPark").prop("checked"))
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/parkaction";
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
			complete:function(xhr, textStatus) {
				if(!bRes) {
					bRes = true;
					SaveState(xhr);
				}
			}
		});
	}
}
/*************************************************
Function:		initTimeTasks
Description:	初始化定时任务
Input:			无
Output:			无
return:			无
*************************************************/
function initTimeTasks()
{
	if($("#dvTimeTasks").children().length == 0)
	{
		g_oTask = $("#dvTimeTasks").schedule();
	}
	if($("#dvEditTimeTasks").children().length == 0)
	{
		var aTypeNameSet = ["aStyleClose", "autoScan", "frameScan", "randomScan", "patrolScan", "Pattern", "laPreset", "panoramaScan", "tiltScan", "periodReboot", "periodAdjust", "auxOutput"];
		var aTypeValueSet = ["disable", "autoscan", "framescan", "randomscan", "patrol", "pattern", "preset", "panoramascan", "tiltscan", "periodreboot", "periodadjust", "auxoutput"];
		g_oEditWnd = $("#dvEditTimeTasks").editSchedule(
		{
			outputTimeSec: g_tTimeTasks,
			typeNameSet: aTypeNameSet,
			typeValueSet: aTypeValueSet, 
			titleName: "laTimingTasks", 
			timeSecNum: 10, 
			disType: 3, 
			typeTitle: "trTaskType",
			isDisWhole: true,
			clickOK: function()
			{
				for(var i = 0; i < g_tTimeTasks.length; i++)
				{
					g_tTimeTasks[i] = $.grep(g_tTimeTasks[i],function(n,i)
					{
						return !(n.m_szStartTime == "00:00" && n.m_szStopTime == "00:00");
					});
					for(var j = 0; j < g_tTimeTasks[i].length; j++)
					{
						if(j%2 == 0)
						{
							g_tTimeTasks[i][j].m_szColor = "#FF0000";
						}
						else
						{
							g_tTimeTasks[i][j].m_szColor = "#00FF00";
						}
					}
				}
				g_oTask.update(g_tTimeTasks);
			}
		});
	}
	//加载语言
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() 
	{
		var lan = parent.translator.getLanguageXmlDoc(["ptzCfg", "TimeTasks"]);
		parent.translator.appendLanguageXmlDoc(lan, g_lxdParamConfig);
		parent.translator.translatePage(lan, document);
	}, true);
	if($.browser.msie)
	{
		var iIEVersion = parseInt($.browser.version, 10);
		if(iIEVersion == 6)
		{
			$("#ptzCfg").find("select").hide();
			$("#timeTasks").find("select").show();
		}
	}
	$("#SaveConfigBtn").show();
	$('#enablePMArea').hide();
	$('#ptzArea').hide();
	getTimeTasks();
}
/*************************************************
Function:		getTimeTasks
Description:	获取定时任务信息
Input:			无
Output:			无
return:			无
*************************************************/
function getTimeTasks()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/timetasks";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_szPtzTimeTasksXml = xhr.responseText;
			$("#enabledTimeTasks").prop("checked", $(xmlDoc).find("enabled").eq(0).text()=="true"?true:false);
			$("#txTimeTasks").val($(xmlDoc).find("Parktime").eq(0).text());
			var oTimeTasks = $(xmlDoc).find("TimeTaskBlock");
			g_tTimeTasks.length = 0;
			g_tTimeTasks = new Array(oTimeTasks.length);
			for(var i = 0; i < oTimeTasks.length; i++)
			{
				var oTimeTaskRanges = oTimeTasks.eq(i).find("TimeTaskRange");
				var szStartTime = "";
				var szEndTime = "";
				var szType = "";
				var szNum = "";
				var szColor = ""
				g_tTimeTasks[i] = new Array();
				for(var j = 0; j < oTimeTaskRanges.length; j++)
				{
					szStartTime = oTimeTaskRanges.eq(j).find("beginTime").eq(0).text();
					szEndTime = oTimeTaskRanges.eq(j).find("endTime").eq(0).text();
					szType = oTimeTaskRanges.eq(j).find("TaskType").eq(0).text();
					szNum = oTimeTaskRanges.eq(j).find("TaskNum").eq(0).text();
					
					var oTimeSegment = new TimeSegment({color:szColor, type:szType, taskNum: parseInt(szNum, 10), startTime:szStartTime, stopTime: szEndTime});
					
					g_tTimeTasks[i].push(oTimeSegment);
				}
				g_tTimeTasks[i] = $.grep(g_tTimeTasks[i],function(n,i)
				{
					return !(n.m_szStartTime == "00:00" && n.m_szStopTime == "00:00");
				});
				for(j = 0; j < g_tTimeTasks[i].length; j++)
				{
					if(j%2 == 0)
					{
						g_tTimeTasks[i][j].m_szColor = "#FF0000";
					}
					else
					{
						g_tTimeTasks[i][j].m_szColor = "#00FF00";
					}
				}
			}
			g_oTask.update(g_tTimeTasks);
			g_oEditWnd.update(g_tTimeTasks);
		},
		error:function()
		{
			g_szPtzTimeTasksXml = "";
		}
	});
}
/*************************************************
Function:		setBasicTimeTasks
Description:	设置基本定时任务信息
Input:			无
Output:			无
return:			无
*************************************************/
function setBasicTimeTasks()
{
	if(g_szPtzTimeTasksXml == "")
	{
		return;
	}
	if(!CheackServerIDIntNum($("#txTimeTasks").val(),'spTimeTaskTips','laTimeTask',5,720))
	{
		return;
	}
	var szXml = g_szPtzTimeTasksXml;
	var xmlDoc = parseXmlFromStr(szXml);
	$(xmlDoc).find("enabled").eq(0).text($("#enabledTimeTasks").prop("checked").toString());
	$(xmlDoc).find("Parktime").eq(0).text($("#txTimeTasks").val());
	var oWeekDocs = $(xmlDoc).find("TimeTaskBlock");
	for(var i = 0; i < oWeekDocs.length; i++)
	{
		var oTimeRanges = oWeekDocs.eq(i).find("TimeTaskRange");
		for(var j = 0; j < oTimeRanges.length; j++)
		{
			if(j < g_tTimeTasks[i].length)
			{
				oTimeRanges.eq(j).find("beginTime").eq(0).text(g_tTimeTasks[i][j].m_szStartTime);
				oTimeRanges.eq(j).find("endTime").eq(0).text(g_tTimeTasks[i][j].m_szStopTime);
				oTimeRanges.eq(j).find("TaskType").eq(0).text(g_tTimeTasks[i][j].m_szType);
				oTimeRanges.eq(j).find("TaskNum").eq(0).text(g_tTimeTasks[i][j].m_iTaskNum);
			}
			else
			{
				oTimeRanges.eq(j).find("beginTime").eq(0).text("00:00");
				oTimeRanges.eq(j).find("endTime").eq(0).text("00:00");
				oTimeRanges.eq(j).find("TaskType").eq(0).text("disable");
				oTimeRanges.eq(j).find("TaskNum").eq(0).text(0);
			}
		}
	}
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/timetasks";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
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
Function:		setDetailedTimeTasks
Description:	设置详细定时任务信息
Input:			无
Output:			无
return:			无
*************************************************/
function setDetailedTimeTasks()
{
}
/*************************************************
Function:		SetZoomInStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetZoomInStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + (m_iPtzSpeed) + "</zoom></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
function SetPTZCallback(xhr)
{
	if(xhr.status == 403)
	{
		alert(getNodeValue('jsNoOperationRight'));
	}
}
/*************************************************
Function:		StopPTZAuto
Description:	停止云台自转
Input:			无
Output:			无
return:			无
*************************************************/
function StopPTZAuto()
{
	if(m_bPTZAuto)
	{
		ptzAuto();	//如果云台自转，就停止
	}
}
/*************************************************
Function:		SetZoomOutStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetZoomOutStart()
{
	StopPTZAuto();
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + (-m_iPtzSpeed) + "</zoom></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
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
			SetPTZCallback(xhr);
		}
	});
}

/*************************************************
Function:		SetPTZStop
Description:	停止PTZ操作
Input:			iType 操作类型
Output:			无
return:			无
*************************************************/
function SetPTZStop(iType)
{
	StopPTZAuto();
	var szXml = "";
	if(iType == 0)
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + 0 + "</tilt></PTZData>";
	}
	else
	{
	    szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + 0 + "</zoom></PTZData>";
	}
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
	var xmlDoc = parseXmlFromStr(szXml);
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftStart
Description:	开始向左转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftStart()
{	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftUpStart
Description:	开始向左上转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftUpStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftDownStart
Description:	开始向左下转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftDownStart()
{	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightStart
Description:	开始向右转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightStart()
{	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightUpStart
Description:	开始向右上转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightUpStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightDownStart
Description:	开始向右下转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightDownStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZUpStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZUpStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZDownStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZDownStart()
{	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/continuous";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		ptzAuto
Description:	云台自动
Input:			无
Output:			无
return:			无
*************************************************/
function ptzAuto()
{
	var szURL = "";
	if(!m_bPTZAuto)
	{
		szURL = m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/presets/"+ 99 +"/goto";
	}
	else
	{
		szURL = m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/presets/"+ 96 +"/goto";
	}
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			m_bPTZAuto = !m_bPTZAuto;
			if(m_bPTZAuto)
			{
				$("#auto").addClass("sel");
			}
			else
			{
				$("#auto").removeClass("sel");
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		SetFocusInStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusInStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + (m_iPtzSpeed) + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/focus";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetFocusStop
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusStop()
{
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + 0 + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/focus";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetFocusOutStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusOutStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + (-m_iPtzSpeed) + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/focus";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisInStart
Description:	
Input:          无
Output:			无
return:			无
*************************************************/
function IrisInStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + (m_iPtzSpeed) + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/iris";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisOutStart
Description:	
Input:			iChannel  通道号
Output:			无
return:			无
*************************************************/
function IrisOutStart()
{
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + (-m_iPtzSpeed) + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/iris";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisStop
Description:	
Input:			iChannel  通道号
Output:			无
return:			无
*************************************************/
function IrisStop()
{
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + 0 + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/System/Video/inputs/channels/1/iris";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		GotoPreset
Description:	调用预置点
Input:			iPresetId 预置点ID
Output:			无
return:			无
*************************************************/
function GotoPreset(iPresetId)
{
	StopPTZAuto();
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/presets/"+ iPresetId +"/goto";
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
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		changePTZLan
Description:	改变PTZ操作提示语
Input:			无
Output:			无
return:			无
*************************************************/
function changePTZLan()
{
	//添加云台操作提示语
	$("#zoomIn").attr("title", getNodeValue("laZoom")+" +");
	$("#zoomOut").attr("title", getNodeValue("laZoom")+" -");
	$("#focusIn").attr("title", getNodeValue("laFocus")+" +");
	$("#focusOut").attr("title", getNodeValue("laFocus")+" -");
	$("#irisIn").attr("title", getNodeValue("laIris")+" +");
	$("#irisOut").attr("title", getNodeValue("laIris")+" -");
	$(".gotoPreset").attr("title", getNodeValue("ExcutePreset"));
}