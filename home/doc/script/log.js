document.charset = "utf-8";
var m_szMajorType = new Array();
var m_szMinorType = new Array();
var m_szLogTime = new Array();
var m_szChannelId = new Array();
var m_szRemoteAddress = new Array();
var m_szUserName = new Array();
var m_iMinorType = 'All';
var m_strLogList = "";
var m_LogSearchFinish = false; // 日志查询已完成
var g_iSeledLogTrObj = null; //记录之前选中的行对象
var g_lxdLog = null; // Log.xml
var g_bIsSearching = false; //是否正在搜索
/*************************************************
Function:		InitLog
Description:	初始化日历页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitLog()
{
	$.cookie('page',null);
	m_strIp = m_szHostName;
	
	ChangeLanguage(parent.translator.szCurLanguage);
	
	m_szUserPwdValue = $.cookie('userInfo'+m_lHttpPort);

	if(m_szUserPwdValue == null)
	{
		window.parent.location.href="login.asp";
	}
	window.parent.ChangeMenu(3);
	window.parent.document.getElementById("curruser").innerHTML = (Base64.decode(m_szUserPwdValue).split(":")[0]);		//显示用户
	
	getUPnPInfo();
	
	GetNowTime();
}
/*************************************************
Function:		GetNowTime
Description:	获取当前日期
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNowTime()
{
	var myDate = new Date();
	var iYear = myDate.getFullYear();        
	var iMon = myDate.getMonth();      
	var iDay = myDate.getDate(); 
	iMon = parseInt(iMon)+1;
	if(iMon <= 9)
	{
		iMon = '0' + iMon;
	}
	var szNowTime = iYear + "-" +  iMon + "-" + iDay + " 00:00:00";
	document.getElementById("begintime").value = szNowTime;
	document.getElementById("endtime").value = iYear + "-" +  iMon + "-" + iDay + " 23:59:59";;
}
/*************************************************
Function:		InsertLogList
Description:	插入日志条目信息到List中
Input:			iNo：序号
                strLogTime : 日志时间
                strMajorType : 主类型
				strMinorType : 次类型
				iChanNum : 通道号
				strUser ： 操作用户
				strRemoteIp ： 远程主机地址
Output:			无
return:			无
*************************************************/
function InsertLogList(iNo,strLogTime,strMajorType,strMinorType,iChanNum,strUser,strRemoteIp)
{
   var ObjTr;
   var ObjTd;
   ObjTr = document.getElementById("LogTableList").insertRow(document.getElementById("LogTableList").rows.length);
   ObjTr.style.height = '20px';
   ObjTr.style.cursor = "pointer";
   ObjTr.align = "center";
   ObjTr.onmouseover=LogHighLight;
   ObjTr.onmouseout=LogRecoveryLight;
   if((iNo%2) != 0)
   {
       ObjTr.bgColor="#f6f6f6" ;
   }
   else
   {
       ObjTr.bgColor="#ebebeb" ;
   }
   ObjTr.style.color = "#39414A";
   for(j = 0;j < document.getElementById("LogTableList").rows[0].cells.length;j++)
   {
		ObjTd = ObjTr.insertCell(j);
		switch(j)
		{
	    	case 0:
			    ObjTd.innerHTML = iNo;
			   	ObjTd.id = "logtdA"+ iNo;
				ObjTd.style.width = "4%";
			   	break;
			case 1:
		    	ObjTd.innerHTML = strLogTime;
			   	ObjTd.id = "logtdB"+ iNo;
				ObjTd.style.width = "18%";
			   	break;
		  	case 2:
				ObjTd.innerHTML = parent.translator.translateNode(g_lxdLog, strMajorType);
			  	ObjTd.id = "logtdC"+ iNo;
				ObjTd.align = "center";
				ObjTd.style.width = "16%";
			  	break;
		  	case 3:
		  		ObjTd.innerHTML = parent.translator.translateNode(g_lxdLog, strMinorType);
			   	ObjTd.id = "logtdD"+ iNo;
				ObjTd.style.width = "16%";
			   	break;
			case 4:
		  		ObjTd.innerHTML = iChanNum;
			   	ObjTd.id = "logtdE"+ iNo;
				ObjTd.align = "center";
				ObjTd.style.width = "15%";
			   	break;
			case 5:
		       	ObjTd.innerHTML = strUser;
			  	ObjTd.id = "logtdF"+ iNo;
				ObjTd.align = "center";
				ObjTd.style.width = "15%";
			  	break;
		  	case 6:
		  		ObjTd.innerHTML = strRemoteIp;
			   	ObjTd.id = "logtdG"+ iNo;
				ObjTd.style.width = "16%";
			   	break;
			default:
				break;
	    }
    }
}
/*************************************************
Function:		LogHighLight
Description:	日志行高亮
Input:			无			
Output:			无
return:			无				
*************************************************/
var g_strFormerBgColor; //记录原来背景颜色
function LogHighLight()
{	
   var obj = this;
   if(g_iSeledLogTrObj == obj || obj.tagName != "TR")
   {
	 return;
   }
   g_strFormerBgColor = obj.style.backgroundColor;
   obj.style.backgroundColor = "#fbfbc2";
}
/*************************************************
Function:		LogRecoveryLight
Description:	日志行恢复背景色
Input:			无			
Output:			无
return:			无				
*************************************************/
function LogRecoveryLight()
{
   var obj = this;
   if(g_iSeledLogTrObj == obj || obj.tagName != "TR")
   {
	 return;
   }
   obj.style.backgroundColor = g_strFormerBgColor;
}
/*************************************************
Function:		SelectLogTd
Description:	选中某行日志
Input:			无
Output:			无
return:			无
*************************************************/
function SelectLogTd(event)
{
   event = event?event:(window.event?window.event:null);
   var ObjTable = event.srcElement?event.srcElement:event.target;
   if(ObjTable.tagName == "TD")
   {
      while(ObjTable.tagName != "TR")
	  {
		  ObjTable = ObjTable.parentNode;
	  }
   }
   if(g_iSeledLogTrObj == ObjTable)
   {
    	return;   
   }
   if(null != g_iSeledLogTrObj)
   {
		if((g_iSeledLogTrObj.rowIndex % 2) != 0)
	    {
		    g_iSeledLogTrObj.style.backgroundColor = "#f6f6f6"; 
	    }
	    else
	    {
		    g_iSeledLogTrObj.style.backgroundColor = "#ebebeb";//ObjTable.bgColor="#f5f5f5" ;
	    }
	    g_iSeledLogTrObj.style.color = "#39414A";
   } 
   ObjTable.style.backgroundColor = '#762727';
   ObjTable.style.color = '#ffffff';
   g_iSeledLogTrObj = ObjTable;
}

