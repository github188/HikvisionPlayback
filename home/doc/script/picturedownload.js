var m_dtStartSearchDate = "";   //开始搜索时间
var m_dtStopSearchDate = "";    //结束搜索时间
var m_szPictureFormat = ".jpg";  //图片的扩展名

var m_szPictureDateSet = new Array();  //图片日期集合
var m_szPictureSizeSet = new Array();   //图片大小集合
var m_szPictureNameSet = new Array();   //图片名字集合
var m_szURISet = new Array();
var m_szTableFileName = new Array();   //单元格中回放文件名


var m_bDownloadPos = 0;      //判断是否已经开始下载
var m_iNowDown = 0;    //正在下载的文件序号
var ClockTime = 0;  //下载时钟	

var m_iCurPictureNumber = 0;  //搜索文件当前页记录数
var m_iHavePictureNumber = 0;  //搜索文件总数
var m_iHavePage = 0; //搜索记录共有几页
var m_iNowPage = 1; //搜索记录当前页
var m_iSearchTimes = 0;
var m_bFirst = true;     

var m_iSelectFile = -1;  //选中的文件序号
var m_iPerNum = 100; //下载文件的记录分页每页显示条数
var m_iDownloadID = -1;

var g_lxdDownload = null;
var g_transStack = null;
/*************************************************
Function:		InitPictureDownload
Description:	初始化图片下载
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPictureDownload()
{
    m_szUserPwdValue = $.cookie('userInfo' + m_lHttpPort);
	if(m_szUserPwdValue == null)
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
Function:		PictureSearch
Description:	图片搜索
Input:			iType:搜索类型,1:非首次搜索	
Output:			无
return:			无				
*************************************************/
function PictureSearch(iType)
{	
	xmlDoc = new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
		
	Root = xmlDoc.createElement('CMSearchDescription');
		
	searchID = xmlDoc.createElement('searchID');
	text = xmlDoc.createTextNode(new UUID());
	searchID.appendChild(text);
	Root.appendChild(searchID);
		
	trackList = xmlDoc.createElement('trackIDList');
	track = xmlDoc.createElement('trackID');
	text = xmlDoc.createTextNode('120');
	track.appendChild(text);
	trackList.appendChild(track);
	Root.appendChild(trackList);
	var dtStartTime = "";
	var dtStopTime = "";

    szStarTime = document.getElementById("begintime").value;
   	szStopTime = document.getElementById("endtime").value;
	
	if(Date.parse(szStopTime.replace(/-/g,"/"))-Date.parse(szStarTime.replace(/-/g,"/")) < 0)
	{
		alert(translator.translateNode(g_lxdDownload, 'jsTimeSegmentErrorTips'));
		return;
	}
	
	szStarTime = szStarTime.replace(' ', 'T') + 'Z';
	szStopTime = szStopTime.replace(' ', 'T') + 'Z';
		
		
	timeSpanList = xmlDoc.createElement('timeSpanList');
	timeSpan = xmlDoc.createElement('timeSpan');
		
	startTime = xmlDoc.createElement('startTime');
	text = xmlDoc.createTextNode(szStarTime);
	startTime.appendChild(text);
	timeSpan.appendChild(startTime);
		
	endTime = xmlDoc.createElement('endTime');
	text = xmlDoc.createTextNode(szStopTime);
	endTime.appendChild(text);
	timeSpan.appendChild(endTime);
		
	timeSpanList.appendChild(timeSpan);
	Root.appendChild(timeSpanList);
	
	contentTypeList =  xmlDoc.createElement('contentTypeList');
	
	contentType = xmlDoc.createElement('contentType');
	text =  xmlDoc.createTextNode("metadata");
	contentType.appendChild(text);
	contentTypeList.appendChild(contentType);
	Root.appendChild(contentTypeList);
		
	maxResults = xmlDoc.createElement('maxResults');
	text = xmlDoc.createTextNode("40");
	maxResults.appendChild(text);
	Root.appendChild(maxResults);
		
	searchResultsPosition = xmlDoc.createElement('searchResultPostion');
	text = xmlDoc.createTextNode('0');
	searchResultsPosition.appendChild(text);
	Root.appendChild(searchResultsPosition);
		
	metadataList = xmlDoc.createElement('metadataList');
	metadataDescriptor = xmlDoc.createElement('metadataDescriptor');
	text = xmlDoc.createTextNode("//recordType.meta.hikvision.com/"+$("#PictureType").val());
	metadataDescriptor.appendChild(text);
	metadataList.appendChild(metadataDescriptor);
	Root.appendChild(metadataList);
		
	xmlDoc.appendChild(Root);
	m_oSearchXml = xmlDoc;
	
	if(1 == iType)
	{
		m_oSearchXml.documentElement.getElementsByTagName('searchResultPostion')[0].childNodes[0].nodeValue = 40 * m_iSearchTimes;
		xmlDoc = m_oSearchXml;
	}else
	{
		m_szPictureDateSet.length = 0;
    	m_szPictureSizeSet.length = 0;
    	m_szPictureNameSet.length = 0;
    	m_szURISet.length = 0;	
		var iRowNum = document.getElementById("PictureTableList").rows.length;
		for(var i = 1; i < iRowNum; i++)
    	{
			document.getElementById("PictureTableList").deleteRow(1);
   	    }
		m_iHavePictureNumber = 0;
		m_bFirst = true;
	}
	
	$("#PicturePage").css("text-align", "left");
	$("#PicturePage").html(translator.translateNode(g_lxdDownload, 'SearchingTips'));
	$("#DivxmlDoc").html(xmlDoc);
	$.ajax({
		type: "POST",
		url: m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/ContentMgmt/search/",
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
			if(403 == xhr.status)
			{
				m_iSearchTimes = 0;
				m_oSearchXml = null;
				g_transStack.push(function()
				{
					showTips('', translator.translateNode(g_lxdPlayback, 'jsNoOperationRight'));
				}, true);
			}
			else if(200 == xhr.status)
			{
				var xmlDoc = xhr.responseXML;
				var szResXml = xhr.responseText;
				
				if("MORE" == $(xmlDoc).find('responseStatusStrg').eq(0).text())
				{
					for(var i = 0; i < $(xmlDoc).find('searchMatchItem').length; i++)
					{
						var szPictureDate = $(xmlDoc).find('endTime').eq(i).text();
						m_szPictureDateSet.push((szPictureDate.replace('T', ' ')).replace('Z', ''));
						var szPlaybackURI = $(xmlDoc).find('playbackURI').eq(i).text();
						m_szURISet.push(szPlaybackURI);
						var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
						var szFileSize = szPlaybackURI.substring(szPlaybackURI.indexOf("size=") + 5, szPlaybackURI.length);
						m_szPictureNameSet.push(szFileName);
						m_szPictureSizeSet.push(szFileSize);
					}
					m_iSearchTimes++;
					m_szXmlStr = szResXml;
					PictureSearch(1);
					
					if(m_bFirst && m_szPictureNameSet.length >= m_iPerNum)
					{
						m_iNowPage = 1 ;
						for(var m = 0 ; m < m_iPerNum ; m ++)
						{
							InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]); 
						}
						m_iCurPictureNumber = m_iPerNum; 
						m_bFirst = false;
					}
				}
				else if("OK" == $(xmlDoc).find('responseStatusStrg').eq(0).text())
				{
					m_iSearchTimes = 0;
					m_oSearchXml = null;
					for(var i = 0; i < $(xmlDoc).find('searchMatchItem').length; i++)
					{
						var szPictureDate = $(xmlDoc).find('endTime').eq(i).text();
						m_szPictureDateSet.push((szPictureDate.replace('T', ' ')).replace('Z', ''));
						var szPlaybackURI = $(xmlDoc).find('playbackURI').eq(i).text();
						m_szURISet.push(szPlaybackURI);
						var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
						var szFileSize = szPlaybackURI.substring(szPlaybackURI.indexOf("size=") + 5, szPlaybackURI.length);
						m_szPictureNameSet.push(szFileName);
						m_szPictureSizeSet.push(szFileSize);
					}
					m_szXmlStr = szResXml;
					
					m_iHavePictureNumber = m_szPictureNameSet.length;
					
					if(m_iHavePictureNumber % m_iPerNum ==0 )
					{
						 m_iHavePage = parseInt(m_iHavePictureNumber/m_iPerNum);
					}
					else
					{ 
						 m_iHavePage = parseInt(m_iHavePictureNumber/m_iPerNum)+1;
					}
					
					if(m_bFirst)
					{
						m_iNowPage = 1 ;
						if(m_iHavePictureNumber > m_iPerNum)
						{
							for(var m = 0 ; m < m_iPerNum ; m ++)
							{
								InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]);  
							}
							m_iCurPictureNumber = m_iPerNum; 
						}
						else
						{
							for(var m = 0 ; m < m_iHavePictureNumber ; m ++)
							{
								InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]);  
							}
							m_iCurPictureNumber = m_iHavePictureNumber; 
						}
						m_bFirst = false;
					}
					
					if(m_szPictureNameSet.length > 0)
					{
						document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload, 'TotalTips') + m_iHavePictureNumber +  translator.translateNode(g_lxdDownload, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='FirstPage()'>" + translator.translateNode(g_lxdDownload, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='LastPage()'>" + translator.translateNode(g_lxdDownload, 'jsPrevPageTips') + "</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='NextPage()'>" + translator.translateNode(g_lxdDownload, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;' onClick='AfterPage()'>" + translator.translateNode(g_lxdDownload, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
					}else
					{
						document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload, 'TotalTips') + "0" +  translator.translateNode(g_lxdDownload, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
					}
					
					$("#PicturePage").css("text-align", "right");
					$('#laPictureSearchTips').html('');
				    $('#divPictureSearchTips').hide();
				}
				else if("NO MATCHES" == xmlDoc.documentElement.getElementsByTagName('responseStatusStrg')[0].childNodes[0].nodeValue)
				{
					m_szXmlStr='';
					m_iSearchTimes = 0;
					m_oSearchXml = null;
					g_transStack.push(function()
					{
						showTips("", translator.translateNode(g_lxdDownload, 'jsNoPictureTip'));
					}, true);
					document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload, 'TotalTips') + "0" +  translator.translateNode(g_lxdDownload, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
				$("#PicturePage").css("text-align", "right");
				}
			}
			else
			{
				document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload, 'TotalTips') + "0" +  translator.translateNode(g_lxdDownload, 'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer; border-bottom:1px solid #000;'>" + translator.translateNode(g_lxdDownload, 'jsLastPageTips') + "</span>&nbsp;&nbsp;";
				$("#PicturePage").css("text-align", "right");
				
				m_iSearchTimes = 0;
				m_oSearchXml = null;
				m_szXmlStr = '';
				g_transStack.push(function()
				{
					showTips('', translator.translateNode(g_lxdDownload, 'szTips1'));
				}, true);
				return ;
			}
		}
	});
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
    if(m_iCurPictureNumber == 0)
	{
	    return;
    }
	for(var i = 0; i < m_iCurPictureNumber; i++)
    {
	    m_szTableFileName[i] = "";
	    document.getElementById("PictureTableList").deleteRow(1);
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
	if(m_iNowPage == m_iHavePage  || m_bDownloadPos == 1)
	{
	 	return;
	}
	DeleteFile();
	m_iNowPage ++ ; 
	if(m_iNowPage == m_iHavePage)
	{
		m_iCurPictureNumber = m_iHavePictureNumber - m_iPerNum*(m_iNowPage - 1) ;
		for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iHavePictureNumber ; m ++)
		{
			InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]); 
		}
	}
	else
	{
		m_iCurPictureNumber = m_iPerNum ;
		for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iPerNum*m_iNowPage ; m ++)
		{
			InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]); 
		}
	}
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	document.getElementById("SelectAll").checked = false;
	document.getElementById("PicturePage").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHavePictureNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(m_iNowPage == 1  || m_bDownloadPos == 1)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage -- ; 
	for(var m = m_iPerNum*(m_iNowPage-1) ; m < m_iPerNum*m_iNowPage ; m ++)
	{
		InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]); 
	}
	m_iCurPictureNumber = m_iPerNum ;
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	document.getElementById("SelectAll").checked = false;
	document.getElementById("PicturePage").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHavePictureNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(1 == m_iNowPage  || 1 == m_bDownloadPos)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage = 1 ; 
	for(var m = 0 ; m < m_iPerNum ; m ++)
	{
		InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]); 
	}
	m_iCurPictureNumber = m_iPerNum; 
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	document.getElementById("SelectAll").checked = false;
	document.getElementById("PicturePage").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHavePictureNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
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
	if(m_iNowPage == m_iHavePage || 1 == m_bDownloadPos)
	{
		return ;
	}
	DeleteFile();
	m_iNowPage = m_iHavePage ; 
	for(var m = (m_iHavePage-1)*m_iPerNum ; m < m_iHavePictureNumber ; m ++)
	{
		InsertPicture((m+1), m_szPictureNameSet[m], m_szPictureDateSet[m], m_szPictureSizeSet[m]);  
	}
	m_iCurPictureNumber = m_iHavePictureNumber - (m_iHavePage-1)*m_iPerNum ;
	m_iSelectFile = m_iPerNum*(m_iNowPage-1) + 1;
	document.getElementById("SelectAll").checked = false;
	document.getElementById("PicturePage").innerHTML =translator.translateNode(g_lxdDownload, "TotalTips") + m_iHavePictureNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
}


