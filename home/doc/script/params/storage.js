var m_iTimeNum = 0;
var m_iNasId = new Array();
var m_iNasIdMap = new Array();  //映射关系
var g_szCurFormatId = "";
var g_iNasStartId = 0; //nas起始Id
var g_bRequiredReboot = false;
/*************************************************
继承，未完成，wuyang
*************************************************/
function RecordPlan() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(RecordPlan);
pr(RecordPlan).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Storage", "RecordPlan"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initRecordPlan();
	//录像计划
	if($("#scheduleplan").html() == "")
	{
		$.ajax(
		{ 
			url: "params/recordplanschedule.asp",
			type: "GET",
			dataType:"html",
			async: true,
			success:function(szMsg)
			{
				$("#scheduleplan").html(szMsg);
				if(g_bSupportWLS && g_bSupportPIR)
				{
					if(g_bSupportCH)
					{
						$("#scheduleplan").find("select").append("<option value='pir' name='laPIRAlarm'>"+getNodeValue("laPIRAlarm")+"</option><option value='wlsensor' name='laWirelessAlarm'>"+getNodeValue("laWirelessAlarm")+"</option><option value='callhelp' name='OptCallHelp'>"+getNodeValue("OptCallHelp")+"</option><option value='AllEvent' name='OptAllEvent'>"+getNodeValue("OptAllEvent")+"</option>");
						g_transStack.push(function() {
							$("#scheduleplan").find("select").find("option[name='OptAllEvent']").attr("title", getNodeValue("OptAllEvent"));
						}, true);
					}
					else
					{
						$("#scheduleplan").find("select").append("<option value='pir' name='laPIRAlarm'>"+getNodeValue("laPIRAlarm")+"</option><option value='wlsensor' name='laWirelessAlarm'>"+getNodeValue("laWirelessAlarm")+"</option><option value='callhelp' name='OptCallHelp'>"+getNodeValue("OptCallHelp")+"</option><option value='pirORwlsensorORcallhelp' name='OptPirORWlsensorORCallhelp'>"+getNodeValue("OptPirORWlsensorORCallhelp")+"</option>");
					}
				}
				m_iCurWeekDay = 0;
				parent.translator.translatePage(that.getLxd(), $("#scheduleplan")[0]);
			}
		});
	}
}

function DiskInfo() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(DiskInfo);
pr(DiskInfo).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").hide();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Storage", "DiskInfo"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
		initDiskInfo();
	}, true);
}

function NAS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(NAS);
pr(NAS).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Storage", "NAS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initNasInfo();
}

