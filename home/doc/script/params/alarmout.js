var m_szAlarmOutInfo = new Array();
for(var i = 0; i < 128; i++)
{
	m_szAlarmOutInfo[i] = -1;				//用于存储报警输出号
}
var m_szAlarmOutName = new Array();
for(var i = 0; i < 128; i++)
{
	m_szAlarmOutName[i] = '';				//用于存储报警输出名称
}
/*************************************************
Function:		GetAlarmOutNo
Description:	获取报警输出数量
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmOutNo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/IO/outputs";
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
		complete:function(xhr, textStatus)
		{
			if(xhr.status == 200)
			{  
				var xmlAnalogDoc = xhr.responseXML;
				m_iAlarmOutputAnalogNum = $(xmlAnalogDoc).find('IOOutputPort').length;
		        m_iAlarmOutputTotalNum = m_iAlarmOutputAnalogNum;//预先将模拟报警输出数赋值给全部报警输出数
			}
			if(getObject("AlarmOutNo"))
			{
				 document.getElementById('AlarmOutNo').options.length = 0;
			}
			if(m_iAlarmOutputTotalNum == 0 && getObject("AlarmOutNo"))//没有报警输出通道时绘制布防时间
			{
				g_transStack.push(InitDrawSchedule, true);
			}
			for(var i = 0; i < m_iAlarmOutputTotalNum; i++)
			{
				 m_szAlarmOutInfo[i] = $(xmlAnalogDoc).find('id').eq(i).text();
				 if($(xmlAnalogDoc).find('IOOutputPort').eq(i).find('name').length > 0)
				 {
					 m_szAlarmOutName[i] = $(xmlAnalogDoc).find('IOOutputPort').eq(i).find('name').eq(0).text();
				 }
				 
				 if(getObject("AlarmOutNo"))
				 {
					 $("<option value='"+ i +"'>"+"A->"+ (i+1) +"</option>").appendTo("#AlarmOutNo");
				 }
			}
			if(getObject("AlarmOutNo") && m_iAlarmOutputTotalNum != 0)
			{
				 CreateAlarmOutputList(m_iAlarmOutputAnalogNum,m_iAlarmOutputTotalNum); 			//列出触发报警输出通道	        
				 GetAlarmOutEach();
			}
		}
	});
}
/*************************************************
Function:		GetAlarmOutEach
Description:	获取单个报警输出信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmOutEach()
{
	$("#SetResultTips").html('');//清空保存前面的提示信息 
	$("SelectAllAlarmOutputBox").eq(0).prop("checked", false);
	
	m_iPicinform = $('#AlarmOutNo').val();
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/IO/outputs/" + m_szAlarmOutInfo[m_iPicinform];
	
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
			$("#defaultState").val($(xmlDoc).find('defaultState').eq(0).text());
		    $("#outputState").val($(xmlDoc).find('outputState').eq(0).text());
		    $("#pulseDuration").val($(xmlDoc).find('pulseDuration').eq(0).text());
		    if($(xmlDoc).find('name').length > 0)
		    {
			   $("#AlarmOutName").val($(xmlDoc).find('name').eq(0).text());
		    }
		    else
		    {
			   $("#AlarmOutName").val('');
		    }
		    if($('#AlarmOutNo').val() < m_iAlarmOutputAnalogNum)
		    {
			   g_transStack.push(function() { $("#IpAddress").val(getNodeValue('LocalTips')); }, true);
			   //$("#IpAddress").val(szAddress);
		    }
		   
		    var tempId = parseInt(m_iPicinform) + 1;
		    for(var i = 1; i <= m_iAlarmOutputTotalNum; i++)
		    {
		       if(i == tempId)
			   {
			       $("#AlarmOutputCheckboxChanO-" + i).prop("checked", true);
				   $("#AlarmOutputCheckboxChanO-" + i).prop("disabled", true);
			   }
			   else
			   {
				   $("#AlarmOutputCheckboxChanO-" + i).prop("checked", false);
				   $("#AlarmOutputCheckboxChanO-" + i).prop("disabled", false);
			   }
		    }
		    GetAlarmOutSchedule();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		GetAlarmOutSchedule
Description:	获取报警输出布防时间
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetAlarmOutSchedule()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Event/schedules";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr, textStatus) 
		{
		    if(xhr.status == 200)
			{
				for(var i = 0; i < 8; i++)
				{
					for(var j = 0;j < 8;j ++)
					{
						m_szWeek[i][j][0] = "00:00:00";
						m_szWeek[i][j][1] = "00:00:00"; 
					}
				}
				var xmlDoc = xhr.responseXML;
				for(i = 0; i < $(xmlDoc).find('EventSchedule').length; i++)
				{
					if($(xmlDoc).find('outputIOPortID').eq(i).text() == m_szAlarmOutInfo[m_iPicinform])
					{
						var xmlScheduleDoc = $(xmlDoc).find("outputIOPortID").eq(i).parent();
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
						break;
					}
				}
			}
			else
			{
				 alert(m_szError400);   
		         return;
			}
			g_transStack.push(InitDrawSchedule, true);
		}
	});
}
/*************************************************
Function:		SetAlarmOutInfo
Description:	设置报警输出信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetAlarmOutInfo()
{
	var iSetSuccess = 1;
	if(m_iAlarmOutputTotalNum == 0)
	{
		szRetInfo = m_szErrorState + m_szError10;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}
	if(!CheckDeviceName($("#AlarmOutName").val(),'AlarmOutNametips',1))
	{
		return;
	}
	
	var szErrorChan = "";
	var temp = document.getElementsByName("AlarmOutputCheckbox"); 
	for(var i = 0; i < temp.length; i ++) 
	{ 
	   	if (temp[i].checked == true)
		{
			SetAlarmOutPara(i);
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
				if(j > m_iAlarmOutputAnalogNum)
				{
					 strIndex = m_szAlarmOutInfo[i].split("-"); 
					 j = "D"+ (Math.floor(parseInt(strIndex[1])/100) - m_iAChannelNum) + "-" + parseInt(strIndex[1])%100;
				}
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
	}
	else
	{
		var szRetInfo = m_szErrorState + m_szError66  + szErrorChan + m_szError44;
	}
	$("#SetResultTips").html(szRetInfo);
	setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
}
/*************************************************
Function:		SetAlarmOutPara
Description:	设置报警信息
Input:			iNo:报警输出号			
Output:			无
return:			无				
*************************************************/
function SetAlarmOutPara(iNo)
{
	m_bSetAlarmInfo = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	m_bSetSchedule = false;
	
	SetAlarmOutSchedule(iNo);
	
	if(m_b403Error || m_bNetAbnormal)
	{
		return;
	}
	
	var xmlAlarmOutDoc = new createxmlDoc();			
	var Instruction = xmlAlarmOutDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlAlarmOutDoc.appendChild(Instruction);
	
	if(iNo < m_iAlarmOutputAnalogNum)
	{
	    var Root = xmlAlarmOutDoc.createElement("IOOutputPort");
	}
	else
	{
		var Root = xmlAlarmOutDoc.createElement("DynIOOutputPort");
	}

	Element = xmlAlarmOutDoc.createElement("id");
	text = xmlAlarmOutDoc.createTextNode(m_szAlarmOutInfo[iNo]);
	Element.appendChild(text);
	Root.appendChild(Element); 
	
	PowerOnState = xmlAlarmOutDoc.createElement("PowerOnState");
	
	Element = xmlAlarmOutDoc.createElement("defaultState");
	text = xmlAlarmOutDoc.createTextNode($("#defaultState").val());
	Element.appendChild(text);
	PowerOnState.appendChild(Element); 
	
	Element = xmlAlarmOutDoc.createElement("outputState");
	text = xmlAlarmOutDoc.createTextNode($("#outputState").val());
	Element.appendChild(text);
	PowerOnState.appendChild(Element); 
	
	Element = xmlAlarmOutDoc.createElement("pulseDuration");
	text = xmlAlarmOutDoc.createTextNode($("#pulseDuration").val());
	Element.appendChild(text);
	PowerOnState.appendChild(Element);
	Root.appendChild(PowerOnState); 
		
	Extensions = xmlAlarmOutDoc.createElement("Extensions");
	Element = xmlAlarmOutDoc.createElement("name");
	if(m_iPicinform == iNo)
	{
		text = xmlAlarmOutDoc.createTextNode($("#AlarmOutName").val());
	}
	else
	{
		text = xmlAlarmOutDoc.createTextNode(m_szAlarmOutName[iNo]);
	}
	Element.appendChild(text);
	Extensions.appendChild(Element);
	Root.appendChild(Extensions);
	
	xmlAlarmOutDoc.appendChild(Root);
		
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/System/IO/outputs/" + m_szAlarmOutInfo[iNo];
	
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: xmlAlarmOutDoc,
		async: false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if(m_bSetSchedule == false)
			{
				m_bSetAlarmInfo = false;
				return;
			}
			else
			{
				m_bSetAlarmInfo = true;
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			m_bSetAlarmInfo = false;
		}
	});
}
/*************************************************
Function:		CreateAlarmOutScheduleDoc
Description:	创建布防时间信息
Input:			iNo:报警输出号			
Output:			无
return:			无				
*************************************************/
function CreateAlarmOutScheduleDoc(iNo)
{
	//CopyDayTimeInfo();   //判断是否复制星期
	
	var XmlScheduleDoc = new createxmlDoc();
	var Instruction = XmlScheduleDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlScheduleDoc.appendChild(Instruction);
	var Root = XmlScheduleDoc.createElement("EventSchedule");
	
	Element = XmlScheduleDoc.createElement("enabled");
	text = XmlScheduleDoc.createTextNode("true");
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlScheduleDoc.createElement("eventType");
	text = XmlScheduleDoc.createTextNode("IO");
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = XmlScheduleDoc.createElement("outputIOPortID");
	text = XmlScheduleDoc.createTextNode(m_szAlarmOutInfo[iNo]);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	TimeBlockList = XmlScheduleDoc.createElement("TimeBlockList");
	
	var TIME = new Array ();
	var TimeBlock = new Array();
	for (var i=0;i<7;i++)											//封装一个XML文件，节点的值先从已经保存的数组中获得
	{		
		for (j=0;j<8;j++)
		{
			if(m_szWeek[i][j][0] != '00:00:00' || m_szWeek[i][j][1] != '00:00:00')
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
	Root.appendChild(TimeBlockList);
	XmlScheduleDoc.appendChild(Root);
	return XmlScheduleDoc;
}
/*************************************************
Function:		SetAlarmOutSchedule
Description:	设置报警输出布防时间
Input:			iNo:报警输出号			
Output:			无
return:			无				
*************************************************/
function SetAlarmOutSchedule(iNo)
{
	m_bSetAlarmInfo = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	m_bSetSchedule = false;
	
	var xmlDoc = CreateScheduleDoc("IO","ALARMOUT",iNo);//修改创建布防时间xml方式
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/Event/schedules/" + "IO_OUT_" + (iNo + 1);
	
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
