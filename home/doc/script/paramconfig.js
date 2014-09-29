var m_bSupportIPC = true;
var m_bSupportZerochan = true;
var m_bSupportHoliday = true;                   //是否支持假日配置
var m_bSupportDisk = true;
var m_bIsSupportFrontPara = true;
var m_bSupportRecord = true;
var g_bSupportSNMP = false;
var g_bSupportQoS = false;
var g_bSupport8021x = false;
var g_bSupportCapturePlan = false;
var g_bSupportWIFI = false;       //是否支持WIFI
var g_bSupportTeleCtrl = false;   //是否支持遥控器
var g_bSupportWLS = false;        //是否支持无线门磁
var g_bSupportPIR = false;        //是否支持PIR
var g_bSupport485 = false;      //是否支持485
var g_bSupport232 = false;      //是否支持232
var g_bSupportCH = false;       //是否支持呼救报警
var g_bSupportAV = false;       //是否支持匿名访问
var g_bSupportUPnP = false;       //是否支持UPnP
var g_bSupportPicOverlay = false; //是否支持图片叠加
var g_bSupportIPFilter = false;   //是否支持IP过滤
var g_oCurrentTab = null;
var g_oMenu = null; // 菜单对象

var g_bGetSysCab = false; //是否已经获取系统设置的能力
var g_bGetNetCab = false; //是否已经获取网络参数的能力
var g_bGetEventCab = false; //是否已经获取事件的能力

// 此对象用来优化基本设置与高级设置菜单之间切换的速度
// 还需进一步测试，wuyang
var g_menuRecorder = {
	szCurMenu: "LocalConfig",
	szCurMainMenu: null,
	szLastMenu: null,
	szLastMainMenu: null
}

var g_lxdParamConfig = null; // ParamConfig.xml

$.ajaxSetup({timeout: 15000});  //默认超时时间为15秒

