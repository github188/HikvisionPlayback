var g_lxdMain = null;
var g_bIsIPDome = false;
var g_bIsSupportAudio = false;


function initMain()
{
    var tok = m_lUserName + ':' + m_lPassword;
    var hash = Base64.encode(tok);
    
    var szUrl = decodeURI(document.URL);
    if (szUrl.indexOf("?page=") != -1)
    {
        var szPage = szUrl.substring(szUrl.indexOf("page=") + 5, szUrl.indexOf("&params="));
        if (szPage.indexOf(".aspx") == -1)
        {
            szPage = szPage.concat(".aspx");
        }
        var szParam = szUrl.substring(szUrl.indexOf("&params=") + 8, szUrl.length);
        $.cookie('page', szPage + "?" + szParam + "%1");
    }
    else
    {
        $.cookie('page', null);
    }
   // $.cookie('page', null);
    m_szUserPwdValue = hash;//"YWRtaW46MTIzNDU=";
   
    $.cookie('userInfo' + m_lHttpPort, m_szUserPwdValue == "" ? Base64.encode("anonymous:\177\177\177\177\177\177") : m_szUserPwdValue);

	
	$("#ConfigDivUpdateBlock").css({"width":document.body.scrollWidth+"px","height":document.body.scrollHeight+"px"});
	$(window).bind("resize", function()
	{
	    $("#ConfigDivUpdateBlock").css({ "width": document.body.scrollWidth + "px", "height": document.body.scrollHeight + "px" });
		if($("#contentframe").attr("src").indexOf("preview") != "-1")
		{
			var curWnd = document.getElementById('contentframe').contentWindow;
			if(curWnd.m_iWndType == 0)
			{
				curWnd.autoSize();
			}
		}
	});
	mainEventBind();
	//if ("anonymous:\177\177\177\177\177\177" !== Base64.decode(m_szUserPwdValue))
	//{
		GetDeviceInfo(); //获取设备型号
		//getAudioSupport();
	//}
	LatestPage();
}

/*************************************************
Function:		LastPage
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			无
Output:			无
return:			无				
*************************************************/
function LatestPage()
{
  //  debugger;
	//translator.initLanguageSelect($.cookie("language"));
	//var lxd = translator.getLanguageXmlDoc("Main");
	//translator.translatePage($(lxd).children("Main")[0], parent.document);
	//g_lxdMain = $(lxd).children("Common")[0];
	//translator.translateElements(g_lxdMain, $("#dvChangeSize")[0], "span", "title");
	var curpage = $.cookie('page');
	if(null == curpage)
	{
	    ChangeFrame("playback.aspx?ip=" + m_szHostName + "&port=" + m_lHttpPort + "&u=" + m_lUserName + "&p=" + m_lPassword + "&rtsp=" + m_lRtspPort + "&cha=" + m_channel + "&date_time=" + m_datetime, 2);
	}else
	{
		ChangeFrame(curpage.split("%")[0],curpage.split("%")[1]);
	}
}

/*************************************************
Function:		ChangeFrame
Description:	主页面加载时，获取cookie，跳转到刷新前的界面
Input:			src:页面路径
				index:ID序号
Output:			无
return:			无				
*************************************************/
function ChangeFrame(src,index)
{
	if("anonymous:\177\177\177\177\177\177" === Base64.decode(m_szUserPwdValue) && index != 1){
		return;
	}
	//$("#contentframe").remove();
	$("#content").html('<iframe frameborder="0" style="margin:0px;padding:0px;" scrolling="no" id="contentframe" name="contentframe" class="contentframe" src="' + src + '"></iframe>');
}
/*************************************************
Function:		restoreSize
Description:	恢复主页面框架各子元素大小
Input:			无
Output:			无
return:			无				
*************************************************/
function restoreSize(iIndex)
{
	/*if(iIndex == 1)
	{
	    $('#content').height(689);
	    $('#contentframe').height(653);
	}
	else
	{
	    $('#content').height(655);
	    $('#contentframe').height(619);		
	}
	$('#content').width(974);
	$('#header').width(974);
	$('#nav').width(974);
	$('#contentframe').width(938);*/
}
/*************************************************
Function:		ChangeMenu
Description:	改变主页菜单栏
Input:			index:ID序号
Output:			无
return:			无				
*************************************************/
function ChangeMenu(index)
{
	for(var i = 1;i < 5;i++)
	{
		if($("#iMenu"+i).hasClass("menuBackground"))
		{
			$("#iMenu"+i).removeClass("menuBackground");
		}
	}
	$("#iMenu"+index).addClass("menuBackground");
	restoreSize(index);//还原界面大小
}

