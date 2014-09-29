var m_szXmlStr = "";			    //xml保存
var m_oSearchXml = null;            //录像搜索XML
var m_bWndPause = false;		    //是否暂停了
var m_bWndRecord = false;		    //是否在回放
var m_iWndSpeed = 1;			    //当前的播放速度
var m_bWndFrame = false;		    //是否单帧播放
var m_bSound = false;               //是否开启了声音
var m_bWndSearched = false;		    //窗口是否搜索过
var m_tWndMidTime = "";		        //窗口的时间轴时间
var tTimeBar = null;                //时间条对象
var m_dtSearchDate = "";		    //当前搜索的日期
var m_dtCalendarDate = "";		    //当前日历的日期
var m_iChangeDownLoadPicTimer = 0;	//剪辑片段图标定时器
var m_iOSDTimer = 0;				//获取OSD定时器
var m_iSearchTimes = 0;

var m_szStartTimeSet = new Array(); //开始时间集合
var m_szEndTimeSet = new Array();   //结束时间集合
var m_szFileNameSet = new Array();  //文件名集合
var m_szFileSizeSet = new Array();  //文件大小集合
var m_szURISet = new Array();       //文件utl集合

var m_PictureDownWindow = null;

var g_lxdPlayback = null; // Playback.xml

var g_iSpanType = 7;

var g_bMoveFirst = false; 

var sliderVolume = null; 

var g_szStopPlayBack = ""; 