/*************************************************
Function:		InsertPicture
Description:	插入图片条目信息到List中
Input:			iNo: 图片序号	
                strPictureName b : 图片名
				strPictureDate : 图片记录时间
				iPictureSize e : 图片大小			
Output:			无
return:			无				
*************************************************/
function InsertPicture(iNo, strPictureName, strPictureDate, iPictureSize)
{
	var iPictureSizeKB  = parseInt(iPictureSize/1024);
	var ObjTr;
	var ObjTd;
	ObjTr = document.getElementById("PictureTableList").insertRow(document.getElementById("PictureTableList").rows.length);
	ObjTr.style.height=16;
	ObjTr.style.color="#000000";
	ObjTr.style.cursor="pointer";
	ObjTr.align = "center"; 
	$(ObjTr).bind('click', {iIndex:iNo}, function(event)
	{
		var i = parseInt(event.data.iIndex)
	    SelectFile(i);
	});
	
	for(j = 0;j < document.getElementById("PictureTableList").rows[0].cells.length;j++) 
	{  
		ObjTd = ObjTr.insertCell(j); 
		ObjTd.style.color="#000000"; 
		ObjTd.align = "center";  
		if((iNo%2)==0)
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
				ObjTd.innerHTML = "<div><input name='box"+iNo+"' id='box"+iNo+"' type='checkbox' value='0' onClick='CheckAll()'></div>";
				ObjTd.id = "PictureA"+iNo;
				ObjTd.width = "56";
				break;
			case 1:
				ObjTd.innerHTML = iNo;
				ObjTd.id = "PictureB"+iNo;
				ObjTd.width = "56";
				break;
			case 2:
				ObjTd.innerHTML = strPictureName;
				ObjTd.id = "PictureC"+strPictureName;
				ObjTd.width = "200";
				break;				   
			case 3:	               
				ObjTd.innerHTML = strPictureDate;
				ObjTd.id = "PictureD"+iNo;
				ObjTd.width = "156";
				break;		
			case 4:
			   if(iPictureSizeKB==0)
			   {
					ObjTd.innerHTML = "1 KB";
					ObjTd.id = "PictureE"+iNo;
					 ObjTd.width = "100";
					break;
			   }
			   else
			   {
					ObjTd.innerHTML = iPictureSizeKB +" KB";
					ObjTd.id = "PictureE"+iNo;
					ObjTd.width = "100";
					break;
			   }
			case 5:
			   ObjTd.id = "downProcess"+iNo;  
			   ObjTd.width = "143";
			   break;
			default:
			   break; 		
	   }
	}  
	m_szTableFileName[iNo-1] = strPictureName;
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
	if(1 == m_bDownloadPos)
   	{
       	return;
   	}
	if(m_iSelectFile == iIndex)
	{
		return;
	}
	var oSelObj = document.getElementById("PictureTableList").rows[iIndex - (m_iNowPage-1)*m_iPerNum];
	for(j = 0;j < oSelObj.cells.length;j++) 
    {
		oSelObj.cells[j].style.color = "#ffffff";
		oSelObj.cells[j].style.backgroundColor = "#2882E2";
	}
	if(m_iSelectFile != -1)
	{
		oSelObj = document.getElementById("PictureTableList").rows[m_iSelectFile - (m_iNowPage-1)*m_iPerNum];
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
	for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber);i++)
    { 
	   	if((document.getElementById("box"+(i+1)).checked) == true)
	   	{
			iHaveSelect ++;
	   	} 
   	}
	if(iHaveSelect == m_iCurPictureNumber)
	{
		document.getElementById("SelectAll").checked = true;
	}
	else
	{
		document.getElementById("SelectAll").checked = false;
	}
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
    var bAll = document.getElementById("SelectAll").checked;
	if(bAll)
	{	
	    for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber); i++)
    	{  
        	document.getElementById("box"+(i+1)).checked = true;
    	}
	}
	else
	{
	    for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber); i++)
    	{  
        	document.getElementById("box"+(i+1)).checked = false;
    	}
	}
}

