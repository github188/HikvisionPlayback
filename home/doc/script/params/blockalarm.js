var m_szBlockInfo = new Array();          //用户存储列表中的XML信息add20100110
var m_szBlockAlarmXmlStr = "";
for(var i = 0; i < 2; i++)
{
	m_szBlockInfo[i] = '';
}
var m_szBlockAlarmLink = '';
/*************************************************
Function:		RecordKeepInitDay
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordKeepInitDay()
{
	m_szBlockAlarmLink = '';
	var szInfo = getNodeValue('laPlugin');
	if(!checkPlugin('1', szInfo, 1, 'tamperdetect'))
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
	
	GetBlockAlarmInfo();
}

/*************************************************
Function:		GetBlockAlarmInfo
Description:	获取遮挡报警信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetBlockAlarmInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TamperDetection/channels/" + m_iPicinform;
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
			m_szBlockAlarmXmlStr = xhr.responseText;
			GetBlockAlarmLink();
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
Function:		GetBlockAlarmLink
Description:	获取遮挡报警联动方式
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetBlockAlarmLink()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + "tamper-" + m_iPicinform;
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
		    m_szBlockAlarmLink = xhr.responseText;
		    GetBlockAlarmSchedule();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			m_szBlockAlarmLink = '';
		    GetBlockAlarmSchedule();
		}
	});
}
/*************************************************
Function:		GetBlockAlarmSchedule
Description:	获取遮挡报警布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetBlockAlarmSchedule()
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
		    GetBlockInfo();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		GetBlockInfo	
Description:	获取硬盘录像机的通道移动侦测参数信息
Input:			无
Output:			无	
Return:			以XML形式记录硬盘录像机通道移动侦测参数信息的一个字符串。
*************************************************/
function GetBlockInfo()               
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
		
	var xmlDoc = null;
	var xmlLinkDoc = null;
	var xmlScheduleDoc = null;
	if(m_szBlockAlarmXmlStr != "")
	{
		xmlDoc = parseXmlFromStr(m_szBlockAlarmXmlStr);
		
		var strTemp = m_szBlockAlarmXmlStr.split("</TamperDetectionChannel>");
		m_szBlockAlarmXmlStr = strTemp[0] + "<videoFormat>" +  m_iVideoOutNP + "</videoFormat></TamperDetectionChannel>";
			
		if("true" == $(xmlDoc).find('enabled').eq(0).text())
		{
			 $("#IsUseKeepout").prop("checked",true);
		}
		else
		{
			 $("#IsUseKeepout").prop("checked",false);
		}
		   
		//$("#BlockSensitive").val(1);	
		sliderImage1.wsetValue(1);
		sliderImage1.setTitle(getNodeValue('laSensitivity') + getNodeValue('BlockSensitiveOpt1'));
		MDRNumber = $(xmlDoc).find('TamperDetectionRegionList').eq(0).children('TamperDetectionRegion').length;
		if(MDRNumber > 0)
		{
			var BlockSensitive = $(xmlDoc).find('sensitivityLevel').eq(0).text();
			BlockSensitive = Number(BlockSensitive);
			if(BlockSensitive <= 30)
			{
				BlockSensitive = 1;
			}
			else if(BlockSensitive > 30 && BlockSensitive <= 60)
			{
				BlockSensitive = 2;
			}
			else if(BlockSensitive > 60)
			{
				BlockSensitive = 3;
			}
			sliderImage1.wsetValue(BlockSensitive);
		    sliderImage1.setTitle(getNodeValue('laSensitivity') + getNodeValue('BlockSensitiveOpt' + BlockSensitive));
		}
		m_szAreaXmlInfo = TransDevToOcxRegion(m_szBlockAlarmXmlStr, "tamperdetection");
		try
		{
		    HWP.SetRegionInfo(m_szAreaXmlInfo);//设置遮挡区域
		}
		catch(oError)
		{
		}
	}
	if(m_szBlockAlarmLink != '')
	{
	    xmlLinkDoc = parseXmlFromStr(m_szBlockAlarmLink);
		m_szBlockInfo[0] = "tamper-" + m_iPicinform;
	}
	
	if(xmlLinkDoc != null)
	{
		var iMethodNum = $(xmlLinkDoc).find("notificationMethod").length;
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
		CheackAlarmOutputAllSel();
	}
	else
	{
		m_szBlockInfo[0] = "tamper-" + m_iPicinform;
	}
	xmlDoc = parseXmlFromStr(m_szMoveDetectSchedule);
	for(i = 0; i < $(xmlDoc).find('EventSchedule').length; i++)
	{
		if($(xmlDoc).find('eventType').eq(i).text() == 'tamperdetection')
		{
			if($(xmlDoc).find('eventType').eq(i).next().eq(0).text() == m_iPicinform)
			{
				m_szBlockInfo[1] = $(xmlDoc).find('eventType').eq(i).prev().eq(0).text();
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
		m_szBlockInfo[1] = "Tamperdetection_video" + m_iPicinform;
	}
	
	g_transStack.push(InitDrawSchedule, true);
	//InitDrawSchedule();
	EnableBlockAlarm();
}
/*************************************************
Function:		SetBlockAlarmInfo
Description:	设置遮挡报警
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetBlockAlarmInfo()
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

	DeleteBlockRegion();
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
	SetBlockLink();
	SetBlockSchedule();
	
	if( $("#IsUseKeepout").prop("checked"))
	{
		var strIsUseKeepout = "true";
	}
	else
	{
		var strIsUseKeepout = "false";
	}
	var BlockSensitive = sliderImage1.getValue();//$("#BlockSensitive").val();
	BlockSensitive = Number(BlockSensitive);
	switch(BlockSensitive)
	{
		case 1:
			BlockSensitive = 30;
			break;
		case 2:
			BlockSensitive = 60;
			break;
		case 3:
			BlockSensitive = 90;
			break;				
	}
	var xmlDoc = TransOcxToDevRegion(m_szBlockAlarmXmlStr, m_szAreaXmlInfo, 'tamperdetection');
	for(var i = 0; i < $(xmlDoc).find('sensitivityLevel').length; i++)
	{
		$(xmlDoc).find('sensitivityLevel').eq(i).text(BlockSensitive);
		$(xmlDoc).find('enabled').eq(i+1).text(strIsUseKeepout);
	}
	$(xmlDoc).find('enabled').eq(0).text(strIsUseKeepout);
	if($(xmlDoc).find('videoFormat').length > 0)
	{
		$(xmlDoc).find("videoFormat").eq(0).remove();
	}
	 
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TamperDetection/channels/" + m_iPicinform;
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
Function:		DeleteBlockRegion
Description:	删除遮挡报警区域
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteBlockRegion()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/TamperDetection/channels/" + m_iPicinform +"/regions";
	
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
Function:		SetBlockSchedule
Description:	设置遮挡报警布防时间
Input:			无
Output:			无
return:			无				
*************************************************/
function SetBlockSchedule()
{
	var xmlDoc = CreateScheduleDoc("tamperdetection","","");
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules/" + m_szBlockInfo[1];
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
Function:		SetBlockLink
Description:	设置遮挡报警联动方式
Input:			无
Output:			无
return:			无				
*************************************************/
function SetBlockLink()
{
	var xmlDoc = CreateLinkDoc("tamperdetection");
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szBlockInfo[0];	
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
Function:		DeleteBlockAlarmLink
Description:	删除遮挡报警联动
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteBlockAlarmLink()
{  
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szBlockInfo[0];	
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
Function:		EnableBlockAlarm
Description:	启用遮挡报警
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableBlockAlarm()
{
	if($("#IsUseKeepout").prop("checked"))
	{
		$("#ScheduleEditBtn").prop("disabled",false);
		/*$(".videocontrols").prop("disabled",false);
		$("#tableEventLinkage").find(":checkbox").prop("disabled",false);*/
	}
	else
	{
		$("#ScheduleEditBtn").prop("disabled",true);
		/*$(".videocontrols").prop("disabled",true);
		$("#tableEventLinkage").find(":checkbox").prop("disabled",true);*/
	}
}
