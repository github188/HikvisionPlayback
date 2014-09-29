var m_szAlarmInInfo = new Array();          //用户存储列表中的XML信息add20100110
for(var i = 0; i < 128; i++)
{
	m_szAlarmInInfo[i] = new Array();
	for(var j = 0; j < 4; j++)
	{
		m_szAlarmInInfo[i][j] = '0';
	}
}
var m_szAlarmInLink = "";
var m_szAlarmInSchedule = "";
/*************************************************
Function:		GetAlarmInNum
Description:	获取报警输入信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmInNum()
{ 
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/IO/inputs";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			m_szAnalogAlarmInfo = xhr.responseText;
			
			m_iAnalogAlarmInNum = $(xmlDoc).find('IOInputPort').length;
			$('#AlarmInNo').empty();
			for(var i = 0; i < m_iAnalogAlarmInNum; i++)
			{
				$("<option value='"+ i +"'>"+"A<-"+ (i+1) +"</option>").appendTo("#AlarmInNo");
				m_szAlarmInInfo[i][0] = $(xmlDoc).find('id').eq(i).text();
				
				var cbFun = function() { m_szAlarmInInfo[arguments.callee.i][1] = getNodeValue('LocalTips'); };
				cbFun.i = i;
				g_transStack.push(cbFun, true);
				//m_szAlarmInInfo[i][1] = szAddress;
				
				m_szAlarmInInfo[i][2] = $(xmlDoc).find('triggeringType').eq(i).text();
				m_szAlarmInInfo[i][3] = $(xmlDoc).find('IOInputPort').eq(i).find('name').eq(0).text();
			}
			if(m_iAnalogAlarmInNum != 0)
			{
				GetAlarmInLink();
			}
			else
			{
				m_iPicinform = 0;
				GetAlarmInInfo();
			}		
		}
	});
}
/*************************************************
Function:		GetAlarmInLink
Description:	获取报警输入联动信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmInLink()
{
	m_iPicinform = $('#AlarmInNo').val();
	$("#SelectAllBox").prop("checked", false);
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + 'IO-' + parseInt(parseInt(m_iPicinform) + 1);
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete:function(xhr, textStatus)
		{
			if(xhr.status == 200)
			{  
				m_szAlarmInLink = xhr.responseText;
			}   
			else
			{    
				m_szAlarmInLink = '';	
			}
			GetAlarmInSchedule();
		}
	});
}
/*************************************************
Function:		GetAlarmInSchedule
Description:	获取报警输入布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmInSchedule()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			m_szAlarmInSchedule = xhr.responseText;
			GetAlarmInInfo();
		}
	});
}
/*************************************************
Function:		GetAlarmInInfo
Description:	插入报警信息至页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmInInfo()
{
	GetAlarmOutNo();//获取报警输出数
	CreateAlarmOutputList(m_iAlarmOutputAnalogNum,m_iAlarmOutputTotalNum); //列出触发报警输出通道
	
	/*$("#InEmail").prop("checked",false);
	$("#InSoundAlarm").prop("checked",false);
	$("#InMonitorAlarm").prop("checked",false);
	$("#InUpload").prop("checked",false);
	$("#InFTP").prop("checked",false);*/
	$("#tableEventLinkage").find(":checkbox").prop("checked", false);
	
	if(m_iAnalogAlarmInNum != 0)
	{
	    m_iPicinform = $('#AlarmInNo').val();
	}
	$("#triggering").val(m_szAlarmInInfo[m_iPicinform][2]);
	g_transStack.push(function() { $("#IpAddress").val(m_szAlarmInInfo[m_iPicinform][1]); }, true);
	//$("#IpAddress").val(m_szAlarmInInfo[m_iPicinform][1]);
	$("#AlarmInName").val(m_szAlarmInInfo[m_iPicinform][3]);
	
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
	
    if(m_szAlarmInLink != '')
	{
		xmlLinkDoc = parseXmlFromStr(m_szAlarmInLink);
	}
	
	if(xmlLinkDoc != null)
	{
		var iMethodNum = xmlLinkDoc.getElementsByTagName("notificationMethod").length;
		for(i = 0;i < iMethodNum;i++)//报警输入联动信息
		{
			if("email" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#InEmail").prop("checked",true);
			}
			
			if("beep" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#InSoundAlarm").prop("checked",true);
			}
			if("center" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#InUpload").prop("checked",true);
			}
			if("FTP" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#InFTP").prop("checked",true);
			}			
			if("monitorAlarm" == $(xmlLinkDoc).find('notificationMethod').eq(i).text())
			{
				 $("#InMonitorAlarm").prop("checked",true);
			}		
		}
			   
		var iAnalogOutPut = $(xmlLinkDoc).find("outputIOPortID").length;   
		for(j = 0;j < iAnalogOutPut; j++)
		{
		    var iNo = $(xmlLinkDoc).find("outputIOPortID").eq(j).text();
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
		//触发录像通道
		var iAnalogRecord = $(xmlLinkDoc).find("videoInputID").length;
		for(j = 0; j < iAnalogRecord; j++)
		{
			var iNo = $(xmlLinkDoc).find("videoInputID").eq(j).text();
			if(iNo <= m_iAChannelNum)
			{
			    $("#TriggerRecordCheckboxChan"+iNo).prop("checked",true);
			}
		}
		CheackAlarmOutputAllSel();    //检查报警输出通道是否全选
		//PTZ联动
		if($(xmlLinkDoc).find("ptzAction").length > 0)
		{
			var ptzChannelID = $(xmlLinkDoc).find("ptzChannelID").eq(0).text();
			var actionNum = $(xmlLinkDoc).find("actionNum").eq(0).text();
			var actionName = $(xmlLinkDoc).find("actionName").eq(0).text();
			if(actionName == 'preset')
			{
				$("#IsUsePreset").prop('checked',true);
				$("#IsUseCurise").prop('checked',false);
				$("#IsUseTrack").prop('checked',false);
				$("#PresetNo").val(actionNum);
				UnUseOther("IsUsePreset");
			}
			else if(actionName == 'patrol')
			{
				$("#IsUsePreset").prop('checked',false);
				$("#IsUseCurise").prop('checked',true);
				$("#IsUseTrack").prop('checked',false);
				$("#CuriseNo").val(actionNum);
				UnUseOther("IsUseCurise");
			}
			else if(actionName == 'pattern')//轨迹
			{
				$("#IsUsePreset").prop('checked',false);
				$("#IsUseCurise").prop('checked',false);
				$("#IsUseTrack").prop('checked',true);
				$("#TrackNo").val(actionNum);
				UnUseOther("IsUseTrack");
			}
		}		
	}
	
	var xmlDoc = null;
	var xmlScheduleDoc = null;
	if(m_szAlarmInSchedule != '')
	{
		xmlDoc = parseXmlFromStr(m_szAlarmInSchedule);
		for(i = 0; i < $(xmlDoc).find('EventSchedule').length; i++)
		{
			if($(xmlDoc).find('eventType').eq(i).text() == 'IO' && $(xmlDoc).find('inputIOPortID').eq(i).text() == m_szAlarmInInfo[m_iPicinform][0])
			{
				xmlScheduleDoc = $(xmlDoc).find("EventSchedule").eq(i);
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
	
	ListCopyChannelAlarm(m_iAnalogAlarmInNum, m_iAnalogAlarmInNum);
	
	g_transStack.push(InitDrawSchedule, true);
	//InitDrawSchedule();
}
/*************************************************
Function:		RecordPTZInitDay
Description:	添加ptz模拟通道名称 、预置点序号、巡航序号、轨迹号
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordPTZInitDay()
{
	$("#PresetNo").empty();
	for(var i = 1; i < 9; i++)
	{
		$("<option value='"+ i +"'>"+ i +"</option>").appendTo("#PresetNo");
	}
	$("#CuriseNo").empty();
	for(var i = 1; i < 9; i++)
	{
		$("<option value='"+ i +"'>"+ i +"</option>").appendTo("#CuriseNo");
	}
	$("#TrackNo").empty();
	for(var i = 1; i < 5; i++)
	{
		$("<option value='"+ i +"'>"+ i +"</option>").appendTo("#TrackNo");
	}
}
/*************************************************
Function:		SaveAlarmInInfo	
Description:	设置硬盘录像机的报警输入参数信息
Input:			lAlarmInNum	对应报警输入通道
				lpAlarmInCfgXML 以XML形式记录硬盘录像机报警输入参数信息的一个字符串。
Output:			无	
Return:			-1 -- 失败，0 -- 成功， 1 -- 成功并需要重启设备。
*************************************************/
function SaveAlarmInInfo()
{
	//没有报警输入
	if(m_iAnalogAlarmInNum == 0)
	{
		szRetInfo = m_szErrorState + m_szError10;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}
	m_bAlarmRebootRequired = 0;
	m_iPicinform = $('#AlarmInNo').val();
	
	if(!CheckDeviceName($("#AlarmInName").val(),'AlarmInNametips',1))
	{
		return;
	}
	
	XmlScheduleDoc = CreateScheduleDoc("IO", "ALARMIN","");//修改创建布防时间xml方式
	XmlLinkDoc = CreateAlarmInLinkDoc();
	
	var iSetSuccess = 1;
	var iValues;
	var szErrorChan = "";
	
	var temp = document.getElementsByName("SingleCheckbox"); 
	for(var i = 0; i < temp.length; i++) 
	{ 
	   	if(temp[i].checked == true)
	   	{
			var xmlAlarmInDoc = null;
			xmlAlarmInDoc = parseXmlFromStr(m_szAnalogAlarmInfo);
			
			var xmlAlarmInOneDoc = new createxmlDoc();
			var Instruction = xmlAlarmInOneDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
			xmlAlarmInOneDoc.appendChild(Instruction);
			
			IOInputPort = xmlAlarmInOneDoc.createElement('IOInputPort');
			
			id = xmlAlarmInOneDoc.createElement("id");
			text = xmlAlarmInOneDoc.createTextNode($(xmlAlarmInDoc).find('IOInputPort').eq(i).find('id').eq(0).text());
			id.appendChild(text);
			IOInputPort.appendChild(id);

			triggeringType = xmlAlarmInOneDoc.createElement("triggeringType");
			text = xmlAlarmInOneDoc.createTextNode($("#triggering").val());
			triggeringType.appendChild(text);
			IOInputPort.appendChild(triggeringType);
			
			Element = xmlAlarmInOneDoc.createElement("name");
			text = xmlAlarmInOneDoc.createTextNode('');
			Element.appendChild(text);
			IOInputPort.appendChild(Element);
			
			xmlAlarmInOneDoc.appendChild(IOInputPort);
			
			if(i == m_iPicinform)
			{
				$(xmlAlarmInOneDoc).find('name').eq(0).text($("#AlarmInName").val());
			}
			else
			{
				$(xmlAlarmInOneDoc).find('name').eq(0).text(m_szAlarmInInfo[i][3]);
			}
			
			$(XmlLinkDoc).find('id').eq(0).text('IO-' + parseInt(i + 1));
			$(XmlLinkDoc).find('inputIOPortID').eq(0).text(m_szAlarmInInfo[i][0]);
			$(XmlScheduleDoc).find('inputIOPortID').eq(0).text(m_szAlarmInInfo[i][0]);
			
		   	SetAlarmInPara(i,xmlAlarmInOneDoc,XmlLinkDoc,XmlScheduleDoc);
			
			if(m_b403Error)
			{
				szRetInfo = m_szErrorState + m_szError8;
				$("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				return;
			}			
			if(m_bNetAbnormal)
			{
				szRetInfo = m_szErrorState + m_szError9;
				$("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
				return;
			}
			if(m_bSetAlarmInfo == false)
			{
				var j = i + 1;
				if(szErrorChan == "")
				{
					szErrorChan = j;	
				}
				else
				{
					szErrorChan = szErrorChan + "," + j;	
				}	
				iSetSuccess = 0;
			}
	   	} 
	} 
	if(iSetSuccess == 1)
	{
		var szRetInfo = m_szSuccessState + m_szSuccess1;
		for(var i = 0; i < temp.length; i ++) 
		{ 
			if (temp[i].checked == true)
			{
				m_szAlarmInInfo[i][2] = $("#triggering").val();//修改报警类型
			}
		}
		m_szAlarmInInfo[m_iPicinform][3] = $("#AlarmInName").val();
	}
	else
	{
		var szRetInfo = m_szErrorState + m_szError66  + szErrorChan + m_szError44;
	}
	$("#SetResultTips").html(szRetInfo);
	setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
	if(m_bAlarmRebootRequired > 0)
	{
		pr(Maintain).confirmAndRestart();
	}
}
/*************************************************
Function:		SetAlarmInPara
Description:	设置报警输入信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetAlarmInPara(iNo,xmlAlarmInDoc,xmlLinkDoc,xmlScheduleDoc)
{
	m_bSetAlarmInfo = false;
	m_bDelete = false;
	m_bSetLink = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	m_bSetSchedule = false;
	
	DeleteAlarmInLink(iNo);
	
	if(m_b403Error || m_bNetAbnormal)
	{
		return;
	}
	SetAlarmInLink(iNo, xmlLinkDoc); //设置报警联动
	
	SetAlarmInSchedule(iNo, xmlScheduleDoc);//设置报警输入布防时间
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/IO/inputs/" + m_szAlarmInInfo[iNo][0];
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: xmlAlarmInDoc,
		async: false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr,textStatus) {
			if(xhr.status == 200)
			{
				if((m_bDelete == false) || (m_bSetLink == false) || (m_bSetSchedule == false))
				{
					m_bSetAlarmInfo = false;
					return;
				}
				else
				{
					m_bSetAlarmInfo = true;
					var xmlDoc = xhr.responseXML;	   
					var state = $(xmlDoc).find('statusCode').eq(0).text();
					if("7" == state)
					{
						m_bAlarmRebootRequired++;
					}
				}
			}
		}
	});
}
/*************************************************
Function:		SetAlarmInSchedule
Description:	设置报警输入布防时间
Input:			iNo:报警输入号
				xmlDoc:布防时间信息
Output:			无
return:			无				
*************************************************/
function SetAlarmInSchedule(iNo,xmlDoc)
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules/" + "IO_IN_" + parseInt(iNo + 1);
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
Function:		SetAlarmInLink
Description:	设置报警输入联动方式
Input:			iNo:报警输入号
				xmlDoc:联动信息
Output:			无
return:			无				
*************************************************/
function SetAlarmInLink(iNo,xmlDoc)
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + 'IO-' + parseInt(iNo + 1);
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
Function:		DeleteAlarmInLink
Description:	删除报警输入联动
Input:			iNo:报警输入号			
Output:			无
return:			无				
*************************************************/
function DeleteAlarmInLink(iNo)
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + 'IO-' + parseInt(iNo + 1);
	
	$.ajax(
	{
		type: "DELETE",
		url: szURL,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("OK" == $(xmlDoc).find('statusString').eq(0).text())
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
Function:		CreateAlarmInLinkDoc
Description:	创建报警输入联动信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function CreateAlarmInLinkDoc()
{
	var szXml = "<?xml version='1.0' encoding='utf-8'?><EventTrigger>";
	if(m_iPicinform < m_iAnalogAlarmInNum)
	{
	    szXml += "<id>IO-"+parseInt(parseInt(m_iPicinform) + 1)+"</id>";
	}
	else
	{
		szXml += "<id>IO-"+m_szAlarmInInfo[m_iPicinform][0].split("-")[1]+"</id>";
	}
	szXml += "<eventType>IO</eventType><eventDescription>IO Event is detected.</eventDescription>";
	szXml += "<inputIOPortID>"+m_szAlarmInInfo[m_iPicinform][0]+"</inputIOPortID>";
	szXml += "<EventTriggerNotificationList>";
				
	if($("#InEmail").prop("checked"))				//邮件联动
	{
		szXml += "<EventTriggerNotification><id>email</id><notificationMethod>email</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	
	if($("#InSoundAlarm").prop("checked"))			//声音报警
	{
		szXml += "<EventTriggerNotification><id>beep</id><notificationMethod>beep</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}

	if($("#InUpload").prop("checked"))				//上传中心
	{
		szXml += "<EventTriggerNotification><id>center</id><notificationMethod>center</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}
	if($("#InFTP").prop("checked"))				//上传FTP
	{
		szXml += "<EventTriggerNotification><id>FTP</id><notificationMethod>FTP</notificationMethod><notificationRecurrence>beginning</notificationRecurrence></EventTriggerNotification>";
	}	
	for(var i = 1;i <= m_iAlarmOutputTotalNum;i++)//触发报警输出
	{
		var szTriggerAlarmOut = "AlarmOutputCheckboxChanO-" + i;
		if($("#"+szTriggerAlarmOut).prop("checked"))
		{
			szXml += "<EventTriggerNotification>";
			if(i <= m_iAlarmOutputAnalogNum)
			{
				szXml += "<id>IO-"+i+"</id>";
			}
			else
			{
				szXml += "<id>IO-"+m_szAlarmOutInfo[i-1].split('-')[1]+"</id>";
			}
			
			szXml += "<notificationMethod>IO</notificationMethod><notificationRecurrence>beginning</notificationRecurrence><outputIOPortID>"+m_szAlarmOutInfo[i-1]+"</outputIOPortID></EventTriggerNotification>";
		}
	}
	//PTZ联动
	if($("#IsUsePreset").prop("checked") || $("#IsUseCurise").prop("checked") || $("#IsUseTrack").prop("checked"))
	{
		szXml += "<EventTriggerNotification>";
	
		var szPTZAction = "<ptzAction><ptzChannelID>1</ptzChannelID>";
		if($("#IsUsePreset").prop("checked"))
		{
			szPTZAction += "<actionName>preset</actionName><actionNum>"+$("#PresetNo").val()+"</actionNum>";
			ptzId = "ptz1-preset"+$("#PresetNo").val();
		}
		else if($("#IsUseCurise").prop("checked"))
		{
			szPTZAction += "<actionName>patrol</actionName><actionNum>"+$("#CuriseNo").val()+"</actionNum>";
			ptzId = "ptz1-patrol"+$("#CuriseNo").val();
		}
		else if($("#IsUseTrack").prop("checked"))
		{
			szPTZAction += "<actionName>pattern</actionName><actionNum>"+$("#TrackNo").val()+"</actionNum>";
			ptzId = "ptz1-pattern"+$("#TrackNo").val();
		}
		szPTZAction += "</ptzAction>";
		
		szXml += "<id>"+ptzId+"</id>";
		szXml += "<notificationMethod>ptz</notificationMethod><notificationRecurrence>beginning</notificationRecurrence>";
		szXml += szPTZAction + "</EventTriggerNotification>";
	}
	//录像联动
	if($("#TriggerRecordCheckboxChan1").prop("checked"))
	{
		szXml += "<EventTriggerNotification><id>record-1</id><notificationMethod>record</notificationMethod><notificationRecurrence>beginning</notificationRecurrence><videoInputID>1</videoInputID></EventTriggerNotification>";
	}
	szXml += "</EventTriggerNotificationList></EventTrigger>";
	
	return parseXmlFromStr(szXml);
}
/*************************************************
Function:		UnUseOther	
Description:	ptz联动只选择其中一个
Input:			id：表单id
Output:			无	
Return:			无
*************************************************/
function UnUseOther(id)
{
	var szId1 = "IsUsePreset";   
	var szId2 = "IsUseCurise";
	var szId3 = "IsUseTrack";
	if(id == szId1)
	{
		if($("#"+id).prop("checked"))
		{
			$("#PresetNo").prop("disabled", false);
			$("#CuriseNo").prop("disabled", true);
			$("#TrackNo").prop("disabled", true);
			
			$("#"+szId2).prop("checked", false);
			$("#"+szId3).prop("checked", false);
		}
		else
		{
			$("#PresetNo").prop("disabled", true);
			$("#CuriseNo").prop("disabled", true);
			$("#TrackNo").prop("disabled", true);
		}
	}
	else if(id == szId2)
	{
		if($("#"+id).prop("checked"))
		{
			$("#PresetNo").prop("disabled", true);
			$("#CuriseNo").prop("disabled", false);
			$("#TrackNo").prop("disabled", true);
			
			$("#"+szId1).prop("checked", false);
			$("#"+szId3).prop("checked", false);
		}
		else
		{
			$("#PresetNo").prop("disabled", true);
			$("#CuriseNo").prop("disabled", true);
			$("#TrackNo").prop("disabled", true);
		}
	}
	else
	{
		if($("#"+id).prop("checked"))
		{
			$("#PresetNo").prop("disabled", true);
			$("#CuriseNo").prop("disabled", true);
			$("#TrackNo").prop("disabled", false);
			
			$("#"+szId2).prop("checked", false);
			$("#"+szId1).prop("checked", false);
		}
		else
		{
			$("#PresetNo").prop("disabled", true);
			$("#CuriseNo").prop("disabled", true);
			$("#TrackNo").prop("disabled", true);
		}
	}
}