var m_bEnableRecord = "false";                  //使能录像计划
var g_arrWeekDayRecordType = new Array();         //录像类型（7天 * 4个时间段 + 7个全天录像类型）
for(var i = 0; i < 28; i++)
{
	g_arrWeekDayRecordType[i] = "CMR";
}
var g_arrWeek = new Array();					//星期数组，用于保存时间段信息,一共7天，每天4个时间段
for (var i = 0;i < 7;i ++)
{
	g_arrWeek[i] = new Array();
	for(var j = 0;j < 4;j ++)
	{
		g_arrWeek[i][j] = new Array();
		g_arrWeek[i][j][0] = "00:00:00";
		g_arrWeek[i][j][1] = "00:00:00"; 
	}
}
var m_iCurWeekDay = 0;                           //当前选中的是星期几
var m_recordCanvas = null;
var m_bHolidayEnable = false;
var m_recordCanvasContext = null;
var m_showInputWindowTmp = 0;                    //上次输入框显示状态
/*************************************************
Function:		InitSchedule
Description:	绘制录像计划
Input:			none	
Output:			none
return:			none				
*************************************************/
function InitSchedule()
{
	setTimeout(function()
	{
		var gapRecordeTypePosition = 5; 
		var iIEVersion = parseInt($.browser.version, 10);
		if($.browser.msie && (iIEVersion == 6 || iIEVersion == 7 || iIEVersion == 8))
		{
			$("#recordplanCanvas").html('<canvas id="myCanvas" width="670" height="280"></canvas>');
			G_vmlCanvasManager.init($("#recordplanCanvas")[0]);
		}
		m_recordCanvasContext = document.getElementById("myCanvas").getContext('2d');
		
		var context = m_recordCanvasContext;
		
		context.clearRect(0, 0, 670, 280);
		
		var weekcn=new Array(getNodeValue('laMonday'),getNodeValue('laTuesday'),getNodeValue('laWednesday'),getNodeValue('laThursday'),getNodeValue('laFriday'),getNodeValue('laSaturday'),getNodeValue('laSunday'));
		var hour=new Array("0","2","4","6","8","10","12","14","16","18","20","22","24");
		var recordTypecn=new Array(getNodeValue('WholeDayRecordTypeOpt1'),getNodeValue('aMoveDetection'),getNodeValue('WholeDayRecordTypeOpt3'),getNodeValue('WholeDayRecordTypeOpt4'),getNodeValue('WholeDayRecordTypeOpt5'), getNodeValue('Other'));
		
		context.fillStyle = "#ffffff";
		context.fillRect(0,0,515,280);
		
		context.fillStyle = "#ffffff";
		context.fillRect(60,45,432,210);
		
		for(var i = 0; i < 7; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				if(g_arrWeek[i][j][1] != "00:00:00")
				{	
					var timeDrawFirst = parseInt(g_arrWeek[i][j][0].split(":")[1],10) + parseInt(g_arrWeek[i][j][0].split(":")[0],10) * 60;
					var timeDrawSecond = parseInt(g_arrWeek[i][j][1].split(":")[1],10) + parseInt(g_arrWeek[i][j][1].split(":")[0],10) * 60;
					context.fillStyle = "#ffffff";
					context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
					if(g_arrWeekDayRecordType[i * 4 + j] == "CMR")
					{
						context.fillStyle = "#6577fd";
					}
					else if(g_arrWeekDayRecordType[i * 4 + j] == "MOTION")
					{
						context.fillStyle = "#74b557"; 
					}
					else if(g_arrWeekDayRecordType[i * 4 + j] == "ALARM")
					{
						context.fillStyle = "#b83f42"; 
					}
					else if(g_arrWeekDayRecordType[i * 4 + j] == "EDR")
					{
						context.fillStyle = "#e58805"; 
					}
					else if(g_arrWeekDayRecordType[i * 4 + j] == "ALARMANDMOTION")
					{
						context.fillStyle = "#b9e2fe";
					}
					else
					{
						context.fillStyle = "#aa6ffe";
					}
					context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
				}
			}	
		}
		for(i = 0; i < 6; i++)
		{
			if(0 == i)
			{
				context.fillStyle = "#6577fd";  
			}
			else if(1 == i)
			{
				context.fillStyle = "#74b557";  
			}
			else if(2 == i)
			{
				context.fillStyle = "#b83f42"; 
			}
			else if(3 == i)
			{
				context.fillStyle = "#e58805";  
			}
			else if(4 == i)
			{
				context.fillStyle = "#b9e2fe";  
			}
			else
			{
				context.fillStyle = "#aa6ffe";
			}
			context.fillRect(540,5+i*30,10,10);
			
			context.fillStyle = '#000000';
			context.font = '13px Verdana';
			
			context.fillText(recordTypecn[i],555,gapRecordeTypePosition+i*30 + 10); 
		}	
		context.lineWidth = 1;
		context.fillStyle = '#676767';
		context.moveTo(2,2);
		context.lineTo(515,2);
		context.stroke();
		context.lineTo(515,278);
		context.stroke();
		context.lineTo(2,278);
		context.stroke();	
		context.lineTo(2,2);
		context.stroke();
	
		context.fillStyle = '#a3a3a3';
	
		for(i = 0; i <= 7; i++)
		{
			context.lineWidth = 1;
			context.strokeStyle = 'rgb(150, 150, 150)';
			context.moveTo(60,i*30+45);
			context.lineTo(492,i*30+45);
			context.stroke(); 
			if(i != 7)
			{
				if(5 == i || 6 == i)
				{
				  context.fillStyle = 'red';	
				}
				else
				{
				  context.fillStyle = '#000000';
				}
				context.font = '13px Verdana';
				context.fillText(weekcn[i],10,i*30+60);	
			}    	
		} 
	
		for(i = 0; i <= 24; i++)
		{
			context.lineWidth = 1;
	  
			context.moveTo(60+i*18,41);
			context.lineTo(60+i*18,253);
			context.stroke();
			if(0 == i % 2) 
			{
				context.fillStyle = '#000';
				context.fillText(hour[i/2],55+i*18,30);   
			}
			if(i != 24)
			{
				for(j = 0; j<=25; j++)
				{
					context.fillStyle = 'gray';
					context.fillRect(69+18*i, 45+j*8, 1,5); 	
				}
			}
		}
	},10);
}

