var m_szXmlStr="";
var m_bChannelRecord = false;   //通道是否在录像
var m_bSound = false;           //通道声音属否打开

var m_bPTZAuto = false;         //云台是否自动轮询
var m_bIsDiskFreeSpaceEnough = true;
var sliderPtzSpd = null;      //PTZ速度滑动条
var sliderVolume = null;      //声音滑动条

var m_szBrowser = navigator.appName; //获取浏览器名称
var m_szExit = "是否注销";
var m_iPtzSpeed = 60;
var m_iWndType = 0;
var m_iPtzMode = 1;//0为显示,1为隐藏

var m_iOperateMode = 0;         //弹出编辑路径窗口后的操作  0 - 添加 1 - 修改
var m_oOperated = null;         //被操作修改值的对象
var m_iProtocolType = 0;        //取流方式，默认为RTSP
var m_bLight = false;           //ptz灯光状态
var m_bWiper = false;
var m_oPtzTabs = null;          //云台预置点tabs对象

var m_szaudioCompressionType = 'G.711ulaw';
var m_iTalkNum = 0;  //语音对讲通道数
var m_bTalk = 0; //是否正在对讲
var m_iTalkingNO = 0; //正在对讲的通道号

var g_lxdPreview = null; // Preview.xml
var g_bEnable3DZoom = false; //是否开启3D定位
var g_bEnableEZoom = false; //是否开启电子定位
/*************************************************
Function:		InitPreview
Description:	初始化预览界面
Input:			无
Output:			无
return:			无
*************************************************/
function InitPreview() {
  //  debugger;
    //alert('InitPreview');
    $.cookie('page', null);
    /*
    $.cookie('page', null);
	m_szUserPwdValue = $.cookie('userInfo'+m_lHttpPort);
	if(m_szUserPwdValue === null) {
		window.parent.location.href="login.aspx";
		return;
	}
    */
    m_szUserPwdValue = "YWRtaW46MTIzNDU=";
		
    window.parent.document.getElementById("curruser").innerHTML = (Base64.decode(m_szUserPwdValue).split(":")[0]);		//显示用户

	window.parent.ChangeMenu(1);
	LatestPage();
	getUPnPInfo();
	
	m_oPtzTabs = $(".ptztabs").tabs(".ptzpanes", {tabs:"span",markCurrent:false});
	
	InitSlider();

	ChangeLanguage(parent.translator.szCurLanguage);

	
	if(!checkPlugin('2', parent.translator.translateNode(g_lxdPreview, 'laPlugin'), 1)) {
		$('#main_plugin').attr("style", "text-align:center;background-color:#343434;");
		$(".pluginLink").attr("style", "display:inline-block;margin-top:" + 280 + "px;");
		return;
	}
	m_PreviewOCX=document.getElementById("PreviewActiveX");
	//设置基本信息
	var szInfo = '<?xml version="1.0" encoding="utf-8"?><Information><WebVersion><Type>ipc</Type><Version>3.1.2.120416</Version><Build>20120416</Build></WebVersion><PluginVersion><Version>3.0.3.5</Version><Build>20120416</Build></PluginVersion><PlayWndType>0</PlayWndType></Information>';
	try {
		m_PreviewOCX.HWP_SetSpecialInfo(szInfo, 0);
	} catch(e) {	
	}
    //比较插件版本信息
	if(!CompareFileVersion()) {
		UpdateTips();
	}
	var szPathInfo = '';
	try {
		szPathInfo = m_PreviewOCX.HWP_GetLocalConfig();
	} catch(e) {
		szPathInfo = m_PreviewOCX.GetLocalConfig();
	}
	var xmlDoc = parseXmlFromStr(szPathInfo);
    m_iProtocolType = parseInt($(xmlDoc).find("ProtocolType").eq(0).text(), 10);
	if("anonymous:\177\177\177\177\177\177" === Base64.decode(m_szUserPwdValue)){
		$("#ptzshow").hide();
		$("#spOriginal").hide();
	}else{
		//某些初始化延后执行
		setTimeout(function() {
			//初始化预置点
			InitPreset();
			//验证巡航时间有效性输入
			$('#PatrolTime').bind('keyup', function() {
				var szVal = $(this).val();
				if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
					if(szVal.length > 1) {
						$(this).val(szVal.substring(0, szVal.length - 1));
					} else {
						$(this).val('1');
					}
				}
				var iVal = parseInt(szVal, 10);
				if(iVal > 30) {
					$(this).val('30');
				}
			});
			//验证巡航速度有效性输入
			$('#PatrolSpeed').bind('keyup', function() {
				var szVal = $(this).val();
				if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
					if(szVal.length > 1) {
						$(this).val(szVal.substring(0, szVal.length - 1));
					} else {
						$(this).val('1');
					}
				}
				if(parseInt(szVal, 10) > 40) {
					$(this).val('40');
				}
				if(parseInt(szVal, 10) < 1) {
					$(this).val('1');
				}
			});
			//云台添加hover事件
			$(".ptzDir").find("span").each(function() {
				$(this).hover(
					function () {
						$(this).addClass("sel");
					},
					function () {
						$(this).removeClass("sel");
					}
				);
			});
			//自动扫描点击事件
			$("#auto").unbind().hover(function () {
				if(!m_bPTZAuto) {
					$(this).addClass("sel");
				}
			},
			function() {
				if(!m_bPTZAuto) {
					$(this).removeClass("sel");
				}
			});
			//调焦、聚焦和光圈等按钮鼠标悬停样式
			$(".ptzBtnMid").find("span").each(function() {
				$(this).hover(
					function () {
						$(this).addClass("sel");
					},
					function () {
						$(this).removeClass("sel");
					}
				);
			});
			//灯光、雨刷、一键聚焦和镜头初始化等按钮鼠标悬停样式
			$(".ptzAidBg").find("span").each(function(i) {
				if(i%2 == 0) {
					$(this).hover(
						function () {
							$(this).addClass("sel");
						},
						function () {
							$(this).removeClass("sel");
						}
					);
				}
			});
			//视频底部栏按钮鼠标悬停样式
			$("#toolbar").find("span").each(function() {
				$(this).hover(
					function () {
						if($(this).hasClass("volumemouseout")) {
							if(!$(this).children().hasClass("sounddisable")) {
								$(this).removeClass().addClass("volumemouseover");	
							}	
						} else {
							if(!($(this).children().hasClass("capturedisable") || $(this).children().hasClass("recorddisable") || $(this).children().hasClass("disEZoom") || $(this).children().hasClass("dis3DZoom"))) {
								$(this).removeClass().addClass("btnmouseover");
							}
						}
					},
					function () {
						if($(this).hasClass("volumemouseover") || $(this).hasClass("volumemouseout")) {
							$(this).removeClass().addClass("volumemouseout");
						} else {
							$(this).removeClass().addClass("btnmouseout");
						}
					}
				);
			});
		}, 20);
		setTimeout(function() {
			InitPresetList();
			GetPatrolsCab();
			InitPattern();  // 初始化轨迹
		},  500);
	}
	autoSize();
	setTimeout(StartRealPlay, 100);
	if(!parent.g_bIsSupportAudio) {
	    $("#voiceTalk").parent().hide();
		$("#opensound").parent().hide();
	}
	$("#substream").removeClass().addClass("substreamout");
	$("#mainstream").removeClass().addClass("mainstreamover");
	if(window.parent.g_bIsIPDome){
		$("#dv3DZoom").show();
		$("#dvEZoom").hide();
	}else{
		$("#dv3DZoom").hide();
		$("#dvEZoom").show();
	}
}
/*************************************************
Function:		LastPage
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			无
Output:			无
return:			无				
*************************************************/
function LatestPage() {
    //  debugger;
    translator.initLanguageSelect($.cookie("language"));
    var lxd = translator.getLanguageXmlDoc("Main");
    translator.translatePage($(lxd).children("Main")[0], parent.document);
    g_lxdMain = $(lxd).children("Common")[0];
    translator.translateElements(g_lxdMain, $("#dvChangeSize")[0], "span", "title");
    var curpage = $.cookie('page');
    if (null == curpage) {
        //ChangeFrame("preview.aspx", 1);
  //  } else {
       // ChangeFrame(curpage.split("%")[0], curpage.split("%")[1]);
    }
}
/*************************************************
Function:		StartRealPlay
Description:	开始预览
Input:			iChannelNum：通道号
                iWndNum：窗口号  （默认当前选中窗口）
Output:			无
return:			无
*************************************************/
function StartRealPlay() {
    
	if(!HWP.wnds[0].isPlaying) {
		var szURL = "";
		if(m_iProtocolType == 4) {
			if(m_iStreamType == 0) {
				szURL = "rtsp://" +m_szHostName+ ":" +g_szHttpPort + "/PSIA/streaming/channels/101";
			} else {
				szURL = "rtsp://" +m_szHostName+ ":" +g_szHttpPort + "/PSIA/streaming/channels/102";
			}
		} else {
			if(m_iStreamType == 0) {
				szURL = "rtsp://" +m_szHostName+ ":" +m_lRtspPort + "/PSIA/streaming/channels/101";
			} else {
				szURL = "rtsp://" +m_szHostName+ ":" +m_lRtspPort + "/PSIA/streaming/channels/102";
			}
		}
		
		if (m_PreviewOCX.HWP_Play(szURL, m_szUserPwdValue, 0, "", "") != 0)
		{
			var iError = m_PreviewOCX.HWP_GetLastError();
			if(403 == iError) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			} else {
			    alert(iError);
			    alert(m_szUserPwdValue);
				alert(parent.translator.translateNode(g_lxdPreview, 'previewfailed'));
			}
			return;

		}
		HWP.wnds[0].isPlaying = true;
		m_bChannelRecord = false;

	    $("#capture").removeClass().addClass('capture');
	    $("#startRecord").removeClass().addClass('startrecord');	
		$("#opensound").removeClass().addClass('closesound');
		$("#play").removeClass().addClass("stoprealplay").attr("title", parent.translator.translateNode(g_lxdPreview, 'stoppreview'));
		$("#dvEZoomBtn").attr("title", getNodeValue("laEnableZoom")).attr("class", "StartEZoom");
		$("#Start3DZoom").attr("title", getNodeValue("Start3DZoom")).attr("class", "Start3DZoom");
	} else {
		StopRealPlay();
	}
}
/*************************************************
Function:		StopRealPlay
Description:	停止预览
Input:			iChannelNum : 通道号
Output:			无
return:			无
*************************************************/
function StopRealPlay() {
	//如果正在录像，先停止
	if(m_bChannelRecord) {
		StopRecord();
	}
	if(HWP.Stop(0) != 0) {
		alert(parent.translator.translateNode(g_lxdPreview, 'previewfailed'));
		return;
	}
	HWP.wnds[0].isPlaying = false; // 可去掉，wuyang
	m_bChannelRecord = false;
		
	//如果声音打开了，关闭声音
	if(m_bSound) {
		$("#opensound").attr("title", parent.translator.translateNode(g_lxdPreview, 'opensound'));
	}
	
	m_PreviewOCX.HWP_DisableZoom(0);
	$("#dvEZoomBtn").attr("class", "disEZoom").attr("title", "");
	g_bEnableEZoom = false;
	$("#Start3DZoom").attr("title", "").attr("class", "dis3DZoom");
	g_bEnable3DZoom = false;
	
	$("#capture").removeClass().addClass('capturedisable');
	$("#startRecord").removeClass().addClass('recorddisable');
	sliderVolume.wsetValue(0);
	$("#opensound").removeClass().addClass('sounddisable');
	$("#play").removeClass().addClass("play").attr("title", parent.translator.translateNode(g_lxdPreview, 'jsPreview'));
	m_bSound = false;
}
/*************************************************
Function:		StartRecord
Description:	开始录像
Input:			szFileName: 自定义录像文件名
Output:			无
return:			无
*************************************************/
function StartRecord(szFileName) {
	if(!m_bChannelRecord) {
		if(HWP.wnds[0].isPlaying) {
			var time = new Date();
			var szFileName = "";
			var szHostName = "";
			if(m_szHostName.indexOf("[") < 0) {
				szHostName = m_szHostName;
			} else {
				szHostName = m_szHostName.substring(1, m_szHostName.length - 1).replaceAll(":", ".");
			}
			szFileName = szHostName + "_01" + "_" + time.Format("yyyyMMddhhmmssS");
			var iRes = m_PreviewOCX.HWP_StartSave(0, szFileName);
			if(0 == iRes) {
				m_bChannelRecord = true;
				$("#startRecord").removeClass().addClass("stoprecord");
				$("#startRecord").attr("title", parent.translator.translateNode(g_lxdPreview, 'stoprecord'));
				m_bIsDiskFreeSpaceEnough = true;
				//强制I帧
				$.ajax({
					type:"PUT",
					url:m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/1/requestKeyFrame",
					async:false,
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0");  
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					}
				});
			} else if(-1 == iRes) {
				var iError = m_PreviewOCX.HWP_GetLastError();
				if(10 == iError || 9 == iError) {
					alert(parent.translator.translateNode(g_lxdPreview, 'jsCreateFileFailed'));
				} else {
					alert(parent.translator.translateNode(g_lxdPreview, 'recordfailed'));
				}
			} else if(-2 == iRes) {
				m_bIsDiskFreeSpaceEnough = false;
				alert(parent.translator.translateNode(g_lxdPreview, 'FreeSpaceTips'));
			} else if(-3 == iRes) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsCreateFileFailed'));
			}
		}
	} else {
		StopRecord();
	}
}
/*************************************************
Function:		StopRecord
Description:	停止录像
Input:			无
Output:			无
return:			无
*************************************************/
function StopRecord() {
	var szRecord = parent.translator.translateNode(g_lxdPreview, 'jsRecord');	//录像
	var iRes = m_PreviewOCX.HWP_StopSave(0);
	if(0 == iRes) {
		m_bChannelRecord = false;
		g_transStack.push(function() {
 		    showTips("", parent.translator.translateNode(g_lxdPreview, 'jsRecordSucc'));
		},  true);
	}
	$("#startRecord").removeClass().addClass("startrecord");
	$("#startRecord").attr("title", parent.translator.translateNode(g_lxdPreview, 'jsRecord'));
}
/*************************************************
Function:		CapturePicture
Description:	抓图
Input:			无
Output:			无
return:			无
*************************************************/
function CapturePicture() {
	if(HWP.wnds[0].isPlaying) {
		var time = new Date();
		var szFileName = "";
		var szHostName = "";
		if(m_szHostName.indexOf("[") < 0) {
			szHostName = m_szHostName;
		} else {
			szHostName = m_szHostName.substring(1, m_szHostName.length - 1).replaceAll(":", ".");
		}
		szFileName = szHostName + "_01" + "_" + time.Format("yyyyMMddhhmmssS");
		
		var iRes = m_PreviewOCX.HWP_CapturePicture(0, szFileName);
		if(iRes == 0) {
			g_transStack.push(function() {
			    showTips("", parent.translator.translateNode(g_lxdPreview, 'jsCaptureSucc'));
			},  true);
		} else if(iRes == -1) {
			var iError = m_PreviewOCX.HWP_GetLastError();
			if(10 == iError || 9 == iError) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsCreateFileFailed'));
			} else {
				alert(parent.translator.translateNode(g_lxdPreview, 'capturefailed'));
			}
		} else if(-2 == iRes) {
			alert(parent.translator.translateNode(g_lxdPreview, 'FreeSpaceTips'))
		} else if(-3 == iRes) {
			alert(parent.translator.translateNode(g_lxdPreview, 'jsCreateFileFailed'));
		} else {
			//未定义
		}
	}
}
/*************************************************
Function:		OpenSound
Description:	声音控制
Input:			无
Output:			无
return:			无
*************************************************/
function OpenSound() {
	if(HWP.wnds[0].isPlaying) {
		if(!m_bSound) {
			if(0 == m_PreviewOCX.HWP_OpenSound(0)) {
				$("#opensound").removeClass().addClass('opensound');
				$("#opensound").attr("title", parent.translator.translateNode(g_lxdPreview, 'closesound'));
				m_bSound = true;
				SetVolume(50);
			} else {
				var iError = m_PreviewOCX.HWP_GetLastError();
				//声音设备被占用
				if(25 == iError) {
					alert(parent.translator.translateNode(g_lxdPreview, 'jsOpenSoundFailed'));//提示语待定
				}
			}
		} else {
			m_PreviewOCX.HWP_CloseSound();
			$("#opensound").removeClass().addClass('closesound');
			$("#opensound").attr("title", parent.translator.translateNode(g_lxdPreview, 'opensound'));
			m_bSound = false;
			sliderVolume.wsetValue(0);
		}
	}
}
/*************************************************
Function:		SetVolume
Description:	设置音量
Input:			lVolume     音量   0-100
Output:			无
return:			无
*************************************************/
function SetVolume(lVolume) {
	if(0==m_PreviewOCX.HWP_SetVolume(0, lVolume)) {
		sliderVolume.wsetValue(lVolume);
		sliderVolume.setTitle(''+lVolume);
	}
}
/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan：语言
Output:			无
return:			无
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan) {
	g_lxdPreview = parent.translator.getLanguageXmlDoc("Preview", lan);
	parent.translator.appendLanguageXmlDoc(g_lxdPreview, parent.g_lxdMain);
	parent.translator.translatePage(g_lxdPreview, document);
	
	window.parent.document.title = parent.translator.translateNode(g_lxdPreview, "title");
	m_szExit = parent.translator.translateNode(g_lxdPreview, "exit");
	
	parent.translator.translateElements(g_lxdPreview, $("#toolbar")[0], "div", "title");
	
	parent.translator.translateElements(g_lxdPreview, $(".ptzAid")[0], "span", "title");
	//添加云台操作提示语
	$("#zoomIn").attr("title", getNodeValue("laZoom")+" +");
	$("#zoomOut").attr("title", getNodeValue("laZoom")+" -");
	$("#focusIn").attr("title", getNodeValue("laFocus")+" +");
	$("#focusOut").attr("title", getNodeValue("laFocus")+" -");
	$("#irisIn").attr("title", getNodeValue("laIris")+" +");
	$("#irisOut").attr("title", getNodeValue("laIris")+" -");
	
	//parent.translator.translateElements(g_lxdPreview, $(".ptzDis")[0], "div", "title");
	//添加预置点相关操作提示语
	$(".tab1").attr("title", getNodeValue("laPreset"));
	$(".tab2").attr("title", getNodeValue("Patrol"));
	$(".tab3").attr("title", getNodeValue("Pattern"));
	
	$(".gotoPreset").attr("title", getNodeValue("ExcutePreset"));
	$(".setPreset").attr("title", getNodeValue("SetPreset"));
	$(".cleanPreset").attr("title", getNodeValue("CleanPreset"));
	
	$(".start").attr("title", getNodeValue("Start"));
	$(".stop").attr("title", getNodeValue("stop"));
	$(".save").attr("title", getNodeValue("laSaveBtn"));
	$(".delete").attr("title", getNodeValue("DelDigitalIpBtn"));
	$(".startSave").attr("title", getNodeValue("StartSave"));
	$(".stopSave").attr("title", getNodeValue("StopSave"));
	//是否预览
	if (HWP.wnds[0].isPlaying) {
		$("#play").attr("title", parent.translator.translateNode(g_lxdPreview, 'stoppreview'));
	} else {
		$("#play").attr("title", parent.translator.translateNode(g_lxdPreview, 'jsPreview'));
	}
	if (m_bChannelRecord) {
		$("#startRecord").attr("title", parent.translator.translateNode(g_lxdPreview, 'stoprecord'));
	} else {
		$("#startRecord").attr("title", parent.translator.translateNode(g_lxdPreview, 'jsRecord'));
	}
	if (m_bSound) {
		$("#opensound").attr("title", parent.translator.translateNode(g_lxdPreview, 'closesound'));
	} else {
		$("#opensound").attr("title", parent.translator.translateNode(g_lxdPreview, 'opensound'));
	}
	if(g_bEnable3DZoom){
		$("#Start3DZoom").attr("title", getNodeValue("Stop3DZoom"));
	}else{
		if($("#Start3DZoom").hasClass("dis3DZoom")) {
			$("#Start3DZoom").attr("title", "");
		} else {
			$("#Start3DZoom").attr("title", getNodeValue("Start3DZoom"));
		}
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
	$("#spOriginal").attr("title", parent.translator.translateNode(g_lxdPreview, 'windowProportionOpt1'));
	$("#sizeauto").attr("title", parent.translator.translateNode(g_lxdPreview, 'windowAuto'));
	$("#ptzshow").attr("title", parent.translator.translateNode(g_lxdPreview, 'laPTZ'));
	
	sliderPtzSpd.setTitle(parent.translator.translateNode(g_lxdPreview, 'ptzSpeed') + ':' + (m_iPtzSpeed > 90 ? 7 : parseInt(m_iPtzSpeed/15)));
	
    InitPatrolLan();
	InitPresetListLan();
	if($('#divPreviewTips').css('display') != 'none') {
	    g_transStack.translate();
	}	
}
/*************************************************
Function:		showTips
Description:	显示提示语
Input:			title:标题
                strTips:提示语
Output:			无
return:			无				
*************************************************/
var g_iShowTipsTimer;
function showTips(title, strTips) {
	$('#laPreviewTips').html(strTips);
	$('#divPreviewTips').show();
	clearTimeout(g_iShowTipsTimer);
	g_iShowTipsTimer = setTimeout(function() {
	    $('#laPreviewTips').html('');
		$('#divPreviewTips').hide();    			
	},  5000);	
}
/*************************************************
Function:		InitPatrolLan
Description:	初始化路径选择下拉框语言
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPatrolLan() {
	var oSelect = document.getElementById("selectPatrol");
	var iLen = oSelect.options.length;
	var szName = parent.translator.translateNode(g_lxdPreview, 'laTrack');
	for (var i = 0; i < iLen; i++) {
		oSelect.options[i].text = szName + " " + (i+1);
   	}
}

/*************************************************
Function:		InitPresetList
Description:	初始化预置点下拉框
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPresetList() {
	$("#SelectPreset").empty();
	var szName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
	for(var i = 0; i < 256; i++) {
		if(window.parent.g_bIsIPDome) {
			if((i >= 32 && i < 44) || (i > 90 && i < 105)) {
				continue;
			}
		}
		$("<option value='"+ (i+1) +"'>"+szName+" "+(i+1)+"</option>").appendTo("#SelectPreset");
   	}
}
/*************************************************
Function:		InitPresetListLan
Description:	初始化预置点下拉框语言
Input:			无			
Output:			无
return:			无				
*************************************************/
function InitPresetListLan() {
	var szPresetName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
	$("#SelectPreset").find("option").each(function() {
		var szName = $(this).html();
		$(this).html(szPresetName+" "+szName.split(" ")[1]);
	});
}
/*************************************************
Function:		PluginEventHandler
Description:	回放事件响应
Input:			iEventType 事件类型, iParam1 参数1, iParam2 保留
Output:			无
return:			无
*************************************************/
function PluginEventHandler(iEventType, iParam1, iParam2) {
	if(21 == iEventType) {
		if(m_bIsDiskFreeSpaceEnough) {
			m_bIsDiskFreeSpaceEnough = false;
		    setTimeout(function() {alert(parent.translator.translateNode(g_lxdPreview, 'FreeSpaceTips'));}, 2000);
		}
		StopRecord();
	} else if(3 == iEventType) {
		m_PreviewOCX.HWP_StopVoiceTalk();
		m_bTalk = 0;
		$("#voiceTalk").removeClass().addClass("voiceoff").attr("title", parent.translator.translateNode(g_lxdPreview, 'voiceTalk'));
		setTimeout(function() {alert(parent.translator.translateNode(g_lxdPreview, 'VoiceTalkFailed'));}, 2000);
	}
}
/*************************************************
Function:		GetSelectWndInfo
Description:	获取选中窗口信息
Input:			SelectWndInfo:窗口信息xml
Output:			无
return:			无
*************************************************/
function GetSelectWndInfo(SelectWndInfo) {
	return;
}
/*************************************************
Function:		SetZoomInStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetZoomInStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + (m_iPtzSpeed) + "</zoom></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZCallback
Description:	ptz设置回调
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZCallback(xhr) {
	if(xhr.status == 403) {
		alert(getNodeValue('jsNoOperationRight'));
	}
}
/*************************************************
Function:		StopPTZAuto
Description:	停止云台自转
Input:			无
Output:			无
return:			无
*************************************************/
function StopPTZAuto() {
	if(m_bPTZAuto) {
		//如果云台自转，就停止
		ptzAuto();
	}
}
/*************************************************
Function:		SetZoomOutStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetZoomOutStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + (-m_iPtzSpeed) + "</zoom></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZStop
Description:	停止PTZ操作
Input:			iType 操作类型
Output:			无
return:			无
*************************************************/
function SetPTZStop(iType) {
	if(!HWP.wnds[0].isPlaying) {
		return;	
	}	
	StopPTZAuto();
	var szXml = "";
	if(iType == 0) {
		szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + 0 + "</tilt></PTZData>";	
	} else {
		szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + 0 + "</zoom></PTZData>";	
	}
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftStart
Description:	开始向左转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":"+ m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftUpStart
Description:	开始向左上转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftUpStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZLeftDownStart
Description:	开始向左下转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZLeftDownStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightStart
Description:	开始向右转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightUpStart
Description:	开始向右上转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightUpStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZRightDownStart
Description:	开始向右下转
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZRightDownStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (m_iPtzSpeed) + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZUpStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZUpStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + (m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPTZDownStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetPTZDownStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + (-m_iPtzSpeed) + "</tilt></PTZData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		ptzAuto
Description:	云台自动
Input:			无
Output:			无
return:			无
*************************************************/
function ptzAuto() {
	if(!window.parent.g_bIsIPDome) {
		if(!HWP.wnds[0].isPlaying) {
			return;	
		}	
		var szXml = "";
		if(!m_bPTZAuto) {
			szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
		} else {
			szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + 0 + "</tilt></PTZData>";
		}
		var xmlDoc = parseXmlFromStr(szXml);
		$.ajax({
			type: "PUT",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/autoptz",
			processData: false,
			data: xmlDoc,
			success: function(xmlDoc, textStatus, xhr) {
				m_bPTZAuto = !m_bPTZAuto;
				if(m_bPTZAuto) {
					$("#auto").addClass("sel");
				} else {
					$("#auto").removeClass("sel");
				}
			},
			error: function() {
				if(!m_bPTZAuto) {
					szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + (-m_iPtzSpeed) + "</pan><tilt>" + 0 + "</tilt></PTZData>";
				} else {
					szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + 0 + "</pan><tilt>" + 0 + "</tilt></PTZData>";
				}				
				var xmlDoc = parseXmlFromStr(szXml);
				$.ajax({
					type: "PUT",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("If-Modified-Since", "0");
						xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
					},
					url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/continuous",
					processData: false,
					data: xmlDoc,
					success: function(xmlDoc, textStatus, xhr) {
						m_bPTZAuto = !m_bPTZAuto;
						if(m_bPTZAuto) {
							$("#auto").addClass("sel");
						} else {
							$("#auto").removeClass("sel");
						}
					},
					error: function(xhr, textStatus, errorThrown) {
						if(xhr.status == 403) {
							alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
						}
					}
				});
			}
		});
	} else {  //球机调用特殊预置点
		if(!HWP.wnds[0].isPlaying) {
			return;	
		}
		var szURL = "";
		if(!m_bPTZAuto) {
			szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/presets/"+ 99 +"/goto";
		} else {
			szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/presets/"+ 96 +"/goto";
		}
		$.ajax({
			type: "PUT",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("If-Modified-Since", "0");
				xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			},
			url: szURL,
			success: function(xmlDoc, textStatus, xhr) {
				m_bPTZAuto = !m_bPTZAuto;
				if(m_bPTZAuto) {
					$("#auto").addClass("sel");
				} else {
					$("#auto").removeClass("sel");
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				if(xhr.status == 403) {
					alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
				}
			}
		});	
	}
}
/*************************************************
Function:		SetFocusInStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusInStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + (m_iPtzSpeed) + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/focus",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetFocusStop
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusStop() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + 0 + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/focus",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetFocusOutStart
Description:	
Input:			无
Output:			无
return:			无
*************************************************/
function SetFocusOutStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + (-m_iPtzSpeed) + "</focus></FocusData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/focus",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisInStart
Description:	
Input:          无
Output:			无
return:			无
*************************************************/
function IrisInStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + (m_iPtzSpeed) + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/iris",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisOutStart
Description:	
Input:			iChannel  通道号
Output:			无
return:			无
*************************************************/
function IrisOutStart() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + (-m_iPtzSpeed) + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/iris",
		processData: false,
		data: xmlDoc,		
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		IrisStop
Description:	
Input:			iChannel  通道号
Output:			无
return:			无
*************************************************/
function IrisStop() {	
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + 0 + "</iris></IrisData>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1/iris",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SetPresetFun
Description:	设置预置点
Input:			iPresetId 预置点ID
Output:			无
return:			无
*************************************************/
function SetPresetFun(iPresetId) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	StopPTZAuto();
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZPreset><id>" + iPresetId + "</id><presetName>" + getNodeValue("laPreset") + " " + iPresetId + "</presetName></PTZPreset>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/presets/" + iPresetId,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		GotoPreset
Description:	调用预置点
Input:			iPresetId 预置点ID
Output:			无
return:			无
*************************************************/
function GotoPreset(iPresetId) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	StopPTZAuto();
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/presets/" + iPresetId + "/goto",
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		CleanPreset
Description:	清除预置点
Input:			iPresetId 预置点ID
Output:			无
return:			无
*************************************************/
function CleanPreset(iPresetId) {
	StopPTZAuto();
	$.ajax({
		type: "DELETE",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/presets/" + iPresetId,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		InitSlider
Description:	初始化预览页面滑动条
Input:			无
Output:			无
return:			无
*************************************************/
function InitSlider() {	
	sliderPtzSpd = new neverModules.modules.slider({
	     targetId: "ptzSlider",
	     sliderCss: "speedSlider",
	     barCss: "speedBar",
	     min: 1,
	     max: 7,
	     hints: ""
	}); 
	sliderPtzSpd.create();	
	sliderPtzSpd.onchange = function () {
		var spd= sliderPtzSpd.getValue();
		if(spd < 7) {
		  m_iPtzSpeed = spd*15;
		} else {
		  m_iPtzSpeed = 100;
		}
		sliderPtzSpd.setTitle(parent.translator.translateNode(g_lxdPreview, 'ptzSpeed') + ':' + spd);  //云台活动条提示
	};
    var iVol;
	sliderVolume = new neverModules.modules.slider({
	     targetId: "volumeDiv",
		 sliderCss: "imageslider1",
		 barCss: "imageBar2",
		 min: 0,
		 max: 100
	});
	sliderVolume.create();
	sliderVolume.onchange = function () {
	    if(!HWP.wnds[0].isPlaying) {
		    this.wsetValue(0);							
		} else {
		    iVol = sliderVolume.getValue();
			if(iVol > 0) {
				if(!m_bSound) {		        
					if(0 == m_PreviewOCX.HWP_OpenSound(0)) {
						m_bSound = true;
						$("#opensound").removeClass().addClass("opensound").attr("title",parent.translator.translateNode(g_lxdPreview, 'closesound'));
						SetVolume(iVol);
					} else {
						var iError = m_PreviewOCX.HWP_GetLastError();
						//声音设备被占用
						if(25 == iError) {
							g_transStack.push(function() {
								showTips('', parent.translator.translateNode(g_lxdPreview, 'jsOpenSoundFailed'));//提示语待定
							},  true);
						}
					}
				} else {
					SetVolume(iVol);
				}
			} else {
				m_PreviewOCX.HWP_CloseSound(); 
				m_bSound = false;
				$("#opensound").removeClass().addClass("closesound");
			}
			sliderVolume.setTitle(''+iVol);
		}
	};	
}

/*************************************************
Function:		InitPreset
Description:	初始化预置点
Input:			无 
Output:			无
return:			无
*************************************************/
function InitPreset() {
	var szName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
	for(var i = 1; i < 257; i++) {
		$("<div><span><label name='laPreset' class='fontnormal'>" + szName + "</label> " + i + "</span><span></span><span></span><span></span></div>").appendTo("#PresetArea").bind("click", {index: i}, function(event) {
			if(!$(this).hasClass("select")) {
				$(this).siblings(".select").each(function() {
					$(this).removeClass("select");
					$(this).children("span").eq(1).removeClass("gotoPreset").unbind();
					$(this).children("span").eq(2).removeClass("setPreset").unbind();
					$(this).children("span").eq(3).removeClass("cleanPreset").unbind();
				});
				$(this).attr("class","select");
				$(this).children("span").eq(1).addClass("gotoPreset").attr("title", getNodeValue("ExcutePreset")).bind("click",{index: event.data.index},function(event) {
					GotoPreset(event.data.index);
				});
				$(this).children("span").eq(2).addClass("setPreset").attr("title", getNodeValue("SetPreset")).bind("click",{index: event.data.index},function(event) {
					SetPresetFun(event.data.index);
				});
				$(this).children("span").eq(3).addClass("cleanPreset").attr("title", getNodeValue("CleanPreset")).bind("click",{index: event.data.index},function(event) {
					CleanPreset(event.data.index);
				});
			}
		}).bind({
			mouseover:function() {
				if(!$(this).hasClass("select")) {
					$(this).addClass("enter");
				}
			},
			mouseout:function() {
				$(this).removeClass("enter");
			}
		}).children("span").eq(0).addClass("firstchild");
	}
}

/*************************************************
Function:		InsertPresetList
Description:	插入预置点到巡航路径中
Input:			iNo：序号
                iPresetID :    预置点序号
                iPatrolTime : 延时
				iPatrolSpeed : 速度
Output:			无
return:			无
*************************************************/
function InsertPresetList(iNo, iPresetID, iPatrolTime, iPatrolSpeed) {
	var szName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
	$('#PatrolPresetList').children("div").last().children("span").eq(0).removeClass("delete");	
	$("<div><span class='firstchild'></span><span class='secondchild'>"+iNo+"</span><span class='thirdchild' id='"+iPresetID+"'><label name='laPreset' class='fontnormal'>"+szName+"</label>"+iPresetID+"</span><span class='fouthchild'>"+iPatrolTime+"s</span><span>"+iPatrolSpeed+"</span><span></span></div>").appendTo("#PatrolPresetList").bind({
		click:function() {
			if(!$(this).hasClass("select")) {
				$(this).siblings(".select").each(function() {
					$(this).removeClass("select");
					$(this).children("span").eq(5).removeClass("edit").unbind();
				});
				$(this).attr("class","select");
				var parent = this;
				$(this).children("span").eq(5).addClass("edit").bind("click",{parent:parent},function(event) {
					var oParent = event.data.parent;
					var oChildren = $(oParent).children("span");
					var iPresetId = oChildren.eq(2).attr("id");
					var iPatrolTime = oChildren.eq(3).text().split("s")[0];
					var iPatrolSpeed = oChildren.eq(4).text();
					EditPresetListDlg(oParent, 1, iPresetId, iPatrolTime, iPatrolSpeed);
				});
			}
		},
		mouseover:function() {
			if(!$(this).hasClass("select")) {
				$(this).addClass("enter");
			}
		},
		mouseout:function() {
			$(this).removeClass("enter");
		}
	}).children("span").eq(0).bind("click",function() {
		if($('#PatrolPresetList').children("div").index($(this).parent()) != ($('#PatrolPresetList').children("div").length-1)) {
			return;
		}
		$('#PatrolPresetList').children("div").last().remove();
		if($('#PatrolPresetList').children("div").last().hasClass("select")) {
			$('#PatrolPresetList').children("div").last().click().children("span").eq(0).addClass("delete");
		} else {
			$('#PatrolPresetList').children("div").last().children("span").eq(0).addClass("delete");
		}
	}).addClass("delete");	
	$("#PatrolPresetList").scrollTop(1000);
}

/*************************************************
Function:		EditPresetListDlg
Description:	弹出编辑窗口
input:          obj : 当前点击对象
Output:			无
return:			无
*************************************************/
function EditPresetListDlg(obj, iOperateMode, iPresetID, iPatrolTime, iPatrolSpeed) {
	if(0 == iOperateMode) {
		if($('#PatrolPresetList').children("div").length >= 32) {
			return;
		}
	}
	m_iOperateMode = iOperateMode;
	m_oOperated = obj;
	$('#SelectPreset').val(iPresetID);
	$('#PatrolTime').val(iPatrolTime);
	$('#PatrolSpeed').val(iPatrolSpeed);
	
	$('#EditPatrolPreset').css('right', '2px');
	$('#EditPatrolPreset').css('top', $(obj).offset().top - $('#EditPatrolPreset').height() + 30);
	$('#EditPatrolPreset').modal();
}

/*************************************************
Function:		onPresetListDlgOk
Description:	路径编辑窗口确定键事件响应
input:          无
Output:			无
return:			无
*************************************************/
function onPresetListDlgOk() {
	if(m_iOperateMode == 0) {
		InsertPresetList($('#PatrolPresetList').children("div").length + 1, $('#SelectPreset').attr("value"), $('#PatrolTime').val(), $('#PatrolSpeed').val());
	} else {
		var szName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
		var obj = $(m_oOperated).children("span");
		obj.eq(2).html("<label name='laPreset' class='fontnormal'>"+szName+'</label>'+$('#SelectPreset').attr("value")).attr("id", $('#SelectPreset').attr("value"));
		obj.eq(3).html($('#PatrolTime').val()+'s');
		obj.eq(4).html($('#PatrolSpeed').val());
		obj.eq(5).unbind().bind("click",{parent:m_oOperated,a:$('#SelectPreset').attr("value"),b:$('#PatrolTime').val(),c:$('#PatrolSpeed').val()},function(event) {
			EditPresetListDlg(event.data.parent, 1, event.data.a, event.data.b, event.data.c);
		});
	}
	$.modal.impl.close();
}
/*************************************************
Function:		GetPatrol
Description:	获取一条路径
Input:			iNo：序号
Output:			无
return:			无
*************************************************/
function GetPatrol(iPatrolID) {
	$.ajax({
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/patrols/" + iPatrolID,
		complete:function(xhr, textStatus) {
			$('#PatrolPresetList').empty();
			if(xhr.status==200) {
				var xmlDoc = xhr.responseXML;
				var iPresetNum = 0;
				var szName = parent.translator.translateNode(g_lxdPreview, 'laPreset');
				iPresetNum = $(xmlDoc).find('PatrolSequence').length;
				for(i = 0; i < iPresetNum; i++) {
					var iPresetID = parseInt($(xmlDoc).find('presetID').eq(i).text(),10);				
					if(iPresetID <= 0) {
						break;
					}
					InsertPresetList(i+1, iPresetID, $(xmlDoc).find('delay').eq(i).text(), $(xmlDoc).find('seqSpeed').eq(i).text())
				}
			}
		}
	});
}
/*************************************************
Function:		StartPatrol
Description:	开始一条路径
Input:			iNo：序号
Output:			无
return:			无
*************************************************/
function StartPatrol() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	var iPatternID = $('#selectPatrol').val();
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/patrols/" + iPatternID + "/start",
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		StopPatrol
Description:	停止一条路径
Input:			iNo：序号
Output:			无
return:			无
*************************************************/
function StopPatrol() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}	
	var iPatternID = $('#selectPatrol').val();
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/patrols/" + iPatternID + "/stop",
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		SavePatrol
Description:	保存一条路径
Input:			无
Output:			无
return:			无
*************************************************/
function SavePatrol() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	var iPatternID = $('#selectPatrol').attr("value");
	var szXml = "";
	$("#PatrolPresetList").children("div").each(function() {
		var oChildren = $(this).children("span");
		var iPresetId = parseInt(oChildren.eq(2).attr("id"), 10);
		var iPatrolTime = parseInt(oChildren.eq(3).text().split("s")[0], 10);
		var iPatrolSpeed = oChildren.eq(4).text();
		szXml += "<PatrolSequence><presetID>" + iPresetId + "</presetID><delay>" + iPatrolTime + "</delay><Extensions><selfExt><seqSpeed>" + iPatrolSpeed +
		"</seqSpeed></selfExt></Extensions></PatrolSequence>";
	});
	szXml = "<?xml version='1.0' encoding='UTF-8'?><PTZPatrol><id>" + iPatternID + "</id><patrolName>patrol "+ (iPatternID>9?iPatternID:("0"+iPatternID)) + "</patrolName><PatrolSequenceList>" +
	szXml + "</PatrolSequenceList></PTZPatrol>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/patrols/" + iPatternID,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SetPTZCallback(xhr);
		}
	});
}
/*************************************************
Function:		DeletePatrol
Description:	删除一条路径
Input:			无
Output:			无
return:			无
*************************************************/
function DeletePatrol() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	var iPatternID = $('#selectPatrol').attr("value");
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/PTZ/channels/1/patrols/"+ iPatternID;
	$.ajax({
		type: "DELETE",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		success: function(xmlDoc, textStatus, xhr) {
			$('#PatrolPresetList').empty();
		}
	});
}
/*************************************************
Function:		InitPattern
Description:	初始化轨迹
Input:			无 
Output:			无
return:			无
*************************************************/
function InitPattern() {
	$.ajax({
		type: "GET",
		async: true,
		timeout: 15000,
	    //url: m_lHttp + m_szHostName + ":" + m_lHttpPort +  "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns",
		url: "Preview.ashx",
		data: "method=InitPattern",
		success: function(xmlDoc, textStatus, xhr) {
			var szName = parent.translator.translateNode(g_lxdPreview, 'Pattern');
			var iLen = $(xmlDoc).find('PTZPattern').length;
			if(0 == iLen) {
				m_oPtzTabs.hideTab(2);
				return;
			}
			for(var i = 1; i <= iLen; i++) {
				$("<div><span><label name='Pattern' class='fontnormal'>" + szName + "</label> " + i +"</span><span></span><span></span><span></span><span></span><span></span></div>").appendTo("#TrackArea").bind("click",{index: i}, function(event) {
					if(!$(this).hasClass("select")) {
						$(this).siblings(".select").each(function() {
							$(this).removeClass("select");
							$(this).children("span").eq(1).removeClass("start").unbind();
							$(this).children("span").eq(2).removeClass("stop").unbind();
							$(this).children("span").eq(3).removeClass("startSave").unbind();
							$(this).children("span").eq(4).removeClass("stopSave").unbind();
							$(this).children("span").eq(5).removeClass("delete").unbind();
						});
						$(this).attr("class","select");
						$(this).children("span").eq(1).addClass("start").attr("title", getNodeValue("Start")).bind("click",{index: event.data.index},function(event) {
							StartPattern(event.data.index);
						});
						$(this).children("span").eq(2).addClass("stop").attr("title", getNodeValue("stop")).bind("click",{index: event.data.index},function(event) {
							StopPattern(event.data.index);
						});
						$(this).children("span").eq(3).addClass("startSave").attr("title", getNodeValue("StartSave")).bind("click",{index: event.data.index},function(event) {
							StartRecordPattern(event.data.index);
						});
						$(this).children("span").eq(4).addClass("stopSave").attr("title", getNodeValue("StopSave")).bind("click",{index: event.data.index},function(event) {
							StopRecordPattern(event.data.index);
						});
						$(this).children("span").eq(5).addClass("delete").attr("title", getNodeValue("DelDigitalIpBtn")).bind("click",{index: event.data.index},function(event) {
							DeletePattern(event.data.index);
						});
					}
				}).bind({
					mouseover:function() {
						if(!$(this).hasClass("select")) {
							$(this).addClass("enter");
						}
					},
					mouseout:function() {
						$(this).removeClass("enter");
					}
				}).children("span").eq(0).addClass("firstchild");
			}
			
		},
		error:function() {
			m_oPtzTabs.hideTab(2);
		}
	});
}