/*************************************************
Function:		autoResizeIframe
Description:	配置页面高度自适应
Input:			无
				无
Output:			无
return:			无				
*************************************************/
function autoResizeIframe()
{
	if($("#EditAreaContent").height() > 569)
	{
		window.parent.document.getElementById('content').style.height = $("#EditAreaContent").height() + 86 + "px";
		window.parent.document.getElementById('contentframe').style.height =  $("#EditAreaContent").height() + 50 + "px";
		$("#menu").height($("#EditAreaContent").height());
	}
	else
	{
		window.parent.document.getElementById('content').style.height = 655 + "px";
		window.parent.document.getElementById('contentframe').style.height =  619 + "px";				
		$("#menu").height(569);
	}
}
/*************************************************
Function:		InitInterConfigface
Description:	初始化配置页面
Input:			无
				无
Output:			无
return:			无				
*************************************************/
function InitInterConfigface()
{
	//记录菜单cookie置为空
	$.cookie('page',null);
	m_strIp = m_szHostName;
	
	m_szUserPwdValue = $.cookie('userInfo' + m_lHttpPort);
	if(m_szUserPwdValue == null)
	{
		window.parent.location.href="login.asp";
		return;
	}
	m_strUserName = Base64.decode(m_szUserPwdValue).split(":")[0];
	m_strPassword = Base64.decode(m_szUserPwdValue).split(":")[1];
	window.parent.document.getElementById("curruser").innerHTML = m_strUserName;
	
	//选中菜单
	window.parent.ChangeMenu(4);
	
	getUPnPInfo();
	GetNetworkVersion();    //获取设备支持的协议版本
	
	//合并语言资源
	ChangeLanguage(parent.translator.szCurLanguage, false);
	
	//无线报警和PIR报警
	if(!window.parent.g_bIsIPDome)
	{
		isSupportWLSensors();
		isSupportPIR();
		isSupportCallHelp();
	}
	
	//初始化菜单树
	g_oMenu = $("#menu").Menu({defaultCur : "1_0"});
	
	if(!window.parent.g_bIsIPDome)
	{
		g_oMenu.hide("2_3");
	}
}
/*************************************************
  Function:    	showmenuconfig
  Description:	树中节点选择并跳转不同页面
  Input:        szMenu:子菜单名
  				iMode:0获取 1设置
  				szMainMenu:主菜单名
  Output:      	无
  Return:		无
*************************************************/
function showmenuconfig(szMenu, iMode, szMainMenu)
{
	if (iMode == 0)
	{
		g_menuRecorder.szCurMenu = szMenu;
		g_menuRecorder.szCurMainMenu = szMainMenu;
		if(g_menuRecorder.szLastMenu !== szMenu) {
			HWP.Stop(0);
		}
	}
	switch ((iMode == 0) ? (szMenu + ":get") : (g_menuRecorder.szCurMenu + ":set"))
	{
		case "LocalConfig:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/LocalConfig.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					pr(LocalConfig).initCSS();
					g_oCurrentTab = $(".tabs").tabs(".pane", {markCurrent: false});
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					autoResizeIframe();
				}
			});
			break;
		}
		case "LocalConfig:set":
		{
			ia(LocalConfig).submit();
			break;
		}
		case "System:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu)
			{
				if (szMainMenu === "BaseConfig")
				{
					g_oCurrentTab.hideTabs([3, 4, 5, 6]);
				} else {
					if(g_bSupport232)
					{
						g_oCurrentTab.showTab(3);
					}
					if(g_bSupport485)
					{
						g_oCurrentTab.showTab(4);
					}
					if(g_bSupportTeleCtrl)
					{
						g_oCurrentTab.showTab(5);
					}
					g_oCurrentTab.showTab(6);
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/System.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					if(!g_bGetSysCab)//获取系统设置能力
					{
						g_bGetSysCab = true;
						if(!window.parent.g_bIsIPDome)
						{
							isSupportTeleCtrl();
						}
						
						isSupport232And485();
					}
					pr(DeviceInfo).initCSS();
					pr(TimeSettings).initCSS();
					pr(Maintain).initCSS();
					pr(Telecontrol).initCSS();
					if (szMainMenu === "BaseConfig") {
						g_oCurrentTab = $("#tabSystem").tabs(".pane", {hideIndexes:[3, 4, 5, 6]});
					} else {
						g_oCurrentTab = $("#tabSystem").tabs(".pane");
						if(!g_bSupport232)
						{
							g_oCurrentTab.hideTab(3);
						}
						if(!g_bSupport485)
						{
							g_oCurrentTab.hideTab(4);
						}
						if(!g_bSupportTeleCtrl)
						{
							g_oCurrentTab.hideTab(5);
						}
					}
					System.tabs = g_oCurrentTab;
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "System:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 0:
					ia(DeviceInfo).submit();
					break;
				case 1: // 不可能到这里
					ia(TimeSettings).submit();
					break;
				case 2: // 不可能到这里
					ia(Maintain).submit();
					break;
				case 3:
				 	ia(RS232Config).submit();
					break;
				case 4:
					ia(RS485Config).submit();
					break;
				case 6:
					ia(TimeSettings).submitDST();
					break;
				default:
					break;
			}
			
			break;
		}
		case "Network:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "BaseConfig") 
				{
					Network.tabs.hideTabs([2, 3, 4, 5, 6, 7, 8, 9]);
				} 
				else 
				{
					Network.tabs.showTabs([2, 3]);
					
					if(g_bSupportSNMP)
					{
						Network.tabs.showTab(4);
					}
					
					if(g_bSupport8021x)
					{
						Network.tabs.showTab(5);
					}
					
					if(g_bSupportQoS)
					{
						Network.tabs.showTab(6);
					}
					
					Network.tabs.showTab(7);
					if(g_bSupportWIFI)
					{
						Network.tabs.showTab(8);
					}
					if(g_bSupportUPnP)
					{
						Network.tabs.showTab(9);
					}
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/Network.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					$("#EditAreaContent").html(msg);
					if(!g_bGetNetCab)//获取网络参数能力
					{
						g_bGetNetCab = true;
						//是否支持高级网络参数
						isSupportQoS();
						isSupportSNMP();
						isSupportWIFI();
						if(!g_bSupportWIFI){
							isSupport8021x();
						}
						isSupportUPnP();
					}
					if (szMainMenu === "BaseConfig") 
					{
						Network.tabs = $("#tabNetwork").tabs(".pane", {beforeLeave:Network.beforeLeave, hideIndexes:[2, 3, 4, 5, 6, 7, 8, 9]});
					} 
					else 
					{
						Network.tabs = $("#tabNetwork").tabs(".pane", {beforeLeave:Network.beforeLeave});
						if(!g_bSupportSNMP)
						{
							Network.tabs.hideTab(4);
						}
						
						if(!g_bSupport8021x)
						{
							Network.tabs.hideTab(5);
						}
						
						if(!g_bSupportQoS)
						{
							Network.tabs.hideTab(6);
						}
						
						Network.tabs.showTab(7);
						if(!g_bSupportWIFI)
						{
							Network.tabs.hideTab(8);
						}
						if(!g_bSupportUPnP)
						{
							Network.tabs.hideTab(9);
						}
					}			
					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
					initNetwork();
				}
			});
			break;
		}
		case "Network:set":
		{
			switch (Network.tabs.curTab)
			{
				case 0:
					SetNetBasicInfo();
					break;
				case 1:
				    setPortInfo();
					break;
				case 2: 
				    SetDDNSInfo();
					break;
				case 3: 
				    SetPPPOEInfo();
					break;
				case 4: 
				    SetSNMPInfo();
					break;
				case 5: 
				    Set8021x();
					break;	
				case 6: 
				    SetQoSInfo();
					break;
				case 7:
					SetFTPInfo();
					break;	
				case 8:
					setWIFI();
					break;
				case 9:
					setUPNP();
					break;			
				default:
					break;
			}			
			break;
		}
		case "AudioAndVideo:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/AudioAndVideo.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					AudioAndVideo.tabs = $("#tabAudioAndVideo").tabs(".pane");
					if(!parent.g_bIsSupportAudio)
					{
						AudioAndVideo.tabs.hideTab(1);
					}					
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "AudioAndVideo:set":
		{
			switch (AudioAndVideo.tabs.curTab)
			{
				case 0:
				    SetVideoInfo();
					break;
				case 1:
				    setAudioInfo();
					break;
				default:
					break;
			}				
			break;
		}		
		case "VideoSettings:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "BaseConfig") {
					g_oCurrentTab.hideTabs([1, 2, 3, 4]);
				} else {
					if(window.parent.g_bIsIPDome)
					{
						g_oCurrentTab.showTabs([1, 2]);
					}
					else
					{
						g_oCurrentTab.showTabs([1, 2, 3]);
					}
					if(g_bSupportPicOverlay){
						g_oCurrentTab.showTab(4);
					}
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/VideoSettings.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
					isSupportPicOverlay();
					$("#EditAreaContent").html(msg);
					pr(BaseVideoSettings).initCSS();
					pr(OSDSettings).initCSS();
					pr(TextOverlay).initCSS();
					pr(VideoMask).initCSS();
					pr(PictureOverlay).initCSS();
					m_iPicinform = 1; // 全局变量
					HWP.wnds[0].isPlaying = false;
					if (szMainMenu === "BaseConfig") {
						g_oCurrentTab = $("#tabVideoSettings").tabs(".pane", {beforeLeave:VideoSettings.beforeLeave, hideIndexes:[1, 2, 3, 4]});
					} else {
						g_oCurrentTab = $("#tabVideoSettings").tabs(".pane", {beforeLeave:VideoSettings.beforeLeave});
						if(window.parent.g_bIsIPDome)
						{
							g_oCurrentTab.hideTab(3);
						}
						if(!g_bSupportPicOverlay){
							g_oCurrentTab.hideTab(4);
						}
					}
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "VideoSettings:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 0: // 不可能到这里
					ia(BaseVideoSettings).submit();
					break;
				case 1:
					ia(OSDSettings).submit();
					break;
				case 2:
					ia(TextOverlay).submit();
					break;
				case 3:
					ia(VideoMask).submit();
					break;
				case 4:
					ia(PictureOverlay).submit();
					break;
				default:
					break;
			}
			break;
		}
		case "User:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				if (szMainMenu === "BaseConfig") 
				{
					g_oCurrentTab.hideTabs([1,2,3]);
				} 
				else 
				{
					g_oCurrentTab.showTab(1);
					if(g_bSupportAV){
						g_oCurrentTab.showTab(2);
					}
					if(g_bSupportIPFilter){
						g_oCurrentTab.showTab(3);
					}
				}
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/User.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					$.ajax({ 
						url: "params/userlist.asp",
						type: "GET",
						dataType:"html",
						success:function(szMsg)
						{
							$("#UserPage").html(szMsg);
							isSupportAnonymousVisit();  //是否支持匿名
							isSupportIPFilter();  //是否支持IP过滤
							if (szMainMenu === "BaseConfig") 
							{
								g_oCurrentTab = $(".tabs").tabs(".pane", {hideIndexes:[1,2,3]});
							}
							else
							{
								g_oCurrentTab = $(".tabs").tabs(".pane");
								if(!g_bSupportAV){
									g_oCurrentTab.hideTab(2);
								}
								if(!g_bSupportIPFilter){
									g_oCurrentTab.hideTab(3);
								}
							}
						}
					});
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "User:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 1:
					ia(RTSPAuth).setRTSPAuthInfo();
					break;
				case 2:
					ia(AnonymousVisit).setAnonymousVisit();
					break;
				case 3:
					ia(IPFilter).saveIPAddressFilter();
					break;
				default:
					break;
			}
			break;
		}
		case "Event:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/Event.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) 
				{
					if(!g_bGetEventCab)
					{
						g_bGetEventCab = true;
						isSupportCapturePlan();
					}
					$("#EditAreaContent").html(msg);
					Event.tabs = $("#tabEvent").tabs(".pane", {defaultCur: 0});
					if(!window.parent.g_bIsIPDome) {
						Event.tabs.hideTab(2);
					}
					if(!g_bSupportCapturePlan)
					{
						Event.tabs.hideTab(7);
					}
					if(!g_bSupportWLS && !g_bSupportPIR && !g_bSupportCH)
					{
						Event.tabs.hideTab(8);
					}
					if(0 === pr(DeviceInfo).queryAlarmInNum()) {
						Event.tabs.hideTab(3);
					}
					if(0 === pr(DeviceInfo).queryAlarmOutNum()) {
						Event.tabs.hideTab(4);
					}
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "Event:set":
		{
			switch (Event.tabs.curTab)
			{
				case 0:
				    SetMoveDetectInfo();
					break;
				case 1:
				    SetBlockAlarmInfo();
					break;
				case 2: 
				    SetVideoLostInfo();
					break;
				case 3: 
				    SaveAlarmInInfo();
					break;
				case 4: 
				    SetAlarmOutInfo();
					break;
				case 5: 
				    SaveExceptionInfo();
					break;	
				case 6: 
				    SetEmailInfo();
					break;
				case 7:
				    setCapturePlanInfo();
					break;
				case 8:
					/*setOtherAlarmLinkDoc();*/
					break;
				default:
					break;
			}
			break;
		}
		case "Storage:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/Storage.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig(szMenu, iMode, szMainMenu);
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					initStorage();    //初始化存储页面相关信息
					g_oCurrentTab = $("#tabStorage").tabs(".pane");
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "Storage:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 0:
				    SetRecordPlanInfo();
					break;
				case 1:
					break;
				case 2:
					SetNFSInfo();
					break;			
				default:
					break;
			}
			break;
		}
		case "PtzCfg:get":
		{
			if (g_menuRecorder.szLastMenu === szMenu) {
				g_menuRecorder.szLastMainMenu = szMainMenu;
				return;
			}
			HWP.destory();
			$.ajax({
				url: "params/ptzCfg.asp",
				type: "GET",
				dataType: "html",
				error: function() {
					showmenuconfig("PtzCfg",0,"AdvanceConfig");
				},
				success: function(msg) {
					$("#EditAreaContent").html(msg);
					initPtzCfg();
					g_oCurrentTab = $("#tabPtz").tabs(".pane", {defaultCur: 0, beforeLeave:function(){$("#SetResultTips").empty();}});
					g_menuRecorder.szLastMenu = szMenu;
					g_menuRecorder.szLastMainMenu = szMainMenu;
				}
			});
			break;
		}
		case "PtzCfg:set":
		{
			switch (g_oCurrentTab.curTab)
			{
				case 0:
					setPtzBasic();
					break;
				case 1:
					setLimitInfo();
					break;
				case 2:
					break;
				case 3:
					setParkAction();
					break;
				case 4:
					savePrivacyMask();
					break;
				case 5:
					setBasicTimeTasks();
					break;
				case 6:
					clearCfg();
					break;
				default:
					break;
			}
			break;
		}	
		default:
		{
			break;
		}
	}//switch end
}