/*************************************************
Function:		GetRecordPlanInfo
Description:	获取录像计划信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetRecordPlanInfo()
{
	for(var i = 0; i < 7; i++)
	{
		for(var j = 0;j < 4;j ++)
		{
			g_arrWeek[i][j][0] = "00:00:00";
			g_arrWeek[i][j][1] = "00:00:00"; 
		}
	}
	for(var i = 0; i < 28; i++)
	{
		g_arrWeekDayRecordType[i] = "CMR";
	}
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/ContentMgmt/record/tracks";
	$.ajax({
		type: "GET",
		url: szURL,
		
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			m_szRecordXmlStr = xhr.responseText;
			
			var Track = null;
			for(var i = 0; i < $(xmlDoc).find('Track').length; i++)
			{
				if($(xmlDoc).find('Track').eq(i).find('id').eq(0).text() == '101')
				{
					Track = $(xmlDoc).find('Track').eq(i);
					break;
				}
			}
			if(Track != null)
			{
				m_bEnableRecord = Track.find('enableSchedule').eq(0).text();       //使能录像计划
				$("#RecordTime").val(Track.find('PostRecordTimeSeconds').eq(0).text());//延迟时间
				$("#PreRecordTime").val(Track.find('PreRecordTimeSeconds').eq(0).text());//预录时间
				$("#RedundancyRec").val(Track.find('RedundancyRecord').eq(0).text());//录像冗余
				$("#AudioRec").val(Track.find('SaveAudio').eq(0).text());//记录音频
				var strTemp = Track.find('Duration').eq(0).text().split('D')[0];																				
				strTemp = strTemp.substring(1,strTemp.length);			   
				$("#RecorderDuration").val(strTemp);//过期时间
				
				var iSectionIndex = 0;                                                                          //时间段数组下标
				for(var i = 0; i < Track.find('DayOfWeek').length; i++)
				{
					dayofWeek = Track.find('DayOfWeek').eq(i).text();
					dayofWeek = changeWeekDay(0,dayofWeek);
					for(var j = 0; j <4; j++)
					{
						if((g_arrWeek[dayofWeek][j][0] == '00:00:00' && g_arrWeek[dayofWeek][j][1] == '00:00:00') || (g_arrWeek[dayofWeek][j][0] != '00:00:00' && g_arrWeek[dayofWeek][j][1] == '00:00:00'))
						{
							g_arrWeek[dayofWeek][j][(i%2)] = Track.find('TimeOfDay').eq(i).text();
							if(i%2 == 0)
							{
								g_arrWeekDayRecordType[dayofWeek*4 + j] = Track.find('ActionRecordingMode').eq(i/2).text();
							}
							break;
						}
					}
				} 
			}
			
			if(m_bEnableRecord == "true")      //启用录像计划
			{
				$("#EnableRecordPlan").prop("checked", true); 
			}
			else
			{
				$("#EnableRecordPlan").prop("checked", false);
			}
			EnableRecording();
			g_transStack.push(InitSchedule, true);
		}
	});
}
/*************************************************
Function:		SetRecordPlanInfo
Description:	设置录像计划信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetRecordPlanInfo()
{
	if($("#EnableRecordPlan").prop("checked"))
    {
	   m_bEnableRecord = "true"; 
    }
    else
    {
	    m_bEnableRecord = "false";
    }
    var xmlDoc = parseXmlFromStr(m_szRecordXmlStr);
	$(xmlDoc).find('enableSchedule').eq(0).text(m_bEnableRecord); //使能录像计划
	$(xmlDoc).find('Duration').eq(0).text('P'+ $("#RecorderDuration").val() + 'DT0H');
	CustomExtensionList = $(xmlDoc).find('CustomExtensionList').eq(0);
	CustomExtensionList.find('PostRecordTimeSeconds').eq(0).text($("#RecordTime").val()); 				
	CustomExtensionList.find('PreRecordTimeSeconds').eq(0).text($("#PreRecordTime").val()); 				
	CustomExtensionList.find('SaveAudio').eq(0).text($("#AudioRec").val());
	CustomExtensionList.find('RedundancyRecord').eq(0).text($("#RedundancyRec").val());
	
	var oTrack = $(xmlDoc).find('Track').eq(0);
	if(oTrack.find('TrackSchedule').length > 0)
	{
		 oTrack.find('TrackSchedule').eq(0).remove();
	}
	var szXml = "<TrackSchedule><ScheduleBlock><ScheduleBlockGUID>{00000000-0000-0000-0000-000000000000}</ScheduleBlockGUID><ScheduleBlockType>www.hikvision.com/racm/schedule/ver10</ScheduleBlockType>";
   
	var iScheduleNum = 1;
	for (var m=0; m<7; m++)
	{		
		for (j=0; j<4; j++)
		{
			/*if(g_arrWeek[m][j][0] != '00:00:00' || g_arrWeek[m][j][1] != '00:00:00')*/
			{
				szXml += "<ScheduleAction>";
				szXml += "<id>"+(iScheduleNum++)+"</id><ScheduleActionStartTime><DayOfWeek>"+changeWeekDay(1,m)+"</DayOfWeek><TimeOfDay>"+g_arrWeek[m][j][0]+"</TimeOfDay></ScheduleActionStartTime>";
				szXml += "<ScheduleActionEndTime><DayOfWeek>"+changeWeekDay(1,m)+"</DayOfWeek><TimeOfDay>"+g_arrWeek[m][j][1]+"</TimeOfDay></ScheduleActionEndTime>";
				szXml += "<ScheduleDSTEnable>false</ScheduleDSTEnable><Description>nothing</Description>";
				szXml += "<Actions><Record>true</Record><ActionRecordingMode>"+g_arrWeekDayRecordType[(m*4+j)]+"</ActionRecordingMode></Actions>";
				szXml += "</ScheduleAction>";
			}
		}
	}
	szXml += "</ScheduleBlock></TrackSchedule>";
	$(parseXmlFromStr(szXml)).children().clone().insertBefore(oTrack.find('CustomExtensionList').eq(0));
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/ContentMgmt/record/tracks";
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
Function:		EnableRecording
Description:	使能录像计划复选框
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableRecording()
{
	if($("#EnableRecordPlan").prop("checked"))
	{
		$("#recordScheduleEditBtn").prop("disabled",false);
	}
	else
	{
		$("#recordScheduleEditBtn").prop("disabled",true);	
	}
}
/*************************************************
Function:		SelectWeekDayTable
Description:	选择左侧星期几表格
Input:			iSet:选中星期号			
Output:			无
return:			无				
*************************************************/
function SelectWeekDayTable(iSet)
{ 
   if(m_iCurWeekDay != iSet)
   {
		if(!SaveWeekDaySection(m_iCurWeekDay))        //保存切换星期前的那个星期几的录像时间段
	    {
		    return;
	    }
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 0;
		document.getElementById("alldaylist").checked = false;
		SelectAllplandayList();
		document.getElementById("ChannelplandayList" + m_iDay).checked = false;
		
		m_iCurWeekDay = iSet;
		m_iDay = m_iCurWeekDay;
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 1;		
		document.getElementById("ChannelplandayList" + m_iDay).checked = true;		
	
		CheckWholeOrSection(m_iCurWeekDay);
	    EnableWholeDayRecord();	 
   }
}
/*************************************************
Function:		EnableWholeDayRecord
Description:	选中全天录像（或分段录像）单选框
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableWholeDayRecord()
{
	if($("#WholeDayRecord").prop("checked"))  //选中全天录像
	{
		$("#WholeDayRecordType").prop("disabled",false);
		$("#WholeDayRecordType").val(g_arrWeekDayRecordType[m_iCurWeekDay * 4]);
		
		document.getElementById("StartTime1H").innerHTML = "00"; 
		document.getElementById("StartTime1M").innerHTML = "00";
		document.getElementById("StopTime1H").innerHTML = "24";
		document.getElementById("StopTime1M").innerHTML = "00";
		for(var j = 2; j <= m_iTimePart; j++)
		{
			document.getElementById("StartTime" + j + "H").innerHTML = "00"; 
			document.getElementById("StartTime" + j + "M").innerHTML = "00";
			document.getElementById("StopTime" + j + "H").innerHTML = "00";
			document.getElementById("StopTime" + j + "M").innerHTML = "00";
		}
		
		for(var i = 1; i <= m_iTimePart; i++)
		{
			$("#StartTime" + i + 'H').prop("disabled",true);   
			$("#StartTime" + i + 'M').prop("disabled",true);
			$("#StopTime" + i + 'H').prop("disabled",true);
			$("#StopTime" + i + 'M').prop("disabled",true);
			$("#RecordType" + i).prop("disabled",true); 
		}
	}
	if($("#SectionRecord").prop("checked"))  //选中分段录像
	{
		$("#WholeDayRecordType").prop("disabled",true);
		for(var i = 1; i <= m_iTimePart; i++)
		{
			$("#StartTime" + i + 'H').prop("disabled",false);   
			$("#StartTime" + i + 'M').prop("disabled",false);
			$("#StopTime" + i + 'H').prop("disabled",false);
			$("#StopTime" + i + 'M').prop("disabled",false);
			$("#RecordType" + i).prop("disabled",false); 
		}
		for(var j = 1; j <= m_iTimePart; j++)
		{
			document.getElementById("StartTime" + j + "H").innerHTML = g_arrWeek[m_iCurWeekDay][j-1][0].split(":")[0]; 
			document.getElementById("StartTime" + j + "M").innerHTML = g_arrWeek[m_iCurWeekDay][j-1][0].split(":")[1];
			document.getElementById("StopTime" + j + "H").innerHTML = g_arrWeek[m_iCurWeekDay][j-1][1].split(":")[0];
			document.getElementById("StopTime" + j + "M").innerHTML = g_arrWeek[m_iCurWeekDay][j-1][1].split(":")[1];
			$("#RecordType" + j).val(g_arrWeekDayRecordType[m_iCurWeekDay*4 + j - 1]);
		}
	}
}
/*************************************************
Function:		CheckWholeOrSection
Description:	设置全天录像或分段录像
Input:			iWeekDay:星期几（从0开始，0:星期一）		
Output:			无
return:			无				
*************************************************/
function CheckWholeOrSection(iWeekDay)
{
	var iStartTimeH1 = g_arrWeek[iWeekDay][0][0].split(":")[0];     //访问对应星期的第一个时间段开始时间（时）
	var iStartTimeM1 = g_arrWeek[iWeekDay][0][0].split(":")[1];   //访问对应星期的第一个时间段开始时间（分）
	var iStopTimeH1 = g_arrWeek[iWeekDay][0][1].split(":")[0];    //访问对应星期的第一个时间段结束时间（时）
	var iStopTimeM1 = g_arrWeek[iWeekDay][0][1].split(":")[1];    //访问对应星期的第一个时间段结束时间（分）
	if((iStartTimeH1 == '00') && (iStartTimeM1 == '00') && (iStopTimeH1 == '24') && (iStopTimeM1 == '00'))           //全天录像
	{
		$("#WholeDayRecord").prop("checked", true);
	}
	else											        //分段录像
	{
		$("#SectionRecord").prop("checked", true);
	}	
}
/*************************************************
Function:		SaveWeekDaySection
Description:	保存星期几的录像计划
Input:			iWeekDay:星期几			
Output:			无
return:			true:成功;false:失败				
*************************************************/
function SaveWeekDaySection(iWeekDay)
{
	if(!CheckTimeSetValid())
	{
		return false;
	}	
	for(var i = 1; i <= m_iTimePart; i++)
	{
		if($("#WholeDayRecord").prop("checked"))    //全天录像
	    {
		    g_arrWeekDayRecordType[iWeekDay * 4] = $("#WholeDayRecordType").val();
	    }
		else
		{
		    g_arrWeekDayRecordType[iWeekDay * 4 + i - 1] = $("#RecordType" + i).val();
		}
		g_arrWeek[iWeekDay][i - 1][0] = document.getElementById("StartTime" + i + "H").innerHTML + ":" + document.getElementById("StartTime" + i + "M").innerHTML + ":00";
		g_arrWeek[iWeekDay][i - 1][1] = document.getElementById("StopTime" + i + "H").innerHTML + ":" + document.getElementById("StopTime" + i + "M").innerHTML + ":00";		
	}
	return true;
}
/*************************************************
Function:		CheckTimeSetValid
Description:	检查时间段设置是否合法
Input:			无			
Output:			无
return:			true:成功;false:失败				
*************************************************/
function CheckTimeSetValid()
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	var starttime = 0;
	var stoptime = 0;
	var EachStartTime = 0;
	var EachStopTime = 0;
	var szRetInfo = "";
	for(i = 1;i <= m_iTimePart; i++)
	{
		starttime = parseInt(document.getElementById("StartTime" + i + "H").innerHTML,10)*100 + parseInt(document.getElementById("StartTime" + i + "M").innerHTML,10);
		stoptime = parseInt(document.getElementById("StopTime" + i + "H").innerHTML,10)*100 + parseInt(document.getElementById("StopTime" + i + "M").innerHTML,10);
		if(starttime >= stoptime && starttime != 0)   //结束时间不能小于等于开始时间
		{
			szRetInfo = szAreaNameInfo + getNodeValue('laTimerange') + i + getNodeValue('jsTimeSegmentErrorSegTips');
			$("#SetResultTipsTwo").html(szRetInfo); 
			return false;
		}
		else if(stoptime > 2400)                      //结束时间不能大于24:00
		{
			szRetInfo = szAreaNameInfo + getNodeValue('laTimerange') + i + getNodeValue('EndTimeRangeTips');
			$("#SetResultTipsTwo").html(szRetInfo); 
			return false;
		}
		else
		{
			$("#SetResultTipsTwo").html(""); 
		}
	}
	
	//时间段不能重叠
	for(i = 1;i <= m_iTimePart;i++)
	{
		EachStartTime = parseInt(document.getElementById("StartTime" + i + "H").innerHTML,10)*100 + parseInt(document.getElementById("StartTime" + i + "M").innerHTML,10);
		EachStopTime = stoptime = parseInt(document.getElementById("StopTime" + i + "H").innerHTML,10)*100 + parseInt(document.getElementById("StopTime" + i + "M").innerHTML,10);
		for(j = 1;j <= m_iTimePart;j++)
		{
			if(i != j)
			{
				starttime = parseInt(document.getElementById("StartTime" + j + "H").innerHTML,10)*100 + parseInt(document.getElementById("StartTime" + j + "M").innerHTML,10);
				stoptime = parseInt(document.getElementById("StopTime" + j + "H").innerHTML,10)*100 + parseInt(document.getElementById("StopTime" + j + "M").innerHTML,10);
				
				if((EachStartTime < stoptime && EachStartTime >= starttime && starttime != '00') || (EachStopTime <= stoptime && EachStopTime > starttime && stoptime != '00'))
				{
					szRetInfo = szAreaNameInfo + getNodeValue('laTimerange')+ i + getNodeValue('WithTimeSegmentTips') + j + getNodeValue('OverlappedTips');
					$("#SetResultTipsTwo").html(szRetInfo); 
					return false;
				}	
			}
		}
	}
	return true;
}
/*************************************************
Function:		changeWeekDay
Description:	星期与数字转换
Input:			无	
Output:			无
return:			无			
*************************************************/
function changeWeekDay(iType, strInfo)
{
	var strReturn= '';
	if(iType == 0)
	{
		switch(strInfo)
	    {
		    case 'Monday':
				 strInfo = 0;
				 break;
		    case 'Tuesday':
				 strInfo = 1;
				 break;
		    case 'Wednesday':
				 strInfo = 2;
				 break;
		    case 'Thursday':
				 strInfo = 3;
				 break;
		    case 'Friday':
				 strInfo = 4;
				 break;
		    case 'Saturday':
				 strInfo = 5;
				 break;
		    case 'Sunday':
				 strInfo = 6;
				 break;
		    default:
				 break;
	    }
	}
	else if(iType == 1)
	{
		switch(strInfo)
	    {
		    case 0:
				 strInfo = 'Monday';
				 break;
		    case 1:
				 strInfo = 'Tuesday';
				 break;
		    case 2:
				 strInfo = 'Wednesday';
				 break;
		    case 3:
				 strInfo = 'Thursday';
				 break;
		    case 4:
				 strInfo = 'Friday';
				 break;
		    case 5:
				 strInfo = 'Saturday';
				 break;
		    case 6:
				 strInfo = 'Sunday';
				 break;
		    default:
				 break;
	    }
	}
	return strInfo;
}
/*************************************************
Function:		OKRecordplanDlg
Description:	确定录像计划时间编辑
Input:			无	
Output:			无
return:			无			
*************************************************/
function OKRecordplanDlg()
{
	if(CheckTimeSetValid())
	{
		SaveWeekDaySection(m_iCurWeekDay);
		InitSchedule();
	    $.modal.impl.close();
	}
}
/*************************************************
Function:		EditRecordSchedule
Description:	编辑录像计划时间
Input:			无	
Output:			无
return:			无			
*************************************************/
function EditRecordSchedule()
{
    var lxd = parent.translator.getLanguageXmlDoc(["Storage", "RecordPlan"]);  //窗口打开时需重新翻译一下语言
	parent.translator.appendLanguageXmlDoc(lxd, g_lxdParamConfig);
	parent.translator.translatePage(lxd, document);
	
    $("#scheduleplan").modal();
    m_iCurWeekDay = 0;
    CheckWholeOrSection(0);
    EnableWholeDayRecord();
    $("#ulSchedule").tabs("", {markCurrent: false});
}
/*************************************************
Function:		showtimeInputWindow
Description:	显示时间输入框
Input:			无	
Output:			无
return:			无			
*************************************************/
function showtimeInputWindow(i)
{
  if(!$("#WholeDayRecord").prop("checked"))
  {
	//位置
	if(i < 8)
	{
		document.getElementById('timeInputWindow').style.left = "165px";
		document.getElementById('timeInputWindow').style.top = (205 + i * 25) + "px";
	}
	else
	{
		document.getElementById('timeInputWindow').style.left = "364px";
		document.getElementById('timeInputWindow').style.top = (205 + (i - 8) * 25) + "px";			
	}
		
	//原来不显示，点击显示
    if(document.getElementById('timeInputWindow').style.display != "block")
	{	
		if(i < 8)
	    {
		    document.getElementById("InputTimeH").value = document.getElementById("StartTime" + (i+1) + "H").innerHTML;
		    document.getElementById("InputTimeM").value = document.getElementById("StartTime" + (i+1) + "M").innerHTML;		    
	    }
	    else
	    {
		    document.getElementById("InputTimeH").value = document.getElementById("StopTime" + (i-7) + "H").innerHTML;
		    document.getElementById("InputTimeM").value = document.getElementById("StopTime" + (i-7) + "M").innerHTML;	
	    }		
		document.getElementById('timeInputWindow').style.display = "block";
	}
	//原来显示
	else
	{
		var szTimeH = document.getElementById("InputTimeH").value;
		var szTimeM = document.getElementById("InputTimeM").value;
		if(szTimeH.length < 2)
		{
			szTimeH = '0' + szTimeH;
		}
		if(szTimeM.length < 2)
		{
		    szTimeM = '0' + szTimeM;	
		}
		if(i == m_showInputWindowTmp)//点击当前显示框
		{		    
		    if(i < 8)
	        {
		        document.getElementById("StartTime" + (i+1) + "H").innerHTML = szTimeH;
		        document.getElementById("StartTime" + (i+1) + "M").innerHTML = szTimeM;		    
	        }
	        else
	        {
		        document.getElementById("StopTime" + (i-7) + "H").innerHTML = szTimeH;
		        document.getElementById("StopTime" + (i-7) + "M").innerHTML = szTimeM;	
	        }				
			document.getElementById('timeInputWindow').style.display = "none";	
		}
		else//点击其他框
		{			
		    if(m_showInputWindowTmp < 8)//把框内的值赋给前一个点击的框
	        {
		        document.getElementById("StartTime" + (m_showInputWindowTmp+1) + "H").innerHTML = szTimeH;
		        document.getElementById("StartTime" + (m_showInputWindowTmp+1) + "M").innerHTML = szTimeM;
	        }
	        else
	        {
		        document.getElementById("StopTime" + (m_showInputWindowTmp-7) + "H").innerHTML = szTimeH;
		        document.getElementById("StopTime" + (m_showInputWindowTmp-7) + "M").innerHTML = szTimeM;		
	        }
			
			if(i < 8)
	        {
		        document.getElementById("InputTimeH").value = document.getElementById("StartTime" + (i+1) + "H").innerHTML;
		        document.getElementById("InputTimeM").value = document.getElementById("StartTime" + (i+1) + "M").innerHTML;		    
	        }
	        else
	        {
		        document.getElementById("InputTimeH").value = document.getElementById("StopTime" + (i-7) + "H").innerHTML;
		        document.getElementById("InputTimeM").value = document.getElementById("StopTime" + (i-7) + "M").innerHTML;	
	        }				
			document.getElementById('timeInputWindow').style.display = "block";
		}
	}
	m_showInputWindowTmp = i;
  }
}
/*************************************************
Function:		CopyToWeekDay
Description:	复制到其它星期
Input:			无			
Output:			无
return:			无				
*************************************************/
function CopyToWeekDay()
{
	if(!SaveWeekDaySection(m_iCurWeekDay))
	{
		return;
	}
	for(var i = 0; i < 7; i++)           //复制当天录像计划到其它星期
	{
		if($("#ChannelplandayList" + i).prop("checked"))
		{
			SaveWeekDaySection(i);
		}
	}
}
/*************************************************
Function:		initRecordPlan
Description:	录像计划页面初始化
Input:			无			
Output:			无
return:			无				
*************************************************/
function initRecordPlan()
{
	GetRecordPlanInfo();
	autoResizeIframe();
}