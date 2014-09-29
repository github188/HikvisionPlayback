var m_iExceptionID = new Array();//异常对应的event ID
for(var i = 0; i < 8; i++)
{
	m_iExceptionID[i] = 0;
}
var iMethodNum = 0;
<!--设备异常参数信息(接口需要传入 异常类型)-->
/*************************************************
Function:		GetExceptionInfo	
Description:	获取硬盘录像机的异常参数信息
Input:			无
Output:			无	
Return:			以XML形式记录硬盘录像机异常参数信息的一个字符串。
*************************************************/
function GetExceptionInfo()               
{
	iMethodNum = 0;
	$("input[type='checkbox']").prop("checked", false);
	GetAlarmOutNo();//获取报警输出数
	CreateAlarmOutputList(m_iAlarmOutputAnalogNum,m_iAlarmOutputTotalNum); //列出触发报警输出通道
	
	$("#ExEmail").prop("checked",false);
	$("#ExUpload").prop("checked",false);
	$("#ExSoundAlarm").prop("checked",false);
	$("#ExMonitorAlarm").prop("checked",false);
	
	if($("#ExceptionType").val() == "nicbroken" || $("#ExceptionType").val() == "ipconflict")
	{
		$("#ExUpload").prop("disabled",true);
		if(!window.parent.g_bIsIPDome)
		{
			$("#ExEmail").prop("disabled",true);
		}
	}
	else
	{
		$("#ExUpload").prop("disabled",false);
		if(!window.parent.g_bIsIPDome)
		{
			$("#ExEmail").prop("disabled",false);
		}
	}
	szXmlhttp = new getXMLHttpRequest();
	szXmlhttp.onreadystatechange = GetExceptionInfoCallback;  
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers";
	szXmlhttp.open("GET", szURL, true); 
	szXmlhttp.setRequestHeader("If-Modified-Since","0");  
	szXmlhttp.setRequestHeader("Authorization",  "Basic " + m_szUserPwdValue);
	szXmlhttp.send(null); 
}

