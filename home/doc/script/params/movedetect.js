var m_szMotionInfo = new Array();          //用户存储列表中的XML信息add20100110
for(var i = 0; i < 2; i++)
{
	m_szMotionInfo[i] = '0';
}
var m_szAreaXmlInfo = "";
var m_szMoveDetectLink = "";
var m_szMoveDetectLink = '';
var sliderImage1 = null;

var Event = {
	tabs: null	// 保存事件配置页面的tabs对象引用
};
/*************************************************
继承，未完成，wuyang
*************************************************/
function MotionDetection() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(MotionDetection);
pr(MotionDetection).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	HWP.Stop(0);
	$("#divEventSubPage").empty();
	var that = this;
    $.ajax({
		url: "params/movedetect.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) 
		{
			$("#divEventSubPage").html(msg);
			//初始化灵敏度滑动条
			sliderImage1 = new neverModules.modules.slider(
			{targetId: "MoveSensitive",
			sliderCss: "imageslider1",
			barCss: "imageBar2",
			step: 1,
			min: 0,
			max: 6,
			hints: "灵敏度:0"
			}); 
			sliderImage1.create();
			sliderImage1.wsetValue(0);
			sliderImage1.onchange = function ()
			{
			  	sliderImage1.setTitle(getNodeValue('laSensitivity') + sliderImage1.getValue());
			};
			$.ajax({ 
				url: "params/schedule.asp",
				type: "GET",
				dataType:"html",
				async: false,
				timeout: 15000,
				success:function(szMsg) {
					$("#TimeScheduleEdit").html(szMsg);
					g_transStack.clear();
					g_transStack.push(function() {
						that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "MotionDetection"]));
						parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
						parent.translator.translatePage(that.getLxd(), document);
					}, true);
					setTimeout("RecordMoveInitDay()", 10);  //解决IE6、7刷新无法绘制画布问题
				}
			});
		}
	});
}

function TamperProof() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(TamperProof);
pr(TamperProof).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	HWP.Stop(0);
	$("#divEventSubPage").empty();
	var that = this;
	$.ajax({
		url: "params/blockalarm.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);
			//遮挡报警灵敏度
			sliderImage1 = new neverModules.modules.slider(
			{targetId: "BlockSensitive",
			sliderCss: "imageslider1",
			barCss: "imageBar2",
			step: 1,
			min: 1,
			max: 3,
			hints: "灵敏度:低"
			}); 
			sliderImage1.create();
			sliderImage1.wsetValue(0);
			sliderImage1.onchange = function ()
			{
			  	sliderImage1.setTitle(getNodeValue('laSensitivity') + getNodeValue('BlockSensitiveOpt' + sliderImage1.getValue()));
			};
			$.ajax({ 
				url: "params/schedule.asp",
				type: "GET",
				dataType:"html",
				async: false,
				timeout: 15000,
				success:function(szMsg) {
					$("#TimeScheduleEdit").html(szMsg);
					g_transStack.clear();
					g_transStack.push(function() {
						that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "TamperProof"]));
						parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
					}, true);
					setTimeout("RecordKeepInitDay()", 10);  //解决IE6、7刷新无法绘制画布问题
					autoResizeIframe();
					g_transStack.push(function() {
						parent.translator.translatePage(that.getLxd(), document);
					}, true);
				}
			});
		}
	});
}

function VideoLoss() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(VideoLoss);
pr(VideoLoss).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	$("#divEventSubPage").empty();
	var that = this;
    $.ajax({
		url: "params/videolost.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);
			$.ajax({
				url: "params/schedule.asp",
				type: "GET",
				dataType: "html",
				async: false,
				timeout: 15000,
				success:function(szMsg) {						
					document.getElementById("TimeScheduleEdit").innerHTML = szMsg;
					g_transStack.clear();
					g_transStack.push(function() {
						that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "VideoLoss"]));
						parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
						parent.translator.translatePage(that.getLxd(), document);
					}, true);
					VideoLostInitDay();
					autoResizeIframe();
				}
			});
		}
	});
}

function AlarmInput() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(AlarmInput);
pr(AlarmInput).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	$("#divEventSubPage").empty();
	var that = this;
	$.ajax({
		url: "params/alarmin.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);
			if(window.parent.g_bIsIPDome)
			{
				$("#trLinkagePTZ").show();
			}
			RecordPTZInitDay();
			$.ajax({ 
				url: "params/schedule.asp",
				type: "GET",
				dataType:"html",
				async: false,
				timeout: 15000,
				success:function(szMsg) {
					document.getElementById("TimeScheduleEdit").innerHTML = szMsg;
					g_transStack.clear();
					g_transStack.push(function() {
						that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "AlarmInput"]));
						parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
						parent.translator.translatePage(that.getLxd(), document);
					}, true);
					
					GetAlarmInNum();
					autoResizeIframe();
				}
			});
		}
	});
}

function AlarmOutput() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(AlarmOutput);
pr(AlarmOutput).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	var that = this;
	$("#divEventSubPage").empty();
	$.ajax({
		url: "params/alarmout.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);	
			$.ajax({ 
				url: "params/schedule.asp",
				type: "GET",
				dataType:"html",
				async: false,
				timeout: 15000,
				success:function(szMsg) { 											
					$("#TimeScheduleEdit").html(szMsg);
					g_transStack.clear();
					g_transStack.push(function() {
						that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "AlarmOutput"]));
						parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
						parent.translator.translatePage(that.getLxd(), document);
					}, true);
					
					GetAlarmOutNo();
					autoResizeIframe();
				}
			});
		}
	});
}

function Exception() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Exception);
pr(Exception).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	$("#divEventSubPage").empty();
	var that = this;
	$.ajax({
		url: "params/abnormal.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "Exception"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			GetExceptionInfo();
			autoResizeIframe();
		}
	});
}