/*************************************************
Function:		LogSearch
Description:	搜索日志文件
Input:			无			
Output:			无
return:			无				
*************************************************/
function LogSearch()
{
	if(g_bIsSearching)
	{
		return;
	}
	m_bFirst = true;
	m_strLogList = "";
	var RowNum = document.getElementById("LogTableList").rows.length;
    for(var i = 1; i < RowNum; i++)
    {
		document.getElementById("LogTableList").deleteRow(1);
    }
	m_iLogNum = 0;
		
    iMajorType = document.getElementById("MajorType").value;
	iMinorType = document.getElementById("MinorType").value;
    
    szStarTime = document.getElementById("begintime").value;
    szStopTime = document.getElementById("endtime").value;
    
	beginDate = szStarTime.split(" ")[0];
	endDate = szStopTime.split(" ")[0];
	beginDate = beginDate.replace(/-/g,"/"); 
	endDate = endDate.replace(/-/g,"/"); 
	if(Date.parse(endDate)-Date.parse(beginDate) == 0)
	{
		beginDate = szStarTime.split(" ")[1];
		endDate = szStopTime.split(" ")[1];
		beginTimes = beginDate.split(":");
		endTimes = endDate.split(":");
		if((beginTimes[0]*3600+beginTimes[1]*60+beginTimes[2]*1) > (endTimes[0]*3600+endTimes[1]*60+endTimes[2]*1))
		{
			alert(parent.translator.translateNode(g_lxdLog, 'jsTimeSegmentErrorTips'));
			return;
		}
	}
	else if(Date.parse(endDate)-Date.parse(beginDate) < 0)
	{
		alert(parent.translator.translateNode(g_lxdLog, 'jsTimeSegmentErrorTips'));
		return;
	}

	m_LogSearchFinish = false;
	id = new UUID();
	g_bIsSearching = true;
	GetLogList(0);
}
/*************************************************
Function:		GetLogList
Description:	获取日志信息插入列表
Input:			iType: 搜索类型，首次或者非首次			
Output:			无
return:			无				
*************************************************/
function GetLogList(iType)
{
	$("#logpage").css("text-align", "left");
	$("#logpage").html(parent.translator.translateNode(g_lxdLog, 'SearchingTips'));
	var xmlDoc = new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	
	Root = xmlDoc.createElement('CMSearchDescription');
	
	searchID = xmlDoc.createElement('searchID');
	text = xmlDoc.createTextNode(id);
	searchID.appendChild(text);
	Root.appendChild(searchID);
	
	metaID = xmlDoc.createElement('metaId');
	if(iMajorType == 'All')
	{
		SearchMetaId = "log.hikvision.com";
	}
	else if(iMinorType == 'All')
	{
		SearchMetaId = "log.hikvision.com/" + iMajorType;
	}
	else
	{
		SearchMetaId = "log.hikvision.com/" + iMajorType + "/" + iMinorType;
	}
	text = xmlDoc.createTextNode(SearchMetaId);
	metaID.appendChild(text);
	Root.appendChild(metaID);
	
	timeSpanList = xmlDoc.createElement('timeSpanList');
	timeSpan = xmlDoc.createElement('timeSpan');
	
	startTime = xmlDoc.createElement('startTime');
	text = xmlDoc.createTextNode(szStarTime.replace(' ', 'T') + 'Z');
	startTime.appendChild(text);
	timeSpan.appendChild(startTime);
	
	endTime = xmlDoc.createElement('endTime');
	text = xmlDoc.createTextNode(szStopTime.replace(' ', 'T') + 'Z');
	endTime.appendChild(text);
	timeSpan.appendChild(endTime);
	
	timeSpanList.appendChild(timeSpan);
	Root.appendChild(timeSpanList);
	
	maxResults = xmlDoc.createElement('maxResults');
	text = xmlDoc.createTextNode("200");
	maxResults.appendChild(text);
	Root.appendChild(maxResults);
	
	if(iType == 1)
	{
		searchResultsPosition = xmlDoc.createElement('searchResultPostion');
		text = xmlDoc.createTextNode(m_iLogNum);
		searchResultsPosition.appendChild(text);
		Root.appendChild(searchResultsPosition);
	}	
	xmlDoc.appendChild(Root);
	
	$.ajax(
	{
		type: "POST",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/ContentMgmt/logSearch",
		async: true,
		timeout: 15000,
		processData: false,
		data: xmlDoc,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr, textStatus)
		{
			if(xhr.status == 403)
			{
				document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + "0" +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
				$("#logpage").css("text-align", "right");
				g_bIsSearching = false;
				alert(parent.translator.translateNode(g_lxdLog, 'jsNoOperationRight'));
			}
			else if(xhr.status == 200)
			{
				var xmlDoc = xhr.responseXML;
				if("true" == $(xmlDoc).find('responseStatus').eq(0).text())
				{
					//插入日志信息至列表
					var len = parseInt($(xmlDoc).find('numOfMatches').eq(0).text(), 10);
					for(var i = 0; i < len; i++)
					{
						var oOneMatchElement = $(xmlDoc).find('searchMatchItem').eq(i);
						m_szMajorType[m_iLogNum + i] = oOneMatchElement.find('metaId').eq(0).text().split('/')[1];
						m_szMinorType[m_iLogNum + i] = oOneMatchElement.find('metaId').eq(0).text().split('/')[2];
						m_szLogTime[m_iLogNum + i] = oOneMatchElement.find('StartDateTime').eq(0).text().replace('T', ' ').replace('Z', ' ');
						if(oOneMatchElement.find('metaId').eq(0).text().split('/')[3] == undefined)
						{
							m_szChannelId[m_iLogNum + i] = '';
						}
						else
						{
							m_szChannelId[m_iLogNum + i] = oOneMatchElement.find('metaId').eq(0).text().split('/')[3];
							if(oOneMatchElement.find('localId').length > 0)
							{
								m_szChannelId[m_iLogNum + i] = oOneMatchElement.find('localId').eq(0).text();
							}
						}
						//获取IPv6地址或IPv4地址
						if($(xmlDoc).find('searchMatchItem').eq(i).find('ipAddress').length > 0)
						{
							m_szRemoteAddress[m_iLogNum + i] = oOneMatchElement.find('ipAddress').eq(0).text();
						}
						else
						{
							m_szRemoteAddress[m_iLogNum + i] = oOneMatchElement.find('ipv6Address').eq(0).text();
						}
						
						m_szUserName[m_iLogNum + i] = oOneMatchElement.find('userName').eq(0).text();
					}
					m_iLogNum += len;//用于记录总条数
					if("MORE" == $(xmlDoc).find('responseStatusStrg').eq(0).text())
					{
						//还有更多的日志信息，需继续查询（需添加searchResultsPosition节点）
						GetLogList(1);
						
						if(m_bFirst && m_iLogNum >= m_iPerLogNum)
						{
							m_iNowPage = 1 ;
							for(var m = 0 ; m < m_iPerLogNum ; m ++)
							{
								InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);  
							}
							m_iCurLogNumber = m_iPerLogNum; 
							m_bFirst = false;
						}
					}
					else
					{
						m_iHaveLogNumber = m_iLogNum;
						if(m_iLogNum % m_iPerLogNum ==0 )
						{
							 m_iHavePage = parseInt(m_iLogNum/m_iPerLogNum);
						}
						else
						{ 
							 m_iHavePage = parseInt(m_iLogNum/m_iPerLogNum)+1;
						}
						if(m_bFirst)
						{
							m_iNowPage = 1 ;
							if(m_iLogNum > m_iPerLogNum)
							{
								for(var m = 0 ; m < m_iPerLogNum ; m ++)
								{
									InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);  
								}
								m_iCurLogNumber = m_iPerLogNum; 
							}
							else
							{
								for(var m = 0 ; m < m_iLogNum ; m ++)
								{
									InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);  
								}
								m_iCurLogNumber = m_iLogNum; 
							}
							m_bFirst = false;
						}
						if(m_iLogNum > 0)
						{
							document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
						}
						else
						{
							document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + "0" +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
						}
						$("#logpage").css("text-align", "right");
						g_bIsSearching = false;
						setTimeout( function () {
							alert(parent.translator.translateNode(g_lxdLog, 'szTips1'));
							m_LogSearchFinish = true;
							}, 1);
					}
				}
			}
			else
			{
				document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + "0" +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
				$("#logpage").css("text-align", "right");
				g_bIsSearching = false;
				alert(parent.translator.translateNode(g_lxdLog, 'szTips3'));
			}
		}
	});
}
/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无				
*************************************************/
function ChangeLanguage(lan)
{
	g_lxdLog = parent.translator.getLanguageXmlDoc("Log", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdLog, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdLog, document);
	
	window.parent.document.title = parent.translator.translateNode(g_lxdLog, 'title');
	m_szExit = parent.translator.translateNode(g_lxdLog, 'exit');
	if($("#MinorType").val() != null)
	{
	    m_iMinorType = $("#MinorType").val();
	}
	if($("#MajorType").val() != null)
	{
	    changeMajorType($("#MajorType").val(),1);
	}
	else
	{
		changeMajorType('All',1);
	}
	if(m_iLogNum > 0 && m_bFirst == false)//改变语言时改变日志信息及翻页信息
	{
		DeleteLog();
		if(m_iLogNum < m_iPerLogNum)
		{
			for(var m = 0; m < m_iLogNum ; m ++)
			{
				InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);  
			}
		}
		else
		{
			if(m_iNowPage == m_iHavePage)
			{
				for(var m = m_iPerLogNum*(m_iNowPage-1) ; m < m_iLogNum ; m ++)
				{
					InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);
				}
			}
			else
			{
				 for(var m = m_iPerLogNum*(m_iNowPage-1) ; m < m_iPerLogNum*m_iNowPage ; m ++)
				 {
					 InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]); 
				 }
			}
		}
		document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
	}
	else
	{
		document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog,'TotalTips') + "0" +  parent.translator.translateNode(g_lxdLog,'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + parent.translator.translateNode(g_lxdLog,'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + getNodeValue('jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;'  >" + parent.translator.translateNode(g_lxdLog,'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + parent.translator.translateNode(g_lxdLog,'jsLastPageTips') + "</span>&nbsp;&nbsp;";
	}
}
/*************************************************
Function:		changeMajorType
Description:	改变主类型时动态添加次类型
Input:			strType:主类型 iMode:0 页面切换 1:脚本调用
Output:			无
return:			无				
*************************************************/
function changeMajorType(strType, iMode)
{
	document.getElementById('MinorType').options.length = 0;
	if(strType == 'All')
	{
		$("<option value='All'>" + parent.translator.translateNode(g_lxdLog, 'MajorTypeOpt1') + "</option>").appendTo("#MinorType");
	}
	else if(strType == 'Alarm')
	{
		for(var i = 1; i < 8; i++)
		{
			$("<option value='"+ parent.translator.translateNode(g_lxdLog, 'MinorTypeAlarmOpt' + i).split(':')[0] +"'>" + parent.translator.translateNode(g_lxdLog, 'MinorTypeAlarmOpt' + i).split(':')[1] + "</option>").appendTo("#MinorType");
		}
		$("<option value='pirStart' name='pirStart'>"+getNodeValue("pirStart")+"</option>").appendTo("#MinorType");
		$("<option value='pirStop' name='pirStop'>"+getNodeValue("pirStop")+"</option>").appendTo("#MinorType");
		$("<option value='wlsensorStart' name='wlsensorStart'>"+getNodeValue("wlsensorStart")+"</option>").appendTo("#MinorType");
		$("<option value='wlsensorStop' name='wlsensorStop'>"+getNodeValue("wlsensorStop")+"</option>").appendTo("#MinorType");
		$("<option value='callhelpStart' name='callhelpStart'>"+getNodeValue("callhelpStart")+"</option>").appendTo("#MinorType");
		$("<option value='callhelpStop' name='callhelpStop'>"+getNodeValue("callhelpStop")+"</option>").appendTo("#MinorType");
	}
	else if(strType == 'Exception')
	{
		for(var i = 1; i < 14; i++)
		{
			$("<option value='"+ parent.translator.translateNode(g_lxdLog, 'MinorTypeExpOpt' + i).split(':')[0] +"'>" + parent.translator.translateNode(g_lxdLog, 'MinorTypeExpOpt' + i).split(':')[1] + "</option>").appendTo("#MinorType");
		}
	}
	else if(strType == 'Infomation')
	{
		for(var i = 1; i < 10; i++)
		{
			$("<option value='"+ parent.translator.translateNode(g_lxdLog, 'MinorTypeInforOpt' + i).split(':')[0] +"'>" + parent.translator.translateNode(g_lxdLog, 'MinorTypeInforOpt' + i).split(':')[1] + "</option>").appendTo("#MinorType");
		}
	}
	else if(strType == 'Operation')
	{
		for(var i = 1; i < 41; i++)
		{

			var strTemp = parent.translator.translateNode(g_lxdLog, 'MinorTypeOperationOpt' + i);
			$("<option value='"+ strTemp.split(':')[0] +"'>" + strTemp.substr(strTemp.split(':')[0].length + 1) + "</option>").appendTo("#MinorType");
		}
	}
	if(iMode == 1)
	{
	    setTimeout(function(){$("#MinorType").val(m_iMinorType);},1);
	}
}
/*************************************************
Function:		NextPage
Description:	List下一页
Input:			无			
Output:			无
return:			无				
*************************************************/
function NextPage()
{
    if(m_iNowPage == m_iHavePage)
    {
        return;
    }
    DeleteLog();
    m_iNowPage ++ ; 
    if(m_iNowPage == m_iHavePage)
    {
        m_iCurLogNumber = m_iLogNum - m_iPerLogNum*(m_iNowPage - 1) ;
	    for(var m = m_iPerLogNum*(m_iNowPage-1) ; m < m_iLogNum ; m ++)
        {
	        InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);
	    }
    }
    else
    {
         m_iCurLogNumber = m_iPerLogNum ;
	     for(var m = m_iPerLogNum*(m_iNowPage-1) ; m < m_iPerLogNum*m_iNowPage ; m ++)
	     {
		      InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]); 
	     }
    }
  	document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		LastPage