/*************************************************
Function:		PictureDownload
Description:	图片下载
Input:			无			
Output:			无
return:			无				
*************************************************/
function PictureDownload()
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
				for(var k = (m_iNowPage - 1)*m_iPerNum; k< ((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber);k++)
				{ 
					document.getElementById("box"+(k+1)).disabled="";
				}
				document.getElementById("SelectAll").disabled="";
				clearInterval(ClockTime);
				$("#laDownloadBtn").html(translator.translateNode(g_lxdDownload, "DownloadBtn"));
			}
			return ;
		}
		else
		{
			return;
		}
	}
	for(var i=(m_iNowPage - 1)*m_iPerNum;i<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber);i++)
	{ 
		if((document.getElementById("box"+(i+1)).checked) == true)
		{
			m_iNowDown = i;
			var szDownXml = '<?xml version="1.0"?><downloadRequest version="1.0" xmlns="http://urn:selfextension:psiaext-ver10-xsd"><playbackURI>rtsp://'+m_szHostName+'/Streaming/tracks/120?starttime='+m_szPictureDateSet[m_iNowDown].replace(" ", "T")+'Z&amp;endtime='+m_szPictureDateSet[m_iNowDown].replace(" ", "T")+'Z&amp;name='+m_szPictureNameSet[m_iNowDown]+'&amp;size='+m_szPictureSizeSet[m_iNowDown]+'</playbackURI></downloadRequest>'
 
 			try
			{
				m_iDownloadID = m_PreviewOCX.HWP_StartDownloadEx(m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/Custom/SelfExt/ContentMgmt/download", m_szUserPwdValue, m_szPictureNameSet[m_iNowDown] + m_szPictureFormat, szDownXml, "");	
			}catch(e)
			{
				m_iDownloadID = -1;
			}
			
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
			$("#laDownloadBtn").html(translator.translateNode(g_lxdDownload, "stop"));
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
	for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber);j++)
	{ 
		document.getElementById("box"+(j+1)).disabled="disabled";
	}
	document.getElementById("SelectAll").disabled="disabled";
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
	if(0 == iStatus)
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
			for(var i=m_iNowDown+1;i<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber);i++)
			{ 
				if((document.getElementById("box"+(i+1)).checked) == true)
				{
					m_iNowDown = i;
					var szDownXml = '<?xml version="1.0"?><downloadRequest version="1.0" xmlns="http://urn:selfextension:psiaext-ver10-xsd"><playbackURI>rtsp://'+m_szHostName+'/Streaming/tracks/120?starttime='+m_szPictureDateSet[m_iNowDown].replace(" ", "T")+'Z&amp;endtime='+m_szPictureDateSet[m_iNowDown].replace(" ", "T")+'Z&amp;name='+m_szPictureNameSet[m_iNowDown]+'&amp;size='+m_szPictureSizeSet[m_iNowDown]+'</playbackURI></downloadRequest>'
		 
					m_iDownloadID = m_PreviewOCX.HWP_StartDownloadEx(m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/Custom/SelfExt/ContentMgmt/download", m_szUserPwdValue, m_szPictureNameSet[m_iNowDown] + m_szPictureFormat , szDownXml, "");
					
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
					$("#laDownloadBtn").html(translator.translateNode(g_lxdDownload, "stop"));
					return;
				} 
			}
			for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber); j++)
    		{ 
	   			document.getElementById("box"+(j+1)).disabled="";
			}
			document.getElementById("SelectAll").disabled="";
			$("#laDownloadBtn").html(translator.translateNode(g_lxdDownload, "DownloadBtn"));
		}
	}
	else
	{
		clearInterval(ClockTime);
		m_PreviewOCX.HWP_StopDownload(m_iDownloadID);
		m_iDownloadID = -1;
		$("#downProcess"+(m_iNowDown+1)).html(translator.translateNode(g_lxdDownload, "jsDownloadFailed"));
		//alert(translator.translateNode(g_lxdDownload, 'tipsGetStatus'));
		for(var j=(m_iNowPage - 1)*m_iPerNum;j<((m_iNowPage - 1)*m_iPerNum + m_iCurPictureNumber); j++)
		{ 
			document.getElementById("box"+(j+1)).disabled="";
		}
		document.getElementById("all").disabled="";
		$("#laDownloadBtn").html(translator.translateNode(g_lxdDownload, "DownloadBtn"));
		return;
	}
}