/*************************************************
Function:		initStorage
Description:	初始化存储页面信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function initStorage()
{
	//硬盘管理
	$("#selAllDisk").bind("click",function()
	{
		if(this.checked)
		{
			$(".seldiskcheck").each(function()
			{
				if(!$(this).prop("disabled"))
				{
					$(this).prop("checked", true);
				}
			});
		}
		else
		{
			$(".seldiskcheck").each(function()
			{
				if(!$(this).prop("disabled"))
				{
					$(this).prop("checked", false);
				}
			});
		}
	});
	//nas
	$("#nas").find("span").each(
	function(i)
	{
		var iRow = parseInt(i/4,10);
		var j = i%4;
		switch(j)
		{
			case 0:
				$(this).addClass("nasrowfirst");
				break;
			case 1:
				$(this).addClass("nasrowsecond");
				break;
			case 2:
				$(this).addClass("nasrowthird");
				if(iRow > 0)
				{
					/*if(window.parent.g_bIsIPDome)
					{
						if(iRow > 1)
						{
							return;
						}
					}*/
					$(this).bind(
					{
						click:function()
						{
							$("#editText").show();
							$("#editText").css({"left":$(this).offset().left+"px", "top":$(this).offset().top+"px",width:$(this).width()+"px",height:$(this).height()+"px"});
							$("#inputText").css({width:$(this).width()-4+"px",height:$(this).height()+"px","padding-left":"5px"});
							$("#inputText").focus();
							$("#inputText").val($(this).html().replace(/&amp;/g, '&'));
							var self = this;
							$("#inputText").unbind().bind(
							{
								blur:function()
								{
									$(self).html(this.value.replace(/\&/g, '&amp;'));
									$("#editText").hide();
								},
								keydown:function(event)
								{
									if(13 == event.keyCode)
									{
										$(this).blur();
									}
								}
							})
						}
					});
				}
				break;
			case 3:
				$(this).addClass("nasrowfouth");
				if(iRow > 0)
				{
					/*if(window.parent.g_bIsIPDome)
					{
						if(iRow > 1)
						{
							return;
						}
					}*/
					$(this).bind(
					{
						click:function()
						{
							$("#editText").show();
							$("#editText").css({"left":$(this).offset().left+"px", "top":$(this).offset().top+"px",width:$(this).width()+"px",height:$(this).height()+"px"});
							$("#inputText").css({width:$(this).width()-4+"px",height:$(this).height()+"px","padding-left":"5px"});
							$("#inputText").focus();
							$("#inputText").val($(this).html().replace(/&amp;/g, '&'));
							var self = this;
							$("#inputText").unbind().bind(
							{
								blur:function()
								{
									$(self).html(this.value.replace(/\&/g, '&amp;')).attr("title", this.value);
									$("#editText").hide();
								},
								keydown:function(event)
								{
									if(13 == event.keyCode)
									{
										$(this).blur();
									}
								}
							})
						}
					});
				}
				break;
			default:
				break;
		}
	});
}
/*************************************************
Function:		initDiskInfo
Description:	初始化硬盘信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function initDiskInfo()
{
	GetDiskInfo();
	autoResizeIframe();
}

/*************************************************
Function:		GetDiskInfo
Description:	获取设备上SD卡信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetDiskInfo()
{
	$("#storageDecList").empty();
	$("#selAllDisk").prop("checked", false);
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/ContentMgmt/Storage",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var xmlRoot = $(xmlDoc);
			var iHddLen = xmlRoot.find("hdd").length;
			for(var i = 0; i < iHddLen; i++)
			{
				var szDiskId = xmlRoot.find('id').eq(i).text();
				var szDiskType = TurnDiskType(xmlRoot.find('hddType').eq(i).text());//硬盘类型
				
				var szDiskCapacity = (parseInt(xmlRoot.find('capacity').eq(i).text(), 10)/1024).toFixed(2) + "GB"; 
				var szDiskFreeSpace = (parseInt(xmlRoot.find('freeSpace').eq(i).text(), 10)/1024).toFixed(2) + "GB";
				var szDiskProperty = TurnHardDiskProperty(xmlRoot.find('property').eq(i).text());
				var szDiskStatus =  TurnDiskStatus(xmlRoot.find('status').eq(i).text());//硬盘状态
				
				insertOneDisk(szDiskId, "hdd", szDiskCapacity, szDiskFreeSpace, szDiskStatus, szDiskType, szDiskProperty);
			}
			var iNasLen = xmlRoot.find("nas").length;
			for(var i = 0; i < iNasLen; i++)
			{
				var szDiskStatus =  xmlRoot.find("nas").eq(i).find('status').eq(0).text();//硬盘状态
				
				var szDiskId = xmlRoot.find("nas").eq(i).find('id').eq(0).text();
				var szDiskType = TurnDiskType(xmlRoot.find("nas").eq(i).find('nasType').eq(0).text());//硬盘类型
				
				var szDiskCapacity = (parseInt(xmlRoot.find("nas").eq(i).find('capacity').eq(0).text(), 10)/1024).toFixed(2) + "GB"; 
				var szDiskFreeSpace = (parseInt(xmlRoot.find("nas").eq(i).find('freeSpace').eq(0).text(), 10)/1024).toFixed(2) + "GB";
				var szDiskProperty = TurnHardDiskProperty(xmlRoot.find("nas").eq(i).find('property').eq(0).text());
				
				insertOneDisk(szDiskId, "nas", szDiskCapacity, szDiskFreeSpace, TurnDiskStatus(szDiskStatus), szDiskType, szDiskProperty);
				if(szDiskStatus == 'offline')
				{
					$("#nas_"+szDiskId).find(":checkbox").eq(0).prop("disabled", true);
				}
			}
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}

/*************************************************
Function:		TurnDiskStatus
Description:	将硬盘状态转换成文字
Input:			szDiskStatus:硬盘状态		
Output:			无
return:			无				
*************************************************/
function TurnDiskStatus(szDiskStatus)
{
	if("ok" == szDiskStatus)
	{
		return getNodeValue('tipsNormal');
	}
	else if("unformatted" == szDiskStatus)
	{
		return getNodeValue('tipsUnformatted');
	}
	else if("error" == szDiskStatus)
	{
		return getNodeValue('tipsError');
	}
	else if("idle" == szDiskStatus)
	{
		return getNodeValue('tipsIdle');
	}
	else if("mismatch" == szDiskStatus)
	{
		return getNodeValue('tipsMismatch');
	}
	else if("offline" == szDiskStatus)
	{
		return getNodeValue('OffLineTips');
	}
	else if("formating" == szDiskStatus)
	{
		return getNodeValue('tipsFormatting');
	}
	return "";
}