var g_bEnableEZoom = false;
/*************************************************
Function:		InitPlayback
Description:	初始化回放界面
Input:			无
Output:			无
return:			无
*************************************************/
function InitPlayback()
{
	$.cookie('page', null);
	var tok = m_lUserName + ':' + m_lPassword;
	//var tok = 'admin:12345';
	m_szUserPwdValue = Base64.encode(tok);
	//alert(tok + '-------' + m_szUserPwdValue)
    /*m_szUserPwdValue = $.cookie('userInfo' + m_lHttpPort);
	if(null == m_szUserPwdValue)
	{
		window.parent.location.href = "login.aspx";
		return;
	}*/

	window.parent.ChangeMenu(2);
	
	getUPnPInfo();
	
	var date =  new Time();
	m_dtSearchDate = date.getStringTime().split(" ")[0];
	m_dtCalendarDate = m_dtSearchDate;
    
	
    try {
        ChangeLanguage("en");
        if (!$.browser.msie) {
            var canvas = document.getElementById("timebar");
            if (canvas.getContext) {
                tTimeBar = new TimeBar(canvas, 604, 60);
                tTimeBar.setMouseUpCallback(timeBarMouseUp);
            } else {
                $("#timebar").html('');
            }
        } else {
            $("#timebar").width(604);
            $("#timebar").height(60);
            tTimeBar = document.getElementById("timebar");
        }

        var szPlugin = parent.translator.translateNode(g_lxdPlayback, 'laPlugin');
        if (!checkPlugin('2', szPlugin, 1)) {
            $('#main_plugin').attr("style", "text-align:center;background-color:#000000;");
            $(".pluginLink").attr("style", "display:inline-block;margin-top:" + 220 + "px;");
            $(".pluginLink").text("Please click here to download and install the plug-in. Close the browser when installing the plug-in.");
            if ($.browser.msie) {
                $("#playbackbar").hide();
            }
            return;
        } else {
            $("#dvTimebarCtrl").show();
            $("#frTimebarCtrl").show();
        }
    } catch (e) {
        //console.log("Exception: " + e.message);
    }
    
	m_PreviewOCX = document.getElementById("PreviewActiveX");
	
	if(!CompareFileVersion())
	{
		UpdateTips();
	}
	initVolumeSlider();	
	initMouseHover();
	
	setTimeout(function()
	{
	    var szUrl = decodeURI(document.URL);
		if(szUrl.indexOf("?")!=-1)
		{
			var szStartTime = "";
			var szStopTime = "";
			if(szUrl.indexOf("start=") !=-1 && szUrl.indexOf("&stop=") != -1)
			{
				szStartTime = szUrl.substring(szUrl.indexOf("start=") + 6, szUrl.indexOf("&stop="));
				szStopTime = szUrl.substring(szUrl.indexOf("&stop=") + 6, szUrl.length);
				szStartTime = szStartTime.substring(0,4)+"-"+szStartTime.substring(4,6)+"-"+szStartTime.substring(6,8)+ " " + szStartTime.substring(8,10)+":"+szStartTime.substring(10,12)+":"+szStartTime.substring(12,14);
				szStopTime = szStopTime.substring(0,4)+"-"+szStopTime.substring(4,6)+"-"+szStopTime.substring(6,8)+ " " + szStopTime.substring(8,10)+":"+szStopTime.substring(10,12)+":"+szStopTime.substring(12,14);
			}
			else
			{
				szStartTime = DayAdd((m_dtSearchDate+" 00:00:00"),0);
				szStopTime = DayAdd((m_dtSearchDate+" 23:59:59"), 0);
			}
		    
			SearchRecordFile(2, szStartTime, szStopTime);
		}
		else
		{
		    //debugger;
			SearchRecordFile(2);
		}
	},500);
	if(window.parent.g_bIsIPDome){
		$("#dvEZoom").hide();
	}else{
		$("#dvEZoom").show();
	}
}
/*************************************************
Function:		SetVolume
Description:	设置音量
Input:			lVolume     音量   0-100
Output:			无
return:			无
*************************************************/
function SetVolume(lVolume)
{
	m_PreviewOCX.HWP_SetVolume(0, lVolume);
}
/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan)
{
	g_lxdPlayback = parent.translator.getLanguageXmlDoc("Playback", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdPlayback, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdPlayback, document);
	window.parent.document.title = parent.translator.translateNode(g_lxdPlayback, 'title');
	m_szExit = parent.translator.translateNode(g_lxdPlayback, 'exit');
	if(HWP!=null && HWP.wnds[0].isPlaying)
	{
		if(!m_bWndPause && !m_bWndFrame)
		{
			$("#play").attr("title", parent.translator.translateNode(g_lxdPlayback, 'jsPause'));
			if(m_iWndSpeed < 1)
			{
				$("#nowStatues").html("1/"+(1/m_iWndSpeed)+'&nbsp;'+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
			}
			else
			{
				$("#nowStatues").html(m_iWndSpeed+'&nbsp;'+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));
			}
		}
		else
		{
			if(m_bWndPause && !m_bWndFrame)
			{
				$("#nowStatues").html(parent.translator.translateNode(g_lxdPlayback, 'jsPauseAlready'));
			}
			else
			{
				$("#nowStatues").html(parent.translator.translateNode(g_lxdPlayback, 'jssingleframe'));
			}
			$("#play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsResume'));
		}
	}
	else
	{
		$("#play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'gePlay'));
	}
	
	$("#SlowlyForward").attr("title",parent.translator.translateNode(g_lxdPlayback, 'SlowlyForward'));
	$("#FastForward").attr("title",parent.translator.translateNode(g_lxdPlayback, 'FastForward'));
	$("#SingleFrame").attr("title",parent.translator.translateNode(g_lxdPlayback, 'SingleFrame'));
	$("#stop").attr("title",parent.translator.translateNode(g_lxdPlayback, 'stop'));
	$("#download").attr("title",parent.translator.translateNode(g_lxdPlayback, 'RecordDownload'));
	$("#picturedownload").attr("title",parent.translator.translateNode(g_lxdPlayback, 'PictureDownload'));
	$("#capture").attr("title",parent.translator.translateNode(g_lxdPlayback, 'capture'));

	if(m_bSound)
	{
		$("#opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'closesound'));
	}
	else
	{
		$("#opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'opensound'));
	}
	
	if(m_bWndRecord)
	{
		$("#record").attr("title",parent.translator.translateNode(g_lxdPlayback, 'stoprecord'));
	}
	else
	{
		$("#record").attr("title",parent.translator.translateNode(g_lxdPlayback, 'startRecord'));
	}
	if(g_bEnableEZoom) {
		$("#dvEZoomBtn").attr("title", getNodeValue("laDisableZoom"));
	} else {
		if($("#dvEZoomBtn").hasClass("disEZoom")) {
			$("#dvEZoomBtn").attr("title", "");
		} else {
			$("#dvEZoomBtn").attr("title", getNodeValue("laEnableZoom"));
		}
	}
	$("#dingshi").attr("title",parent.translator.translateNode(g_lxdPlayback, 'laGotoTime'));
	$("#timeNarrow").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsZoomOut'));
	$("#timeExpand").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsZoomIn'));
	var szLanguage = '';
	if(parent.translator.szCurLanguage == 'zh')
	{
		szLanguage = 'zh-cn';
	} else if(parent.translator.szCurLanguage == 'zh_TW') {
		szLanguage = 'zh-tw';	
	}  else {
		$.each(parent.translator.languages, function(i) {
			    if (this.value === parent.translator.szCurLanguage) {
				    szLanguage = this.value;
			    }
		});
		if(szLanguage === '') {
			szLanguage = 'en';
		}
	}
	WdatePicker({minDate:'1970-01-01 00:00:00',maxDate:'2037-12-31 23:59:59',eCont:'div1',onpicked:function(dp){m_dtCalendarDate = dp.cal.getDateStr();},lang: szLanguage,startDate:m_dtCalendarDate});
	if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed)
	{
		m_DownWindow.ChangeLan();
	}
	if(m_PictureDownWindow && m_PictureDownWindow.open && !m_PictureDownWindow.closed) {
			m_PictureDownWindow.ChangeLan();
		}
	if($('#divPlaybackTips').css('display') != 'none')
	{
	    g_transStack.translate();
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
    if (strTips == '')
        return;
	$('#laPlaybackTips').html(strTips);
	$('#divPlaybackTips').show();
	clearTimeout(g_iShowTipsTimer);
	g_iShowTipsTimer = setTimeout(function()
			   {
				   $('#laPlaybackTips').html('');
				   $('#divPlaybackTips').hide(); 
			   },  5000);
}
/*************************************************
Function:		SearchRecordFile
Description:	搜索录像文件
Input:			iType:0拖动时间轴跨天搜索，1非首次搜索，2点击搜索按钮搜索
				dtStartTime: 开始时间(可省略)
				dtStopTime:  结束时间(可省略)
Output:			无
return:			无
*************************************************/
function SearchRecordFile(iType, szStartTime, szStopTime)
{
    $("#laPlaybackTips").html('Searching...');
    $('#divPlaybackTips').show();
    
    if(iType == 2)
	{
		if(HWP.wnds[0].isPlaying)
		{
			
			g_transStack.push(function()
							  {
				                  showTips('', parent.translator.translateNode(g_lxdPlayback, 'stopCurrentWndPlay'));
							  }, true);
			return;
		}
		if(arguments.length > 1)
		{
			m_dtSearchDate = szStartTime.split(" ")[0];
			m_tWndMidTime = szStartTime;
		}
		else
		{
			m_dtSearchDate = m_dtCalendarDate;
			m_tWndMidTime = m_dtSearchDate + " 00:00:00";
		}
		
		tTimeBar.setMidLineTime(m_tWndMidTime);
		
		m_szStartTimeSet.length = 0;
		m_szEndTimeSet.length = 0;
		m_szFileNameSet.length = 0;
		m_szFileSizeSet.length = 0;
		m_szURISet.length = 0;
		
		g_bMoveFirst = true;
	}
	if(iType == 0)
	{
		g_bMoveFirst = false;
	}
	var xmlDoc = null;
	if(iType != 1)
	{
		m_szXmlStr = '';
		
		tTimeBar.m_iSelWnd = 0;
		tTimeBar.clearWndFileList(0);
		tTimeBar.repaint();
		
		xmlDoc = new createxmlDoc();
		var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
		xmlDoc.appendChild(Instruction);
		
		Root = xmlDoc.createElement('CMSearchDescription');
		
		searchID = xmlDoc.createElement('searchID');
		text = xmlDoc.createTextNode(new UUID());
		searchID.appendChild(text);
		Root.appendChild(searchID);
		
		trackList = xmlDoc.createElement('trackList');
		track = xmlDoc.createElement('trackID');
		text = xmlDoc.createTextNode(m_channel);
		track.appendChild(text);
		trackList.appendChild(track);
		Root.appendChild(trackList);
		var dtStartTime = "";
		var dtStopTime = "";
		if(arguments.length > 1)
		{
			dtStartTime = szStartTime.replace(' ', 'T') + 'Z';
			dtStopTime = szStopTime.replace(' ', 'T') + 'Z';
		}
		else
		{
			dtStartTime = DayAdd((m_dtSearchDate+" 00:00:00"),-1).replace(' ', 'T') + 'Z';
			dtStopTime = DayAdd((m_dtSearchDate+" 23:59:59"), 1).replace(' ', 'T') + 'Z';
		}
		
		
		timeSpanList = xmlDoc.createElement('timeSpanList');
		timeSpan = xmlDoc.createElement('timeSpan');
		
		startTime = xmlDoc.createElement('startTime');
		text = xmlDoc.createTextNode(dtStartTime);
		startTime.appendChild(text);
		timeSpan.appendChild(startTime);
		
		endTime = xmlDoc.createElement('endTime');
		text = xmlDoc.createTextNode(dtStopTime);
		endTime.appendChild(text);
		timeSpan.appendChild(endTime);
		
		timeSpanList.appendChild(timeSpan);
		Root.appendChild(timeSpanList);
		
		maxResults = xmlDoc.createElement('maxResults');
		text = xmlDoc.createTextNode("40");//暂定一次返回40条
		maxResults.appendChild(text);
		Root.appendChild(maxResults);
		
		searchResultsPosition = xmlDoc.createElement('searchResultPostion');
		text = xmlDoc.createTextNode('0');
		searchResultsPosition.appendChild(text);
		Root.appendChild(searchResultsPosition);
		
		metadataList = xmlDoc.createElement('metadataList');
		metadataDescriptor = xmlDoc.createElement('metadataDescriptor');
		text = xmlDoc.createTextNode("//metadata.psia.org/VideoMotion");
		metadataDescriptor.appendChild(text);
		metadataList.appendChild(metadataDescriptor);
		Root.appendChild(metadataList);
		
		xmlDoc.appendChild(Root);
		m_oSearchXml = xmlDoc;
		
		m_szStartTimeSet.length = 0;
		m_szEndTimeSet.length = 0;
		m_szFileNameSet.length = 0;
		m_szFileSizeSet.length = 0;
		m_szURISet.length = 0;
	}
	else
	{
		if(null == m_oSearchXml)
		{
			g_bMoveFirst = false;
			return;
		}
		m_oSearchXml.documentElement.getElementsByTagName('searchResultPostion')[0].childNodes[0].nodeValue = 40 * m_iSearchTimes;
		xmlDoc = m_oSearchXml;
	}
	$.ajax({
		type: "POST",
	    //url: m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/ContentMgmt/search/",
		url: "Playbacks.ashx?method=search&url=" + m_szHostName + ":" + m_lHttpPort + "&u=" + m_lUserName + "&p=" + m_lPassword,
		async: true,
		timeout: 30000,
		processData: false,
		data: xmlDoc,
		/*beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
        */
		complete: function(xhr, textStatus)
		{
		      //debugger;
			if(xhr.status == 403)
			{
				m_iSearchTimes = 0;
				m_oSearchXml = null;
				g_transStack.push(function()
				{
					showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsNoOperationRight'));
				}, true);
				g_bMoveFirst = false;
			}
			else if(xhr.status==200)
			{
				var xmlDoc = xhr.responseXML;
				var szResXml = xhr.responseText;
				
				if("MORE" == $(xmlDoc).find('responseStatusStrg').eq(0).text())
				{
					if($.browser.msie)
					{
						tTimeBar.AddFileList(szResXml, 0);
					}
					else
					{
						AddFileToTimeBar(xmlDoc, 0);
					}
					for(var i = 0; i < $(xmlDoc).find('searchMatchItem').length; i++)
					{
						var szStartTime = $(xmlDoc).find('startTime').eq(i).text();
						if(szStartTime.split("T")[0] != m_dtSearchDate)
						{
							continue;
						}
						var szStopTime = $(xmlDoc).find('endTime').eq(i).text();
						m_szStartTimeSet.push((szStartTime.replace('T', ' ')).replace('Z', ''));
						m_szEndTimeSet.push((szStopTime.replace('T', ' ')).replace('Z', ''));
						var szPlaybackURI = $(xmlDoc).find('playbackURI').eq(i).text();
						m_szURISet.push(szPlaybackURI);
						var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
						var szFileSize = szPlaybackURI.substring(szPlaybackURI.indexOf("size=") + 5, szPlaybackURI.length);
						m_szFileNameSet.push(szFileName);
						m_szFileSizeSet.push(szFileSize);
					}
					m_iSearchTimes++;
					m_szXmlStr = szResXml;
					SearchRecordFile(1);
				}
				else if("OK" == $(xmlDoc).find('responseStatusStrg').eq(0).text())
				{

					m_iSearchTimes = 0;
					m_oSearchXml = null;
					//add by tangzz 2012-7-9 华为回放停止时间设置
					var szEndLength = $(xmlDoc).find('endTime').length;
					if(szEndLength > 0)
					{
						g_szStopPlayBack = ($(xmlDoc).find('endTime').eq(szEndLength - 1).text().replace('T', ' ')).replace('Z', '');
					}
					else
					{
						g_szStopPlayBack = '';	
					}
					for(var i = 0; i < $(xmlDoc).find('searchMatchItem').length; i++)
					{
						var szStartTime = $(xmlDoc).find('startTime').eq(i).text();
						if(szStartTime.split("T")[0] != m_dtSearchDate)
						{
							continue;
						}
						var szStopTime = $(xmlDoc).find('endTime').eq(i).text();
						m_szStartTimeSet.push((szStartTime.replace('T', ' ')).replace('Z', ''));
						m_szEndTimeSet.push((szStopTime.replace('T', ' ')).replace('Z', ''));
						var szPlaybackURI = $(xmlDoc).find('playbackURI').eq(i).text();
						m_szURISet.push(szPlaybackURI);
						var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
						var szFileSize = szPlaybackURI.substring(szPlaybackURI.indexOf("size=") + 5, szPlaybackURI.length);
						m_szFileNameSet.push(szFileName);
						m_szFileSizeSet.push(szFileSize);
					}
					m_bWndSearched = true;
					m_szXmlStr = szResXml;
					if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed)
					{
						m_DownWindow.FileLoad();
					}
					if(m_szStartTimeSet.length > 0 && iType != 0 && g_bMoveFirst)
					{
						tTimeBar.setMidLineTime(m_szStartTimeSet[0]);
					}
					if($.browser.msie)
					{
						tTimeBar.AddFileList(szResXml, 0);
					}
					else
					{
						AddFileToTimeBar(xmlDoc, 0);
					}
					$('#laPlaybackTips').html('');
				    $('#divPlaybackTips').hide();
					g_bMoveFirst = false;
				}
				else if("NO MATCHES" == xmlDoc.documentElement.getElementsByTagName('responseStatusStrg')[0].childNodes[0].nodeValue)
				{
					m_szXmlStr='';
					m_iSearchTimes = 0;
					m_oSearchXml = null;
					m_bWndSearched = false;
					g_transStack.push(function()
					{
						showTips("", parent.translator.translateNode(g_lxdPlayback, 'szTips3'));
					}, true);
					if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed)
					{
						m_DownWindow.FileLoad();
					}
					g_bMoveFirst = false;
				}
			}
			else
			{
				m_iSearchTimes = 0;
				m_oSearchXml = null;
				m_bWndSearched = false;
				m_szXmlStr = '';
				g_bMoveFirst = false;
				if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed)
				{
					m_DownWindow.FileLoad();
				}
				g_transStack.push(function()
				{
					showTips('', parent.translator.translateNode(g_lxdPlayback, 'szTips1'));
				}, true);
				return ;
			}
		}
	});
}

/*************************************************
Function:		AddFileToTimeBar
Description:	添加文件到时间条
Input:			xmlDoc:文件信息
Output:			无
return:			无
*************************************************/
function AddFileToTimeBar(xmlDoc)
{
	for(var i = 0; i < xmlDoc.documentElement.getElementsByTagName('searchMatchItem').length; i++)
	{
		var szStartTime = xmlDoc.documentElement.getElementsByTagName('startTime')[i].childNodes[0].nodeValue;
		var szStopTime = xmlDoc.documentElement.getElementsByTagName('endTime')[i].childNodes[0].nodeValue;
		try
		{
			var szType = xmlDoc.documentElement.getElementsByTagName('metadataDescriptor')[i].childNodes[0].nodeValue.split("/");
			var iType = 1;
			if(szType[1] == "timing")
			{
				iType = 1;
			}
			else if(szType[1] == "manual")
			{
				iType = 4;
			}
			else if(szType[1] == "motion" || szType[1] == "alarm" || szType[1] == "motionOrAlarm" || szType[1] == "motionAndAlarm" || szType[1] == "pir" || szType[1] == "wlsensor" || szType[1] == "callhelp" || szType[1] == "pirORwlsensorORcallhelp" || szType[1] == "AllEvent")
			{
				iType = 2;
			}
		}
		catch(e)
		{
			iType = 1;
		}
		tTimeBar.addFile((szStartTime.replace('T', ' ')).replace('Z', ''), (szStopTime.replace('T', ' ')).replace('Z', ''), iType);
	}
	tTimeBar.repaint();
}
/*************************************************
Function:		GetSelectWndInfo
Description:	获取选中窗口信息
Input:			SelectWndInfo:窗口信息xml
Output:			无
return:			无
*************************************************/
function GetSelectWndInfo(SelectWndInfo)
{
	return;
}
/*************************************************
Function:		PluginEventHandler
Description:	回放事件响应
Input:			iEventType 事件类型, iParam1 参数1, iParam2 保留
Output:			无
return:			无
*************************************************/
function PluginEventHandler(iEventType, iParam1, iParam2)
{
	if(0 == iEventType)
	{
		GetOSDTime(iParam1);
		if(0 == iParam1)
		{
			StopPlayBack();
		}
		g_transStack.push(function()
						  {
		                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsPlayStopAbnormal'));
						  }, true);
	}
	else if(2 == iEventType)
	{
		if(0 == iParam1)
		{
			StopPlayBack();
		}
		g_transStack.push(function()
						  {
		                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsPlaybackStop'));
						  }, true);
	}
	else if(21 == iEventType)
	{
		if(0 == iParam1)
		{
			PlayBackSaveFile();
		}
		if(m_bIsDiskFreeSpaceEnough)
		{
			g_transStack.push(function()
							  {
			                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'FreeSpaceTips'));
							  }, true);
			m_bIsDiskFreeSpaceEnough = false;
		}
	}
	else
	{
	}
}
/*************************************************
Function:		timeBarMouseUp
Description:	鼠标离开时间条时，跨天了就继续搜索
Input:			tMidTime 中轴线时间
Output:			无
return:			无
*************************************************/
function timeBarMouseUp(tMidTime)
{
	 var bPlay = HWP.wnds[0].isPlaying;
	 StopPlayBack();

	 var date;
	 if(arguments.length >= 1)
	 {
		 date = tMidTime;
	 }
	 else
	 {
		 date = tTimeBar.m_tCurrentMidTime.getStringTime();
	 }
	 m_tWndMidTime = date;	
	 var szStartTime = m_dtSearchDate+" 00:00:00";
	 var szStopTime = m_dtSearchDate+" 23:59:59";
	 
	 if(date > szStopTime || date < szStartTime)
	 {
		 m_dtSearchDate = date.split(" ")[0];
		 if(m_bWndSearched)
		 {
			 SearchRecordFile(0);
		 }
	 }
	 if(bPlay)
	 {
		 StartPlayBack();
	 }
}