function Email() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(Email);
pr(Email).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	var that = this;
	$("#divEventSubPage").empty();
	$.ajax({
		url: "params/email.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);	
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "Email"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			GetEmailInfo();
			autoResizeIframe();
		}
	});
}

function CapturePlan() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(CapturePlan);
pr(CapturePlan).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	$("#divEventSubPage").empty();
	var that = this;
	$.ajax({
		url: "params/CapturePlan.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg); 
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "CapturePlan"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			getCapturePlanAbility();
			getCapturePlanInfo();
			autoResizeIframe();
		}
	});
}
//其他报警
function OtherAlarm() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(OtherAlarm);
pr(OtherAlarm).initCSS = function()
{
	$("#seWLSID").change(function()
	{
		getWLSInfo($(this).val());
		getAlarmLinkInfo("WLSensor-"+$(this).val());
	});
	GetAlarmOutNo();//获取报警输出数
	//列出报警输出通道
	var szDivInfo = "";
	for(var i = 0; i < m_iAlarmOutputTotalNum; i ++)
	{
		if(i < m_iAlarmOutputAnalogNum)
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'>&nbsp;"+"A->" + (i + 1) + "&nbsp;";			
		}
		else
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'>&nbsp;"+"D" + (Math.floor(parseInt(m_szAlarmOutInfo[i].split("-")[1])/100) - m_iAChannelNum) + "->" + parseInt(m_szAlarmOutInfo[i].split("-")[1])%100 + "&nbsp;";
		}
		
		if((i+1) % 9 == 0 && i != 0)
		{
			szDivInfo = szDivInfo + "<br>";	
		}
	}
	$("#spWLSDisPlayLinkageList").html(szDivInfo);
	$("#spPIRDisPlayLinkageList").html(szDivInfo);
	$("#spCallHelpDisPlayLinkageList").html(szDivInfo);
	$("#inWLSSelectAllAlarmOutput").prop("checked", false).click(function()
	{
		if(this.checked)
		{
			$("#spWLSDisPlayLinkageList").find(":checkbox").prop("checked", true);
		}
		else
		{
			$("#spWLSDisPlayLinkageList").find(":checkbox").prop("checked", false);
		}
	});
	$("#inPIRSelectAllAlarmOutput").prop("checked", false).click(function()
	{
		if(this.checked)
		{
			$("#spPIRDisPlayLinkageList").find(":checkbox").prop("checked", true);
		}
		else
		{
			$("#spPIRDisPlayLinkageList").find(":checkbox").prop("checked", false);
		}
	});
	$("#inCallHelpSelectAllAlarmOutput").prop("checked", false).click(function()
	{
		if(this.checked)
		{
			$("#spCallHelpDisPlayLinkageList").find(":checkbox").prop("checked", true);
		}
		else
		{
			$("#spCallHelpDisPlayLinkageList").find(":checkbox").prop("checked", false);
		}
	});
}
pr(OtherAlarm).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").hide();
	$("#divEventSubPage").empty();
	var that = this;
	$.ajax({
		url: "params/OtherAlarm.asp",
		type: "GET",
		dataType: "html",
		async: false,
		timeout: 15000,
		error: function() {
			//that.update();
		},
		success: function(msg) {
			$("#divEventSubPage").html(msg);
			that.initCSS();
			
			$("#dvWLS").find(":radio").prop("checked", true).click();
			g_transStack.clear();
			g_transStack.push(function() {
				that.setLxd(parent.translator.getLanguageXmlDoc(["Events", "OtherAlarm"]));
				parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
				parent.translator.translatePage(that.getLxd(), document);
			}, true);
			
			getPIRInfo();
			getAlarmLinkInfo("PIR");
			
			getWLSInfo($("#seWLSID").val());
			getAlarmLinkInfo("WLSensor-"+$("#seWLSID").val());
			
			if(g_bSupportCH)
			{
				$("#dvCallHelp").show();
				getAlarmLinkInfo("callhelp");
			}
			
			autoResizeIframe();
		}
	});
}
/*************************************************
Function:		RecordMoveInitDay
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordMoveInitDay()
{
	var szInfo = getNodeValue('laPlugin');
	if(!checkPlugin('1', szInfo, 1, 'motiondetect'))
	{
		return;
	}
	
	if(!CompareFileVersion())
	{
		UpdateTips();
	}
	
	ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
	m_iPicinform = 1;

	setTimeout(function() {
		if (HWP.Play() !== 0) {
			alert(getNodeValue("previewfailed"));
		}
	}, 10);
	
	GetMoveDetectInfo();
}

/*************************************************
Function:		GetMoveDetectInfo
Description:	获取移动侦测信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetMoveDetectInfo()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/MotionDetection/" + m_iPicinform;
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			m_szMoveDetectXmlStr = xhr.responseText;
			GetMoveDetectLink();
			if($(xmlDoc).find("highlightsenabled").length > 0){
				$("#divHighLight").show();
				$("#chEnableHighLight").prop("checked", $(xmlDoc).find("highlightsenabled").eq(0).text()=="true"?true:false);
			}
			autoResizeIframe();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
				HWP.ClearRegion();//清除所画区域
				$("input",document).each(function(i)
				{
					$(this).prop("disabled", true);										   
				});
				alert(m_szError77);
				$("#SaveConfigBtn").prop('disabled',true); //保存按钮为不可用状态
				return;
			}
			else
			{    
			   alert(m_szError400);   
			   return;
			}   
		}
	});
}
/*************************************************
Function:		GetMoveDetectLink
Description:	获取移动侦测联动方式
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetMoveDetectLink()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/VMD-" + m_iPicinform;
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
		    m_szMoveDetectLink = xhr.responseText;
		    GetMoveDetectSchedule();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			m_szMoveDetectLink = '';
		    GetMoveDetectSchedule();
		}
	});
}
/*************************************************
Function:		GetMoveDetectSchedule
Description:	获取移动侦测布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetMoveDetectSchedule()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
		    m_szMoveDetectSchedule = xhr.responseText;
		    GetMotionInfo();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		GetMotionInfo	
Description:	获取硬盘录像机的通道移动侦测参数信息
Input:			lChannelNum	对应通道号
Output:			无	
Return:			以XML形式记录硬盘录像机通道移动侦测参数信息的一个字符串。
*************************************************/
function GetMotionInfo()               
{
    GetAlarmOutNo();//获取报警输出数
	CreateAlarmOutputList(m_iAlarmOutputAnalogNum,m_iAlarmOutputTotalNum); 			//列出触发报警输出通道
	
	$("#MoveEmail").prop("checked",false);
	$("#MoveSoundAlarm").prop("checked",false);
	$("#MoveMonitorAlarm").prop("checked",false);
	$("#MoveUpload").prop("checked",false);
	
	for(var i = 0; i < 8; i++)
	{
		for(var j = 0;j < 8;j ++)
		{
			m_szWeek[i][j][0] = "00:00:00";
			m_szWeek[i][j][1] = "00:00:00"; 
		}
	}
	
	var xmlLinkDoc = null;
	var xmlScheduleDoc = null;
    var xmlDoc = parseXmlFromStr(m_szMoveDetectXmlStr);
	if("true" == $(xmlDoc).find('enabled').eq(0).text())
	{
		 $("#IsUseMotion").prop("checked",true);
	}
	else
	{
		 $("#IsUseMotion").prop("checked",false);
	}
	   
	//$("#MoveSensitive").val(0);	
	sliderImage1.wsetValue(0);
	sliderImage1.setTitle(getNodeValue('laSensitivity') + sliderImage1.getValue());
	MDRNumber = $(xmlDoc).find('MotionDetectionRegionList').eq(0).children('MotionDetectionRegion').length;
	var MotionDetectionRegions = $(xmlDoc).find('MotionDetectionRegionList').eq(0).children('MotionDetectionRegion');
	if(MDRNumber > 0)
	{
	    var MoveSensitive =  $(xmlDoc).find('sensitivityLevel').eq(0).text();
		MoveSensitive = Number(MoveSensitive);
		switch(MoveSensitive)
		{
			case 0:
				MoveSensitive = 0;
				break;
			case 10:
				MoveSensitive = 1;
				break;
			case 20:
				MoveSensitive = 2;
				break;
			case 40:
				MoveSensitive = 3;
				break;
			case 60:
				MoveSensitive = 4;
				break;
			case 80:
				MoveSensitive = 5;
				break;
			case 100:
				MoveSensitive = 6;
				break;						
		}		
		//$("#MoveSensitive").val(MoveSensitive);
		sliderImage1.wsetValue(MoveSensitive);
		sliderImage1.setTitle(getNodeValue('laSensitivity') + MoveSensitive);
	}
	m_szAreaXmlInfo = TransDevToOcxRegion(m_szMoveDetectXmlStr, "movedetect");
	try
	{
	    HWP.SetRegionInfo(m_szAreaXmlInfo);//设置移动侦测区域
	}
	catch(oError)
	{
		
	}
	if(m_szMoveDetectLink != '')
	{
	    xmlLinkDoc = parseXmlFromStr(m_szMoveDetectLink);
		m_szMotionInfo[0] = "VMD-" + m_iPicinform;
	}
	
	if(xmlLinkDoc != null)
	{
		var iMethodNum = $(xmlLinkDoc).find('notificationMethod').length;
		for(i = 0;i < iMethodNum;i++)//报警输入联动信息
		{
			if("email" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#MoveEmail").prop("checked",true);
			}
			if("beep" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#MoveSoundAlarm").prop("checked",true);
			}
			if("center" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#MoveUpload").prop("checked",true);
			}
			if("monitorAlarm" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#MoveMonitorAlarm").prop("checked",true);
			}
			if("FTP" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#MoveFTP").prop("checked",true);
			}		
		}
			   
		var iAnalogOutPut = $(xmlLinkDoc).find('outputIOPortID').length;   
		for(j = 0;j < iAnalogOutPut; j++)
		{
		    var iNo = $(xmlLinkDoc).find('outputIOPortID').eq(j).text();
		    for(var i = 0; i < m_iAlarmOutputTotalNum; i++)
		    {
			    if(m_szAlarmOutInfo[i] == iNo)
			    {
				    iNo = i;
				    break;
			    }
		    }
		    $("#AlarmOutputCheckboxChanO-" + (iNo + 1)).prop("checked",true);
		}
		
		//触发通道录像
		var iAnalogRecord = $(xmlLinkDoc).find('videoInputID').length;
		for(j = 0; j < iAnalogRecord; j++)
		{
			var iNo = $(xmlLinkDoc).find('videoInputID').eq(j).text();
			if(iNo <= m_iAChannelNum)
			{
			    $("#TriggerRecordCheckboxChan"+iNo).prop("checked",true);
			}
		}
		CheackAlarmOutputAllSel();
	}
	else
	{
		m_szMotionInfo[0] = "VMD-" + m_iPicinform;
	}
	
	xmlDoc = parseXmlFromStr(m_szMoveDetectSchedule);
	for(i = 0; i < $(xmlDoc).find('EventSchedule').length; i++)
	{
		if($(xmlDoc).find('eventType').eq(i).text() == 'VMD')
		{
			if($(xmlDoc).find('eventType').eq(i).next().eq(0).text() == m_iPicinform)
			{
				m_szMotionInfo[1] = $(xmlDoc).find('eventType').eq(i).prev().eq(0).text();
				xmlScheduleDoc = $(xmlDoc).find('EventSchedule').eq(i);
				break;
			}
		}
	}
	
	if(xmlScheduleDoc != null)
	{
		for(var i = 0; i < $(xmlScheduleDoc).find('dayOfWeek').length; i++)
		{
			dayofWeek = $(xmlScheduleDoc).find('dayOfWeek').eq(i).text();
			for(var j = 0; j<8; j++)
			{
				if(m_szWeek[dayofWeek-1][j][0] == '00:00:00' && m_szWeek[dayofWeek-1][j][1] == '00:00:00')
				{
					m_szWeek[dayofWeek-1][j][0] = $(xmlScheduleDoc).find('TimeRange').eq(i).children('beginTime').eq(0).text();
					m_szWeek[dayofWeek-1][j][1] = $(xmlScheduleDoc).find('TimeRange').eq(i).children('endTime').eq(0).text();
					break;
				}
			}
		}
		if(m_bHolidayEnable)
	    {
		    for(var i = 0; i < $(xmlScheduleDoc).find('HolidayBlockList').eq(0).children('TimeBlock').length; i++)
		    {
			    for(var j = 0; j<8; j++)
			    {
				    if((m_szWeek[7][j][0] == '00:00:00' && m_szWeek[7][j][1] == '00:00:00') || (m_szWeek[7][j][0] != '00:00:00' && m_szWeek[7][j][1] == '00:00:00'))
				    {
					    m_szWeek[7][j][0] = $(xmlScheduleDoc).find('HolidayBlockList').eq(0).find('beginTime').eq(i).text();
					    m_szWeek[7][j][1] = $(xmlScheduleDoc).find('HolidayBlockList').eq(0).find('endTime').eq(i).text();
					    break;
				    }
			    }
		    }
	    }
	}
	else
	{
		m_szMotionInfo[1] = "VMD_video" + m_iPicinform;
	}
	g_transStack.push(InitDrawSchedule, true);
	//InitDrawSchedule();
	EnableMoveDetect();
}
/*************************************************
Function:		StartHuaCover
Description:	开始画图
Input:			无			
Output:			无
return:			无				
*************************************************/
function StartHuaCover()
{
	if ($("#CoverStartMapbutton").val() == getNodeValue('CoverStartMapbutton'))
	{
		HWP.SetDrawStatus(true);
		$("#CoverStartMapbutton").val(getNodeValue("CoverStopMapbuttonTips"));
	}
	else
	{
		HWP.SetDrawStatus(false);
		$("#CoverStartMapbutton").val(getNodeValue("CoverStartMapbutton"));
	}
}
/*************************************************
Function:		ClearMapCover
Description:	清除画图
Input:			iType: 清除区域类型			
Output:			无
return:			无				
*************************************************/
function ClearMapCover(iType)
{
	Warning =confirm(getNodeValue('ClearRegionTips'));
	if(Warning)
	{
		HWP.ClearRegion();//清除所画区域
	}
}
/*************************************************
Function:		SetMoveDetectInfo
Description:	设置移动侦测
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetMoveDetectInfo()
{
	if($("#CoverStartMapbutton").html() == getNodeValue('CoverStopMapbuttonTips'))
	{
		HWP.SetDrawStatus(false);
		$("#CoverStartMapbutton").html(getNodeValue('CoverStartMapbutton'));
		
	}
	m_szAreaXmlInfo = HWP.GetRegionInfo();
	
	m_bDelete = true;
	m_bSetLink = false;
	m_bSetSchedule = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	
	//DeleteMoveDetectLink();
	
	SetMotionLink();
	
	if(m_b403Error)
	{
		szRetInfo = m_szErrorState + m_szError8;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}
	
	if(m_bNetAbnormal)
	{
		szRetInfo = m_szErrorState + m_szError9;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}
	
	SetMotionSchedule();
	//验证绘制的区域是否合法
	var oCheckXml = parseXmlFromStr(m_szAreaXmlInfo);
	var bParamIsOK = true;
	$(oCheckXml).find("DetectionRegion").each(function()
	{
		var oRegionCoordinates1 = $(this).find("RegionCoordinates").eq(0);
		var oRegionCoordinates2 = $(this).find("RegionCoordinates").eq(1);
		var oRegionCoordinates3 = $(this).find("RegionCoordinates").eq(2);
		var oRegionCoordinates4 = $(this).find("RegionCoordinates").eq(3);
		//横线
		if(oRegionCoordinates1.find("positionX").eq(0).text() == oRegionCoordinates4.find("positionX").eq(0).text() && oRegionCoordinates1.find("positionY").eq(0).text() == oRegionCoordinates4.find("positionY").eq(0).text())
		{
			bParamIsOK = false;
			return false;
		}
		//竖线
		if(oRegionCoordinates1.find("positionX").eq(0).text() == oRegionCoordinates2.find("positionX").eq(0).text() && oRegionCoordinates1.find("positionY").eq(0).text() == oRegionCoordinates2.find("positionY").eq(0).text())
		{
			bParamIsOK = false;
			return false;
		}
	});
	if(!bParamIsOK)
	{
		return;
	}
	DeleteMoveDetectInfo();
	
	var strIsUseMotion = "";
	if( $("#IsUseMotion").prop("checked"))
	{
		strIsUseMotion = "true";
	}
	else
	{
		strIsUseMotion = "false";
	}
	var MoveSensitive = sliderImage1.getValue();//$("#MoveSensitive").val();
	MoveSensitive = Number(MoveSensitive);
	switch(MoveSensitive)
	{
		case 0:
			MoveSensitive = 0;
			break;
		case 1:
			MoveSensitive = 10;
			break;
		case 2:
			MoveSensitive = 20;
			break;
		case 3:
			MoveSensitive = 40;
			break;
		case 4:
			MoveSensitive = 60;
			break;
		case 5:
			MoveSensitive = 80;
			break;
		case 6:
			MoveSensitive = 100;
			break;						
	}
	
	//获取移动侦测区域
	var xmlDoc = TransOcxToDevRegion(m_szMoveDetectXmlStr, m_szAreaXmlInfo, 'movedetect');
	$(xmlDoc).find('id').eq(0).text(m_iPicinform);
	$(xmlDoc).find('enabled').eq(0).text(strIsUseMotion);
	
	for(var i = 0; i < $(xmlDoc).find('sensitivityLevel').length; i++)
	{
	    $(xmlDoc).find('sensitivityLevel').eq(i).text(MoveSensitive);
	}
	if($("#divHighLight").css("display") != "none"){
		$(xmlDoc).find("highlightsenabled").eq(0).text($("#chEnableHighLight").prop("checked").toString());
	}
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/MotionDetection/" + m_iPicinform;
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data:xmlDoc,
		async:false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr,textStatus) {
			if((m_bDelete == false) || (m_bSetLink == false) || (m_bSetSchedule == false))
			{
				szRetInfo = m_szErrorState + m_szError1;
				$("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				return;
			}
			if(xhr.status == 403)
			{
				szRetInfo = m_szErrorState + m_szError8;
			}
			else if(xhr.status == 200)
			{
				var xmlDoc = xhr.responseXML;
				if("1" == $(xmlDoc).find('statusCode').eq(0).text())
				{
					szRetInfo = m_szSuccessState + m_szSuccess1;
					//GetMoveDetectInfo();
				}
				else
				{
					szRetInfo = m_szErrorState + m_szError1;
				}
			}else
			{
				szRetInfo = m_szErrorState + m_szError9;
			}
			$("#SetResultTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
		}
	});
}
/*************************************************
Function:		DeleteMoveDetectLink
Description:	删除移动侦测区域
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteMoveDetectInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/MotionDetection/" + m_iPicinform +"/regions";
	$.ajax(
	{
		type: "DELETE",
		url: szURL,
		async:false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("1" == $(xmlDoc).find('statusCode').eq(0).text())
			{
				szRetInfo = m_szSuccessState + getNodeValue('DeleteRegionSuccessTips');
				//HWP.ClearRegion();//清除所画区域
			}
			else
			{
				szRetInfo = m_szErrorState + getNodeValue('DeleteRegionFailedTips');
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			szRetInfo = m_szErrorState + m_szError9;
		}
	});
}
/*************************************************
Function:		SetMotionSchedule
Description:	设置移动侦测布防时间
Input:			无
Output:			无
return:			无				
*************************************************/
function SetMotionSchedule()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules/" + m_szMotionInfo[1];
	var xmlDoc = CreateScheduleDoc("VMD","","");//修改创建布防时间xml方式
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: xmlDoc,
		async: false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("OK" == $(xmlDoc).find('statusString').eq(0).text())
		    {
			    m_bSetSchedule = true;
		    }
		    else
		    {
			    m_bSetSchedule = false;
		    }		
		},
		error: function(xhr, textStatus, errorThrown)
		{
			m_bSetSchedule = false;
		}
	});
}
/*************************************************
Function:		SetMotionLink
Description:	设置移动侦测联动方式
Input:			无
Output:			无
return:			无				
*************************************************/
function SetMotionLink()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szMotionInfo[0];
	var xmlDoc = CreateLinkDoc("VMD");
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: xmlDoc,
		async: false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("OK" == $(xmlDoc).find('statusString').eq(0).text())
		    {
			    m_bSetLink = true;
		    }
		    else
		    {
			    m_bSetLink = false;
		    }			
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
				m_b403Error = true;
			}
			else
			{
				m_bNetAbnormal = true;
			}
		}
	});
}
/*************************************************
Function:		DeleteMoveDetectLink
Description:	删除移动侦测联动
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteMoveDetectLink()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szMotionInfo[0];
	$.ajax(
	{
		type: "DELETE",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("1" == $(xmlDoc).find('statusCode').eq(0).text())
		    {
			    m_bDelete = true;
		    }
		    else
		    {
			    m_bDelete = false;
		    }			
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
				m_b403Error = true;
			}
			else
			{
				m_bNetAbnormal = true;
			}
		}
	});
}
/*************************************************
Function:		TransDevToOcxRegion
Description:	将设备传过来的xml转换成插件需要的xml格式
Input:			无			
Output:			无
return:			无				
*************************************************/
function TransDevToOcxRegion(strInfo,strType)
{
	var xmlTempDoc = parseXmlFromStr(strInfo);
	var xmlDoc = new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	
	Root = xmlDoc.createElement("DetectionRegionInfo");
	
	Element = xmlDoc.createElement("videoFormat");
	text = xmlDoc.createTextNode(m_iVideoOutNP);
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("RegionType");
	var RegionType = "roi";
	if(strType == "movedetect")
	{
	    RegionType = $(xmlTempDoc).find('regionType').eq(0).text();
	}
	text = xmlDoc.createTextNode(RegionType);
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	if(RegionType == "grid")
	{
		Grid = xmlDoc.createElement("Grid");
	
		Element = xmlDoc.createElement("rowGranularity");
		text = xmlDoc.createTextNode($(xmlTempDoc).find('rowGranularity').eq(0).text());
		Element.appendChild(text);	
		Grid.appendChild(Element);
		
		Element = xmlDoc.createElement("columnGranularity");
		text = xmlDoc.createTextNode($(xmlTempDoc).find('columnGranularity').eq(0).text());
		Element.appendChild(text);	
		Grid.appendChild(Element);
		
		Root.appendChild(Grid);
	}
	else
	{
		ROI = xmlDoc.createElement("ROI");
	
		Element = xmlDoc.createElement("HorizontalResolution");
		text = xmlDoc.createTextNode("704");//暂时写成固定的，需从设备获取
		Element.appendChild(text);	
		ROI.appendChild(Element);
		
		Element = xmlDoc.createElement("VerticalResolution");
		if(m_iVideoOutNP == 'PAL')
		{
		    text = xmlDoc.createTextNode("576");//暂时写成固定的，需从设备获取
		}
		else
		{
			text = xmlDoc.createTextNode("480");//暂时写成固定的，需从设备获取
		}
		Element.appendChild(text);	
		ROI.appendChild(Element);
		
		Root.appendChild(ROI);
	}
	
	Element = xmlDoc.createElement("DisplayMode");
	if(strType == "movedetect")
	{
		text = xmlDoc.createTextNode("transparent");
	}
	else
	{
		text = xmlDoc.createTextNode("shelter");
	}
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("MaxRegionNum");
	if(strType == "movedetect")
	{
		text = xmlDoc.createTextNode("8");//暂时写成固定的，需从设备获取
	}
	else if(strType == "tamperdetection")
	{
		text = xmlDoc.createTextNode("1");
	}
	else
	{
		text = xmlDoc.createTextNode("4");
	}
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	DetectionRegionList = xmlDoc.createElement("DetectionRegionList");
	for(var i = 0; i < $(xmlTempDoc).find('RegionCoordinatesList').length; i++) //几个区域
	{
		DetectionRegion = xmlDoc.createElement("DetectionRegion");
		RegionCoordinatesList = xmlDoc.createElement("RegionCoordinatesList");
		for(var j = 0; j < $(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionX').length; j++)//几个坐标
		{
			RegionCoordinates = xmlDoc.createElement("RegionCoordinates");
			
			Element = xmlDoc.createElement("positionX");
		    text = xmlDoc.createTextNode($(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionX').eq(j).text());
		    Element.appendChild(text);
			RegionCoordinates.appendChild(Element);
			
			Element = xmlDoc.createElement("positionY");
		    text = xmlDoc.createTextNode($(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionY').eq(j).text());
		    Element.appendChild(text);
			RegionCoordinates.appendChild(Element);
			
			RegionCoordinatesList.appendChild(RegionCoordinates);
		}
		DetectionRegion.appendChild(RegionCoordinatesList);
		DetectionRegionList.appendChild(DetectionRegion);
	}
	Root.appendChild(DetectionRegionList);
	xmlDoc.appendChild(Root);
	
	return xmlToStr(xmlDoc);
}
/*************************************************
Function:		TransOcxToDevRegion
Description:	将插件传过来的xml转换成设备需要的xml格式
Input:			无			
Output:			无
return:			无				
*************************************************/
function TransOcxToDevRegion(strDeviceInfo, strOcxInfo, strType)
{
	var xmlDoc = parseXmlFromStr(strDeviceInfo);
	var xmlTempDoc = parseXmlFromStr(strOcxInfo);
	
	if(strType == "movedetect")
	{
		$(xmlDoc).find('MotionDetectionRegionList').eq(0).remove();	
		DetectionRegionList = xmlDoc.createElement("MotionDetectionRegionList");
		var strTemp = "MotionDetectionRegion";
	}
	else if(strType == "tamperdetection")
	{
		$(xmlDoc).find('TamperDetectionRegionList').eq(0).remove();		
		DetectionRegionList = xmlDoc.createElement("TamperDetectionRegionList");
		var strTemp = "TamperDetectionRegion";
	}
	else
	{
		$(xmlDoc).find('PrivacyMaskRegionList').eq(0).remove();	
		DetectionRegionList = xmlDoc.createElement("PrivacyMaskRegionList");
		var strTemp = "PrivacyMaskRegion";
	}
	for(var i = 0; i < $(xmlTempDoc).find('DetectionRegion').length; i++)
	{
		DetectionRegion = xmlDoc.createElement(strTemp);
		
		Element = xmlDoc.createElement("id");
		text = xmlDoc.createTextNode(i+1);
		Element.appendChild(text);	
		DetectionRegion.appendChild(Element);
		
		Element = xmlDoc.createElement("enabled");
		text = xmlDoc.createTextNode("true");
		Element.appendChild(text);	
		DetectionRegion.appendChild(Element);
		
		if(strType != "videoshelter")
		{
			Element = xmlDoc.createElement("sensitivityLevel");
			text = xmlDoc.createTextNode("0");
			Element.appendChild(text);	
			DetectionRegion.appendChild(Element);
		}
		if(strType == "movedetect")
		{
			Element = xmlDoc.createElement("detectionThreshold");
			text = xmlDoc.createTextNode("50");
			Element.appendChild(text);	
			DetectionRegion.appendChild(Element);
		}
		
		RegionCoordinatesList = xmlDoc.createElement("RegionCoordinatesList");
		for(var j = 0; j < $(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionX').length; j++)//几个坐标
		{
			RegionCoordinates = xmlDoc.createElement("RegionCoordinates");
			
			Element = xmlDoc.createElement("positionX");
			text = xmlDoc.createTextNode($(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionX').eq(j).text());
			Element.appendChild(text);
			RegionCoordinates.appendChild(Element);
			
			Element = xmlDoc.createElement("positionY");
			text = xmlDoc.createTextNode($(xmlTempDoc).find('RegionCoordinatesList').eq(i).find('positionY').eq(j).text());
			Element.appendChild(text);
			RegionCoordinates.appendChild(Element);
			
			RegionCoordinatesList.appendChild(RegionCoordinates);
		}
		DetectionRegion.appendChild(RegionCoordinatesList);
		DetectionRegionList.appendChild(DetectionRegion);
	}
	xmlDoc.documentElement.appendChild(DetectionRegionList);
	return xmlDoc;
}
/*************************************************
Function:		EnableMoveDetect
Description:	移动侦测使能
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableMoveDetect()
{
	if($("#IsUseMotion").prop("checked"))
	{
		$("#ScheduleEditBtn").prop("disabled",false);
		/*$(".videocontrols").prop("disabled",false);
		$("#chEnableHighLight").prop("disabled",false);
		$("#tableEventLinkage").find(":checkbox").prop("disabled",false);*/
	}
	else
	{
		$("#ScheduleEditBtn").prop("disabled",true);
		/*$(".videocontrols").prop("disabled",true);
		$("#chEnableHighLight").prop("disabled",true);
		$("#tableEventLinkage").find(":checkbox").prop("disabled",true);*/
	}
}
/*************************************************
Function:		getPIRInfo
Description:	获取PIR报警信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getPIRInfo()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PIR";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#inEnablePIRAlarm").prop("checked", $(xmlDoc).find("enabled").eq(0).text() == "true"? true:false);
			$("#inPIRName").val($(xmlDoc).find("name").eq(0).text());
		},
		error: function(xhr, textStatus, errorThrown)
		{
			$("#inEnablePIRAlarm").prop("checked", false);
			$("#inPIRName").val("");
		}
	});
}
/*************************************************
Function:		getWLSInfo
Description:	获取单个无线报警信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getWLSInfo(iID)
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/WLSensors/"+iID;
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#inEnableWLSAlarm").prop("checked", $(xmlDoc).find("enabled").eq(0).text() == "true"? true:false);
			$("#inWLSName").val($(xmlDoc).find("name").eq(0).text());
		},
		error: function(xhr, textStatus, errorThrown)
		{
			$("#inEnableWLSAlarm").prop("checked", false);
			$("#inWLSName").val("");
		}
	});
}
/*************************************************
Function:		getAlarmLinkInfo
Description:	获取报警联动信息信息
Input:			szType  类型			
Output:			无
return:			无				
*************************************************/
function getAlarmLinkInfo(szType)
{
	if(szType == "PIR")
	{
		var szParent = "dvPIR";
	}
	else if(szType == "callhelp")
	{
		var szParent = "dvCallHelp";
	}
	else
	{
		var szParent = "dvWLS";
	}
	$("#"+szParent).find("#dvEventLinkage").find(":checkbox").prop("checked", false);
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/"+szType;
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var oNotificationMethod = $(xmlDoc).find("notificationMethod");
			var iMethodNum = oNotificationMethod.length;
			for(var i = 0;i < iMethodNum;i++)//报警输入联动信息
			{
				var szMethod = oNotificationMethod.eq(i).text();
				if("email" == szMethod)
				{
					 $("#"+szParent).find("#InEmail").prop("checked",true);
				}
				
				if("beep" == szMethod)
				{
					 $("#"+szParent).find("#InSoundAlarm").prop("checked",true);
				}
				if("center" == szMethod)
				{
					 $("#"+szParent).find("#InUpload").prop("checked",true);
				}
				if("FTP" == szMethod)
				{
					 $("#"+szParent).find("#InFTP").prop("checked",true);
				}			
				if("monitorAlarm" == szMethod)
				{
					 $("#"+szParent).find("#InMonitorAlarm").prop("checked",true);
				}
				if("LightAudioAlarm" == szMethod)
				{
					 $("#"+szParent).find("#inLightAudioAlarm").prop("checked",true);
				}
			}
				   
			var iAnalogOutPut = $(xmlDoc).find("outputIOPortID").length;   
			for(j = 0;j < iAnalogOutPut; j++)
			{
				var iNo = $(xmlDoc).find("outputIOPortID").eq(j).text();
				for(var i = 0; i < m_iAlarmOutputTotalNum; i++)
				{
					if(m_szAlarmOutInfo[i] == iNo)
					{
						iNo = i;
						break;
					}
				}
				$("#"+szParent).find("#AlarmOutputCheckboxChanO-" + (iNo + 1)).prop("checked",true);
			}
			//是否全选
			if(szType == "PIR")
			{
				var oCheckbox = $("#spPIRDisPlayLinkageList").find(":checkbox")
				oCheckbox.each(function(i)
				{
					if(this.checked)
					{
						if((i+1) >= oCheckbox.length)
						{
							$("#inPIRSelectAllAlarmOutput").prop("checked",true);
						}
					}
					else
					{
						$("#inPIRSelectAllAlarmOutput").prop("checked",false);
						return false;
					}
				});
			}
			else if(szType == "callhelp")
			{
				var oCheckbox = $("#spCallHelpDisPlayLinkageList").find(":checkbox")
				oCheckbox.each(function(i)
				{
					if(this.checked)
					{
						if((i+1) >= oCheckbox.length)
						{
							$("#inCallHelpSelectAllAlarmOutput").prop("checked",true);
						}
					}
					else
					{
						$("#inCallHelpSelectAllAlarmOutput").prop("checked",false);
						return false;
					}
				});
			}
			else
			{
				var oCheckbox = $("#spWLSDisPlayLinkageList").find(":checkbox")
				oCheckbox.each(function(i)
				{
					if(this.checked)
					{
						if((i+1) >= oCheckbox.length)
						{
							$("#inWLSSelectAllAlarmOutput").prop("checked",true);
						}
					}
					else
					{
						$("#inWLSSelectAllAlarmOutput").prop("checked",false);
						return false;
					}
				});
			}
			//触发录像通道
			if($(xmlDoc).find("videoInputID").length > 0)
			{
				$("#"+szParent).find("#inRecord").prop("checked",true);
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			
		}
	});
}
/*************************************************
Function:		setOtherAlarmInfo
Description:	设置其他报警信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function setOtherAlarmInfo(szType)
{
	if(szType == "PIR")
	{
		if(!CheckDeviceName($("#inPIRName").val(),'inPIRNameTips',1))
		{
			return;
		}
		var szXml = "<?xml version='1.0' encoding='UTF-8'?><PIRAlarm><enabled>"+$("#inEnablePIRAlarm").prop("checked").toString()+"</enabled><name>"+$("#inPIRName").val()+"</name></PIRAlarm>";
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PIR";
	}
	else if(szType == "callhelp")
	{
		return;
	}
	else
	{
		
		if(!CheckDeviceName($("#inWLSName").val(),'inWLSNameTips',1))
		{
			return;
		}
		var szXml = "<?xml version='1.0' encoding='UTF-8'?><WirelessSensor><id>"+$("#seWLSID").val()+"</id><enabled>"+$("#inEnableWLSAlarm").prop("checked").toString()+"</enabled><name>"+$("#inWLSName").val()+"</name></WirelessSensor>";
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/WLSensors/"+$("#seWLSID").val();
	}
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type:"PUT",
		url: szURL,
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

/*************************************************
Function:		setOtherAlarmLinkDoc
Description:	设置其他报警联动信息
Input:			szType  类型			
Output:			无
return:			无				
*************************************************/
function setOtherAlarmLinkDoc(szType)
{
	if(szType == "PIR")
	{
		var szParent = "dvPIR";
	}
	else if(szType == "callhelp")
	{
		var szParent = "dvCallHelp";
	}
	else
	{
		var szParent = "dvWLS";
	}
	
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><EventTrigger>";
	
	if(szType == "PIR")
	{
		szXml += "<id>PIR</id><eventType>PIR</eventType><eventDescription>PIR Event trigger Information</eventDescription><videoInputChannelID>1</videoInputChannelID><dynVideoInputChannelID>1</dynVideoInputChannelID><EventTriggerNotificationList>";
	}
	else if(szType == "callhelp")
	{
		szXml += "<id>callhelp</id><eventType>callhelp</eventType><eventDescription>PIR Event trigger Information</eventDescription><videoInputChannelID>1</videoInputChannelID><dynVideoInputChannelID>1</dynVideoInputChannelID><EventTriggerNotificationList>";
	}
	else
	{
		szXml += "<id>WLSensor-"+$("#seWLSID").val()+"</id>";
		szXml += "<eventType>WLSensor</eventType><eventDescription>WLSensor Event trigger Information</eventDescription><WLSensorID>"+$("#seWLSID").val()+"</WLSensorID><videoInputChannelID>1</videoInputChannelID><dynVideoInputChannelID>1</dynVideoInputChannelID><EventTriggerNotificationList>";
	}
	if($("#"+szParent).find("#InEmail").prop("checked"))				//邮件联动
	{
		szXml += "<EventTriggerNotification><id>email</id><notificationMethod>email</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	
	if($("#"+szParent).find("#InSoundAlarm").prop("checked"))			//声音报警
	{
		szXml += "<EventTriggerNotification><id>beep</id><notificationMethod>beep</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}

	if($("#"+szParent).find("#InUpload").prop("checked"))				//上传中心
	{
		szXml += "<EventTriggerNotification><id>center</id><notificationMethod>center</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	if($("#"+szParent).find("#InFTP").prop("checked"))				//上传FTP
	{
		szXml += "<EventTriggerNotification><id>FTP</id><notificationMethod>FTP</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	if($("#"+szParent).find("#inLightAudioAlarm").prop("checked"))				//无线声光报警器
	{
		szXml += "<EventTriggerNotification><id>LightAudioAlarm</id><notificationMethod>LightAudioAlarm</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	if($("#"+szParent).find("#inRecord").prop("checked"))				//触发录像
	{
		szXml += "<EventTriggerNotification><id>record-1</id><notificationMethod>record</notificationMethod><videoInputID>1</videoInputID><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	
	for(var i = 1;i <= m_iAlarmOutputTotalNum;i++)//触发报警输出
	{
		var szTriggerAlarmOut = "AlarmOutputCheckboxChanO-" + i;
		if($("#"+szParent).find("#"+szTriggerAlarmOut).prop("checked"))
		{
			if(i <= m_iAlarmOutputAnalogNum)
			{
				szXml += "<EventTriggerNotification><id>IO-"+i+"</id><notificationMethod>IO</notificationMethod><outputIOPortID>"+m_szAlarmOutInfo[i-1]+"</outputIOPortID><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
			}
			else
			{
				szXml += "<EventTriggerNotification><id>IO-"+m_szAlarmOutInfo[i-1].split('-')[1]+"</id><notificationMethod>IO</notificationMethod><outputIOPortID>"+m_szAlarmOutInfo[i-1]+"</outputIOPortID><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
			}
		}
	}
	szXml += "</EventTriggerNotificationList></EventTrigger>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = "";
	if(szType == "PIR")
	{
	   szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/PIR";
	}
	else if(szType == "callhelp")
	{
		 szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/callhelp";
	}
	else
	{
		szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/WLSensors/"+$("#seWLSID").val();
	}
	
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: xmlDoc,
		processData: false,
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("If-Modified-Since", "0");  
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr, textStatus) 
		{
			if(szType == "callhelp")
			{
				SaveState(xhr);
			}
		},
		success: function()
		{
			if(szType == "callhelp")
			{
				return;
			}
			setOtherAlarmInfo(szType);
		}
	});	
}