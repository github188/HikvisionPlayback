document.charset = "utf-8";
var m_szCurrentTab = '';
var m_TheCanvas = null;
var m_lastWindowTmp = 0;

/*************************************************
  Function:    	JugeSystemDate
  Description:	判断客户端系统日期
  Input:        无
  Output:      	无
  Return:		无
*************************************************/
function JugeSystemDate()
{	
	var myDate = new Date();
	var iYear = myDate.getFullYear();        
	if(iYear < 1971 || iYear > 2037)
	{
		//alert(jsTimeSegmentErrorTips);
		if(m_bErrorDate == 1)
		{
			parent.location.href = "index.asp";
		}
		else
		{
			m_bErrorDate = 1;
		}
	}		
}
/*************************************************
Function:		CheckKeyDown
Description:	输入时按下空格时，不允许输入
Input:			iSetId: 需要验证表单Id	
				iSetValue: 需要验证的值	
Output:			无
return:			无				
*************************************************/
function CheckKeyDown(event)
{
	event = event?event:(window.event?window.event:null);
	if(event.keyCode == 32)   
    {
    	if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			event.preventDefault();
		}
		else
		{
		    event.returnValue = false;    //非ie浏览器event无returnValue属性
		}      
		return;
     }
}
/*************************************************
Function:		CheckInput
Description:	不允许中文
Input:			事件
Output:			无
return:			无				
*************************************************/
function CheckInput(event)
{
	event = event?event:(window.event?window.event:null);
	var obj = event.srcElement || event.target;
	if(!obj)
	{
		return;
	}
	if(event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
	{
		var reg = /[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/i;
		if($.isChinese($(obj).val())) 
		{ 
			$(obj).val($(obj).val().replace(/[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/g, ""));
		}
	}
}
/*************************************************
Function:		SaveState
Description:	保存后返回的状态
Input:			xhr  XMLHttpRequest 对象		
Output:			无
return:			无				
*************************************************/
function SaveState(xhr)
{
	if(arguments.length > 0)
	{
		szXmlhttp = xhr;
	}
	if(szXmlhttp.readyState == 4)
	{
		if(szXmlhttp.status == 200 || szXmlhttp.status == 403 || szXmlhttp.status == 400 || szXmlhttp.status == 503 || szXmlhttp.status == 500)
		{
		    var xmlDoc =szXmlhttp.responseXML;
		   
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			
			if("1" == state)	//OK
			{
				szRetInfo = m_szSuccessState + m_szSuccess1;
			}
			else if("3" == state)	//Device Error
			{
				szRetInfo = m_szErrorState + m_szError6;
			}
			else if("4" == state || "2" == state)	//Invalid Operation
			{
				var statusString = $(xmlDoc).find('statusString').eq(0).text();
				statusCode = statusString.split(":")[0];
				if(isNaN(statusCode))
				{
					if("4" == state)
					{
						szRetInfo = m_szErrorState + m_szError5;
					}
					else
					{
						szRetInfo = m_szErrorState + m_szError7;
					}
				}
				else if("20" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError11;
				}
				else if("21" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError12;
				}
				else if("22" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError13;
				}
				else if("23" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError8;
				}
				else if("24" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError5;
				}
				else if("27" == statusCode)
				{
					szRetInfo = m_szErrorState + m_szError4;
				}
			}
			else if("5" == state)	//Invalid XML Format
			{
				szRetInfo = m_szErrorState + m_szError4;
			}
			else if("6" == state)	//Invalid XML Content
			{
				szRetInfo = m_szErrorState + m_szError13;
			}
			else if("7" == state)	//Reboot Required
			{
				szRetInfo = m_szSuccessState + m_szSuccess5;
				pr(Maintain).confirmAndRestart();
			}
			else if("9" == state)	//Device does not support the function
			{
				szRetInfo = m_szErrorState + m_szError77;
			}
		}
		else
		{
			szRetInfo = m_szErrorState + m_szError14;
		}
		$("#SetResultTips").html(szRetInfo);
		setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
	}
}
/**********************************
Function:		getObject
Description:	获取页面对象
Input:			无
Output:			无
return:			无		
***********************************/
function getObject(objectId,top) 
{ 
	doc = top?window.top.document:document; 
	if(typeof(objectId)!="object" && typeof(objectId)!="function") 
	{ 
	if(doc.getElementById && doc.getElementById(objectId)) 
	{ 
		// W3C DOM 
		return doc.getElementById(objectId); 
	} 
	else if(doc.getElementsByName(objectId)) 
	{ 
		return doc.getElementsByName(objectId)[0]; 
	} 
	else if (doc.all && doc.all(objectId)) 
	{ 
		// MSIE 4 DOM 
		return doc.all(objectId); 
	} 
	else if (doc.layers && doc.layers[objectId]) 
	{ 
		// NN 4 DOM.. note: this won't find nested layers 
		return doc.layers[objectId]; 
	} 
	else 
	{ 
		return false; 
	} 
	}else 
	return objectId; 
}
/*************************************************
Function:		SelectAllChanToCopy
Description:	全选/全不选复制通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllChanToCopy(iType)
{
	try
	{
		var bCheck = true;
		if($("#SelectAllBox").prop("checked") == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("SingleCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck;
		} 
		SelectCurrentChanDis(iType);
	}
	catch(err)
	{
		//alert(err.description);
	}
}
/*************************************************
Function:		SelectCurrentChanDis
Description:	当前通道始终是选中并disabled
Input:			iType: 0 通道 1 报警量		
Output:			无
return:			无				
*************************************************/
function SelectCurrentChanDis(iType)
{
	if(iType == 0)
	{
		try
		{	
			if(m_iPicinform <= m_iAChannelNum)
			{
				document.getElementById("SingleCheckboxChan" + m_iPicinform).checked = true;
				document.getElementById("SingleCheckboxChan" + m_iPicinform).disabled = 1;
			}
		}
		catch(err)
		{
			
		}
	}
	else
	{
		try
		{	
			document.getElementById("SingleCheckboxChan" + m_iPicinform).checked = true;
			document.getElementById("SingleCheckboxChan" + m_iPicinform).disabled = 1;
		}
		catch(err)
		{
		
		}
	}
}
/*************************************************
Function:		CheackListAllSel
Description:	判断是否全选复制通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackListAllSel(iType)
{
	var bCheck = true;
	var temp = document.getElementsByName("SingleCheckbox"); 
	for (var i =0; i<temp.length; i++) 
	{ 
	   if (temp[i].checked == false)
	   {
		   bCheck = false;
		   break;
	   } 
	} 
	$("#SelectAllBox").prop("checked", bCheck);
	SelectCurrentChanDis(iType);
}
/**********************************
Function:		CreateAlarmOutputList
Description:	列出报警输出联动list checkbox
Input:			iAnalogChan: 模拟通道
				iTotalChan: 模拟+IP总通道数	
Output:			无
return:			无	
***********************************/   
function CreateAlarmOutputList(iAnalogChan,iTotalChan)
{
	var szDivInfo = "";
	for(var i = 0; i < iTotalChan; i ++)
	{
		if(i < iAnalogChan)
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'  onClick='CheackAlarmOutputAllSel()'>&nbsp;"+"A->" + (i + 1) + "&nbsp;";			
		}
		else
		{
			szDivInfo = szDivInfo + "<input class='checkbox' name='AlarmOutputCheckbox' id='AlarmOutputCheckboxChanO-"+ (i + 1)+"' type='checkbox'  onClick='CheackAlarmOutputAllSel()'>&nbsp;"+"D" + (Math.floor(parseInt(m_szAlarmOutInfo[i].split("-")[1])/100) - m_iAChannelNum) + "->" + parseInt(m_szAlarmOutInfo[i].split("-")[1])%100 + "&nbsp;";
		}
		
		if((i+1) % 9 == 0 && i != 0)
		{
			szDivInfo = szDivInfo + "<br>";	
		}
	}
	$("#DisPlayLinkageList").html(szDivInfo); 
	if(getObject("SelectAllAlarmOutputBox"))
	{
	    document.getElementById('SelectAllAlarmOutputBox').checked = false;
	}
}
/*************************************************
Function:		CheackAlarmOutputAllSel
Description:	判断是否全选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackAlarmOutputAllSel()
{
	var bCheck = true;
	var temp = document.getElementsByName("AlarmOutputCheckbox"); 
	if(temp.length == 0)
	{
		bCheck = false;
	}
	for (var i =0; i<temp.length; i++) 
	{ 
	   if (temp[i].checked == false)
	   {
		   bCheck = false;
		   break;
	   } 
	}
	if(getObject("SelectAllAlarmOutputBox"))
	{
		document.getElementById('SelectAllAlarmOutputBox').checked = bCheck;
	}
}
/*************************************************
Function:		CheackEveryTime
Description:	各个时间段不能有重复时间
Input:			idName:识别是验证那个表单
Output:			无
return:			1代表正确，0代表有重复				
*************************************************/
function CheackEveryTime(idName)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	for(var x = 1; x<= m_iTimePart; x ++)
	{
		var StartTimeH =  idName + "StartTime" + x + "H";
		var StartTimeM =  idName + "StartTime" + x + "M";
		var StopTimeH =  idName + "StopTime" + x + "H";
		var StopTimeM =  idName + "StopTime" + x + "M";
		var St1 = document.getElementById(StartTimeH).innerHTML;
		var St2 = document.getElementById(StartTimeM).innerHTML;
		var Sp1 = document.getElementById(StopTimeH).innerHTML;
		var Sp2 = document.getElementById(StopTimeM).innerHTML;
		var St12 = St1 * 60 + St2 * 1;
		var Sp12 = Sp1 * 60 + Sp2 * 1;
		if((St12 + Sp12) != 0 )
		{
			for(var y = 1; y <= 8; y ++)
			{
				if(y != x)
				{
					var ComStartTimeH =  idName + "StartTime" + y + "H";
					var ComStartTimeM =  idName + "StartTime" + y + "M";
					var ComStopTimeH =  idName + "StopTime" + y + "H";
					var ComStopTimeM =  idName + "StopTime" + y + "M";
					var ComSt1 = document.getElementById(ComStartTimeH).innerHTML;
					var ComSt2 = document.getElementById(ComStartTimeM).innerHTML;
					var ComSp1 = document.getElementById(ComStopTimeH).innerHTML;
					var ComSp2 = document.getElementById(ComStopTimeM).innerHTML;
					var ComSt12 = ComSt1 * 60 + ComSt2 * 1;
					var ComSp12 = ComSp1 * 60 + ComSp2 * 1;
					if((ComSt12 + ComSp12) != 0 )
					{
						if(St12 <= ComSt12 && Sp12 > ComSt12)
						{
							var szErrorTips = szAreaNameInfo + getNodeValue('laTimerange')+ y + getNodeValue('WithTimeSegmentTips') + x + getNodeValue('OverlappedTips');
							
							$("#SetResultTipsTwo").html(szErrorTips);
							return 0;
						}
					}
				}
			}
		}
	}
	$("#SetResultTipsTwo").html(""); 
	return 1;
}
/*************************************************
Function:		CheackIntOutTime
Description:	时间段开始时间不能大于结束时间
Input:			idName:识别是验证那个表单
Output:			无
return:			1代表正确，0代表有错误					
*************************************************/
function CheackIntOutTime(idName)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	for(var x = 1; x<= m_iTimePart; x ++)
	{
		var StartTimeH =  idName + "StartTime" + x + "H";
		var StartTimeM =  idName + "StartTime" + x + "M";
		var StopTimeH =  idName + "StopTime" + x + "H";
		var StopTimeM =  idName + "StopTime" + x + "M";
		var St1 = document.getElementById(StartTimeH).innerHTML;
		var St2 = document.getElementById(StartTimeM).innerHTML;
		var Sp1 = document.getElementById(StopTimeH).innerHTML;
		var Sp2 = document.getElementById(StopTimeM).innerHTML;
		
		var St12 = St1 * 60 + St2 * 1;
		var Sp12 = Sp1 * 60 + Sp2 * 1;
		if(St12 >= Sp12)
		{
			if((St12 + Sp12) != 0 )
			{
				var szErrorTips = szAreaNameInfo + getNodeValue('laTimerange') + x + getNodeValue('jsTimeSegmentErrorSegTips');
				$("#SetResultTipsTwo").html(szErrorTips);   
				return 0;
			}
		}
		if((St12 + Sp12) != 0 )
		{
			for(var y = 1; y <= m_iTimePart; y ++)
			{
				if(y != x)
				{
					var ComStartTimeH =  idName + "StartTime" + y + "H";
					var ComStartTimeM =  idName + "StartTime" + y + "M";
					var ComStopTimeH =  idName + "StopTime" + y + "H";
					var ComStopTimeM =  idName + "StopTime" + y + "M";
					var ComSt1 = document.getElementById(ComStartTimeH).innerHTML;
					var ComSt2 = document.getElementById(ComStartTimeM).innerHTML;
					var ComSp1 = document.getElementById(ComStopTimeH).innerHTML;
					var ComSp2 = document.getElementById(ComStopTimeM).innerHTML;
					var ComSt12 = ComSt1 * 60 + ComSt2 * 1;
					var ComSp12 = ComSp1 * 60 + ComSp2 * 1;
					if((ComSt12 + ComSp12) != 0 )
					{
						if(St12 <= ComSt12 && Sp12 > ComSt12)
						{
							var szErrorTips = szAreaNameInfo + getNodeValue('laTimerange')+ y + getNodeValue('WithTimeSegmentTips') + x + getNodeValue('OverlappedTips');
							
							$("#SetResultTipsTwo").html(szErrorTips);
							return 0;
						}
					}
				}
			}
		}
		m_szWeek[m_iDay][x - 1][0] = St1 + ":" + St2 + ":00";
		m_szWeek[m_iDay][x - 1][1] = Sp1 + ":" + Sp2 + ":00";
	}
	$("#SetResultTipsTwo").html("");   
	return 1;
}
/*************************************************
Function:		CheackAllChanneldayList
Description:	判断是否全选星期
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheackAllChanneldayList()
{
	var iHaveSelect = 0; //已经选中的checkbox数目
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	for(var i = 0;i < WeekdayNum;i ++)
    { 
	   	if((document.getElementById("ChannelplandayList" + i).checked) == true)
	   	{
			iHaveSelect ++;
	   	} 
   	}
	if(iHaveSelect == WeekdayNum)
	{
		document.getElementById("alldaylist").checked = true;
	}
	else
	{
		document.getElementById("alldaylist").checked = false;
	}	
}

/*************************************************
Function:		SelectAllplandayList
Description:	全选所有星期复制
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllplandayList()
{
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	var bAll = document.getElementById("alldaylist").checked;
	for(var i = 0; i < WeekdayNum; i ++)
	{
		if(bAll)
		{
			document.getElementById("ChannelplandayList" + i).checked = true;
		}
		else
		{
			document.getElementById("ChannelplandayList" + i).checked = false;
		}
	}
	document.getElementById("ChannelplandayList" + m_iDay).checked = true;
}
/*************************************************
Function:		GetEveryTimeDayInfo
Description:	根据星期几信息填入到表单中
Input:			无		
Output:			无
return:			无				
*************************************************/
function GetEveryTimeDayInfo()
{
	if(getObject("StartTime1H"))
	{
		for (var x =0; x < m_iTimePart; x ++)
		{
			document.getElementById("StartTime" + (x+1) +"H").innerHTML = m_szWeek[m_iDay][x][0].split(":")[0];
			document.getElementById("StartTime" + (x+1) +"M").innerHTML = m_szWeek[m_iDay][x][0].split(":")[1];
			document.getElementById("StopTime" + (x+1) +"H").innerHTML = m_szWeek[m_iDay][x][1].split(":")[0];
			if(m_szWeek[m_iDay][x][1].split(":")[0] == "24")
			{
				document.getElementById("StopTime" + (x+1) +"M").innerHTML = "00";
				//document.getElementById("StopTime" + (x+1) +"M").disabled = 1;	
			}
			else
			{
				document.getElementById("StopTime" + (x+1) +"M").innerHTML = m_szWeek[m_iDay][x][1].split(":")[1];
				//document.getElementById("StopTime" + (x+1) +"M").disabled = 0;
			}
		}
	}
}
/**********************************
Function:		ListCopyChannelAlarm
Description:	根据报警量列出复制报警量checkbox
Input:			iAnalogChan: 模拟通道
				iTotalChan: 模拟+IP总通道数	
Output:			无
return:			无	
***********************************/   
function ListCopyChannelAlarm(iAnalogChan,iTotalChan)
{
	var szDivInfo = "";
	for(var i = 0; i < iTotalChan; i ++)
	{
		if(i < iAnalogChan)
		{
			szDivInfo = szDivInfo + "<input name='SingleCheckbox' id='SingleCheckboxChan"+i+"' type='checkbox'  onClick='CheackListAllSel(1)'>"+"A<-" + (i + 1) + "&nbsp;";
		}
		else
		{
			strIndex = m_szAlarmInInfo[i][0].split("-");
			szDivInfo = szDivInfo + "<input name='SingleCheckbox' id='SingleCheckboxChan"+i+"' type='checkbox'  onClick='CheackListAllSel(1)'>D"+ (Math.floor(parseInt(strIndex[1])/100) - m_iAChannelNum) + "<-" + parseInt(strIndex[1])%100 + "&nbsp;";
		}
		
		if((i+1) % 6 == 0 && i != 0)
		{
			szDivInfo = szDivInfo + "<br>";	
		}
	}
	$("#DisPlayChanList").html(szDivInfo); 
	SelectCurrentChanDis(1);
}
/*************************************************
Function:		CopyDayTimeInfo	
Description:	复制到星期的信息 移动侦测 视频丢失==
Input:			无
Output:			无	
Return:			无
*************************************************/
function CopyDayTimeInfo()
{
	if(CheackIntOutTime("") == 0)
	{
		return;	
	}
	
	if(m_bHolidayEnable)
	{
		var WeekdayNum = 8;
	}
	else
	{
		var WeekdayNum = 7;
	}
	for(var i=0;i<WeekdayNum;i++)											
	{
		if(i != m_iDay)
		{
			if(document.getElementById("ChannelplandayList" + i).checked == true)
			{
				for (j=0;j<8;j++)
				{				
					m_szWeek[i][j][0] = m_szWeek[m_iDay][j][0];						
					m_szWeek[i][j][1] = m_szWeek[m_iDay][j][1];					
				}
			}
		}
	}
}
/*************************************************
Function:		jump_showdaytime
Description:	根据星期几获取相关显示信息  移动侦测 视频丢失..
Input:			iSet: select项的通道号			
Output:			无
return:			无				
*************************************************/
function jump_showdaytime(iSet)
{
	if(m_iDay != iSet)
	{
		if(CheackIntOutTime("") == 0)
		{
			return;	
		}
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 0;
		document.getElementById("alldaylist").checked = false;
		SelectAllplandayList();
		document.getElementById("ChannelplandayList" + m_iDay).checked = false;
		
		m_iDay = iSet;
		document.getElementById("ChannelplandayList" + m_iDay).disabled = 1;		
		document.getElementById("ChannelplandayList" + m_iDay).checked = true;

		GetEveryTimeDayInfo();
	}
}
/*************************************************
Function:		SelectAllAlarmOutputToLinkage
Description:	全选/全不选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllAlarmOutputToLinkage()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllAlarmOutputBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("AlarmOutputCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{
			if(temp[i].disabled)
			{
				continue;
			}
			temp[i].checked = bCheck; 
		}
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
/*************************************************
Function:		SelectAllAlarmOutput
Description:	全选/全不选复制通道-报警输出
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllAlarmOutput()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllAlarmOutputBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("AlarmOutputCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck; 
		}
		document.getElementsByName("AlarmOutputCheckbox")[m_iPicinform].checked = true;
   		document.getElementsByName("AlarmOutputCheckbox")[m_iPicinform].disabled = 1;
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
/*************************************************
Function:		SelectAllTriggerRecordToLinkage
Description:	全选/全不选复制通道-触发录像通道
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllTriggerRecordToLinkage()
{
	try
	{
		var bCheck = true;
		if(document.getElementsByName("SelectAllTriggerRecordBox")[0].checked == true)
		{
		   bCheck = true;
		}
		else
		{
		   bCheck = false;
		}	    
		var temp = document.getElementsByName("TriggerRecordCheckbox"); 
		for (var i =0; i<temp.length; i++) 
		{ 
		   temp[i].checked = bCheck; 
		} 
	}
	catch(err)
	{
		//LogErrorTips(err.description);
	}
}
/*************************************************
Function:		CreateScheduleDoc
Description:	创建布防时间信息
Input:			iType: 布防时间类型
				iAlarmType: 报警类型
				iAlarmOutNo: 报警输出号
Output:			无
return:			无				
*************************************************/
function CreateScheduleDoc(iType,iAlarmType, iAlarmOutNo)
{
	var ScheduleID = "";
	var XmlScheduleDoc = new createxmlDoc();
	var Instruction = XmlScheduleDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlScheduleDoc.appendChild(Instruction);
	var Root = XmlScheduleDoc.createElement("EventSchedule");
	
	Element = XmlScheduleDoc.createElement("eventType");
	text = XmlScheduleDoc.createTextNode(iType);
	Element.appendChild(text);
	Root.appendChild(Element);
			
	switch(iType)
	{
		case "VMD":
		case "Videoloss":
		case "videoloss":
		case "tamperdetection":
		{
			if(iType == 'tamperdetection')
			{
				ScheduleID = "Tamperdetection_video" + m_iPicinform;
			}
			else
			{
			    ScheduleID = iType + "_video" + m_iPicinform;
			}
			
			Element = XmlScheduleDoc.createElement("videoInputID");
			text = XmlScheduleDoc.createTextNode(m_iPicinform);
			Element.appendChild(text);
			Root.appendChild(Element);
		}
		case "IO":
		{
			if(iAlarmType == "ALARMIN")
			{
				ScheduleID = "IO_IN" + m_szAlarmInInfo[m_iPicinform][0];
				
				Element = XmlScheduleDoc.createElement("inputIOPortID");
				text = XmlScheduleDoc.createTextNode(m_szAlarmInInfo[m_iPicinform][0]);
				Element.appendChild(text);
				Root.appendChild(Element);
			}
			else if(iAlarmType == "ALARMOUT")
			{
				ScheduleID = "IO_OUT" + m_szAlarmOutInfo[iAlarmOutNo];
				
				Element = XmlScheduleDoc.createElement("outputIOPortID");
				text = XmlScheduleDoc.createTextNode(m_szAlarmOutInfo[iAlarmOutNo]);
				Element.appendChild(text);
				Root.appendChild(Element);
			}
		}
		default:
		{
			break;
		}
	}
	
	Element = XmlScheduleDoc.createElement("id");
	text = XmlScheduleDoc.createTextNode(ScheduleID);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	TimeBlockList = XmlScheduleDoc.createElement("TimeBlockList");	
	var TIME = new Array ();
	var TimeBlock = new Array();
	for (var i=0;i<7;i++)											//封装一个XML文件，节点的值先从已经保存的数组中获得
	{		
		for (j=0;j<8;j++)
		{
			/*if(m_szWeek[i][j][0] != '00:00:00' || m_szWeek[i][j][1] != '00:00:00')*/
			{
				TimeBlock = XmlScheduleDoc.createElement("TimeBlock");
				
				Element = XmlScheduleDoc.createElement("dayOfWeek");					
				text = XmlScheduleDoc.createTextNode(i + 1);
				Element.appendChild(text);
				TimeBlock.appendChild(Element);
			
				TIME[j] = XmlScheduleDoc.createElement("TimeRange");
				
				Element = XmlScheduleDoc.createElement("beginTime");
				text = XmlScheduleDoc.createTextNode(m_szWeek[i][j][0]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				Element = XmlScheduleDoc.createElement("endTime");					
				text = XmlScheduleDoc.createTextNode(m_szWeek[i][j][1]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
					
				TimeBlock.appendChild(TIME[j]);
				
				TimeBlockList.appendChild(TimeBlock);
			}
		}
	}
	if(m_bHolidayEnable)
	{
		HolidayBlockList = XmlScheduleDoc.createElement("HolidayBlockList");
		for (j=0;j<8;j++)
		{
			if(m_szWeek[7][j][0] != '00:00:00' || m_szWeek[7][j][1] != '00:00:00')
			{
				TimeBlock = XmlScheduleDoc.createElement("TimeBlock");
			
				TIME[j] = XmlScheduleDoc.createElement("TimeRange");
				
				Element = XmlScheduleDoc.createElement("beginTime");
				text = XmlScheduleDoc.createTextNode(m_szWeek[7][j][0]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
				
				Element = XmlScheduleDoc.createElement("endTime");					
				text = XmlScheduleDoc.createTextNode(m_szWeek[7][j][1]);
				Element.appendChild(text);
				TIME[j].appendChild(Element);
					
				TimeBlock.appendChild(TIME[j]);
				
				HolidayBlockList.appendChild(TimeBlock);
			}
		}
		Root.appendChild(HolidayBlockList);
	}
	Root.appendChild(TimeBlockList);
	XmlScheduleDoc.appendChild(Root);
			
	return XmlScheduleDoc;
}
/*************************************************
Function:		CreateLinkDoc
Description:	创建联动信息
Input:			iType: 联动类型
				iAlarmType: 通道号
				iAlarmOutNo: 报警输出号
Output:			无
return:			无				
*************************************************/
function CreateLinkDoc(iType)
{
	var XmlLinkDoc = new createxmlDoc();
	var Instruction = XmlLinkDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlLinkDoc.appendChild(Instruction);
	var Root = XmlLinkDoc.createElement("EventTrigger");
	
	Element = XmlLinkDoc.createElement("id");
	text = XmlLinkDoc.createTextNode('');
	Element.appendChild(text);
	Root.appendChild(Element);
			
	Element = XmlLinkDoc.createElement("eventType");
	text = XmlLinkDoc.createTextNode(iType);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlLinkDoc.createElement("eventDescription");
	text = XmlLinkDoc.createTextNode(iType + " Event is detected.");
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlLinkDoc.createElement("videoInputChannelID");
	text = XmlLinkDoc.createTextNode(m_iPicinform);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	var EventTriggerNotificationList = XmlLinkDoc.createElement("EventTriggerNotificationList");
				
	if($("#MoveEmail").prop("checked"))				//邮件联动
	{
		szEmail = XmlLinkDoc.createElement("EventTriggerNotification");
		
		Element = XmlLinkDoc.createElement("id");
		text = XmlLinkDoc.createTextNode("email");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationMethod");
		text = XmlLinkDoc.createTextNode("email");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationRecurrence");
		text = XmlLinkDoc.createTextNode("beginning");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		EventTriggerNotificationList.appendChild(szEmail);
	}
				
	if($("#MoveMonitorAlarm").prop("checked"))		//监视器上警告
	{
		szMonitorAlarm = XmlLinkDoc.createElement("EventTriggerNotification");
		
		Element = XmlLinkDoc.createElement("id");
		text = XmlLinkDoc.createTextNode("monitorAlarm");
		Element.appendChild(text);
		szMonitorAlarm.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationMethod");
		text = XmlLinkDoc.createTextNode("monitorAlarm");
		Element.appendChild(text);
		szMonitorAlarm.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationRecurrence");
		text = XmlLinkDoc.createTextNode("beginning");
		Element.appendChild(text);
		szMonitorAlarm.appendChild(Element);
		
		EventTriggerNotificationList.appendChild(szMonitorAlarm);
	}
	
	if($("#MoveSoundAlarm").prop("checked"))			//声音报警
	{
		szBeep = XmlLinkDoc.createElement("EventTriggerNotification");
		
		Element = XmlLinkDoc.createElement("id");
		text = XmlLinkDoc.createTextNode("beep");
		Element.appendChild(text);
		szBeep.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationMethod");
		text = XmlLinkDoc.createTextNode("beep");
		Element.appendChild(text);
		szBeep.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationRecurrence");
		text = XmlLinkDoc.createTextNode("beginning");
		Element.appendChild(text);
		szBeep.appendChild(Element);
		
		EventTriggerNotificationList.appendChild(szBeep);
	}

	if($("#MoveUpload").prop("checked"))				//上传中心
	{
		szCenter = XmlLinkDoc.createElement("EventTriggerNotification");
		
		Element = XmlLinkDoc.createElement("id");
		text = XmlLinkDoc.createTextNode("center");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationMethod");
		text = XmlLinkDoc.createTextNode("center");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationRecurrence");
		text = XmlLinkDoc.createTextNode("beginning");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		EventTriggerNotificationList.appendChild(szCenter);
	}
	if($("#MoveFTP").prop("checked"))				//FTP
	{
		szCenter = XmlLinkDoc.createElement("EventTriggerNotification");
		
		Element = XmlLinkDoc.createElement("id");
		text = XmlLinkDoc.createTextNode("FTP");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationMethod");
		text = XmlLinkDoc.createTextNode("FTP");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		Element = XmlLinkDoc.createElement("notificationRecurrence");
		text = XmlLinkDoc.createTextNode("beginning");
		Element.appendChild(text);
		szCenter.appendChild(Element);
		
		EventTriggerNotificationList.appendChild(szCenter);
	}	
	for(var i = 1;i <= m_iAlarmOutputTotalNum;i++)//触发报警输出
	{
		var szTriggerAlarmOut = "AlarmOutputCheckboxChanO-" + i;
		if(document.getElementById(szTriggerAlarmOut).checked)
		{
			szAlarmout = XmlLinkDoc.createElement("EventTriggerNotification");
				
			Element = XmlLinkDoc.createElement("id");
			if(i <= m_iAlarmOutputAnalogNum)
			{
				text = XmlLinkDoc.createTextNode('IO-' + i);
			}
			else
			{
				text = XmlLinkDoc.createTextNode('IO-' + m_szAlarmOutInfo[i-1].split('-')[1]);
			}			
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
				
			Element = XmlLinkDoc.createElement("notificationMethod");
			text = XmlLinkDoc.createTextNode("IO");
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
				
			Element = XmlLinkDoc.createElement("notificationRecurrence");
			text = XmlLinkDoc.createTextNode("beginning");
			Element.appendChild(text);
			szAlarmout.appendChild(Element);	
	
			Element = XmlLinkDoc.createElement("outputIOPortID");
			text = XmlLinkDoc.createTextNode(m_szAlarmOutInfo[i-1]);
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
			
			EventTriggerNotificationList.appendChild(szAlarmout);
		}
	}
	if(iType == "VMD")
	{
		var temp = document.getElementsByName("TriggerRecordCheckbox");
		for(var chan = 0; chan  < temp.length; chan ++)//触发录像通道
		{
			if(temp[chan].checked)
			{
				RecordLink = XmlLinkDoc.createElement("EventTriggerNotification");
			
				Element = XmlLinkDoc.createElement("id");
				if(chan  < m_iAChannelNum)
				{
				    text = XmlLinkDoc.createTextNode('record-' + (chan+1));
				}
				Element.appendChild(text);
				RecordLink.appendChild(Element);
					
				Element = XmlLinkDoc.createElement("notificationMethod");
				text = XmlLinkDoc.createTextNode("record");
				Element.appendChild(text);
				RecordLink.appendChild(Element);
					
				Element = XmlLinkDoc.createElement("notificationRecurrence");
				text = XmlLinkDoc.createTextNode("beginning");
				Element.appendChild(text);
				RecordLink.appendChild(Element);	
		
				Element = XmlLinkDoc.createElement("videoInputID");
				if(chan < m_iAChannelNum)
				{
					iNo = chan + 1;
				}
				text = XmlLinkDoc.createTextNode(iNo);
				Element.appendChild(text);
				RecordLink.appendChild(Element);
				
				EventTriggerNotificationList.appendChild(RecordLink);
			}
		}
	}
	
	Root.appendChild(EventTriggerNotificationList);
	XmlLinkDoc.appendChild(Root);
	switch(iType)
	{
		case "VMD":
		{
			XmlLinkDoc.documentElement.getElementsByTagName('id')[0].childNodes[0].nodeValue = m_szMotionInfo[0];
			break;
		}
		case "videoloss":
		{
			XmlLinkDoc.documentElement.getElementsByTagName('id')[0].childNodes[0].nodeValue = m_szVideoLostInfo[0];
			break;
		}
		case "tamperdetection":
		{
			XmlLinkDoc.documentElement.getElementsByTagName('id')[0].childNodes[0].nodeValue = m_szBlockInfo[0];
			break;
		}
		default:
		{
		    break;
		}
	}
	return XmlLinkDoc;
}
/*************************************************
Function:		CheckAddressingType
Description:	获取IP地址类型
Input:			strInfo: IP地址
Output:			地址类型
return:			无				
*************************************************/
function CheckAddressingType(strInfo)
{
	var strIpAddressType = "hostName";
	if(m_strIpVersion == 'v4')
    {
		if($.isIpAddress(strInfo) == true)
		{
			strIpAddressType = "ipAddress";		
		}
	}
	else if(m_strIpVersion == 'v6')
    {
		if($.isIPv6(strInfo) == true)
		{
			strIpAddressType = "ipv6Address";	
		}
	}
	else
	{
		if($.isIpAddress(strInfo) == true)
		{
			strIpAddressType = "ipAddress";
		}
		else if($.isIPv6(strInfo) == true)
		{
			strIpAddressType = "ipv6Address";
		}
	}
	return strIpAddressType;
}
/*************************************************
Function:		ReDrawMoveSchedule
Description:	重绘计划图
Input:			
Output:			无
return:			无				
*************************************************/
function ReDrawMoveSchedule(id)
{
	var iIEVersion = parseInt($.browser.version, 10);
	if($.browser.msie && (iIEVersion == 6 || iIEVersion == 7 || iIEVersion == 8))
	{
		$("#divEventCanvas").html('<canvas id="ScheduleCanvas" width="520" height="285"></canvas>')
		G_vmlCanvasManager.init($("#divEventCanvas")[0]);
	}
	var context = document.getElementById("ScheduleCanvas").getContext('2d');
	context.clearRect(0, 0, 520, 285);
	
    var weekcn=new Array(getNodeValue('laMonday'),getNodeValue('laTuesday'),getNodeValue('laWednesday'),getNodeValue('laThursday'),getNodeValue('laFriday'),getNodeValue('laSaturday'),getNodeValue('laSunday'),getNodeValue('laHoliday'));
    var hour=new Array("0","2","4","6","8","10","12","14","16","18","20","22","24");

	context.fillStyle = "#ffffff";
    context.fillRect(0,0,515,280);
	
	context.fillStyle = "#ffffff";
    context.fillRect(60,45,432,210);
	
	for(var i = 0; i < 7; i++)
	{
		for(var j = 0; j < 7; j++)
	    {
		   if(m_szWeek[i][j][1] != "00:00:00")
		   {	
			  var timeDrawFirst = parseInt(m_szWeek[i][j][0].split(":")[1],10) + parseInt(m_szWeek[i][j][0].split(":")[0],10) * 60;
		      var timeDrawSecond = parseInt(m_szWeek[i][j][1].split(":")[1],10) + parseInt(m_szWeek[i][j][1].split(":")[0],10) * 60;
			  context.fillStyle = "#ffffff";
			  context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
			  context.fillStyle = "#6577fd";
              context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
		  }
		}	
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
      context.lineTo(60+i*18,255);
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
}
/*************************************************
Function:		InitDrawSchedule
Description:	获取IP地址类型
Input:			无
Output:			无
return:			无				
*************************************************/
function InitDrawSchedule()
{
	var iIEVersion = parseInt($.browser.version, 10);
	if($.browser.msie && (iIEVersion == 6 || iIEVersion == 7 || iIEVersion == 8)) {
		$("#divEventCanvas").html('<canvas id="ScheduleCanvas" width="520" height="285"></canvas>')
		G_vmlCanvasManager.init($("#divEventCanvas")[0]);
	}
	try {
		var context = document.getElementById("ScheduleCanvas").getContext('2d');
	} catch(e) {
		//setTimeout(InitDrawSchedule,200);
		return;
	}
	context.clearRect(0, 0, 520, 285);
    var weekcn=new Array(getNodeValue('laMonday'),getNodeValue('laTuesday'),getNodeValue('laWednesday'),getNodeValue('laThursday'),getNodeValue('laFriday'),getNodeValue('laSaturday'),getNodeValue('laSunday'),getNodeValue('laHoliday'));
    var hour=new Array("0","2","4","6","8","10","12","14","16","18","20","22","24");

	context.fillStyle = "#ffffff";
    context.fillRect(0,0,515,280);
	
	context.fillStyle = "#ffffff";
    context.fillRect(60,45,432,210);
	
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 7; j++) {
			if(m_szWeek[i][j][1] != "00:00:00") {	
				var timeDrawFirst = parseInt(m_szWeek[i][j][0].split(":")[1],10) + parseInt(m_szWeek[i][j][0].split(":")[0],10) * 60;
				var timeDrawSecond = parseInt(m_szWeek[i][j][1].split(":")[1],10) + parseInt(m_szWeek[i][j][1].split(":")[0],10) * 60;
				context.fillStyle = "#ffffff";
				context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
				context.fillStyle = "#6577fd";
				context.fillRect(60 + (timeDrawFirst/1440) * 432,45 + i * 30,((timeDrawSecond - timeDrawFirst)/1440) * 432,30);
			}
		}	
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

	for(i = 0; i <= 7; i++) {
		context.lineWidth = 1;
		context.strokeStyle = 'rgb(150, 150, 150)';
		context.moveTo(60,i*30+45);
		context.lineTo(492,i*30+45);
		context.stroke(); 
		if(i != 7) {
			if(5 == i || 6 == i) {
				context.fillStyle = 'red';	
			} else {
				context.fillStyle = '#000000';
			}
			context.font = '13px Verdana';
			context.fillText(weekcn[i],10,i*30+60);	
		}    	
	}

    for(i = 0; i <= 24; i++) {
		context.lineWidth = 1;
  
		context.moveTo(60+i*18,41);
		context.lineTo(60+i*18,255);
		context.stroke();
		if(0 == i % 2) {
			context.fillStyle = '#000';
			context.fillText(hour[i/2],55+i*18,30);   
		}
		if(i != 24) {
			for(j = 0; j<=25; j++) {
				context.fillStyle = 'gray';
				context.fillRect(69+18*i, 45+j*8, 1,5); 	
			}
		}
    }
}
/*************************************************
Function:		showScheduleinputWindow
Description:	显示时间输入框
Input:			i:输入框显示编号
Output:			无
return:			无				
*************************************************/
function showScheduleinputWindow(i)
{
	//位置
	if(i < 8)
	{
		document.getElementById('timeInputWindow').style.left = "250px";
		document.getElementById('timeInputWindow').style.top = (155 + i * 25) + "px";
	}
	else
	{
		document.getElementById('timeInputWindow').style.left = "474px";
		document.getElementById('timeInputWindow').style.top = (155 + (i - 8) * 25) + "px";			
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
		if(i == m_lastWindowTmp)//点击当前显示框
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
		    if(m_lastWindowTmp < 8)//把框内的值赋给前一个点击的框
	        {
		        document.getElementById("StartTime" + (m_lastWindowTmp+1) + "H").innerHTML = szTimeH;
		        document.getElementById("StartTime" + (m_lastWindowTmp+1) + "M").innerHTML = szTimeM;
	        }
	        else
	        {
		        document.getElementById("StopTime" + (m_lastWindowTmp-7) + "H").innerHTML = szTimeH;
		        document.getElementById("StopTime" + (m_lastWindowTmp-7) + "M").innerHTML = szTimeM;		
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
	m_lastWindowTmp = i;
}
/*************************************************
Function:		EditSchedule
Description:	弹出布防时间编辑框
Input:			无
Output:			无
return:			无				
*************************************************/
function EditSchedule()
{
   var lxd = parent.translator.getLanguageXmlDoc(["Events","Common"]);  //窗口打开时需重新翻译一下语言
   parent.translator.appendLanguageXmlDoc(lxd, g_lxdParamConfig);
   parent.translator.translatePage(lxd, document);
  
   m_iDay = 0;
   GetEveryTimeDayInfo();
   $("#TimeScheduleEdit").modal(); 
   try 
   {
       m_szAreaXmlInfo = HWP.GetRegionInfo();  
	   $('#main_plugin').hide();
   }
   catch (oError)
   {
   }
   $("#ulSchedule").tabs("", {markCurrent: false});
}
/*************************************************
Function:		OKEditScheduleDlg
Description:	布防时间框按确定按钮
Input:			无
Output:			无
return:			无				
*************************************************/
function OKEditScheduleDlg()
{
	if(CheackIntOutTime("") == 0)
	{
		return;	
	}	
	ReDrawMoveSchedule();
    try 
    {
        $('#main_plugin').show();
		if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			HWP.Stop(0);
			setTimeout(function() {
				HWP.Play();
				HWP.SetRegionInfo(m_szAreaXmlInfo);
			}, 10);	
		}		
    }
    catch (oError)
    {
    } 	
	$.modal.impl.close();	
}
/*************************************************
Function:		CancelScheduleDlg
Description:	布防时间按取消按钮
Input:			无
Output:			无
return:			无				
*************************************************/
function CancelScheduleDlg()
{
    try 
    {
        $('#main_plugin').show();
		if(navigator.appName == "Netscape" || navigator.appName == "Opera")
		{
			HWP.Stop(0);
			setTimeout(function() {
				HWP.Play();
				HWP.SetRegionInfo(m_szAreaXmlInfo);
			}, 10);	
		}
    }
    catch (oError)
    {
    }
	$.modal.impl.close();	
}
/*************************************************
 * Copyright 2008-2013 Hikvision Digital Technology Co., Ltd. 
 * Class TimeSegment 
 * @author chenxiangzhen
 * @created 2012-02-23
 * @version v1.0
 * @function 信息储存，存放时间片段相关信息
 *************************************************/
function TimeSegment(options)
{
	options = jQuery.extend({}, options);
	this.m_iX = 0;
	this.m_iY = 0;
	this.m_iWidth = 0;
	this.m_iHeight = 0;
	this.m_szColor = options.color?options.color:"#FFFFFF";
	this.m_szType = options.type?options.type:"disable";
	this.m_iTaskNum = options.taskNum?options.taskNum:0;
	this.m_szStartTime = options.startTime?options.startTime:"00:00";
	this.m_szStopTime = options.stopTime?options.stopTime:"00:00";
}
/*************************************************
Function:		deepCopy
Description:	深度复制
Input:			destination 目标
				source 源			
Output:			无
return:			选项				
*************************************************/
function deepCopy(destination, source) 
{
	if($.isEmptyObject(destination) || $.isEmptyObject(source))
	{
		return;
	}
	for(var property in source) 
	{ 
		var copy = source[property]; 
		if (destination === copy)
		{
			continue; 
		}
		if ( typeof copy === "object" ) 
		{ 
			destination[property] = DeepCopy(destination[property] || {}, copy); 
		} 
		else 
		{ 
			destination[property] = copy; 
		} 
	} 
	return destination; 
}