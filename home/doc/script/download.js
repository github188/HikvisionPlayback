document.charset = "utf-8";
var m_szBrowser = navigator.appName; //获取浏览器名称码

var m_bDownloadPos = 0;      //判断是否已经开始下载
var m_iCurFileNumber = 0;   //搜索文件总数
var m_bOpen = 0 ;            //是否开启下载回放文件页面
var m_szNewName = "";       //选中要下载的文件名
var ClockTime = "";    //下载时开启时钟，不停的改变下载状态
var m_iSelectFile = -1;   //选中的文件序号
var m_iNowDown = 0;    //正在下载的文件序号	
var m_szTableFileName = new Array();   //单元格中回放文件名
var m_iCurFileNumber = 0;  //搜索文件当前页记录数
var m_iHaveFileNumber = 0;  //搜索文件总数
var m_iHavePage = 0; //搜索记录共有几页
var m_iNowPage = 1; //搜索记录当前页
var m_iSelectedNum = 1; //选中的记录条数
var m_iDownNum = 1; //下载文件的记录序号数
var m_iPerNum = 20; //下载文件的记录分页每页显示条数
var m_szStartDown = "下&nbsp;载";
var m_szStopDown = "停&nbsp;止";

var m_PreviewOCX = null;
var m_iDownloadID = -1; //下载ID
var m_oParent = null;
var m_oXmlDoc = null;

var g_lxdDownload = null;
var g_transStack = null;