/**********************************
Function:		StartPlayBack
Description:	开始回放、暂停回放
Input:			
Output:			无
return:			无
***********************************/
function StartPlayBack() {
	if (!HWP.wnds[0].isPlaying)	//没有回放
	{
	    //debugger;
		var date1;
		if(navigator.appName == "Microsoft Internet Explorer")
		{
			date1 =  new Date(Date.parse(tTimeBar.GetPlayBackTime().replace(/\-/g,'/')));
		}
		else
		{
			date1 =  new Date(Date.parse(tTimeBar.m_tCurrentMidTime.getStringTime().replace(/\-/g,'/')));
		}
		var date2 =  new Date(Date.parse(DayAdd((m_dtSearchDate+" 23:59:59"), 1).replace(/\-/g,'/')));		
		if(date1.getTime() >= date2.getTime())
		{
			g_transStack.push(function()
							  {
			                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsSearchFile'));
							  }, true);
			return;
		}
		//停止时间设置 add by tangzz
		if(g_szStopPlayBack != '')
		{
			date2 =  new Date(Date.parse(DayAdd(g_szStopPlayBack, 0).replace(/\-/g,'/')));	
		}
		
		var szStartTime = date1.Format("yyyyMMddThhmmssZ"); 		//当前时间轴时间
		var szStopTime = date2.Format("yyyyMMddThhmmssZ"); 			//时间轴后一天的23:59:59
		
		var szPathInfo = '';
		try
		{
			szPathInfo = m_PreviewOCX.HWP_GetLocalConfig();
		}
		catch(e)
		{
			szPathInfo = m_PreviewOCX.GetLocalConfig();
		}
        var xmlDoc = parseXmlFromStr(szPathInfo);
        
		m_iProtocolType = parseInt(xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue);
		if(m_iProtocolType == 4) {
		    var szURL = "rtsp://" + m_szHostName + ":" + g_szHttpPort + "/PSIA/streaming/tracks/" + m_channel;
		} else {
		    var szURL = "rtsp://" + m_szHostName + ":" + m_lRtspPort + "/PSIA/streaming/tracks/" + m_channel;
		}
		
		szURL+='?starttime='+szStartTime+'&endtime='+szStopTime;
		
		if (!m_bWndSearched){
			g_transStack.push(function() {
				showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsSearchFile'));
			}, true);
			return;
        }
		
		if (0 == m_PreviewOCX.HWP_Play(szURL, m_szUserPwdValue, 0, szStartTime, szStopTime)) {
			HWP.wnds[0].isPlaying = true;
			$("#play").removeClass().addClass("pause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsPause'));
			m_iWndSpeed = 1;
			$("#nowStatues").html(m_iWndSpeed+'&nbsp;'+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));
			
			GetOSDTime(0);
			$("#capture").removeClass().addClass("capture");
			$("#record").removeClass().addClass("record");
			$("#stop").removeClass().addClass("stop");
			$("#SlowlyForward").removeClass().addClass("slowlyforward");
			$("#FastForward").removeClass().addClass("fastforward");
			$("#SingleFrame").removeClass().addClass("singleframe");
			$("#opensound").removeClass().addClass("closesound");
			$("#dvEZoomBtn").attr("title", getNodeValue("laEnableZoom")).attr("class", "StartEZoom");
		} else {
			g_transStack.push(function(){showTips('', parent.translator.translateNode(g_lxdPlayback, 'startplayfailed'));}, true);
		}
	} else {//回放中
		if (!m_bWndPause && !m_bWndFrame) {//当前为回放状态
			if (0 == m_PreviewOCX.HWP_Pause(0)) {
				clearTimeout(m_iOSDTimer);
				m_iOSDTimer = 0;
				m_bWndPause = true;
				$("#play").removeClass().addClass("play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsResume'));
				$("#nowStatues").html(parent.translator.translateNode(g_lxdPlayback, 'jsPauseAlready'));
				
				//记住当前窗口的时间轴时间
				if(navigator.appName == "Microsoft Internet Explorer") {
					m_tWndMidTime = tTimeBar.GetPlayBackTime();		
				} else {
					m_tWndMidTime = tTimeBar.m_tCurrentMidTime.getStringTime();
				}
				$("#record").removeClass().addClass("recorddisable");
				$("#SlowlyForward").removeClass().addClass("slowlyforwarddisable");
				$("#FastForward").removeClass().addClass("fastforwarddisable");
				$("#SingleFrame").removeClass().addClass("singleframedisable");				
			} else {
				g_transStack.push(function() {showTips('', parent.translator.translateNode(g_lxdPlayback, 'pausefailed'));}, true);
			}
		} else {
			if (m_bWndPause && !m_bWndFrame) {//当前为暂停状态
				if (0 == m_PreviewOCX.HWP_Resume(0)) {
					GetOSDTime(0);
					m_bWndPause = false;
					m_bWndFrame = false;
					$("#play").removeClass().addClass("pause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsPause'));
					
					if(1 > m_iWndSpeed) {
						$("#nowStatues").html("1/"+(1/m_iWndSpeed)+'&nbsp;'+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
					} else {
						$("#nowStatues").html(m_iWndSpeed+'&nbsp;'+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));
					}
					$("#record").removeClass().addClass("record");
					$("#SlowlyForward").removeClass().addClass("slowlyforward");
					$("#FastForward").removeClass().addClass("fastforward");
					$("#SingleFrame").removeClass().addClass("singleframe");						
				} else {
					g_transStack.push(function(){showTips('', parent.translator.translateNode(g_lxdPlayback, 'resumefailed'));}, true);
				}
			} else {//当前为单帧放状态
				if (0 == m_PreviewOCX.HWP_Resume(0)) {
					GetOSDTime(0);
					m_bWndPause = false;
					m_bWndFrame = false;
					$("#play").removeClass().addClass("pause").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsPause'));			
					m_iWndSpeed = 1;
					$("#nowStatues").html(1+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));
					
					$("#record").removeClass().addClass("record");
					$("#SlowlyForward").removeClass().addClass("slowlyforward");
					$("#FastForward").removeClass().addClass("fastforward");					
				} else {
					g_transStack.push(function(){showTips('', parent.translator.translateNode(g_lxdPlayback, 'resumefailed'));}, true);
				}
			}
		}
	}
}
/**********************************
Function:		StopPlayBack
Description:	停止回放
Input:			
Output:			无
return:			无	
***********************************/
function StopPlayBack()
{
	if(HWP.wnds[0].isPlaying)
	{
		if(m_bWndRecord)		//如果在剪辑，先停止
		{
			if(0 == m_PreviewOCX.HWP_StopSave(0))
			{
				m_bWndRecord = false;
				clearInterval(m_iChangeDownLoadPicTimer);
				m_iChangeDownLoadPicTimer = 0;
				$("#record").attr("title",parent.translator.translateNode(g_lxdPlayback, 'startRecord'));
			}
			else
			{
				g_transStack.push(function()
								  {
				                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'stoprecordfailed'));
								  }, true);
				return;
			}
		}
		if(m_bSound)       //如果声音打开，则关闭声音
		{
			m_bSound = false;
			m_PreviewOCX.HWP_CloseSound();
			sliderVolume.wsetValue(0);
			sliderVolume.setTitle('');
			$("#opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'opensound'));
		}
		if(0 == HWP.Stop(0))
		{
			m_bWndFrame = false;
			m_bWndPause = false;
			HWP.wnds[0].isPlaying = false;
			$("#play").removeClass().addClass("play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'gePlay'));
			clearTimeout(m_iOSDTimer);		//关闭OSD获取的定时器
			m_iOSDTimer = 0;
			$("#NowTime").html("");
			$("#nowStatues").html("");		//状态显示为空
			
			//记住当前窗口的时间轴时间
			if(navigator.appName == "Microsoft Internet Explorer")
			{
				m_tWndMidTime = tTimeBar.GetPlayBackTime();		
			}
			else
			{
				m_tWndMidTime = tTimeBar.m_tCurrentMidTime.getStringTime();
			}
			$("#capture").removeClass().addClass("capturedisable");
			$("#record").removeClass().addClass("recorddisable");
			$("#stop").removeClass().addClass("stopdisable");
			$("#SlowlyForward").removeClass().addClass("slowlyforwarddisable");
			$("#FastForward").removeClass().addClass("fastforwarddisable");
			$("#SingleFrame").removeClass().addClass("singleframedisable");
			$("#opensound").removeClass().addClass("sounddisable");
			$("#dvEZoomBtn").attr("title", "").attr("class", "disEZoom");
		}
		else
		{
			g_transStack.push(function()
							  {
			                      showTips('', parent.translator.translateNode(g_lxdPlayback, 'stoprecordfailed'));
							  },  true);
		}
	}
}
/**********************************
Function:		PlayBackSlowly
Description:	慢放
Input:			
Output:			无
return:			无
***********************************/
function PlayBackSlowly()
{
	if(HWP.wnds[0].isPlaying && !m_bWndPause && !m_bWndFrame)
	{
		if(0 == m_PreviewOCX.HWP_Slow(0))
		{
			m_bWndFrame = false;
			if(m_iWndSpeed > 1/4)
			{
				m_iWndSpeed = 1/2 * m_iWndSpeed;
			}
		}
		if(m_iWndSpeed < 1)
		{
			$("#nowStatues").html("1/"+(1/m_iWndSpeed)+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
		}
		else
		{
			$("#nowStatues").html(m_iWndSpeed+parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
		}
	}
}
/**********************************
Function:		PlayBackFast
Description:	快放
Input:			
Output:			无
return:			无
***********************************/
function PlayBackFast()
{
	if(HWP.wnds[0].isPlaying && !m_bWndPause && !m_bWndFrame)
	{
		if(0 == m_PreviewOCX.HWP_Fast(0))
		{
			m_bWndFrame = false;
			if(m_iWndSpeed < 4)
			{
				m_iWndSpeed = 2 * m_iWndSpeed;
			}
		}
		if(m_iWndSpeed < 1)
		{
			$("#nowStatues").html("1/"+(1/m_iWndSpeed) + parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
		}
		else
		{
			$("#nowStatues").html(m_iWndSpeed + parent.translator.translateNode(g_lxdPlayback, 'jsSpeed'));	
		}	
	}
}
/**********************************
Function:		PlayBackFrame
Description:	单帧
Input:			
Output:			无
return:			无
***********************************/
function PlayBackFrame()
{
	if(HWP.wnds[0].isPlaying && !m_bWndPause)
	{
		if(0 == m_PreviewOCX.HWP_FrameForward(0))
		{
			clearTimeout(m_iOSDTimer);
			m_iOSDTimer = 0;
			m_iWndSpeed = 1;
			$("#nowStatues").html(parent.translator.translateNode(g_lxdPlayback, 'jssingleframe'));
	
			m_bWndFrame = true;
			$("#play").removeClass().addClass("play").attr("title",parent.translator.translateNode(g_lxdPlayback, 'jsResume'));

			//记住当前窗口的时间轴时间
			if(navigator.appName == "Microsoft Internet Explorer")
			{
				m_tWndMidTime = tTimeBar.GetPlayBackTime();		
			}
			else
			{
				m_tWndMidTime = tTimeBar.m_tCurrentMidTime.getStringTime();
			}
			$("#record").removeClass().addClass("recorddisable");
			$("#SlowlyForward").removeClass().addClass("slowlyforwarddisable");
			$("#FastForward").removeClass().addClass("fastforwarddisable");			
		}
		else
		{
			g_transStack.push(function()
			{
			  	showTips('', parent.translator.translateNode(g_lxdPlayback, 'jssingleframefailed'));
			}, true);
		}
	}
}

/**********************************
Function:		GetOSDTime
Description:	获取OSD时间
Input:			iWndNum:窗口号
Output:			无
return:			无
***********************************/
function GetOSDTime(iWndNum)
{
	if(!HWP.wnds[0].isPlaying)
	{
		return;
	}
	var iTime = m_PreviewOCX.HWP_GetOSDTime(0);
	if(iTime <= 8 * 3600 * 1000)
	{
		if(m_iOSDTimer != 0)
		{
			clearTimeout(m_iOSDTimer);
			m_iOSDTimer = 0;
		}
		m_iOSDTimer = setTimeout("GetOSDTime(0)", 100);
		return;
	}
	if(navigator.appName == "Microsoft Internet Explorer")
	{
		if(tTimeBar.GetMouseDown())
		{
			if(m_iOSDTimer != 0)
			{
				clearTimeout(m_iOSDTimer);
				m_iOSDTimer = 0;
			}
			m_iOSDTimer = setTimeout("GetOSDTime(0)", 1000);
			return;
		}
	}
	else
	{
		if(tTimeBar.m_bMOuseDown)
		{
			if(m_iOSDTimer != 0)
			{
				clearTimeout(m_iOSDTimer);
				m_iOSDTimer = 0;
			}
			m_iOSDTimer = setTimeout("GetOSDTime(0)", 1000);
			return;
		}
	}
	var date = new Date(iTime * 1000);

	m_tWndMidTime = date.Format("yyyy-MM-dd hh:mm:ss");
	

	tTimeBar.setMidLineTime(m_tWndMidTime);
	
	if(m_iOSDTimer != 0)
	{
		clearTimeout(m_iOSDTimer);
		m_iOSDTimer = 0;
	}
	m_iOSDTimer = setTimeout("GetOSDTime(0)", 1000);
}
/**********************************
Function:		CapturePicture
Description:	抓图
Input:			无
Output:			无
return:			无
***********************************/
function CapturePicture()
{
	if(HWP.wnds[0].isPlaying)
	{
		var time = new Date();
		var szFileName = "";
		var szHostName = "";
		if(m_szHostName.indexOf("[") < 0)
		{
			szHostName = m_szHostName;
		}
		else
		{
			szHostName = m_szHostName.substring(1, m_szHostName.length - 1).replaceAll(":", ".");
		}
		szFileName = szHostName + "_0" + 1 + "_" + time.Format("yyyyMMddhhmmssS");
		
		var iRes = m_PreviewOCX.HWP_CapturePicture(0, szFileName);
		if(iRes == 0)
		{
			g_transStack.push(function()
			{
			    showTips("", "Capture succeeded.");//parent.translator.translateNode(g_lxdPlayback, 'jsCaptureSucc')
			}, true);
		}
		else if(iRes == -1)
		{
			var iError = m_PreviewOCX.HWP_GetLastError();
			if(10 == iError || 9 == iError)
			{
				g_transStack.push(function()
				{
				    showTips('', 'Fail to create a file.');//parent.translator.translateNode(g_lxdPlayback, 'jsCreateFileFailed')
				}, true);
			}
			else
			{
				g_transStack.push(function()
				{
				    showTips('', 'Capture failed.');//parent.translator.translateNode(g_lxdPlayback, 'capturefailed')
				}, true);
			}
		}
		else if(-2 == iRes)
		{
			g_transStack.push(function()
			{
			    showTips('', 'No enough space.');//parent.translator.translateNode(g_lxdPlayback, 'FreeSpaceTips')
			}, true);
		}
		else if(-3 == iRes)
		{
			g_transStack.push(function()
			{
			    showTips('', 'Fail to create a file.');//parent.translator.translateNode(g_lxdPlayback, 'jsCreateFileFailed')
			}, true);
		}
		else
		{
		}
	}
}
/**********************************
Function:		PlayBackSaveFile
Description:	回放录像剪辑片段
Input:			无
Output:			无
return:			无
***********************************/
function PlayBackSaveFile()
{
	if (m_bWndPause || m_bWndFrame)
	{
		return;
	}
	if(HWP.wnds[0].isPlaying && !m_bWndRecord)
	{
		var time = new Date();
		var szFileName = "";
		var szHostName = "";
		if(m_szHostName.indexOf("[") < 0)
		{
			szHostName = m_szHostName;
		}
		else
		{
			szHostName = m_szHostName.substring(1, m_szHostName.length - 1).replaceAll(":", ".");
		}

		szFileName = szHostName + "_0" + 1 + "_" + time.Format("yyyyMMddhhmmssS");

		var iRes = m_PreviewOCX.HWP_StartSave(0, szFileName);
		if(0 == iRes)
		{
			m_bWndRecord = true;
			if(m_iChangeDownLoadPicTimer != 0)
			{
				clearInterval(m_iChangeDownLoadPicTimer);
				m_iChangeDownLoadPicTimer = 0;
			}
			m_iChangeDownLoadPicTimer = setInterval("ChangeDownLoadPic()", 1000);
			$("#record").attr("title",parent.translator.translateNode(g_lxdPlayback, 'stoprecord'));
			
			m_bIsDiskFreeSpaceEnough = true;
		}
		else if(iRes == -1)
		{
			var iError = m_PreviewOCX.HWP_GetLastError();
			if(10 == iError || 9 == iError)
			{
				g_transStack.push(function()
				{
					showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsCreateFileFailed'));
				}, true);
			}
			else
			{
				g_transStack.push(function()
				{
					showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsRecordError'));
				}, true);
			}
		}
		else if(-2 == iRes)
		{
			m_bIsDiskFreeSpaceEnough = false;
			g_transStack.push(function()
			{
				showTips('', parent.translator.translateNode(g_lxdPlayback, 'FreeSpaceTips'));
			}, true);
		}
		else if(-3 == iRes)
		{
			g_transStack.push(function()
			{
				showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsCreateFileFailed'));
			}, true);
		}
		else
		{
		}
	}
	else if(m_bWndRecord)
	{
		if(0 == m_PreviewOCX.HWP_StopSave(0))
		{
			m_bWndRecord = false;
			clearInterval(m_iChangeDownLoadPicTimer);
			m_iChangeDownLoadPicTimer = 0;
			$("#record").removeClass().addClass("record").attr("title",parent.translator.translateNode(g_lxdPlayback, 'startRecord'));
			g_transStack.push(function()
			{
				showTips("",parent.translator.translateNode(g_lxdPlayback, 'jsClipSucc'));
			}, true);
		}
	}
}
/**********************************
Function:		ChangeDownLoadPic
Description:	剪辑图标变动
Input:			无
Output:			无
return:			无
***********************************/
function ChangeDownLoadPic()
{
   $("#record").removeClass().addClass("recording");
}
/**********************************
Function:		OpenSound
Description:	打开声音
Input:			无
Output:			无
return:			无
***********************************/
function OpenSound()
{
	if(!m_bSound && HWP.wnds[0].isPlaying)
	{
		if(0 == m_PreviewOCX.HWP_OpenSound(0))
		{
			m_bSound = true;
			$("#opensound").removeClass().addClass("opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'closesound'));
			SetVolume(50);
			sliderVolume.wsetValue(50);
			sliderVolume.setTitle(''+50);	
		}
		else
		{
			var iError = m_PreviewOCX.HWP_GetLastError();
			//声音设备被占用
			if(25 == iError)
			{
				g_transStack.push(function()
				{
				    showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsOpenSoundFailed'));//提示语待定
				},  true);
			}
		}
	}
	else if(HWP.wnds[0].isPlaying && m_bSound)
	{
		m_PreviewOCX.HWP_CloseSound();
		m_bSound = false;		
		$("#opensound").removeClass().addClass("closesound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'opensound'));
		sliderVolume.wsetValue(0);
	}
}
/*************************************************
Function:		GoTime
Description:	定位
Input:			无
Output:			无
return:			无
*************************************************/
function GoTime()
{
    //debugger;
	if(HWP.wnds[0].isPlaying)
	{
		StopPlayBack();
	}

	SearchRecordFile(2);
	
	var time = m_dtCalendarDate + " " + $('#time_shi').val()+":"+$('#time_fen').val()+":"+$('#time_miao').val();

	tTimeBar.setMidLineTime(time);
	
	StartPlayBack();
}
/*************************************************
Function:		DownloadGo
Description:	弹出窗口下载回放文件列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function DownloadGo()
{ 
	if(m_bWndSearched)
	{
		if(m_szStartTimeSet.length > 0)
		{
			if(m_DownWindow && m_DownWindow.open && !m_DownWindow.closed)
			{  
				g_transStack.push(function()
				{
					showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsDownloadWnd'));
				}, true);
				m_DownWindow.focus();
				return;
			}
			m_DownWindow = window.open("download.asp",'Download','height=493,width=680,top=250,left=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
		}
	}
	else
	{
		g_transStack.push(function()
		{
			showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsDownload'));
		}, true);
	}
}
/*************************************************
Function:		expandTimebar
Description:	扩大时间条
Input:			无			
Output:			无
return:			无				
*************************************************/
function expandTimebar()
{
	g_iSpanType++;
	if(g_iSpanType > 12)
	{
		g_iSpanType = 12;
		return;
	}
	try
	{
		tTimeBar.SetSpantype(g_iSpanType);
	}
	catch(e)
	{
	}
}
/*************************************************
Function:		narrowTimebar
Description:	缩短时间条
Input:			无			
Output:			无
return:			无				
*************************************************/
function narrowTimebar()
{
	g_iSpanType--;
	if(g_iSpanType < 6)
	{
		g_iSpanType = 6;
		return;
	}
	try
	{
		tTimeBar.SetSpantype(g_iSpanType);
	}
	catch(e)
	{
	}
}

/*************************************************
Function:		PictureDownloadGo
Description:	图片下载
Input:			无			
Output:			无
return:			无				
*************************************************/
function PictureDownloadGo()
{
    if(m_PictureDownWindow && m_PictureDownWindow.open && !m_PictureDownWindow.closed)
	{
	    m_PictureDownWindow.focus();
		return;
	}
	m_PictureDownWindow = window.open("picturedownload.asp",'PictureDownload','height=620,width=941,top=250,left=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
}
/*************************************************
Function:		initVolumeSlider
Description:	初始化音量条
Input:			无			
Output:			无
return:			无				
*************************************************/
function initVolumeSlider()
{    
	var iVol;
	sliderVolume = new neverModules.modules.slider
	({
		 targetId: "volumeDiv",
		 sliderCss: "imageslider1",
		 barCss: "imageBar2",
		 min: 0,
		 max: 100
	}); 
	sliderVolume.onchange = function () 
	{
		if(!HWP.wnds[0].isPlaying)
		{
			this.wsetValue(0);							
		}
		else if(HWP.wnds[0].isPlaying)
		{
			iVol = sliderVolume.getValue();
			if(iVol > 0)
			{
				if(!m_bSound)
				{
					if(0 == m_PreviewOCX.HWP_OpenSound(0))
					{
						m_bSound = true;
						$("#opensound").removeClass().addClass("opensound").attr("title",parent.translator.translateNode(g_lxdPlayback, 'closesound'));
						SetVolume(iVol);
					}
					else
					{
						var iError = m_PreviewOCX.HWP_GetLastError();
						//声音设备被占用
						if(25 == iError)
						{
							g_transStack.push(function()
							{
								showTips('', parent.translator.translateNode(g_lxdPlayback, 'jsOpenSoundFailed'));//提示语待定
							},  true);
						}
					}
				}
				else
				{
					SetVolume(iVol);
				}
			}
			else
			{
				m_PreviewOCX.HWP_CloseSound(); 
				m_bSound = false;
				$("#opensound").removeClass().addClass("closesound");
			}
			sliderVolume.setTitle(''+iVol);
		}
	};
	sliderVolume.create();
}
/*************************************************
Function:		initMouseHover
Description:	初始化鼠标悬浮样式
Input:			无			
Output:			无
return:			无				
*************************************************/
function initMouseHover()
{
	$(".buttonmouseout").each(function()
	{
		$(this).hover
		(
			function () 
			{
			    if($(this).children().hasClass("capturedisable") || $(this).children().hasClass("recorddisable") || $(this).children().hasClass("stopdisable") || $(this).children().hasClass("slowlyforwarddisable") || $(this).children().hasClass("fastforwarddisable") || $(this).children().hasClass("singleframedisable") || $(this).children().hasClass("disEZoom"))
				{
					
				}
				else
				{
				    $(this).removeClass().addClass("buttonmouseover");
				}
			},
			function () 
			{
                $(this).removeClass().addClass("buttonmouseout");
			}
		);
	});
	$(".volumemouseout").each(function()
	{
		$(this).hover
		(
			function () 
			{
			    if($(this).children().hasClass("sounddisable"))
				{
					
				}
				else
				{
				    $(this).removeClass().addClass("volumemouseover");
				}
			},
			function () 
			{
                $(this).removeClass().addClass("volumemouseout");
			}
		);
	});		
}
/*************************************************
Function:		setEZoom
Description:	设置电子放大
Input:			无			
Output:			无
return:			无				
*************************************************/
function setEZoom() 
{
	if (HWP.wnds[0].isPlaying) {
		if(!g_bEnableEZoom) {
			if(m_PreviewOCX.HWP_EnableZoom(0,0) != 0) {
				return ;
			}
			$("#dvEZoomBtn").attr("title", getNodeValue("laDisableZoom")).attr("class", "StopEZoom");
			g_bEnableEZoom = true;
		} else {
			m_PreviewOCX.HWP_DisableZoom(0);
			$("#dvEZoomBtn").attr("title", getNodeValue("laEnableZoom")).attr("class", "StartEZoom");
			g_bEnableEZoom = false;
		}
	}
}