/*************************************************
Function:		StartRecordPattern
Description:	开始记录轨迹
                iPatternID : 轨迹ID
Output:			无
return:			无
*************************************************/
function StartRecordPattern(iPatternID) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns/"+ iPatternID +"/recordstart",
		processData: false,
		complete:function(XHR, textStatus) {
			if(XHR.status == 403) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		StopRecordPattern
Description:	停止记录轨迹
                iPatternID : 轨迹ID
Output:			无
return:			无
*************************************************/
function StopRecordPattern(iPatternID) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	var szURL=m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/Custom/SelfExt/PTZ/channels/1/patterns/"+ iPatternID +"/recordstop";
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: szURL,
		processData: false,
		complete:function(XHR, textStatus) {
			if(XHR.status == 403) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		StartPattern
Description:	开始轨迹
                iPatternID : 轨迹ID
Output:			无
return:			无
*************************************************/
function StartPattern(iPatternID) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns/" + iPatternID + "/run",
		processData: false,
		complete:function(XHR, textStatus) {
			if(XHR.status == 403) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		StopPattern
Description:	停止轨迹
                iPatternID : 轨迹ID
Output:			无
return:			无
*************************************************/
function StopPattern(iPatternID) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns/" + iPatternID + "/stop",
		processData: false,
		complete:function(XHR, textStatus) {
			if(XHR.status == 403) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		DeletePattern
Description:	删除轨迹
                iPatternID : 轨迹ID
Output:			无
return:			无
*************************************************/
function DeletePattern(iPatternID) {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	$.ajax({
		type: "DELETE",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/patterns/" + iPatternID,
		processData: false,
		complete:function(XHR, textStatus) {
			if(XHR.status == 403) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		GetPatrolsCab
Description:	获取巡航路径的能力
input:          无
Output:			无
return:			无
*************************************************/
function GetPatrolsCab() {
	$.ajax({
	    type: "GET",
	    //url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/PTZ/channels/1/patrols",
	    url: "Preview.ashx",
	    data: "method=patrols",
	    async: true,
	    timeout: 30000,
	    /*beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},*/

		success: function(xmlDoc, textStatus, xhr) {
			var iLen = $(xmlDoc).find('PTZPatrol').length;
			if(0 == iLen) {
				m_oPtzTabs.hideTab(1);
				return;
			}
			$("#selectPatrol").empty();
			var szName = parent.translator.translateNode(g_lxdPreview, 'laTrack');
			for(var i = 0; i < iLen; i++) {
				if (i < 9) {
					$("<option value='"+ (i+1) +"'>"+szName+" 0"+(i+1)+"</option>").appendTo("#selectPatrol");
				} else {
					$("<option value='"+ (i+1) +"'>"+szName+" "+(i+1)+"</option>").appendTo("#selectPatrol");
				}
			}
			$("#selectPatrol").unbind().bind("change",function() {
				GetPatrol(this.value);
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			m_oPtzTabs.hideTab(1);
		}
	});
}
/*************************************************
Function:		SetLight
Description:	灯光设置
Input:			无
Output:			无
return:			无
*************************************************/
function SetLight() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	if(!m_bLight) {
	    var szURL = m_lHttp + m_szHostName+ ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/Light/start";
	} else {
		var szURL = m_lHttp + m_szHostName+ ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/Light/stop";
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) {
			if(m_bLight) {
			    m_bLight = false;
				$("#light").removeClass("act");
			} else {
		        m_bLight = true;
				$("#light").addClass("act");
		    }
		},
		error:function(xhr, textStatus) {
			if(403 == xhr.status) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		SetWiper
Description:	雨刷设置
Input:			无
Output:			无
return:			无
*************************************************/
function SetWiper() {
	if(!HWP.wnds[0].isPlaying) {
	    return;	
	}
	if(!m_bWiper) {
	    var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/Wiper/start";
	} else {
		var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/Wiper/stop";
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		success: function(xmlDoc, textStatus, xhr) {
			if(m_bWiper) {
			    m_bWiper = false;
				$("#rain").removeClass("act");
			} else {
		        m_bWiper = true;
				$("#rain").addClass("act");
		    }
		},
		error:function(xhr, textStatus) {
			if(403 == xhr.status) {
				alert(parent.translator.translateNode(g_lxdPreview, 'jsNoOperationRight'));
			}
		}
	});
}
/*************************************************
Function:		SetOneKeyFocus
Description:	一键聚焦
Input:			无
Output:			无
return:			无
*************************************************/
function SetOneKeyFocus() {
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 40000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/onepushfoucs/start",
		processData: false,
		success: function(xmlDoc, textStatus, xhr) {
			//alert("success");
		},
		error:function(xhr, textStatus) {
		}
	});
}
/*************************************************
Function:		SetInitCamera
Description:	初始化镜头
Input:			无
Output:			无
return:			无
*************************************************/
function SetInitCamera() {
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/onepushfoucs/reset";
	if(window.parent.g_bIsIPDome) {
		szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Image/channels/1/LensInitialization";
	}
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		url: szURL,
		processData: false,
		success: function(xmlDoc, textStatus, xhr) {
			//alert("success");
		},
		error:function(xhr, textStatus) {
		}
	});
}
/*************************************************
Function:		GetTalkNum
Description:	获取语音对讲通道数
Input:			无
Output:			无
return:			无
*************************************************/
function GetTalkNum() {
	$.ajax({
		type: "GET",
	    //url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels",\
		url: "Preview.ashx",
		data: "method=GetTalkNum",
		async: false,
		/*beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},*/
		success: function(xmlDoc, textStatus, xhr) {
			m_iTalkNum = $(xmlDoc).find('TwoWayAudioChannel').length;
			if(m_iTalkNum > 0) {
			    m_szaudioCompressionType = $(xmlDoc).find('audioCompressionType').eq(0).text();
			}
		},
		error: function() {
			m_iTalkNum = 0;
		}
	});
}
/*************************************************
Function:		Talk
Description:	语言对讲
Input:			无			
Output:			无
return:			无				
*************************************************/
function Talk(obj) {
  //  debugger;
    GetTalkNum();
	if(m_iTalkNum == 0) {
		return;
	}	
   	m_PreviewOCX=document.getElementById("PreviewActiveX");
   	if(m_bTalk == 0) {
       	if(m_iTalkNum <= 1) {
	       	var szOpenURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1/open";
			var szCloseURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1/close";
			var szDataUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/1/audioData";
			var iAudioType = 1;
			if(m_szaudioCompressionType == 'G.711ulaw') {
				iAudioType = 1;
			} else if(m_szaudioCompressionType == "G.711alaw") {
				iAudioType = 2;
			} else if(m_szaudioCompressionType == "G.726") {
				iAudioType = 3;
			} else {
				iAudioType = 0;
			}
			var iTalk = m_PreviewOCX.HWP_StartVoiceTalk(szOpenURL, szCloseURL, szDataUrl, m_szUserPwdValue, parseInt(iAudioType));
			if(iTalk == 0) {
				$("#voiceTalk").removeClass().addClass("voiceon").attr("title", parent.translator.translateNode(g_lxdPreview, 'StopvoiceTalk'));
				m_bTalk =1;
			} else {
				alert(parent.translator.translateNode(g_lxdPreview, 'VoiceTalkFailed'));
				return ;
			}
	   	} else {
			$('#EditVoiceTalk').css('right', '2px');
			$('#EditVoiceTalk').css('top', $(obj).offset().top - $('#EditPatrolPreset').height() + 5);
			$('#EditVoiceTalk').modal();
	   	}
	} else {
		m_PreviewOCX.HWP_StopVoiceTalk();
	 	$("#voiceTalk").removeClass().addClass("voiceoff").attr("title", parent.translator.translateNode(g_lxdPreview, 'voiceTalk'));
      	m_bTalk =0;
	 }
}
/*************************************************add: 2009-03-20
Function:		SelectTalk
Description:	选中语音通道
Input:			num : 通道序号			
Output:			无
return:			无				
*************************************************/
function SelectTalk(num) {
	if(document.getElementById("Num"+num).checked == false) {
		 m_iTalkingNO = 0;
		 return;
	}
	for(var i=1;i < 3; i ++) {  
		if(i == num) {
		   document.getElementById("Num"+i).checked = true;
		} else {
		   document.getElementById("Num"+i).checked = false;
		}
	}
	m_iTalkingNO = num;
}
/*************************************************
Function:		onVoiceTalkDlgOk
Description:	确定选择进行对讲
Input:			无			
Output:			无
return:			无				
*************************************************/ 
function onVoiceTalkDlgOk() {
    if(m_iTalkingNO == 0) {
	    alert(parent.translator.translateNode(g_lxdPreview, 'ChooseTalkChan'));
		return;
	}
	var PlayOCX = document.getElementById("PreviewActiveX");
	var szOpenURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/" + m_iTalkingNO + "/open";
	var szCloseURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/" + m_iTalkingNO + "/close";
	var szDataUrl = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/TwoWayAudio/channels/" + m_iTalkingNO + "/audioData";
	var iAudioType = 1;
	if(m_szaudioCompressionType == 'G.711ulaw') {
		iAudioType = 1;
	} else if(m_szaudioCompressionType == "G.711alaw") {
		iAudioType = 2;
	} else if(m_szaudioCompressionType == "G.726") {
		iAudioType = 3;
	} else {
		iAudioType = 0;
	}
	var iTalk = PlayOCX.HWP_StartVoiceTalk(szOpenURL, szCloseURL, szDataUrl, m_szUserPwdValue, parseInt(iAudioType));
	if(iTalk == 0) {
		$("#voiceTalk").removeClass().addClass("voiceon").attr("title", parent.translator.translateNode(g_lxdPreview, 'StopvoiceTalk'));
		m_bTalk =1;
	} else {
		alert(parent.translator.translateNode(g_lxdPreview, 'VoiceTalkFailed'));
		return ;
	}
	$.modal.impl.close();
}
/*************************************************
Function:		size4to3
Description:	插件按照4:3显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function size4to3() {
	m_iWndType = 1;
	parent.$('#header').width(974);
	parent.$('#nav').width(974);	
	if(m_iPtzMode === 0) {
	    parent.$('#content').width(974).height(689);
	    parent.$('#contentframe').width(938).height(653);	    
		$("#content").width(704);
		$("#dvChangeSize").width(704);
		$("#main_plugin").width(704).height(576);
	    $("#toolbar").width(704);
		if($("#dvFishOSD").css("display") !== "none") {
		    $("#dvFishOSD").width(704);	
		}
	} else {
	    parent.$('#content').width(974).height(816);
	    parent.$('#contentframe').width(938).height(780);	    
		$("#content").width(938);
		$("#dvChangeSize").width(938);
		$("#main_plugin").width(938).height(703);
	    $("#toolbar").width(938);
		if($("#dvFishOSD").css("display") !== "none") {
		    $("#dvFishOSD").width(938);	
		}		
	}
	$(".ptzpanes").height(458);
	$("#sp4to3").removeClass().addClass("size4to3over");
	$("#sp16to9").removeClass().addClass("size16to9out");
	$("#spOriginal").removeClass().addClass("originalout");
	$("#sizeauto").removeClass().addClass("sizeautoout");	
}
/*************************************************
Function:		size4to3
Description:	插件按照4:3显示
Input:			无			
Output:			无
return:			无				
*************************************************/
function size16to9() {
	m_iWndType = 2;
	parent.$('#header').width(974);
	parent.$('#nav').width(974);
	parent.$('#content').width(974).height(689);
	parent.$('#contentframe').width(938).height(653);
	if(m_iPtzMode === 0) {
	    $("#content").width(704);
		$("#dvChangeSize").width(704);
		$("#main_plugin").width(704).height(396);
	    $("#toolbar").width(704);
		if($("#dvFishOSD").css("display") !== "none") {
		    $("#dvFishOSD").width(704);	
		}		
	} else {    
		$("#content").width(938);
		$("#dvChangeSize").width(938);
		$("#main_plugin").width(938).height(527);
	    $("#toolbar").width(938);
		if($("#dvFishOSD").css("display") !== "none") {
		    $("#dvFishOSD").width(938);	
		}			
	}
	$(".ptzpanes").height(458);
	$("#PatrolPresetList").height(399);
	$("#sp4to3").removeClass().addClass("size4to3out");
	$("#sp16to9").removeClass().addClass("size16to9over");
	$("#spOriginal").removeClass().addClass("originalout");
	$("#sizeauto").removeClass().addClass("sizeautoout");	
}
/*************************************************
Function:		setSize
Description:	设置主页面框架大小适应
Input:			iWidth : 插件的宽
				iHeight: 插件的高
Output:			无
return:			无				
*************************************************/
function setSize(iWidth, iHeight) {
	if(iHeight > 576) {
		parent.$('#content').height(iHeight + 79 + 34);
		parent.$('#contentframe').height(iHeight + 43 + 34);
	} else {
		parent.$('#content').height(689);
		parent.$('#contentframe').height(653);
	}
	if(iWidth > 704) {
		if(m_iPtzMode === 0) {
		    parent.$('#content').width(iWidth + 270);
		    parent.$('#header').width(iWidth + 270);
		    parent.$('#nav').width(iWidth + 270);
		    parent.$('#contentframe').width(iWidth + 234);
			$('#content').width(iWidth);
		} else {
			parent.$('#content').width(iWidth+36);
		    parent.$('#header').width(iWidth+36);
		    parent.$('#nav').width(iWidth+36);
		    parent.$('#contentframe').width(iWidth);
			$('#content').width(iWidth);
		}
	} else {
		parent.$('#content').width(974);
		parent.$('#header').width(974);
		parent.$('#nav').width(974);
		parent.$('#contentframe').width(938);
		$('#content').width(704);
	}
}
/*************************************************
Function:		originSize
Description:	原始尺寸
Input:			iStreamType:0-主码流，1-子码流			
Output:			无
return:			无				
*************************************************/
function originSize() {
	m_iWndType = 3;
	if(m_iStreamType === 0) {
		var xmlMainDoc = $.ajax({
							 url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
							 type: "GET",
							 async: false,
							 beforeSend: function(xhr) {
								 xhr.setRequestHeader("If-Modified-Since", "0");
								 xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
							 }
						 }).responseXML;
		var iMainWndWidth = parseInt($(xmlMainDoc).find("videoResolutionWidth").eq(0).text(), 10);
		var iMainWndHeight = parseInt($(xmlMainDoc).find("videoResolutionHeight").eq(0).text(), 10);
		setSize(iMainWndWidth, iMainWndHeight);
		$("#main_plugin").width(iMainWndWidth).height(iMainWndHeight);
		$("#dvChangeSize").width(iMainWndWidth);
		$("#toolbar").width(iMainWndWidth);
		if($("#dvFishOSD").css("display") !== "none") {
			$("#dvFishOSD").width(iMainWndWidth);	
		}
	} else {
		var xmlSubDoc = $.ajax({
							 url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/102",
							 type: "GET",
							 async: false,
							 beforeSend: function(xhr) {
								 xhr.setRequestHeader("If-Modified-Since", "0");
								 xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
							 }
						 }).responseXML;
		var iSubWndWidth= parseInt($(xmlSubDoc).find("videoResolutionWidth").eq(0).text(), 10);
		var iSubWndHeight = parseInt($(xmlSubDoc).find("videoResolutionHeight").eq(0).text(), 10);
		if(iSubWndWidth >= 320) {
			setSize(iSubWndWidth, iSubWndHeight);
			$("#main_plugin").width(iSubWndWidth).height(iSubWndHeight);
			$("#dvChangeSize").width(iSubWndWidth);
			$("#toolbar").width(iSubWndWidth);
			if($("#dvFishOSD").css("display") !== "none") {
				$("#dvFishOSD").width(iSubWndWidth);	
			}				
		} else {
			setSize(320, 240);
			$("#main_plugin").width(320).height(240);
			$("#dvChangeSize").width(320);
			$("#toolbar").width(320);
			if($("#dvFishOSD").css("display") !== "none") {
				$("#dvFishOSD").width(320);	
			}			
		}
	}
	$(".ptzpanes").height(458);
	$("#PatrolPresetList").height(399);
	$("#sp4to3").removeClass().addClass("size4to3out");
	$("#sp16to9").removeClass().addClass("size16to9out");
	$("#spOriginal").removeClass().addClass("originalover");
	$("#sizeauto").removeClass().addClass("sizeautoout");	
}
/*************************************************
Function:		autoSize
Description:	高度自适应
Input:			无			
Output:			无
return:			无				
*************************************************/ 
function autoSize() {
	m_iWndType = 0;
	var iBrowserHeight = parent.document.documentElement.clientHeight;
	parent.$('#header').width(974);
	parent.$('#nav').width(974);
	parent.$("#content").width(974).height(iBrowserHeight - 144);
	parent.$("#contentframe").width(938).height(iBrowserHeight - 144 - 36);
	if(m_iPtzMode === 0) {
	    $("#content").width(704);
		$("#dvChangeSize").width(704);
		setTimeout(function () {
		    $("#main_plugin").width(704).height(iBrowserHeight - 257);
		}, 10);
		$(".ptzpanes").height(iBrowserHeight - 374);
		$("#PatrolPresetList").height(iBrowserHeight - 433);
	    $("#toolbar").width(704);
		if($("#dvFishOSD").css("display") !== "none") {
			$("#dvFishOSD").width(704);	
		}			
	} else {
	    $("#content").width(938);
		$("#dvChangeSize").width(938);
		setTimeout(function () {
		    $("#main_plugin").width(938).height(iBrowserHeight - 257);
		}, 10);
		$(".ptzpanes").height(iBrowserHeight - 374);
		$("#PatrolPresetList").height(iBrowserHeight - 433);
	    $("#toolbar").width(938);
		if($("#dvFishOSD").css("display") !== "none") {
			$("#dvFishOSD").width(938);	
		}		
	}
	$("#sp4to3").removeClass().addClass("size4to3out");
	$("#sp16to9").removeClass().addClass("size16to9out");
	$("#spOriginal").removeClass().addClass("originalout");
	$("#sizeauto").removeClass().addClass("sizeautoover");
}
/*************************************************
Function:		streamChoose
Description:	主子码流选择
Input:			iStreamType:0-主码流，1-子码流			
Output:			无
return:			无				
*************************************************/
function streamChoose(iStreamType) {
	if(m_iStreamType !== iStreamType) {
	    m_iStreamType = iStreamType;
	    if(HWP.wnds[0].isPlaying) {
		    StopRealPlay();
		    StartRealPlay();
	    }
	    if(m_iWndType === 3) {
	        originSize();	
	    }
	}
	if(m_iStreamType === 0) {
	    $("#substream").removeClass().addClass("substreamout");
		$("#mainstream").removeClass().addClass("mainstreamover");
	} else {
	    $("#substream").removeClass().addClass("substreamover");
		$("#mainstream").removeClass().addClass("mainstreamout");	    	
	}
}
/*************************************************
Function:		ptzShow
Description:	ptz显示隐藏
Input:			无			
Output:			无
return:			无				
*************************************************/
function ptzShow() {
	if(m_iPtzMode === 0) {
	    m_iPtzMode = 1;
		$("#contentRight").hide();
		$("#ptzshow").removeClass().addClass("ptzshowout");
	} else {
		m_iPtzMode = 0;
		$("#contentRight").show();
		$("#ptzshow").removeClass().addClass("ptzhideout");
		if(m_iPtzSpeed === 60) {
		    sliderPtzSpd.wsetValue(4);
		}
	}
	switch (m_iWndType) {
		case 0:
		    autoSize();
			break;
		case 1:
		    size4to3();
			break;
		case 2:
		    size16to9();
			break;
		case 3:
		    originSize();
			break;
		default:
			break;
	}	
}
/*************************************************
Function:		ptzAdd
Description:	ptz速度调大
Input:			无			
Output:			无
return:			无				
*************************************************/
function ptzAdd() {
	var spd= sliderPtzSpd.getValue();
	if(spd < 7) {
		sliderPtzSpd.wsetValue(spd + 1);
		if(spd === 6) {
		    m_iPtzSpeed = 100;	
		} else {
		    m_iPtzSpeed = (spd+1)*15;
		}
		sliderPtzSpd.setTitle(parent.translator.translateNode(g_lxdPreview, 'ptzSpeed') + ':' + (spd + 1));
	}
}
/*************************************************
Function:		ptzReduce
Description:	ptz速度调小
Input:			无			
Output:			无
return:			无				
*************************************************/
function ptzReduce() {
	var spd= sliderPtzSpd.getValue();
	if(spd > 1) {
		sliderPtzSpd.wsetValue(spd - 1);
		m_iPtzSpeed = (spd-1) * 15;
		sliderPtzSpd.setTitle(parent.translator.translateNode(g_lxdPreview, 'ptzSpeed') + ':' + (spd - 1));
	} 
}
/*************************************************
Function:		set3DZoom
Description:	设置3D定位
Input:			无			
Output:			无
return:			无				
*************************************************/
function set3DZoom() {
	if(HWP.wnds[0].isPlaying) {
		if(!g_bEnable3DZoom) {
			if(m_PreviewOCX.HWP_EnableZoom(0,1) != 0) {
				return ;
			}
			$("#Start3DZoom").attr("title", getNodeValue("Stop3DZoom")).attr("class", "Stop3DZoom");
			g_bEnable3DZoom = true;
		} else {
			m_PreviewOCX.HWP_DisableZoom(0);
			$("#Start3DZoom").attr("title", getNodeValue("Start3DZoom")).attr("class", "Start3DZoom");
			g_bEnable3DZoom = false;
		}
	}
}
/*************************************************
Function:		stop3DZoom
Description:	停止3D定位
Input:			无			
Output:			无
return:			无				
*************************************************/
function ZoomInfoCallback(szZoomInfo) {
	var xmlDoc = parseXmlFromStr(szZoomInfo);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PTZ/channels/1/Set3DZoom",
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) {
			//alert("success");
		},
		error:function(xhr, textStatus) {
		}
	});
}
/*************************************************
Function:		setEZoom
Description:	设置电子
Input:			无			
Output:			无
return:			无				
*************************************************/
function setEZoom() {
	if(HWP.wnds[0].isPlaying) {
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