/*************************************************
Function:		InitDownload
Description:	初始化下载
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitDownload()
{
    //$.cookie('userInfo' + m_lHttpPort, "YWRtaW46MTIzNDU=");
    m_oParent = window.opener;
    if ($.cookie('userInfo' + m_lHttpPort) == null || m_oParent == undefined)
	{
		window.close();
		return;
	}
	
	g_transStack = new TransStack();
    ChangeLan("en");
	var szInfo = translator.translateNode(g_lxdDownload, 'laPlugin');
	if(!checkPlugin('0', szInfo))
	{
		return;
	}
	m_PreviewOCX=document.getElementById("PreviewActiveX");
	
	FileLoad();
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
	if(m_iNowPage == m_iHavePage  || m_iDownloadID >= 0)
	{
	 	return;
	}
	DeleteFile();
	m_iNowPage ++ ; 
	if(m_iNowPage == m_iHavePage)
	{
		m_iCurFileNumber = m_iHaveFileNumber - m_iPerNum*(m_iNowPage - 1) ;
		for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iHaveFileNumber ; m ++)
		{
			InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]); 
		}
	}
	else
	{
		m_iCurFileNumber = m_iPerNum ;
		for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iPerNum*m_iNowPage ; m ++)
		{
			InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]);
		}
	}
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	$("#all").prop("checked",false);
	document.getElementById("Page").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(m_iNowPage == 1  || m_iDownloadID >= 0)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage -- ; 
	for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iPerNum*m_iNowPage ; m ++)
	{
		InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]);  
	}
	m_iCurFileNumber = m_iPerNum ;
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	$("#all").prop("checked",false);
	document.getElementById("Page").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(m_iNowPage == 1  || m_iDownloadID >= 0)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage = 1 ; 
	for(var m = 0 ; m < m_iPerNum ; m ++)
	{
		InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]); 
	}
	m_iCurFileNumber = m_iPerNum; 
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	$("#all").prop("checked",false);
	document.getElementById("Page").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(m_iNowPage == m_iHavePage || m_iDownloadID >= 0)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage = m_iHavePage ; 
	for(var m = (m_iHavePage-1)*m_iPerNum ; m < m_iHaveFileNumber ; m ++)
	{
		InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]);  
	}
	m_iCurFileNumber = m_iHaveFileNumber - (m_iHavePage-1)*m_iPerNum ;
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	$("#all").prop("checked",false);
	document.getElementById("Page").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		FileLoad
Description:	搜索回放文件列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function FileLoad()
{
    DeleteFile();
	
    var j = m_oParent.m_szStartTimeSet.length;//获取item节点个数
    var k = 0;  //文件序号
	m_iHaveFileNumber = j;
	k = j;
    m_szNewName = "";
	if(k % m_iPerNum ==0 )
   {
		m_iHavePage = parseInt(k/m_iPerNum);
   }
   else
   { 
		m_iHavePage = parseInt(k/m_iPerNum)+1;
   }
   m_iNowPage = 1 ; 
   if(k > m_iPerNum)
   {
	 
		for(var m = 0 ; m < m_iPerNum ; m ++)
	    {
			InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]);  
	    }
	    m_iCurFileNumber = m_iPerNum; 
   }
   else
   {
 		for(var m = 0 ; m < k ; m ++)
		{
		     InsertFile(m + 1,m_oParent.m_szFileNameSet[m],m_oParent.m_szStartTimeSet[m],m_oParent.m_szEndTimeSet[m],m_oParent.m_szFileSizeSet[m]);
		}
		m_iCurFileNumber = k; 
   }
   document.getElementById("Page").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
}
/*************************************************
Function:		InsertFile
Description:	插入文件条目信息到List中
Input:			a : 文件序号	
                b : 文件名
				c : 开始时间
				d : 结束时间
				e : 文件大小			
Output:			无
return:			无				
*************************************************/
function InsertFile(a,b,c,d,e)
{
	var f = parseInt(e/1048576);
	var ObjTr;
	var ObjTd;
	ObjTr = document.getElementById("FileTable").insertRow(document.getElementById("FileTable").rows.length);
	ObjTr.style.height=16;
	ObjTr.style.color="#000000";
	ObjTr.style.cursor="pointer";
	ObjTr.align = "center";
	ObjTr.id = "fileTr"+a;
	$(ObjTr).bind('click', {iIndex:a}, function(event)
	{
		var i = parseInt(event.data.iIndex);
	    SelectFile(i);
	});
	
	for(j = 0;j < document.getElementById("FileTable").rows[0].cells.length;j++) 
	{  
		ObjTd = ObjTr.insertCell(j); 
		ObjTd.style.color="#000000"; 
		ObjTd.align = "center";  
		if((a%2)==0)
		{
			ObjTd.bgColor="#F5F5F5" ;
		}
		else
		{
			ObjTd.bgColor="#D2D2D2" ;
		} 
		switch(j) 
		{
			case 0:
				ObjTd.innerHTML = "<div><input name='box"+a+"' id='box"+a+"' type='checkbox' value='0' onClick='CheckAll()'></div>";
				ObjTd.id = "testoo"+a;
				ObjTd.width = "40";
				break;
			case 1:
				ObjTd.innerHTML = a;
				ObjTd.id = "testo"+a;
				ObjTd.width = "40";
				break;
			case 2:
				ObjTd.innerHTML = b;
				ObjTd.id = "test"+a;
				ObjTd.width = "140";
				break;				   
			case 3:	               
				ObjTd.innerHTML = c;
				ObjTd.id = "tes"+a;
				ObjTd.width = "140";
				break;
			case 4:
				ObjTd.innerHTML = d;
				ObjTd.id = "te"+a;
				ObjTd.width = "140";
				break;		
			case 5:
			   if(f==0)
			   {
					ObjTd.innerHTML = "1 MB";
					ObjTd.id = "t"+a;
					 ObjTd.width = "90";
					break;
			   }
			   else
			   {
					ObjTd.innerHTML = f+" MB";
					ObjTd.id = "t"+a;
					ObjTd.width = "90";
					break;
			   }
			case 6:
			   ObjTd.id = "downProcess"+a; 	 
			   break;
			default:
			   break; 		
	   }
	}  
	m_szTableFileName[a-1]=b;
}
/*************************************************
Function:		CheckAll
Description:	勾选其中一个checkbox后判断是否已经全选
Input:			无			
Output:			无
return:			无				
*************************************************/
function CheckAll()
{
	var iHaveSelect = 0; //已经选中的checkbox数目
	for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber);i++)
    { 
	   	if($("#box"+(i+1)).prop("checked"))
	   	{
			iHaveSelect ++;
	   	} 
   	}
	if(iHaveSelect == m_iCurFileNumber)
	{
		$("#all").prop("checked", true);
	}
	else
	{
		$("#all").prop("checked", false);
	}
}
/*************************************************
Function:		SelectFile
Description:	选中某个回放文件
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectFile(iIndex)
{  
	if(m_bDownloadPos == 1)
   	{
       	return;
   	}
	if(m_iSelectFile == iIndex)
	{
		return;
	}
	var oSelObj = document.getElementById("fileTr"+iIndex);
	for(j = 0;j < oSelObj.cells.length;j++) 
    {
		oSelObj.cells[j].style.color = "#ffffff";
		oSelObj.cells[j].style.backgroundColor = "#2882E2";
	}
	if(m_iSelectFile != -1)
	{
		oSelObj = document.getElementById("fileTr"+m_iSelectFile);;
		if(m_iSelectFile%2 == 0)
		{
			for(i = 0;i < oSelObj.cells.length;i++) 
			{
				oSelObj.cells[i].style.color = "#000000";
				oSelObj.cells[i].style.backgroundColor = "#F5F5F5";
			}
		}
		else
		{
			for(i = 0;i < oSelObj.cells.length;i++) 
			{
				oSelObj.cells[i].style.color = "#000000";
				oSelObj.cells[i].style.backgroundColor = "#D2D2D2";
			}
		}
	}
	m_iSelectFile = iIndex;	
	m_szNewName = m_szTableFileName[i-1];
	//CheckAll();
}
/*************************************************
Function:		DeleteFile
Description:	删除List中的所有文件条目
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteFile()
{
    if(m_iCurFileNumber == 0)
	{
	    return;
    }
	for(var i = 0; i < m_iCurFileNumber; i++)
    {
	    m_szTableFileName[i] = "";
	    document.getElementById("FileTable").deleteRow(1);
	}
}
/*************************************************
Function:		DownLoadFile
Description:	下载选中回放文件列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function DownLoadFile()
{
	Tips1 = translator.translateNode(g_lxdDownload, "jsTips1");
	Tips2 = translator.translateNode(g_lxdDownload, "jsTips2");
	var iSelectFile = 0; //是否有选中文件
	var iFailNum = 0;    //文件下载失败的数量
	if(m_iDownloadID >= 0)
	{
		Warning=confirm(Tips1);
		if(Warning)
		{
			if(0 == m_PreviewOCX.HWP_StopDownload(m_iDownloadID))
			{
				m_iDownloadID = -1;
				for(var k = (m_iNowPage - 1)*m_iPerNum; k< ((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber);k++)
				{ 
					$("#box"+(k+1)).prop("disabled",false);
				}
				$("#all").prop("disabled",false);
				clearInterval(ClockTime);
				$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
			}
			return ;
		}
		else
		{
			return;
		}
	}
	for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber);i++)
	{ 
		if($("#box"+(i+1)).prop("checked"))
		{
			m_iNowDown = i;
			var szDownXml = '<?xml version="1.0"?><downloadRequest version="1.0" xmlns="http://urn:selfextension:psiaext-ver10-xsd"><playbackURI>rtsp://'+m_oParent.m_szHostName+'/Streaming/tracks/101?starttime='+m_oParent.m_szStartTimeSet[m_iNowDown].replace(" ", "T")+'Z&amp;endtime='+m_oParent.m_szEndTimeSet[m_iNowDown].replace(" ", "T")+'Z&amp;name='+m_oParent.m_szFileNameSet[m_iNowDown]+'&amp;size='+m_oParent.m_szFileSizeSet[m_iNowDown]+'</playbackURI></downloadRequest>';
			
			m_iDownloadID = m_PreviewOCX.HWP_StartDownload(m_oParent.m_lHttp+m_oParent.m_szHostName+":"+m_oParent.m_lHttpPort+"/PSIA/Custom/SelfExt/ContentMgmt/download", m_oParent.m_szUserPwdValue, m_oParent.m_szFileNameSet[m_iNowDown], szDownXml);
			
			if(m_iDownloadID < 0)
			{
				var iErrorValue =  m_PreviewOCX.HWP_GetLastError();
				iSelectFile++;
				iFailNum++;
				if(34 == iErrorValue)
				{ // 多浏览器待测，wuyang
					var cbFunc = function() { $("#downProcess"+(arguments.callee.i+1)).html(translator.translateNode(g_lxdDownload, "Downloaded")); };
					cbFunc.i = i;
					g_transStack.push(cbFunc, true);
				}
				else if(33 == iErrorValue)
				{
					var cbFunc = function() { $("#downProcess"+(arguments.callee.i+1)).html(translator.translateNode(g_lxdDownload, "FreeSpaceTips")); };
					cbFunc.i = i;
					g_transStack.push(cbFunc, true);
				}
				else
				{
					var cbFunc = function() { $("#downProcess"+(arguments.callee.i+1)).html(translator.translateNode(g_lxdDownload, "jsDownloadFailed")); };
					cbFunc.i = i;
					g_transStack.push(cbFunc, true);
				}
				continue;
			}   
			//DownTiao();
			if(ClockTime)
			{
				clearInterval(ClockTime);
				ClockTime = 0;
			}
			ClockTime = setInterval("DownProcess()", 1000);
			iSelectFile++;
			//alert(m_szTableFileName[i])
			$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "stop"));
			break ;
		} 
	}
	if(iSelectFile == 0)
	{
		alert(Tips2);
		return ;
	}
	if(iSelectFile == iFailNum)
	{
		return;
	}
	for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber);j++)
	{ 
		$("#box"+(j+1)).prop("disabled",true);
	}
	$("#all").prop("disabled",true);
}
/*************************************************
Function:		SelectAllFile
Description:	选中所有回放文件
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectAllFile()
{
	if($("#all").prop("checked"))
	{	
	    for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber); i ++)
    	{
			$("#box"+(i+1)).prop("checked", true);
    	}
	}
	else
	{
	    for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber); i ++)
    	{
			$("#box"+(i+1)).prop("checked", false);
    	}
	}
}

/*************************************************
Function:		DownProcess
Description:	下载进度
Input:			无			
Output:			无
return:			无				
*************************************************/
function DownProcess()
{
	if(m_iDownloadID < 0)
	{
		return;
	}
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	var iStatus = m_PreviewOCX.HWP_GetDownloadStatus(m_iDownloadID);
	if(iStatus == 0)
	{
		var iProcess = m_PreviewOCX.HWP_GetDownloadProgress(m_iDownloadID);
		if(iProcess < 0)
		{
			clearInterval(ClockTime);
			ClockTime = 0;
			//alert(translator.translateNode(g_lxdDownload, 'tipsGetProgress'));
			return;
		}
		else if(iProcess < 100)
		{
			$("#downProcess"+(m_iNowDown+1)).html(iProcess + "%");
			/*$("#upgradeProcess").width(parseInt(iProcess * $("#ServerUping").width() / 100));*/
		}
		else
		{
			$("#downProcess"+(m_iNowDown+1)).html(translator.translateNode(g_lxdDownload, "Downloaded"));
			m_PreviewOCX.HWP_StopDownload(m_iDownloadID);
			m_iDownloadID = -1;
			clearInterval(ClockTime);
			ClockTime = 0;
			$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
			for(var i=m_iNowDown+1;i<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber);i++)
			{ 
				if($("#box"+(i+1)).prop("checked"))
				{
					m_iNowDown = i;
					var szDownXml = '<?xml version="1.0"?><downloadRequest version="1.0" xmlns="http://urn:selfextension:psiaext-ver10-xsd"><playbackURI>rtsp://'+m_oParent.m_szHostName+'/Streaming/tracks/101?starttime='+m_oParent.m_szStartTimeSet[m_iNowDown].replace(" ", "T")+'Z&amp;endtime='+m_oParent.m_szEndTimeSet[m_iNowDown].replace(" ", "T")+'Z&amp;name='+m_oParent.m_szFileNameSet[m_iNowDown]+'&amp;size='+m_oParent.m_szFileSizeSet[m_iNowDown]+'</playbackURI></downloadRequest>'
		 
					m_iDownloadID = m_PreviewOCX.HWP_StartDownload(m_oParent.m_lHttp+m_oParent.m_szHostName+":"+m_oParent.m_lHttpPort+"/PSIA/Custom/SelfExt/ContentMgmt/download", m_oParent.m_szUserPwdValue, m_oParent.m_szFileNameSet[m_iNowDown], szDownXml);
					
					if(m_iDownloadID < 0)
					{
						var iErrorValue =  m_PreviewOCX.HWP_GetLastError();
						continue;
					}   
					if(ClockTime)
					{
						clearInterval(ClockTime);
						ClockTime = 0;
					}
					ClockTime = setInterval("DownProcess()", 1000);
					$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "stop"));
					return;
				} 
			}
			for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber); j++)
    		{
				$("#box"+(j+1)).prop("disabled",false);
			}
			$("#all").prop("disabled",false);
			$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
		}
	}
	else
	{
		clearInterval(ClockTime);
		m_PreviewOCX.HWP_StopDownload(m_iDownloadID);
		m_iDownloadID = -1;
		$("#downProcess"+(m_iNowDown+1)).html(translator.translateNode(g_lxdDownload, "jsDownloadFailed"));
		//alert(translator.translateNode(g_lxdDownload, 'tipsGetStatus'));
		for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurFileNumber); j++)
		{
			$("#box"+(j+1)).prop("disabled",false);
		}
		$("#all").prop("disabled",false);
		$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
		return;
	}
}