/*************************************************
Function:		showTips
Description:	显示提示语
Input:			title:标题
				strTips: 提示语
Output:			无
return:			无
*************************************************/
var g_iShowTipsTimer;
function showTips(title, strTips)
{
	$('#laPictureSearchTips').html(strTips);
	$('#divPictureSearchTips').show();
	clearTimeout(g_iShowTipsTimer);
	g_iShowTipsTimer = setTimeout(function()
			   {
				   $('#laPictureSearchTips').html('');
				   $('#divPictureSearchTips').hide(); 
			   },  5000);
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
	translator.translatePage(g_lxdDownload, document);
	
	document.title = translator.translateNode(g_lxdDownload, "picturetitle");
	
	if(m_iHavePictureNumber > 0)
	{
		document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload, "TotalTips") + m_iHavePictureNumber +translator.translateNode(g_lxdDownload, "TiaoTips")+"&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='FirstPage()'>"+translator.translateNode(g_lxdDownload, "jsFirstPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='LastPage()'>"+translator.translateNode(g_lxdDownload, "jsPrevPageTips")+"</span>&nbsp;"+ m_iNowPage+"/"+ m_iHavePage +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='NextPage()'>"+translator.translateNode(g_lxdDownload, "jsNextPageTips")+"</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' onClick='AfterPage()'>"+translator.translateNode(g_lxdDownload, "jsLastPageTips")+"</span>&nbsp;&nbsp;";
	}else
	{
		document.getElementById("PicturePage").innerHTML = translator.translateNode(g_lxdDownload,'TotalTips') + "0" + translator.translateNode(g_lxdDownload,'TiaoTips') + "&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + translator.translateNode(g_lxdDownload,'jsFirstPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + getNodeValue('jsPrevPageTips') + "</span>&nbsp;"+ "0/0" +"&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;'  >" + translator.translateNode(g_lxdDownload,'jsNextPageTips') + "</span>&nbsp;&nbsp;<span style='cursor:pointer;border-bottom:1px solid #000;' >" + translator.translateNode(g_lxdDownload,'jsLastPageTips') + "</span>&nbsp;&nbsp;";
	}
	if($('#divPictureSearchTips').css('display') != 'none')
	{
	    g_transStack.translate();
	}
	if(m_iDownloadID < 0)
	{
		$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "DownloadBtn"));
	}
	else
	{
		$("#DownloadBtn").val(translator.translateNode(g_lxdDownload, "stop"));
	}
}

