var m_szVideoLostInfo = new Array();          //用户存储列表中的XML信息add20100110
for(var i = 0; i < 2; i++)
{
	m_szVideoLostInfo[i] = '';
}
var m_szVideoLostLink = "";
/*************************************************
Function:		VideoLostInitDay
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function VideoLostInitDay()
{
	m_iPicinform = 1;
	GetVideoLostLink();
}
/*************************************************
Function:		GetVideoLostLink
Description:	获取视频遮挡联动方式
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVideoLostLink()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + "videoloss-" + m_iPicinform;
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
		    m_szVideoLostLink = xhr.responseText;
		    GetVideoLostSchedule();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			m_szVideoLostLink = '';
		    GetVideoLostSchedule();
		}
	});
}
/*************************************************
Function:		GetVideoLostSchedule
Description:	获取视频丢失布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetVideoLostSchedule()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules";
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
		    m_szVideoLostSchedule = xhr.responseText;
		    GetVideoLostInfo();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		GetVideoLostInfo	
Description:	获取硬盘录像机的通道视频丢失参数信息
Input:			无
Output:			无	
Return:			无
*************************************************/
function GetVideoLostInfo()               
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
	   if(m_szVideoLostLink != '')
	   {
			xmlLinkDoc = parseXmlFromStr(m_szVideoLostLink);
			m_szVideoLostInfo[0] = "videoloss-" + m_iPicinform;
		}
		if(xmlLinkDoc != null)
		{
			$("#IsUseVideoLost").prop("checked",true);
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
			CheackAlarmOutputAllSel();
		}
		else
		{
			m_szVideoLostInfo[0] = "videoloss-" + m_iPicinform;
			$("#IsUseVideoLost").prop("checked",false);
		}
		
		var xmlDoc = parseXmlFromStr(m_szVideoLostSchedule);
		for(i = 0; i < $(xmlDoc).find('EventSchedule').length; i++)
		{
			if($(xmlDoc).find('eventType').eq(i).text() == 'videoloss')
			{
				if($(xmlDoc).find('eventType').eq(i).next().eq(0).text() == m_iPicinform)
				{
				    m_szVideoLostInfo[1] = $(xmlDoc).find('eventType').eq(i).prev().eq(0).text();
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
							m_szWeek[7][j][1] = $(xmlScheduleDoc).find('HolidayBlockList').eq(0).find('beginTime').eq(i).text();
							break;
						}
					}
				}
			}
		}
		else
		{
			m_szVideoLostInfo[1] = "Videoloss_video" + m_iPicinform;
		}
		
		g_transStack.push(InitDrawSchedule, true);
		//InitDrawSchedule();
		EnableVideoLost();
}
/*************************************************
Function:		SetVideoLostInfo
Description:	设置视频丢失
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetVideoLostInfo()
{
	m_bLinkDelete = false;
	m_bSetLink = false;
	m_bSetSchedule = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	
	DeleteVideoLostLink();//是否需要删除联动
	
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
	
	if($("#IsUseVideoLost").prop("checked"))
	{
		SetLostSchedule();
		SetLostLink();	
	}
	else
	{
		m_bSetSchedule = true;
		m_bSetLink = true;
	}
	if(m_bSetSchedule == true && m_bSetLink == true && m_bLinkDelete == true)
	{
		var szRetInfo = m_szSuccessState + m_szSuccess1;
	}
	else
	{
		var szRetInfo = m_szErrorState + m_szError55 + m_szError44;
	}
	$("#SetResultTips").html(szRetInfo);
	setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
}
/*************************************************
Function:		SetLostSchedule
Description:	设置视频丢失布防时间
Input:			无
Output:			无
return:			无				
*************************************************/
function SetLostSchedule()
{
	var xmlDoc = CreateScheduleDoc("videoloss","","");
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules/" + m_szVideoLostInfo[1];
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
Function:		SetLostLink
Description:	设置视频丢失联动方式
Input:			无
Output:			无
return:			无				
*************************************************/
function SetLostLink()
{
	var xmlDoc = CreateLinkDoc("videoloss");
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szVideoLostInfo[0];
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
			m_bSetLink = false;
		}
	});
}
/*************************************************
Function:		DeleteVideoLostLink
Description:	删除移动侦测联动
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteVideoLostLink()
{  
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_szVideoLostInfo[0];
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
			if("1" == $(xmlDoc).find('statusCode').eq(0).text())
		    {
			    m_bLinkDelete = true;
		    }
		    else
		    {
			    m_bLinkDelete = false;
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