/*************************************************
Function:		ChangeLanguage
Description:	改变页面语言
Input:			lan: 语言
				bCallback: 是否执行翻译回调  默认执行
Output:			无
return:			无				
*************************************************/
var g_transStack = new parent.TransStack();
function ChangeLanguage(lan, bCallback)
{
	if (arguments.length < 2)
	{
		bCallback = true;
	}
	var lxd = parent.translator.getLanguageXmlDoc("ParamConfig", lan);
	ChangeVariableLanguage(parent.translator.appendLanguageXmlDoc($(lxd.cloneNode(true)).children("ParamConfig")[0], parent.g_lxdMain)); // 改变配置页面全局变量语言
	g_lxdParamConfig = parent.translator.appendLanguageXmlDoc($(lxd).children("Common")[0], parent.g_lxdMain);
	parent.document.title = parent.translator.translateNode(g_lxdParamConfig, 'laparamCfg');
	$("#SaveConfigBtn").val(parent.translator.translateNode(g_lxdParamConfig, 'laSaveBtn'));
	if (bCallback)
	{
		g_transStack.translate();
	}
}

/*************************************************
Function:		ChangeVariableLanguage
Description:	改变配置页面全局变量语言
Input:          lxd：LanguageXmlDoc
Output:			无
return:			无				
*************************************************/
function ChangeVariableLanguage(lxd)
{
    m_szSuccess1 = parent.translator.translateNode(lxd, 'Success1');   	 //成功
    m_szSuccess2 = parent.translator.translateNode(lxd, 'Success2');       //成功需重启
    m_szSuccess3 = parent.translator.translateNode(lxd, 'DeleteSuccTips');  	 //成功
    m_szSuccess4 = parent.translator.translateNode(lxd, 'Success4');       //成功需重启
    m_szSuccess5 = parent.translator.translateNode(lxd, 'Success5');       //成功需重启 

    m_szError1 = parent.translator.translateNode(lxd, 'Error1'); 			 //设置失败
    m_szError2 = parent.translator.translateNode(lxd, 'Error2');   		 //获取失败
    m_szError3 = parent.translator.translateNode(lxd, 'Error3');       	 //无效的XML内容
    m_szError4 = parent.translator.translateNode(lxd, 'Error4');   		 //无效的XML格式
    m_szError5 = parent.translator.translateNode(lxd, 'Error5');   		 //无效的操作
    m_szError6 = parent.translator.translateNode(lxd, 'Error6');   		 //设备错误
    m_szError7 = parent.translator.translateNode(lxd, 'Error7');   		 //设备忙
    m_szError8 = parent.translator.translateNode(lxd, 'jsNoOperationRight');  //无权限
    m_szError9 = parent.translator.translateNode(lxd, 'jsNetworkAbnormal');   		 //网络异常
    m_szError10 = parent.translator.translateNode(lxd, 'Error10');
    m_szError11 = parent.translator.translateNode(lxd, 'Error11');   		 //用户名密码错误
    m_szError12 = parent.translator.translateNode(lxd, 'Error12');  		 //方法不允许
    m_szError13 = parent.translator.translateNode(lxd, 'Error13');  		 //参数错误
    m_szError14 = parent.translator.translateNode(lxd, 'Error14');
    m_szError400 = parent.translator.translateNode(lxd, 'Error400');  	 //网络中断或异常
    m_szError44 = parent.translator.translateNode(lxd, 'Error44');   		 //参数失败
    m_szError55 = parent.translator.translateNode(lxd, 'Error55');
	m_szError66 = parent.translator.translateNode(lxd, 'Error66');
	m_szError77 = parent.translator.translateNode(lxd, 'Error77');

    m_szAsk = parent.translator.translateNode(lxd, 'Ask'); 				 //询问信息
    m_szAsk1 = parent.translator.translateNode(lxd, 'Ask1');				 //删除用户询问信息
	m_szRestartAsk = parent.translator.translateNode(lxd, 'RestartTips');
    m_szRestartSuccess = parent.translator.translateNode(lxd, 'RestartSuccessTips');
    m_szRestartFailed = parent.translator.translateNode(lxd, 'RestartFailedTips');
	m_szExit = parent.translator.translateNode(lxd, 'exit');
}
/*************************************************
Function:		isSupportQoS
Description:	是否支持QoS
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportQoS()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/qos/dscp";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportQoS = true;
			if(Network.tabs != null  && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				Network.tabs.showTab(6);
			}
		},
		error:function()
		{
			g_bSupportQoS = false;
			if(Network.tabs != null)
			{
				Network.tabs.hideTab(6);
			}
		}
	});
}
/*************************************************
Function:		isSupport8021x
Description:	是否支持8021x
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupport8021x()
{
	var szURL = m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ieee802.1x";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupport8021x = true;
			if(Network.tabs != null  && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				Network.tabs.showTab(5);
			}
		},
		error:function()
		{
			g_bSupport8021x = false;
			if(Network.tabs != null)
			{
				Network.tabs.hideTab(5);
			}
		}
	});
}
/*************************************************
Function:		isSupportSNMP
Description:	是否支持SNMP
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportSNMP()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/snmp",
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportSNMP = true;
			if(Network.tabs != null  && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				Network.tabs.showTab(4);
			}
		},
		error:function()
		{
			g_bSupportSNMP = false;
			if(Network.tabs != null)
			{
				Network.tabs.hideTab(4);
			}
		}
	});
}
/*************************************************
Function:		isSupportCapturePlan
Description:	是否支持抓图配置
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportCapturePlan()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Snapshot/channels/1",
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportCapturePlan = true;
			if(Event.tabs != null)
			{
				Event.tabs.showTab(7);
			}
		},
		error:function()
		{
			g_bSupportCapturePlan = false;
			if(Event.tabs != null)
			{
				Event.tabs.hideTab(7);
			}
		}
	});
}
/*************************************************
Function:		isSupportWIFI
Description:	是否支持WIFI配置
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportWIFI()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/2/wireless",
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportWIFI = true;
			/*if(Network.tabs != null  && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				Network.tabs.showTab(8);
			}*/
		},
		error:function()
		{
			g_bSupportWIFI = false;
			/*if(Network.tabs != null)
			{
				Network.tabs.hideTab(8);
			}*/
		}
	});
}
/*************************************************
Function:		isSupportTeleCtrl
Description:	是否支持遥控器
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportTeleCtrl()
{
	$.ajax(
	{
		type:"GET",
		url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Telecontrol",
		async:false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");  
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportTeleCtrl = true;
			if(System.tabs != null  && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				System.tabs.showTab(5);
			}
		},
		error:function()
		{
			g_bSupportTeleCtrl = false;
			if(System.tabs != null)
			{
				System.tabs.hideTab(5);
			}
		}
	});	
}
/*************************************************
Function:		isSupportWLSensors
Description:	是否支持无线报警
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportWLSensors()
{
	$.ajax(
	{
		type:"GET",
		url:m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/WLSensors",
		async:false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");  
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success:function()
		{
			g_bSupportWLS = true;
		},
		error:function()
		{
			g_bSupportWLS = false;
		}
	});	
}
/*************************************************
Function:		isSupportPIR
Description:	是否支持PIR报警
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportPIR()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PIR",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr)
		{
			g_bSupportPIR = true;
		},
		error: function(xhr, textStatus, errorThrown)
		{
			g_bSupportPIR = false;
		}
	});
}
/*************************************************
Function:		isSupport232
Description:	是否支持232和485配置
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupport232And485()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Serial/ports",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr)
		{
			var oSerialPorts = $(xmlDoc).find("SerialPort");
			var szIdSet = [];
			for(var i = 0; i < oSerialPorts.length; i++)
			{
				szIdSet.push(oSerialPorts.eq(i).find("serialPortType").eq(0).text());
			}
			if($.inArray("RS485", szIdSet) < 0)
			{
				g_bSupport485 = false;
			}
			else
			{
				g_bSupport485 = true;
			}
			if($.inArray("RS232", szIdSet) < 0)
			{
				g_bSupport232 = false;
			}
			else
			{
				g_bSupport232 = true;
			}
			if(System.tabs != null && g_menuRecorder.szCurMainMenu == 'AdvanceConfig')
			{
				if(g_bSupport485)
				{
					System.tabs.showTab(4);
				}
				if(g_bSupport232)
				{
					System.tabs.showTab(3);
				}
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			g_bSupport232 = false;
			g_bSupport485 = false;
			if(System.tabs != null)
			{
				System.tabs.hideTabs([3,4]);
			}
		}
	});
}
/*************************************************
Function:		isSupportCallHelp
Description:	是否支持呼救报警
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportCallHelp()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/callhelp",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr)
		{
			g_bSupportCH = true;
		},
		error: function(xhr, textStatus, errorThrown)
		{
			g_bSupportCH = false;
		}
	});
}
/*************************************************
Function:		isSupportAnonymousVisit
Description:	是否匿名访问
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportAnonymousVisit()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UserPermission/anonymouslogin",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr)
		{
			g_bSupportAV = true;
		},
		error: function(xhr, textStatus, errorThrown)
		{
			g_bSupportAV = false;
		}
	});
}
/*************************************************
Function:		isSupportUPnP
Description:	是否支持UPnP
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportUPnP()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UPnP",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr) {
			g_bSupportUPnP = true;
		},
		error: function(xhr, textStatus, errorThrown) {
			g_bSupportUPnP = false;
		}
	});
}
/*************************************************
Function:		isSupportPicOverlay
Description:	是否支持图片叠加
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportPicOverlay()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/Image",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr) {
			g_bSupportPicOverlay = true;
		},
		error: function(xhr, textStatus, errorThrown) {
			g_bSupportPicOverlay = false;
		}
	});
}
/*************************************************
Function:		isSupportIPFilter
Description:	是否支持IP过滤
Input:          无
Output:			无
return:			无				
*************************************************/
function isSupportIPFilter()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ipFilter",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async:false,
		success: function(xmlDoc, textStatus, xhr) {
			g_bSupportIPFilter = true;
		},
		error: function(xhr, textStatus, errorThrown) {
			g_bSupportIPFilter = false;
		}
	});
}