/*************************************************
Function:		TurnHardDiskProperty
Description:	将硬盘类型转换成文字
Input:			strDiskType:硬盘类型			
Output:			无
return:			无				
*************************************************/
function TurnDiskType(strDiskType)
{
	var szDiskType = '';
	switch(strDiskType)
	{
		case 'SATA':
			szDiskType = getNodeValue('LocalTips');
			break;
		case 'NFS':
		    szDiskType = 'NAS';
			break;
		case 'iSCSI':
		    szDiskType = 'IP SAN';
			break;
		case 'Virtual Disk':
		    szDiskType = getNodeValue('tipsArray');
		default:
		    szDiskType = strDiskType;
			break;
	}
	return szDiskType;
}

/*************************************************
Function:		TurnHardDiskProperty
Description:	将硬盘属性转换成文字
Input:			iDiskProperty: 硬盘属性			
Output:			无
return:			无				
*************************************************/
function TurnHardDiskProperty(iDiskProperty)
{
	var szDiskProperty = '';
	if('RW' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('tipsRW');
	}
	else if('Redund' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('tipsRedund');
	}
	else if('RO' == iDiskProperty)
	{
		szDiskProperty = getNodeValue('tipsRO');
	}
	return szDiskProperty;
}
/*************************************************
Function:		insertOneDisk
Description:	向存储设备列表插入一条设备信息
Input:			iNo       磁盘号
				szName    名称
				iCap      总容量
				iFreeSpc  剩余容量
				szStatus  状态
				szType    类型
				szProp    属性
Output:			无
return:			无				
*************************************************/
function insertOneDisk(iNo, szName, iCap, iFreeSpc, szStatus, szType, szProp)
{
	var oDiv = $("<div class='storagelist' id="+(szName+"_"+iNo)+"><span class='storagerowfirst'><input type='checkbox' class='seldiskcheck'>"+iNo+"</span><span class='storagerowother'>"+iCap+"</span><span class='storagerowother'>"+iFreeSpc+"</span><span class='storagerowother'>"+szStatus+"</span><span class='storagerowother'>"+szType+"</span><span class='storagerowother'>"+szProp+"</span><span class='storagerowlast'></span></div>").appendTo("#storageDecList").bind(
	{
		click:function()
		{
			
		},
		mouseover:function()
		{

		},
		mouseout:function()
		{

		}
	}).find(":checkbox").eq(0).bind("click", function()
	{
		var iCheckAble = $(".seldiskcheck").filter(function(index)
		{
			return !this.disabled;
		});
		iCheckAble.each(function(i)
		{
			if(!this.checked)
			{
				$("#selAllDisk").prop("checked", false);
				return false;
			}
			if((i+1) >= iCheckAble.length)
			{
				$("#selAllDisk").prop("checked", true);
			}
		});
	});
}
/*************************************************
Function:		FormatSelDisk
Description:	格式化选中硬盘
Input:			无
Output:			无
return:			无				
*************************************************/
function FormatSelDisk()
{
	g_bRequiredReboot = false;  //初始化为false
	szTips1 = getNodeValue('tipsSelectDisk');
	var iCheckLen = $(".seldiskcheck").length;
	var iSel = -1;
	$(".seldiskcheck").each(function(i)
	{
		if(this.checked && !this.disabled)
		{
			iSel = i;
			return false;
		}
	});
	if(-1 != iSel)
	{
		szTips2 = getNodeValue('tipsFormatSelect');
		var bWarning = confirm(szTips2);
		if(bWarning)
		{
			var oSel = $("#storageDecList").children("div").eq(iSel);
			FormatOneDisk(oSel[0].id.split("_")[0], oSel[0].id.split("_")[1]);   //格式化第一个选中的硬盘
		}
	}
	else
	{
		alert(szTips1);
	}
}
/*************************************************
Function:		FormatOneDisk
Description:	格式化硬盘
Input:			szType 硬盘类型
				iId    ID号
Output:			无
return:			无				
*************************************************/
function FormatOneDisk(szType, iId)
{
	$("#SetResultTips").html(''); 
	var szTips3 = getNodeValue('jsComplete');
	var szTips4 = getNodeValue('tipsFormatFailed');
	g_szCurFormatId = szType+"_"+iId;
	window.parent.$("#ConfigDivUpdateBlock").show();
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/ContentMgmt/Storage/"+szType+"/" + iId + "/format";
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		timeout: 0,
		complete:function(xhr, textStatus)
		{
			var xmlDoc = xhr.responseXML;
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			
			if("7" == state)	//Reboot Required
			{
				g_bRequiredReboot = true;
			}
			if(xhr.status == 403)
			{
				var szRetInfo = m_szErrorState + m_szError8;
				window.parent.$("#ConfigDivUpdateBlock").hide();
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szRetInfo); 
				clearTimeout(m_hFormatClockTime);
				return;
			}
			else if(xhr.status == 200)
			{
				//选中的磁盘格式化完毕
				m_iTimeNum = 0;
				clearTimeout(m_hFormatClockTime);
				/*if("7" == state)	//Reboot Required
				{
					var szRetInfo = m_szSuccessState + m_szSuccess5;
					$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szRetInfo); 
				}
				else*/
				{
					$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szTips3);
				}
			}
			else
			{
				m_iTimeNum = 0;
				clearTimeout(m_hFormatClockTime);
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szTips4);
			}
			var iListLen = $("#storageDecList").children("div").length;
			if($("#"+g_szCurFormatId).index() >= (iListLen-1))//所有选中的磁盘均格式化完毕
			{
				setTimeout(function(){
						GetDiskInfo();
						if(g_bRequiredReboot)
						{
							pr(Maintain).confirmAndRestart();
						}
					}, 2000);             //刷新硬盘信息列表（因为硬盘格式化后，状态会发生变化）
				window.parent.$("#ConfigDivUpdateBlock").hide();
				$("#selAllDisk").prop("checked", false);
				return;
			}
			$("#"+g_szCurFormatId).nextAll().each(function()
			{
				if($(this).find(".seldiskcheck").eq(0).prop("checked"))
				{
					var szTypeName = this.id.split("_")[0];
					var iID = this.id.split("_")[1];
					FormatOneDisk(szTypeName, iID);
					return false;
				}
				else if(($(this).index()+1) >= iListLen)//所有选中的磁盘均格式化完毕
				{
					setTimeout(function(){
						GetDiskInfo();
						if(g_bRequiredReboot)
						{
							pr(Maintain).confirmAndRestart();
						}
					}, 2000);             //刷新硬盘信息列表（因为硬盘格式化后，状态会发生变化）
					window.parent.$("#ConfigDivUpdateBlock").hide();
					$("#selAllDisk").prop("checked", false);
				}
			})
			
		}
	});
	m_hFormatClockTime = setTimeout("FormatProgress('"+szType+"', "+iId+")", 500);
}