/*************************************************
Function:		ChangeFrameLanguage
Description:	改变页面语言
Input:			lan:语言
Output:			无
return:			无				
*************************************************/
function ChangeFrameLanguage(lan)
{
	$.cookie('language', lan);
	var lxd = translator.getLanguageXmlDoc("Main", lan);
	translator.translatePage($(lxd).children("Main")[0], parent.document);
	g_lxdMain = $(lxd).children("Common")[0];
	translator.translateElements(g_lxdMain, $("#dvChangeSize")[0], "span", "title");
	var curWnd = document.getElementById('contentframe').contentWindow;
	curWnd.ChangeLanguage(lan);
}
/*************************************************
Function:		GetDeviceInfo
Description:	获取设备名称
Input:			无
Output:			无
return:			无
*************************************************/
function GetDeviceInfo()
{
	/*$.ajax(
	{
		type: "GET",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
	    //url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/deviceInfo",
		url: "Preview.ashx",
		data: "method=GetDeviceInfo",
		async: false,
		timeout: 15000,
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#devicetype").html($(xmlDoc).find('model').eq(0).text());
			var szDeviceDes = $(xmlDoc).find('deviceDescription').eq(0).text();
			if("IPDome" == szDeviceDes)
			{
				g_bIsIPDome = true;
			}
		}
	});
    */
    jQuery.ajax({
        type: "GET",
        url: "../page/Preview.ashx",
        data: "method=GetDeviceInfo&url=" + m_szHostName + "&u=" + m_lUserName + "&p=" + m_lPassword + "&port=" + m_lHttpPort,
        dataType: "xml",
        async: false,
        timeout: 15000,
        success: function (xmlDoc, textStatus, xhr) {
            //$("#devicetype").html($(xmlDoc).find('model').eq(0).text());
            var szDeviceDes = $(xmlDoc).find('deviceDescription').eq(0).text();
            if ("IPDome" == szDeviceDes) {
                g_bIsIPDome = true;
            }
        }
    });

}
/*************************************************
Function:		getAudioSupport
Description:	是否支持音频
Input:			无
Output:			无
return:			无
*************************************************/
function getAudioSupport()
{
	$.ajax(
	{
		type: "GET",
	    /*beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},*/
	    //url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Audio/channels",
		url: "Preview.ashx",
		data: "method=channels",
		async: false,
		timeout: 15000,
		success: function(xmlDoc, textStatus, xhr) 
		{
			if($(xmlDoc).find("AudioChannel").length > 0)
			{
				g_bIsSupportAudio = true;
			}
		}
	});
}
/*************************************************
Function:		mainEventBind
Description:	事件绑定
Input:			无
Output:			无
return:			无				
*************************************************/
function mainEventBind() {
    //点击语言选择框
	$(".languageshow").bind({
	    click: function (e) {
			e.stopPropagation();
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			} else {
				$('#divLanguageChoose').show();
			}
		}
	});
    //点击帮助
	$(".help").bind({
	    click: function (e) {
			e.stopPropagation();
			if($("#SoftwareEdition").css("display") !== "none") {
				$('#SoftwareEdition').hide();
			} else {
				$('#SoftwareEdition').show();
			}
		}
	});	
	//点击语言选择框和帮助以为的地方
    $("body").bind({
	    click: function (e) {
			if($("#divLanguageChoose").css("display") !== "none") {
				$('#divLanguageChoose').hide();
			}
			if($("#SoftwareEdition").css("display") !== "none") {
				$("#SoftwareEdition").hide();
			}			
		}
	});	
	//注销鼠标悬浮
	$(".logout").bind({
	    mouseover: function () {
		    $(this).css("color", "#a73737");
		},
		mouseout: function () {
		    $(this).css("color", "#757575");
		}
	});
}