function GetExceptionInfoCallback()
{
	if(szXmlhttp.readyState == 4)
	{   
		if(szXmlhttp.status == 200)
		{
			var xmlDoc = szXmlhttp.responseXML;
			var EventNum = xmlDoc.documentElement.getElementsByTagName('EventTrigger').length;
			for(var i = 0; i < EventNum; i++)
			{
				if(xmlDoc.documentElement.getElementsByTagName('eventType')[i].childNodes[0].nodeValue == $("#ExceptionType").val())
				{
					var index = document.getElementById("ExceptionType").selectedIndex;
					m_iExceptionID[index] = get_previoussibling(xmlDoc.documentElement.getElementsByTagName('eventType')[i]).childNodes[0].nodeValue;
					EventTriggerNotificationList = xmlDoc.documentElement.getElementsByTagName('EventTriggerNotificationList')[i];
					iMethodNum = EventTriggerNotificationList.getElementsByTagName("notificationMethod").length;
					   
					var iOutPut = EventTriggerNotificationList.getElementsByTagName("outputIOPortID").length;					   
				   for(var j = 0;j < iOutPut; j++)
				   {
					   var iNo = EventTriggerNotificationList.getElementsByTagName("outputIOPortID")[j].childNodes[0].nodeValue;
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
				   for(i = 0;i < iMethodNum;i++)//报警输入联动信息
				   {
					   if("email" == EventTriggerNotificationList.getElementsByTagName('notificationMethod')[i].childNodes[0].nodeValue)
					   {
						   $("#ExEmail").prop("checked",true);
					   }
					   if("center" == EventTriggerNotificationList.getElementsByTagName('notificationMethod')[i].childNodes[0].nodeValue)
					   {
						   $("#ExUpload").prop("checked",true);
					   }
					   if("beep" == EventTriggerNotificationList.getElementsByTagName('notificationMethod')[i].childNodes[0].nodeValue)
					   {
						   $("#ExSoundAlarm").prop("checked",true);
					   }
						if("monitorAlarm" == EventTriggerNotificationList.getElementsByTagName('notificationMethod')[i].childNodes[0].nodeValue)
					   {
						   $("#ExMonitorAlarm").prop("checked",true);
					   }
				   }
				   CheackAlarmOutputAllSel();  //判断是否全选
				   break;
				}//if
			}//for
		}//status = 200
	}
}
/*************************************************
Function:		SaveExceptionInfo	
Description:	设置硬盘录像机的异常参数信息
Input:			lExceptionType	异常类型
				lpAlarmOutCfgXML 以XML形式记录硬盘录像机异常参数信息的一个字符串。
Output:			无	
Return:			-1 -- 失败，0 -- 成功， 1 -- 成功并需要重启设备。
*************************************************/
function SaveExceptionInfo()
{
    var XmlDoc = new createxmlDoc();
	var Instruction = XmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlDoc.appendChild(Instruction);
	var Root = XmlDoc.createElement("EventTrigger");
	
	var index = document.getElementById("ExceptionType").selectedIndex;
	Element = XmlDoc.createElement("id");
	text = XmlDoc.createTextNode(m_iExceptionID[index]);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlDoc.createElement("eventType");
	text = XmlDoc.createTextNode($("#ExceptionType").val());
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlDoc.createElement("eventDescription");
	text = XmlDoc.createTextNode("Exception Event is detected.");
	Element.appendChild(text);
	Root.appendChild(Element);
	
	var EventTrigger = XmlDoc.createElement("EventTriggerNotificationList");
		
	if($("#ExEmail").prop("checked"))
	{
		szEmail = XmlDoc.createElement("EventTriggerNotification");
		
		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode("email");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationMethod");
		text = XmlDoc.createTextNode("email");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationRecurrence");
		text = XmlDoc.createTextNode("beginning");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		EventTrigger.appendChild(szEmail);
	}
	
	if($("#ExSoundAlarm").prop("checked"))
	{
		szEmail = XmlDoc.createElement("EventTriggerNotification");
		
		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode("beep");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationMethod");
		text = XmlDoc.createTextNode("beep");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationRecurrence");
		text = XmlDoc.createTextNode("beginning");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		EventTrigger.appendChild(szEmail);
	}
	
	if($("#ExUpload").prop("checked"))
	{
		szEmail = XmlDoc.createElement("EventTriggerNotification");
		
		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode("center");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationMethod");
		text = XmlDoc.createTextNode("center");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationRecurrence");
		text = XmlDoc.createTextNode("beginning");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		EventTrigger.appendChild(szEmail);
	}
	
	if($("#ExMonitorAlarm").prop("checked"))
	{
		szEmail = XmlDoc.createElement("EventTriggerNotification");
		
		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode("monitorAlarm");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationMethod");
		text = XmlDoc.createTextNode("monitorAlarm");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		Element = XmlDoc.createElement("notificationRecurrence");
		text = XmlDoc.createTextNode("beginning");
		Element.appendChild(text);
		szEmail.appendChild(Element);
		
		EventTrigger.appendChild(szEmail);
	}
	
	var temp = document.getElementsByName("AlarmOutputCheckbox"); 
	for(var i = 0; i < temp.length; i ++) 
	{ 
		if (temp[i].checked == true)
	    {
			szAlarmout = XmlDoc.createElement("EventTriggerNotification");
				
			Element = XmlDoc.createElement("id");
			if(i < m_iAlarmOutputAnalogNum)
			{
				text = XmlDoc.createTextNode('IO-' + (i+1));
			}
			else
			{
				text = XmlDoc.createTextNode('IO-' + m_szAlarmOutInfo[i].split('-')[1]);
			}		
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
				
			Element = XmlDoc.createElement("notificationMethod");
			text = XmlDoc.createTextNode("IO");
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
				
			Element = XmlDoc.createElement("notificationRecurrence");
			text = XmlDoc.createTextNode("beginning");
			Element.appendChild(text);
			szAlarmout.appendChild(Element);	
	
			Element = XmlDoc.createElement("outputIOPortID");
			text = XmlDoc.createTextNode(m_szAlarmOutInfo[i]);
			Element.appendChild(text);
			szAlarmout.appendChild(Element);
			
			EventTrigger.appendChild(szAlarmout);
		}
	}
	Root.appendChild(EventTrigger);
	XmlDoc.appendChild(Root);
	
	szXmlhttp = new getXMLHttpRequest();
	szXmlhttp.onreadystatechange = SetExceptionInfoCallback; 
	if(m_iExceptionID[index] == 0)
	{
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers";
		szXmlhttp.open("POST", szURL, true); 
	}
	else
	{
		var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/triggers/" + m_iExceptionID[index];
		szXmlhttp.open("PUT", szURL, true);
	}
	szXmlhttp.setRequestHeader("If-Modified-Since","0");  
	szXmlhttp.setRequestHeader("Authorization",  "Basic " + m_szUserPwdValue);
	szXmlhttp.send(XmlDoc); 
}
function SetExceptionInfoCallback()
{
	if(szXmlhttp.readyState == 4)
	{   
		if(szXmlhttp.status == 200)
		{ 
			m_szXmlStr = szXmlhttp.responseText;
			var xmlDoc = parseXmlFromStr(m_szXmlStr);
			if(xmlDoc.documentElement.getElementsByTagName('id').length > 0)
			{
				var index = document.getElementById("ExceptionType").selectedIndex;
				m_iExceptionID[index] = xmlDoc.documentElement.getElementsByTagName('id')[0].childNodes[0].nodeValue;
			}
		}
	}
	SaveState(szXmlhttp);
}
