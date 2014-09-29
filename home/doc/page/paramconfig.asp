<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="../css/base.css" />  
    <link rel="stylesheet" type="text/css" href="../css/paramconfig.css" />
    <link rel="stylesheet" type="text/css" href="../script/menu/menu.css" />	
    <link rel="stylesheet" type="text/css" href="../script/tabs/tabs.css" />
    <link rel="stylesheet" type="text/css" href="../script/editWnd/editScheWnd.css" />
    <link rel="stylesheet" type="text/css" href="../css/ptz.css" />
    <link rel="stylesheet" type="text/css" href="../css/params/ptzCfg.css" />
    <title></title>
    <script type="text/javascript" src="../script/slider_extras.js"></script>
    <script type="text/javascript" src="../script/inc.js"></script>
    <script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="../script/jquery.cookie.js"></script>
    <script type="text/javascript" src="../script/jquery_modal.js"></script>
    <script type="text/javascript" src="../script/menu/jquery.menu.js"></script>
    <script type="text/javascript" src="../script/tabs/jquery.tabs.js"></script>
    <script type="text/javascript" src="../script/params/SingletonInheritor.js"></script>
    <script type="text/javascript" src="../script/params/System.js"></script>
    <script type="text/javascript" src="../script/params/LocalConfig.js"></script>
    <script type="text/javascript" src="../script/common.js"></script>
    <script type="text/javascript" src="../script/Plugin.js"></script>
    <script type="text/javascript" src="../script/stringtest.js"></script>
    <script type="text/javascript" src="../script/checkform.js"></script>
    <script type="text/javascript" src="../script/paramconfig.js"></script>
    <script type="text/javascript" src="../script/params/Network.js"></script>
    <script type="text/javascript" src="../script/params/alarmin.js"></script>
    <script type="text/javascript" src="../script/params/alarmout.js"></script>
    <script type="text/javascript" src="../script/params/user.js"></script>
    <script type="text/javascript" src="../script/params/displaychan.js"></script>
    <script type="text/javascript" src="../script/params/videoset.js"></script>
    <script type="text/javascript" src="../script/params/recordplan.js"></script>
    <script type="text/javascript" src="../script/params/movedetect.js"></script>
    <script type="text/javascript" src="../script/params/videolost.js"></script>
    <script type="text/javascript" src="../script/params/videocover.js"></script>
    <script type="text/javascript" src="../script/params/blockalarm.js"></script>
    <script type="text/javascript" src="../script/params/overlays.js"></script>
    <script type="text/javascript" src="../script/params/videoeffectconfig.js"></script>
    <script type="text/javascript" src="../script/params/abnormal.js"></script>
    <script type="text/javascript" src="My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="../script/params/VideoSettings.js"></script>
    <script type="text/javascript" src="../script/params/storage.js"></script>
    <script type="text/javascript" src="../script/params/ptzCfg.js"></script>
    <script type="text/javascript" src="../script/params/CapturePlan.js"></script>
    <script type="text/javascript" src="../script/excanvas.js"></script>
    <script type="text/javascript" src="../script/jquery.schedule.js"></script>
    <script type="text/javascript" src="../script/editWnd/jquery.editScheWnd.js"></script>
    <script type="text/javascript">
		var m_bErrorDate = 1; 		//日期是否错误
		var m_szBrowser = navigator.appName; //获取浏览器名称
		
		var m_szSuccessState = "<img src='../images/config/smile.png' class='verticalmiddle'>&nbsp;";  //设置成功	
		var m_szWaitState = "<img src='../images/config/wait.gif' class='verticalmiddle'>&nbsp;"; //正在升级或者导入		
		var m_szSuccess1 = "保存成功！";   				//成功
		var m_szSuccess2 = "保存成功，设备重启后生效！";    //成功需重启
		var m_szSuccess3 = "删除成功！";   				//成功
		var m_szSuccess4 = "删除成功，设备重启后生效！";    //成功需重启
		var m_szSuccess5 = "成功，设备重启后生效！";       //成功需重启
		
		var m_szErrorState = "<img src='../images/config/error.png' class='verticalmiddle'>&nbsp;";  //设置失败
		var m_szError1 = "设置参数失败！";   				//设置失败
		var m_szError2 = "获取参数失败！";   				//获取失败
		var m_szError3 = "无效的XML内容";       			//无效的XML内容
		var m_szError4 = "无效的XML格式";   				//无效的XML格式
		var m_szError5 = "无效的操作";   					//无效的操作
		var m_szError6 = "设备错误";   					//设备错误
		var m_szError7 = "设备忙";   					//设备忙
		var m_szError8 = "操作无权限";   					//无权限
		var m_szError9 = "网络异常";   					//网络异常
		var m_szError10 = "无报警输入/输出通道";
		var m_szError11 = "用户名密码错误";   			//用户名密码错误
		var m_szError12 = "方法不允许";   				//方法不允许
		var m_szError13 = "服务暂不可用";   					//参数错误
		var m_szError14 = "无效的URL或HTTP方法";
		var m_szError400 = "获取失败:网络中断或异常,请检查！";  //参数失败
		var m_szErrorWarning = "<b>&times;</b>";  		//网络中断时处理
		var m_szError44 = "参数失败";   				//参数失败
		var m_szError55 = "设置通道";
		var m_szError66 = "设置报警量";
		var m_szError77 = "通道不支持该功能";
		
		var m_szAsk = "保存参数设备将自动重启，确定提交？";  //询问信息
		var m_szAsk1 = "是否删除该用户？"; 				//询问信息
		var m_szRestartAsk = "参数已修改，重启后生效，是否重启？";
		var m_szRestartSuccess = "成功，设备正在重启...";
		var m_szRestartFailed = "重启设备失败！";
		var m_szExit = "是否注销";
		
		var m_iAnalogAlarmInNum = 0;              			//获取设备共有几个模拟报警量add 20091230
		var m_iAllHaveAlarmNum = 0;               			//获取设备共有几个报警量（模拟+IP）20091230
		var m_iAlarmOutputTotalNum = 0;         			//报警输出总数（模拟+IP）20091218
		var m_iAlarmOutputAnalogNum = 0;         			//报警输出模拟总数（模拟）20091218
		var m_szDDNS = new Array(); 					   //存储设备DDNS参数
		var m_iMaxUser = 16;   							   //根据设备类型设置最大用户数
		var m_iTimePart = 4;                             	//布防时间段最大数
		var m_iHaveUser = 0;   						       //用户管理当前一共有多少个用户  
		var m_iSelectUser = -1;   						   //用户管理当前选中的用户号 
		var m_iOperatUserList = -2;   					   //用户管理当前当前操作 -1 删除 0 修改 1 添加  
		var m_szIPCUserInfo = new Array();   			   //存储用户结构信息
		for(var k = 0;k < m_iMaxUser;k ++)							
		{
			m_szIPCUserInfo[k] = new Array();
		}
		var m_iAChannelNum = 1;              		//获取设备共有几个模拟通道add 20091217
		var m_iAllChannelNum = 1;               	//获取设备共有几个通道（模拟+IP）20091217
		var m_iPicinform = 1;     					//通道配置时记住当前选中的通道号 add 20091217
		// m_szOCXIsPreview改为HWP.wnds[0].isPlaying代替（Boolean型），对于IPC也可使用HWP.isPlaying()，wuyang
		//var m_szOCXIsPreview = 0;						//记录控件是否正在预览
		var m_iLocalDiskNum = 0;					//设备本地硬盘数
		var m_iVideoOutNP = 'PAL';							 //视频输出制式 0-PAL， 1-NTSC
		
		var m_szWeek = new Array();					//星期数组，用于保存时间段信息,一共7天，每天8个时间段
		for (var i = 0;i < 8;i ++)
		{
			m_szWeek[i] = new Array();
			for(var j = 0;j < 8;j ++)
			{
				m_szWeek[i][j] = new Array();
				m_szWeek[i][j][0] = "00:00:00";
				m_szWeek[i][j][1] = "00:00:00"; 
			}
		}
		var m_iDay = 0;      						//初始化选择为星期一
		var m_strIpVersion = 'v4';	
    </script>
    <script type="text/javascript">
	    JugeSystemDate();        				//判断客户端日期是否正确	
    </script>