Description:	List上一页
Input:			无			
Output:			无
return:			无				
*************************************************/
function LastPage()
{
    if(m_iNowPage == 1)
    {
        return ;
    }
    DeleteLog();
    m_iNowPage -- ; 
    for(var m = m_iPerLogNum*(m_iNowPage-1) ; m < m_iPerLogNum*m_iNowPage ; m ++)
    {
	    InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]);   
    }
    m_iCurLogNumber = m_iPerLogNum ;
  	document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		FirstPage
Description:	List首页
Input:			无			
Output:			无
return:			无				
*************************************************/
function FirstPage()
{
	if(m_iNowPage == 1)
	{
		return ;
	}
	DeleteLog();
	m_iNowPage = 1 ; 
	for(var m = 0 ; m < m_iPerLogNum ; m ++)
	{
		InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]); 
	}
	m_iCurLogNumber = m_iPerLogNum; 
  	document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		AfterPage
Description:	List末页
Input:			无			
Output:			无
return:			无				
*************************************************/
function AfterPage()
{
    if(m_iNowPage == m_iHavePage)
    {
       return ;
    }
    DeleteLog();
    m_iNowPage = m_iHavePage ; 
    for(var m = (m_iHavePage-1)*m_iPerLogNum ; m < m_iLogNum ; m ++)
    {
	     InsertLogList((m+1), m_szLogTime[m], m_szMajorType[m], m_szMinorType[m], m_szChannelId[m], m_szUserName[m],m_szRemoteAddress[m]); 
    }
    m_iCurLogNumber = m_iLogNum - (m_iHavePage-1)*m_iPerLogNum ;
  
  	document.getElementById("logpage").innerHTML = parent.translator.translateNode(g_lxdLog, 'TotalTips') + m_iLogNum +  parent.translator.translateNode(g_lxdLog, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>" + parent.translator.translateNode(g_lxdLog, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		DeleteLog
Description:	删除List中的所有日志条目
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteLog()
{
    if(m_iCurLogNumber == 0)
	{
	    return;
    }
	for(var i = 0; i < m_iCurLogNumber; i++)
    {
	    document.getElementById("LogTableList").deleteRow(1);
	}
}
/*************************************************
Function:		exportLog
Description:	导出日志
Input:			无			
Output:			无
return:			无				
*************************************************/
function exportLog()
{
	if (!m_LogSearchFinish)
	{ // 日志还未查询完全
		return;
	}
	
	m_strLogList = CreateLogListXmlDoc();
	if(m_strLogList === "")
	{
		return;
	}
	var szInfo = parent.translator.translateNode(g_lxdLog, 'laPlugin');
	if(!checkPlugin('0', szInfo))
	{
		return;
	}
	m_PreviewOCX = document.getElementById("PreviewActiveX");
	$("#PreviewActiveX").css('width','1');
	$("#PreviewActiveX").css('height','0');
	$("#spExportLog").prop("disabled", true);
	if(m_PreviewOCX.HWP_ExportDeviceLog(m_strLogList, '', 0) < 0)
	{
		alert(parent.translator.translateNode(g_lxdLog, 'ExportFailedTips'));
		$("#spExportLog").prop("disabled", false);
		return;
	}
	$("#spExportLog").prop("disabled", false);
}
/*************************************************
Function:		CreateLogListXmlDoc
Description:	将搜索出的所有日志转换成xml文档
Input:			无			
Output:			无
return:			无				
*************************************************/
function CreateLogListXmlDoc()
{
    if(m_iLogNum <= 0)
	{
		return "";
	}
	var xmlDoc = new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	
	var Root = xmlDoc.createElement("CMSearchResult");
	
	var Element = null,
		text = null;
	Element = xmlDoc.createElement("laLogTime");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laLogTime'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("laLogMajorType");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laLogMajorType'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("laLogMinorType");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laLogMinorType'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("laLogChannel");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laChannelNo'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("laLogRemoteUser");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laLogRemoteUser'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("laLogRemoteIP");
	text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, 'laLogRemoteIP'));
	Element.appendChild(text);	
	Root.appendChild(Element);
	
	matchList = xmlDoc.createElement("matchList");
	
	for(var i = 0; i < m_iLogNum; i++)
	{
		searchMatchItem = xmlDoc.createElement("searchMatchItem");
		
		Element = xmlDoc.createElement("LogTime");
	    text = xmlDoc.createTextNode(m_szLogTime[i]);
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		Element = xmlDoc.createElement("MajorType");
	    text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, m_szMajorType[i]));
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		Element = xmlDoc.createElement("MinorType");
	    text = xmlDoc.createTextNode(parent.translator.translateNode(g_lxdLog, m_szMinorType[i]));
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		Element = xmlDoc.createElement("ChannelId");
	    text = xmlDoc.createTextNode(m_szChannelId[i]);
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		Element = xmlDoc.createElement("UserName");
	    text = xmlDoc.createTextNode(m_szUserName[i]);
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		Element = xmlDoc.createElement("RemoteAddress");
	    text = xmlDoc.createTextNode(m_szRemoteAddress[i]);
	    Element.appendChild(text);	
	    searchMatchItem.appendChild(Element);
		
		matchList.appendChild(searchMatchItem);
	}
	Root.appendChild(matchList);
	xmlDoc.appendChild(Root);
	
	return xmlToStr(xmlDoc);
}