/*************************************************
Function:		ChangeLan
Description:	改变页面语言
Input:			无
Output:			无
return:			无
*************************************************/
function ChangeLan(lan)
{
    g_lxdDownload = translator.getLanguageXmlDoc("Download", lan);
    var lxd = translator.getLanguageXmlDoc("Main", lan);
    var _lxdMain = $(lxd).children("Common")[0];
    translator.appendLanguageXmlDoc(g_lxdDownload, _lxdMain);
    parent.translator.appendLanguageXmlDoc(g_lxdDownload, m_oParent.parent.g_lxdMain);
    translator.translatePage(g_lxdDownload, document);
    document.title = translator.translateNode(g_lxdDownload, "title");
    document.getElementById("Page").innerHTML = translator.translateNode(g_lxdDownload, "TotalTips") + m_iHaveFileNumber + translator.translateNode(g_lxdDownload, "TiaoTips") + "&nbsp;&nbsp;<span style='cursor:pointer;' onClick='FirstPage()'>" + translator.translateNode(g_lxdDownload, "jsFirstPageTips") + "</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='LastPage()'>" + translator.translateNode(g_lxdDownload, "jsPrevPageTips") + "</span>&nbsp;" + m_iNowPage + "/" + m_iHavePage + "&nbsp;<span style='cursor:pointer;' onClick='NextPage()'>" + translator.translateNode(g_lxdDownload, "jsNextPageTips") + "</span>&nbsp;&nbsp;<span style='cursor:pointer;' onClick='AfterPage()'>" + translator.translateNode(g_lxdDownload, "jsLastPageTips") + "</span>&nbsp;&nbsp;";
    g_transStack.translate();
	if(m_iDownloadID == -1)
	{
		$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
	}
	else
	{
		$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "stop"));
	}
}
/*************************************************
Function:		unLoadPage
Description:	关闭页面
Input:
Output:			无
return:			无
*************************************************/
function unLoadPage()
{
	if(m_iDownloadID < 0)
	{
		return;
	}
	else
	{
		m_PreviewOCX.HWP_StopDownload(m_iDownloadID);
		m_iDownloadID = -1;
		clearInterval(ClockTime);
		ClockTime = 0;
	}
}