</head>
<body onload="InitInterConfigface()" onunload="UnloadPage('paramconfig.asp',4)">
<div id="content" class="container">
    <div id="contentleft" class="contentleft">
        <div id="menu" class="sdmenu">
            <div class="local mainmenu">
                <span class="menuspan"><label id="laLocalConfig" name="laLocalConfig" class="menulabel">&nbsp;</label></span>
                <a id="aLocalConfig" name="aLocalConfig" class="submenu" href="javascript:showmenuconfig('LocalConfig', 0, 'LocalConfig')">&nbsp;</a>
            </div>
            <div class="basic mainmenu">
                <span class="menuspan"><label id="laBaseConfig" name="laBaseConfig" class="menulabel">&nbsp;</label></span>
                <a id="aSystem" name="aSystem" class="submenu" href="javascript:showmenuconfig('System', 0, 'BaseConfig')">&nbsp;</a>
                <a id="aNetwork" name="aNetwork" class="submenu" href="javascript:showmenuconfig('Network', 0, 'BaseConfig')">&nbsp;</a>
                <a id="aAudioAndVideo" name="aAudioAndVideo" class="submenu" href="javascript:showmenuconfig('AudioAndVideo', 0, 'BaseConfig')">&nbsp;</a>
                <a id="aVideoSettings" name="aVideoSettings" class="submenu" href="javascript:showmenuconfig('VideoSettings', 0, 'BaseConfig')">&nbsp;</a>
		        <a id="aSecurity" name="aSecurity" class="submenu" href="javascript:showmenuconfig('User', 0, 'BaseConfig')">&nbsp;</a>
            </div>
            <div class="advanced mainmenu">
                <span class="menuspan"><label id="laAdvanceConfig" name="laAdvanceConfig" class="menulabel">&nbsp;</label></span>
                <a id="aAdvanceSystem" name="aSystem" class="submenu" href="javascript:showmenuconfig('System', 0, 'AdvanceConfig')">&nbsp;</a>
                <a id="aAdvanceNetwork" name="aNetwork" class="submenu" href="javascript:showmenuconfig('Network', 0, 'AdvanceConfig')">&nbsp;</a>
                <a id="aAdvanceAudioAndVideo" name="aAudioAndVideo" class="submenu" href="javascript:showmenuconfig('AudioAndVideo', 0, 'AdvanceConfig')">&nbsp;</a>
                <a id="aPTZ" name="aPTZ" class="submenu" href="javascript:showmenuconfig('PtzCfg', 0, 'AdvanceConfig')">PTZ</a>
                <a id="aAdvanceVideo" name="aVideoSettings" class="submenu" href="javascript:showmenuconfig('VideoSettings', 0, 'AdvanceConfig')">&nbsp;</a>
		        <a id="aAdvanceSecurity" name="aSecurity" class="submenu" href="javascript:showmenuconfig('User', 0, 'AdvanceConfig')">&nbsp;</a>
		        <a id="aEvent" name="aEvent" class="submenu" href="javascript:showmenuconfig('Event', 0, 'AdvanceConfig')">&nbsp;</a>
		        <a id="aStorage" name="aStorage" class="submenu" href="javascript:showmenuconfig('Storage', 0, 'AdvanceConfig')">&nbsp;</a>
            </div>
        </div>
    </div>
    <div id="contentright" class="contentright">
        <div id="EditAreaContent" class="editcontent"></div>
  	    <div class="footer">
	        <span id="SetResultTips"></span>
	        <span><input id="SaveConfigBtn" type="button" class="savebtn" onclick="showmenuconfig('set', 1)" /></span>
        </div>	
    </div>
</div>
</body>
</html>