/*************************************************
Function:		FormatProgress
Description:	定时获取硬盘格式化进度
Input:			无
Output:			无
return:			无				
*************************************************/
function FormatProgress(szType, iId)
{
	var szTips3 = getNodeValue('jsComplete');
	var szTips4 = getNodeValue('tipsFormatFailed');
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/ContentMgmt/Storage/"+szType+"/" + iId + "/formatStatus";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 30000,
		url: szURL,
		success: function(xmlDoc, textStatus, xhr)
		{
			var szTips1 = getNodeValue('tipsFormattingWait');  
			
			var szFormatProgress = parseInt(xmlDoc.documentElement.getElementsByTagName('percent')[0].childNodes[0].nodeValue);
			var IsFormating = xmlDoc.documentElement.getElementsByTagName('formating')[0].childNodes[0].nodeValue;
			
			if(IsFormating == 'false' && szFormatProgress == 0)
			{
				m_iTimeNum++;
				if(m_iTimeNum >= 10)
				{
					$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(getNodeValue('jsNetworkAbnormal'));
				}
			}
			else if(szFormatProgress < 100 && IsFormating == 'true')  //格式化未完成，不断地获取硬盘格式化进度
			{
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szFormatProgress + '%');
				m_iTimeNum = 0;
				m_hFormatClockTime = setTimeout("FormatProgress('"+szType+"', "+iId+")", 3000);
			}
			else if(szFormatProgress == 100 && IsFormating == 'false')//格式化完一个硬盘的话
			{
				m_iTimeNum = 0;
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szTips3);
			}  
			
		},
		error:function(xhr, textStatus, errorThrown)
		{
			if("timeout" == textStatus)
			{
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(getNodeValue('jsNetworkAbnormal'));
			}
			else
			{  
				$("#"+g_szCurFormatId).find(".storagerowlast").eq(0).html(szTips4);
			}
		}
	});
}
/*************************************************
Function:		initNasInfo
Description:	初始化网络硬盘信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function initNasInfo()
{
	GetNasIdStart();
	GetNFSInfo();
	autoResizeIframe();
}
/*************************************************
Function:		GetNasIdStart
Description:	获取nas的起始ID
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNasIdStart()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/ContentMgmt/Storage/hdd/capabilities";
	$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: false,
		timeout: 15000,
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) 
		{
			var oHddList = $(xmlDoc).find("hddList[size]");
			if(oHddList.length > 0)
			{
				g_iNasStartId = parseInt(oHddList.eq(0).attr("size"), 10) + 1;
			}
			else
			{
				g_iNasStartId = 17;
			}
		},
		error:function()
		{
			g_iNasStartId = 17;
		}
	});
}
/*************************************************
Function:		GetNFSInfo
Description:	获取网络硬盘配置（NFS）信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNFSInfo()
{ 
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/ContentMgmt/Storage/nas";
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
			var iNFSNum = xmlDoc.documentElement.getElementsByTagName('nas').length;
			var divSet = $("#nas").children("div");
			for(var i = 0; i < iNFSNum; i++)
			{
				m_iNasId[i] = parseInt(xmlDoc.documentElement.getElementsByTagName('id')[i].childNodes[0].nodeValue,10);
				m_iNasIdMap[i] = i+1;
				divSet.eq(i+1).attr("id",m_iNasId[i]);
				var szIP = "";
				if("hostname" == xmlDoc.documentElement.getElementsByTagName('addressingFormatType')[i].childNodes[0].nodeValue)
				{
					szIP = xmlDoc.documentElement.getElementsByTagName('hostName')[i].childNodes[0].nodeValue;
				}
				else
				{
					try
					{
						szIP = xmlDoc.documentElement.getElementsByTagName('ipAddress')[i].childNodes[0].nodeValue;
					}
					catch(oError)
					{
						szIP = xmlDoc.documentElement.getElementsByTagName('ipv6Address')[i].childNodes[0].nodeValue;
					}
				}
					  
				divSet.eq(i+1).children("span").eq(2).html(szIP).attr("title",szIP);
				if(xmlDoc.documentElement.getElementsByTagName('path')[i].hasChildNodes())
				{
					var szPath = xmlDoc.documentElement.getElementsByTagName('path')[i].childNodes[0].nodeValue;
				   divSet.eq(i+1).children("span").eq(3).html(szPath).attr("title",szPath);
				}
			}
		},
		error:function()
		{
			alert(m_szError400);   
			return;
		}
	});
}  

/*************************************************
Function:		SetNFSInfo
Description:	设置网络硬盘配置（NFS）信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetNFSInfo()
{
	var divSet = $("#nas").children("div");	
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	
	for(var i = 1; i <= 8; i++){
		var spanSet = divSet.eq(i).children("span");
		if(!((spanSet.eq(2).html() == "") && (spanSet.eq(3).html() == ""))){
			if(spanSet.eq(2).html() == '0.0.0.0'){
				$("#IPAddressTips").html(szAreaNameInfo + getNodeValue('DIPAddInvalidTips'));
				return;
			}
			if(m_strIpVersion == 'v4'){
			    if((!CheckDIPadd(spanSet.eq(2).html(), 'IPAddressTips', 'laServerAdd', i)) || (!CheckFilePathStrLen(spanSet.eq(3).html(), 'FilePathTips', 'laFilePath', i, 128))){
				    return;
			    }
			}
			else if(m_strIpVersion == 'v6'){
				if((!CheckIPV6add(spanSet.eq(2).html(), 'IPAddressTips', 'laServerAdd', i)) || (!CheckFilePathStrLen(spanSet.eq(3).html(), 'FilePathTips', 'laFilePath', i, 128))){
				    return;
			    }
			}else{
				if(((!CheckDIPadd(spanSet.eq(2).html(), 'IPAddressTips', 'laServerAdd', i)) && (!CheckIPV6add(spanSet.eq(2).html(), 'IPAddressTips', 'laServerAdd', i))) || (!CheckFilePathStrLen(spanSet.eq(3).html(), 'FilePathTips', 'laFilePath', i, 128))){
				    return;
			    }
			}
		}
	}
	for(var i = 1;i < 8;i++){
		var spanSet = divSet.eq(i).children("span");
		if(!((spanSet.eq(2).html() == "") && (spanSet.eq(3).html() == ""))){
			var szIPAddress1 = spanSet.eq(2).html();
			var szDirectory1 = spanSet.eq(3).html();
			for(var j = i+1;j <= 8;j++){
				var spanSetTemp = divSet.eq(j).children("span");
				if(!((spanSetTemp.eq(2).html() == "") && (spanSetTemp.eq(3).html() == ""))){
					var szIPAddress2 = spanSetTemp.eq(2).html();
					var szDirectory2 = spanSetTemp.eq(3).html();
					
					if(szIPAddress1 ==  szIPAddress2 && szDirectory1 == szDirectory2){
						szRetInfo = szAreaNameInfo + getNodeValue('jsNoSameNFS');
						$("#IPAddressTips").html(szRetInfo);
						spanSetTemp.eq(2).click();
						return;
					}
				}
			}
		}
	}
	$("#IPAddressTips").html("");
	$("#FilePathTips").html("");

	var xmlDoc =  new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	var NASLIST = xmlDoc.createElement("nasList");
	
	var iIdTemp = g_iNasStartId; //临时保存ID
    for(var i = 1; i <= 8; i++){
		var spanSetTemp = divSet.eq(i).children("span");
	    if(divSet[i].id != ""){
	  	    if(spanSetTemp.eq(2).html() == "" && spanSetTemp.eq(3).html() == ""){
	  			var nas = xmlDoc.createElement("nas");
	  			var Element = xmlDoc.createElement("id");
	            var text = xmlDoc.createTextNode(divSet[i].id);
	            Element.appendChild(text);
	            nas.appendChild(Element);
				
				Element = xmlDoc.createElement("addressingFormatType");
				text = xmlDoc.createTextNode('ipaddress');
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				Element = xmlDoc.createElement("ipAddress");
				text = xmlDoc.createTextNode("0.0.0.0");
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				Element = xmlDoc.createElement("portNo");
				text = xmlDoc.createTextNode('0');
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("nasType");
				text = xmlDoc.createTextNode("NFS");
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("path");
				text = xmlDoc.createTextNode("");
				Element.appendChild(text);
				nas.appendChild(Element);
				
				Element = xmlDoc.createElement("property");
				text = xmlDoc.createTextNode("RW");
				Element.appendChild(text);
				nas.appendChild(Element);
				
				NASLIST.appendChild(nas);      
	  	    }else{
	  			var nas = xmlDoc.createElement("nas");
	  			var Element = xmlDoc.createElement("id");
				var text = xmlDoc.createTextNode(divSet[i].id);
				Element.appendChild(text);
				nas.appendChild(Element);
			
				Element = xmlDoc.createElement("addressingFormatType");
				text = xmlDoc.createTextNode("ipaddress");
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				var strIpAddressType = CheckAddressingType(spanSetTemp.eq(2).html());
				Element = xmlDoc.createElement(strIpAddressType);
				text = xmlDoc.createTextNode(spanSetTemp.eq(2).html());
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				Element = xmlDoc.createElement("portNo");
				text = xmlDoc.createTextNode('0');
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("nasType");
				text = xmlDoc.createTextNode("NFS");
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("path");
				text = xmlDoc.createTextNode(spanSetTemp.eq(3).html().replace(/&amp;/g, '&'));
				Element.appendChild(text);
				nas.appendChild(Element);	
				
				Element = xmlDoc.createElement("property");
				text = xmlDoc.createTextNode("RW");
				Element.appendChild(text);
				nas.appendChild(Element);
				
				NASLIST.appendChild(nas);
	  	    }  	
	    }else{
	  	    if(!(spanSetTemp.eq(2).html() == "" && spanSetTemp.eq(3).html() == "")){
				var iNasEndId = iIdTemp + 8;
	  			for(; iIdTemp < iNasEndId; iIdTemp++){
					 if($.inArray(iIdTemp,m_iNasId) < 0){
						 m_iNasId.push(iIdTemp);
						 m_iNasIdMap.push(i);
						 break;
					 }
	  			}
	  			var nas = xmlDoc.createElement("nas");
				
	  			var Element = xmlDoc.createElement("id");
				var text = xmlDoc.createTextNode(m_iNasId[m_iNasId.length-1]);
				Element.appendChild(text);
				nas.appendChild(Element);
				
				Element = xmlDoc.createElement("addressingFormatType");
				text = xmlDoc.createTextNode("ipaddress");
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				var strIpAddressType = CheckAddressingType(spanSetTemp.eq(2).html());
				Element = xmlDoc.createElement(strIpAddressType);
				text = xmlDoc.createTextNode(spanSetTemp.eq(2).html());
				Element.appendChild(text);
				nas.appendChild(Element);	  
		  
				Element = xmlDoc.createElement("portNo");
				text = xmlDoc.createTextNode('0');
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("nasType");
				text = xmlDoc.createTextNode("NFS");
				Element.appendChild(text);
				nas.appendChild(Element);
	
				Element = xmlDoc.createElement("path");
				text = xmlDoc.createTextNode(spanSetTemp.eq(3).html().replace(/&amp;/g, '&'));
				Element.appendChild(text);
				nas.appendChild(Element);	
				
				Element = xmlDoc.createElement("property");
				text = xmlDoc.createTextNode("RW");
				Element.appendChild(text);
				nas.appendChild(Element);
				
				NASLIST.appendChild(nas);    
	  	    }
	    }	  	  
	} 
    xmlDoc.appendChild(NASLIST);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/ContentMgmt/Storage/nas",
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) 
		{
			var divSet = $("#nas").children("div");	
			$.each(m_iNasIdMap, function(i, n)
			{
				var spanSetTemp = divSet.eq(n).children("span");
				if(!(spanSetTemp.eq(2).html() == "" && spanSetTemp.eq(3).html() == ""))
				{
					divSet.eq(n).attr("id",m_iNasId[i]);
				}
				else
				{
					divSet.eq(n).attr("id","");
					m_iNasId[i] = 0;
					m_iNasIdMap[i] = 0;
				}
			});
			$.grep(m_iNasId, function(n,i)
			{
				return n > 0;
			});
			$.grep(m_iNasIdMap, function(n,i)
			{
				return n > 0;
			});
		},
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}