document.charset = "utf-8";
var g_oXmlRtspPort;
var g_bIsRestart = true;
var g_oXhr = null;
var g_oSNMPXml = null;  //记录取得的snmp信息

var Network = {
	tabs: null,	// 保存网络配置页面的tabs对象引用
	beforeLeave: function(iTabIndex) {
		switch (iTabIndex)
		{
			case 9:
				ia(UPNP).beforeLeave();
				break;
			default:
				break;
		}
	}
};

/*************************************************
继承，未完成，wuyang
*************************************************/
function IpConfig() {
	SingletonInheritor.implement(this);
	this.m_bEnablePPPoE = false;
}
SingletonInheritor.declare(IpConfig);
pr(IpConfig).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "IpConfig"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initIpConfig();
}

function PortConfig() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PortConfig);
pr(PortConfig).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "PortConfig"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initPortConfig();
}

function DDNS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(DDNS);
pr(DDNS).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "DDNS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initDDNS();
}

function PPPoE() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(PPPoE);
pr(PPPoE).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "PPPoE"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initPPPOE();
}

function SNMP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(SNMP);
pr(SNMP).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "SNMP"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initSNMP();
}

function P8021x() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(P8021x);
pr(P8021x).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "P8021x"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	init8021x();
}

function QoS() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(QoS);
pr(QoS).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "QoS"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initQos();
}

function FTP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(FTP);
pr(FTP).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "FTP"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initFTP();
}
/*******WIFI********/
function WIFI() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(WIFI);
pr(WIFI).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "WIFI"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	initWIFI();
}
/*******UPNP********/
function UPNP() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(UPNP);
pr(UPNP).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Network", "UPnP"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	if($.browser.msie && parseInt($.browser.version, 10) == 6){
		$("#dvUPNP").find("select").show();
	}
	initUPNP();
}
pr(UPNP).beforeLeave = function() {
	if($.browser.msie && parseInt($.browser.version, 10) == 6){
		$("#dvUPNP").find("select").hide();
	}
}
/*************************************************
Function:		GetNetBasicInfo
Description:	获取网络基本信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetNetBasicInfo(szIndex)
{
	if(szIndex === undefined)
	{
		szIndex = "1";
	}
	$("#NetworkNo").val(szIndex);
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/"+szIndex,
		async: false,
		timeout: 15000,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			//获取网卡类型
			if($(xmlDoc).find('autoNegotiation').length > 0)
			{
				$("#dvNetworkType").show();
				if($(xmlDoc).find('autoNegotiation').eq(0).text() == 'true')
				{
					$("#NetworkType").val('5');
				}
				else if($(xmlDoc).find('speed').eq(0).text() == '10')
				{
					if($(xmlDoc).find('duplex').eq(0).text() == 'half')
					{
						$("#NetworkType").val('1');
					}
					else if($(xmlDoc).find('duplex').eq(0).text() == 'full')
					{
						$("#NetworkType").val('2');
					}
				}
				else if($(xmlDoc).find('speed').eq(0).text() == '100')
				{
					if($(xmlDoc).find('duplex').eq(0).text() == 'half')
					{
						$("#NetworkType").val('3');
					}
					else if($(xmlDoc).find('duplex').eq(0).text() == 'full')
					{
						$("#NetworkType").val('4');
					}
				}
				else if($(xmlDoc).find('speed').eq(0).text() == '1000')
				{
					$("#NetworkType").val('6');
				}
				else
				{
					document.getElementById('NetworkType').selectedIndex = -1;
				}
			}
			else
			{
				$("#dvNetworkType").hide();
			}
			//获取是否自动获取ip
			if($(xmlDoc).find('addressingType').eq(0).text() == 'dynamic')
			{
				$("#IsUseDHCP").prop('checked',true);
			}
			else
			{
				$("#IsUseDHCP").prop('checked',false);
			}
			//获取ip4地址
			$("#ipAddress").val($(xmlDoc).find('IPAddress').eq(0).find('ipAddress').eq(0).text());
	  
			//获取ip4子网掩码
			$("#subnetMask").val($(xmlDoc).find('IPAddress').eq(0).find('subnetMask').eq(0).text());
			//获取ip4网关
			$("#DefaultGateway").val($(xmlDoc).find('DefaultGateway').eq(0).find('ipAddress').eq(0).text());
			
			if($("#DefaultGateway").val() == '0.0.0.0')
			{
				$("#DefaultGateway").val("");
			}
			//获取Mac地址
			if($(xmlDoc).find('MACAddress').length > 0)
			{
				$("#dvMacAddress").show();
				$("#MacAddress").val($(xmlDoc).find('MACAddress').eq(0).text());
			}
			else
			{
				$("#dvMacAddress").hide();
			}
			
			//获取首选DNS服务器
			$("#PrimaryDNS").val($(xmlDoc).find('PrimaryDNS').eq(0).find('ipAddress').eq(0).text());
			
			//获取备用DNS服务器
			if($(xmlDoc).find('SecondaryDNS').length > 0)
			{
				$("#dvDNSServer2").show();
				$("#DNSServer2IP").val($(xmlDoc).find('SecondaryDNS').eq(0).find('ipAddress').eq(0).text());
			}
			else
			{
				$("#dvDNSServer2").hide();
			}
			
			if($("#PrimaryDNS").val() == '0.0.0.0')
			{
				$("#PrimaryDNS").val("");
			}
			if($("#DNSServer2IP").val() == '0.0.0.0')
			{
				$("#DNSServer2IP").val("");
			}
			//获取MTU值
			if($(xmlDoc).find('MTU').length > 0)
			{
				$("#MTU").val($(xmlDoc).find('MTU').eq(0).text());
				$("#9000MTU").show();
			}
			else
			{
				$("#9000MTU").hide();
			}
			//响应西东获取勾选框
			CheckIsDhcp();
			
			GetPPPOEEnable();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);
		}
	});
}
/*************************************************
Function:		getMulticast
Description:	获取多播地址
Input:			无			
Output:			无
return:			无				
*************************************************/
function getMulticast()
{
	g_szMulticastXml = "";
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_szMulticastXml = xhr.responseText;
			//多播地址
			if($(xmlDoc).find('Transport').eq(0).find('Multicast').length > 0) 
			{
				$("#dvMulticast").show();
				var iIndex = $("#divIpConfig").children("div").first().children("div:visible[class!='mainparams']").index($("#dvMulticast"));
				if(iIndex%2 == 0)
				{
					$("#dvMulticast").attr("class", "subparamswhite");
				}
				else
				{
					$("#dvMulticast").attr("class", "subparamsgray");
				}
				if(m_strIpVersion == 'v4')
				{
					var szMulticast = $(xmlDoc).find('Transport').eq(0).find('Multicast').eq(0).find('destIPAddress').eq(0).text();
					if(szMulticast == "0.0.0.0")
					{
						$("#Multicast").val('');
					}
					else
					{
						$("#Multicast").val(szMulticast);
					}
				}
				else
				{
					var szMulticast = $(xmlDoc).find('Transport').eq(0).find('Multicast').eq(0).find('destIPv6Address').eq(0).text();
					if(szMulticast == "::")
					{
						$("#Multicast").val('');
					}
					else
					{
						$("#Multicast").val(szMulticast);
					}
				}
			}
			else
			{
				$("#dvMulticast").hide();
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			$("#dvMulticast").hide();
		}
	});	
}
/*************************************************
Function:		setMulticast
Description:	设置多播地址
Input:			无			
Output:			无
return:			无				
*************************************************/
function setMulticast()
{
	if($("#dvMulticast").css("display") == "none")
	{
		return;
	}
	var szMulticast = $("#Multicast").val();
	var xmlDoc = parseXmlFromStr(g_szMulticastXml);
	
	if(m_strIpVersion == 'v4')
	{
		$(xmlDoc).find("Transport").eq(0).children("Multicast").eq(0).find("destIPAddress").eq(0).text(szMulticast==""?"0.0.0.0":szMulticast)
	}
	else
	{
		$(xmlDoc).find("Transport").eq(0).children("Multicast").eq(0).find("destIPv6Address").eq(0).text(szMulticast==""?"::":szMulticast)
	}
	var oMulticast = parseXmlFromStr('<?xml version="1.0" encoding="UTF-8"?><StreamingChannel><Transport></Transport></StreamingChannel>');
	var oTransport = $(oMulticast).find("Transport").eq(0);
	oTransport.append($(xmlDoc).find("Transport").eq(0).clone().children("ControlProtocolList"));
	oTransport.append($(xmlDoc).find("Transport").eq(0).clone().children("Multicast"));
	
	$.ajax(
	{
		type: "PUT",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		processData: false,
		data: oMulticast,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete:function(xhr, textStatus)
		{
			var xmlDoc =xhr.responseXML;
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			if("7" == state)	//Reboot Required
			{
				if(g_bIsRestart)
				{
					g_bIsRestart = false;
					SaveState(xhr);
				}
			}
			else
			{
				SaveState(xhr);
			}
		}
	});
}
/*************************************************
Function:		SetNetBasicInfo
Description:	设置网络基本信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetNetBasicInfo()
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	if($("#PrimaryDNS").val() != "")
	{
		if(!CheckDIPadd($("#PrimaryDNS").val(),'DNSServerIPtips','jsFirstDNS'))
		{
			return;
		}
	}
	if($("#DNSServer2IP").val() != "")
	{
		if(!CheckDIPadd($("#DNSServer2IP").val(),'DNSServer2IPtips','jsSecondDNS'))
		{
			return;
		}
	}
	if($("#9000MTU").css("display") != "none")
	{
	    if(!CheackServerIDIntNum($("#MTU").val(),'MTUtips','jsMtuParam',100,1500))
	    {
		    return;
	    }
	}
	if(!$("#IsUseDHCP").prop("checked") && !ia(IpConfig).m_bEnablePPPoE)
	{
		if($("#ipAddress").val() == '0.0.0.0')
		{
			$("#ServerIPtips").html(szTipsInfo + getNodeValue('DIPAddInvalidTips'));
			return;
		}
		if($("#subnetMask").val() == '0.0.0.0')
		{
			$("#ServerMaskIPtips").html(szTipsInfo + getNodeValue('MaskAddInvalidTips'));
			return;
		}
		
		if(!CheckDIPadd($("#ipAddress").val(),'ServerIPtips','laIpAddress'))
		{
			return;
		}
		
		if(!CheckMaskIP($("#subnetMask").val(),'ServerMaskIPtips','jsMaskAdd'))
		{
			return;
		}
		
		if($("#DefaultGateway").val() != '')
		{
			if(!CheckDIPadd($("#DefaultGateway").val(),'ServerGateWayIPtips','jsGateAdd'))
			{
				return;
			}
		}
	}
	if($("#dvMulticast").css("display") != "none")
	{
		var szMulticast = $("#Multicast").val();
		if(szMulticast != "")
		{
			if(!CheckMulticastIP(szMulticast,'Multicasttips','laMulticast'))
			{
				return;
			}
		}
	}
	
	var xmlDoc = new createxmlDoc();
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	
	Root = xmlDoc.createElement('NetworkInterface');
	
	Element = xmlDoc.createElement("id");
	text = xmlDoc.createTextNode("1");
	Element.appendChild(text);
	Root.appendChild(Element);
	
	IPAddress = xmlDoc.createElement('IPAddress');	
	ipVersion = xmlDoc.createElement("ipVersion");
	text = xmlDoc.createTextNode('v4');
	ipVersion.appendChild(text);
	IPAddress.appendChild(ipVersion);
	
	addressingType = xmlDoc.createElement("addressingType");
	if($("#IsUseDHCP").prop("checked"))
	{
		text = xmlDoc.createTextNode('dynamic');
	}
	else
	{
		text = xmlDoc.createTextNode('static');
	}
	addressingType.appendChild(text);
	IPAddress.appendChild(addressingType);
	
	Element = xmlDoc.createElement("ipAddress");
	text = xmlDoc.createTextNode($("#ipAddress").val());
	Element.appendChild(text);
	IPAddress.appendChild(Element);
	
	Element = xmlDoc.createElement("subnetMask");
	text = xmlDoc.createTextNode($("#subnetMask").val());
	Element.appendChild(text);
	IPAddress.appendChild(Element);
	
	Gateway = xmlDoc.createElement('DefaultGateway');
	
	Element = xmlDoc.createElement("ipAddress");
	if($("#DefaultGateway").val() == '')
	{
		text = xmlDoc.createTextNode('0.0.0.0');
	}
	else
	{
	    text = xmlDoc.createTextNode($("#DefaultGateway").val());
	}
	Element.appendChild(text);
	Gateway.appendChild(Element);
	IPAddress.appendChild(Gateway);
	
	FirstDNS = xmlDoc.createElement('PrimaryDNS');
	Element = xmlDoc.createElement("ipAddress");
	if($("#PrimaryDNS").val() == '')
	{
		text = xmlDoc.createTextNode('0.0.0.0');
	}
	else
	{
	    text = xmlDoc.createTextNode($("#PrimaryDNS").val());
	}
	Element.appendChild(text);
	FirstDNS.appendChild(Element);
	IPAddress.appendChild(FirstDNS);
	
	SecondaryDNS = xmlDoc.createElement('SecondaryDNS');
	Element = xmlDoc.createElement("ipAddress");
	if($("#DNSServer2IP").val() == '')
	{
		text = xmlDoc.createTextNode('0.0.0.0');
	}
	else
	{
	    text = xmlDoc.createTextNode($("#DNSServer2IP").val());
	}
	Element.appendChild(text);
	SecondaryDNS.appendChild(Element);
	IPAddress.appendChild(SecondaryDNS);
	
	Root.appendChild(IPAddress);
	
	/*Discovery = xmlDoc.createElement('Discovery');
	
	UPnP = xmlDoc.createElement("UPnP");
	enabled = xmlDoc.createElement("enabled");
	text = xmlDoc.createTextNode('false');
	enabled.appendChild(text);
	UPnP.appendChild(enabled);
	Discovery.appendChild(UPnP);
	
	Zeroconf = xmlDoc.createElement("Zeroconf");
	enabled = xmlDoc.createElement("enabled");
	text = xmlDoc.createTextNode('false');
	enabled.appendChild(text);
	Zeroconf.appendChild(enabled);
	Discovery.appendChild(Zeroconf);
	
	Root.appendChild(Discovery);*/
	
	Extensions = xmlDoc.createElement("Extensions");
	
	Link = xmlDoc.createElement("Link");
	MACAddress = xmlDoc.createElement("MACAddress");
	text = xmlDoc.createTextNode($("#MacAddress").val());
	MACAddress.appendChild(text);
	Link.appendChild(MACAddress);
	
	autoNegotiation = xmlDoc.createElement("autoNegotiation");
	text = xmlDoc.createTextNode('false');
	autoNegotiation.appendChild(text);
	Link.appendChild(autoNegotiation);
	
	speed = xmlDoc.createElement("speed");
	text = xmlDoc.createTextNode('');
	speed.appendChild(text);
	Link.appendChild(speed);
	
	duplex = xmlDoc.createElement("duplex");
	text = xmlDoc.createTextNode('');
	duplex.appendChild(text);
	Link.appendChild(duplex);
	
	Element = xmlDoc.createElement("MTU");
	text = xmlDoc.createTextNode($("#MTU").val());
	Element.appendChild(text);
	Link.appendChild(Element);
	
	Extensions.appendChild(Link);
	Root.appendChild(Extensions);
	xmlDoc.appendChild(Root);
	
	if($("#NetworkType").val() == '1')
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '10';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'half';
	}
	else if($("#NetworkType").val() == '2')
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '10';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'full';
	}
	else if($("#NetworkType").val() == '3')
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '100';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'half';
	}
	else if($("#NetworkType").val() == '4')
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '100';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'full';
	}
	else if($("#NetworkType").val() == '6')
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '1000';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'full';
	}
	else
	{
		xmlDoc.getElementsByTagName('speed')[0].childNodes[0].nodeValue = '0';
		xmlDoc.getElementsByTagName('duplex')[0].childNodes[0].nodeValue = 'full';
		if($("#NetworkType").val() == '5')
		{
			xmlDoc.getElementsByTagName('autoNegotiation')[0].childNodes[0].nodeValue = 'true';
		}
	}
	g_bIsRestart = true;
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/"+$("#NetworkNo").val();
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		processData: false,
		data: xmlDoc,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete:function(xhr, textStatus)
		{
			var xmlDoc = xhr.responseXML;
			if(xhr.status == 200)
			{
				setMulticast();
			}
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			if("7" == state)	//Reboot Required
			{
				g_bIsRestart = false;
				SaveState(xhr);
			}
			else
			{
				SaveState(xhr);
			}
		}
	});
}
/*************************************************
Function:		CheckIsDhcp
Description:	检查是否启用DHCP
Input:			无
Output:			无
return:			无	
*************************************************/
function CheckIsDhcp()
{
	if($("#IsUseDHCP").prop("checked"))
	{
      	$('#ipAddress').prop('disabled', true);
		$('#subnetMask').prop('disabled', true);
		$('#DefaultGateway').prop('disabled', true);
		$('#PrimaryDNS').prop('disabled', true);
		$('#DNSServer2IP').prop('disabled', true);
	} 
	else
	{
      	$('#ipAddress').prop('disabled', false);
		$('#subnetMask').prop('disabled', false);
		if(!ia(IpConfig).m_bEnablePPPoE) {
			$('#DefaultGateway').prop('disabled', false);
			$('#PrimaryDNS').prop('disabled', false);
			$('#DNSServer2IP').prop('disabled', false);
		}
	}
}
/*************************************************
Function:		GetPPPOEEnable
Description:	获取是否启用ppoe
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetPPPOEEnable()
{
	$.ajax(
	{
		type: "GET",
		url:  m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PPPoE",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
		    {
			    $('#PrimaryDNS').prop('disabled', true);
			    $('#DNSServer2IP').prop('disabled', true);
				$("#DefaultGateway").prop('disabled', true);
				ia(IpConfig).m_bEnablePPPoE = true;
		    }
			else
			{
				if(!$("#IsUseDHCP").prop("checked")) {
					$('#PrimaryDNS').prop('disabled', false);
					$('#DNSServer2IP').prop('disabled', false);
					$("#DefaultGateway").prop('disabled', false);
				}
				ia(IpConfig).m_bEnablePPPoE = false;
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			ia(IpConfig).m_bEnablePPPoE = false;
		}
	});
}
/*************************************************
Function:		GetPPPOEInfo
Description:	获取PPPOE信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetPPPOEInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PPPoE";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("true" == xmlDoc.documentElement.getElementsByTagName('enabled')[0].childNodes[0].nodeValue)
			{
				$("#PPPOEenabled").prop("checked",true);
				$("#PPPOEUserPsw").val(oCheckPassword.m_szDefaultPassword);
				$("#PswConfirm").val(oCheckPassword.m_szDefaultPassword);
			}
			else
			{
				$("#PPPOEenabled").prop("checked",false);
			}
			
			if(xmlDoc.documentElement.getElementsByTagName('userName')[0].hasChildNodes())
			{
			    $("#PPPOEUserName").val(xmlDoc.documentElement.getElementsByTagName('userName')[0].childNodes[0].nodeValue);
			}
			else
			{
			    $("#PPPOEUserName").val('');
			}
			oCheckPassword.checkUserName($(xmlDoc).find('userName').eq(0).text(), $('#PPPOEUserPsw'), $('#PswConfirm'));
			
			if(!$("#PPPOEenabled").prop("checked"))
			{
				$("#PPPOEUserName").prop("disabled",true);   
				$("#PPPOEUserPsw").prop("disabled",true); 
				$("#PswConfirm").prop("disabled",true); 
				$("#PPPoEIP").val('0.0.0.0');
			}
			else
			{
			    GetPPPOEAddress();
			}
		}
	});
}
/*************************************************
Function:		SetPPPOEInfo
Description:	设置PPPOE信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetPPPOEInfo()
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	$("#PswConfirmtips").html('');
	if($("#PPPOEenabled").prop("checked"))
	{
	    if(!CheackStringLenthNull($('#PPPOEUserName').val(),'PPPOEUserNametips','jsPPPOEName',32))
	    {
	  	    return;
	    }
	    if(!CheackStringLenth($('#PPPOEUserPsw').val(),'PPPOEUserPswtips','jsPPPOEPassword',16))
	    {
	  	    return;
	    }
		if($("#PPPOEUserPsw").val() != $("#PswConfirm").val() )
		{
			var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szAreaNameInfo += getNodeValue('jsPwdCheckMismatch');
			$("#SetResultTips").html(szAreaNameInfo);
			return -1;
		}
		if($('#PPPOEUserPsw').val().length == 0)
		{
			var szPasswordInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szPasswordInfo += getNodeValue("gePassword") + getNodeValue("NullTips");
			$("#PPPOEUserPswtips").html(szPasswordInfo);
			return -1;
		}
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><PPPoE><id>1</id>";
	
	szXml += "<enabled>"+$("#PPPOEenabled").prop("checked").toString()+"</enabled>";
	
	szXml += "<ethernetIfId>1</ethernetIfId>";
	
	szXml += "<userName>"+$('#PPPOEUserName').val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</userName>";
	
    if($('#PPPOEUserPsw').val() != "" && $('#PPPOEUserPsw').val() != oCheckPassword.m_szDefaultPassword)
	{
		szXml += "<password>"+$('#PPPOEUserPsw').val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</password>";
	}
	
	szXml += "</PPPoE>";
	
	var xmlDoc = parseXmlFromStr(szXml);

	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PPPoE/1";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		EnablePPPOE
Description:	设置PPPOE状态
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnablePPPOE()
{
	if($("#PPPOEenabled").prop("checked"))
	{
		$("#PPPOEUserName").prop("disabled",false);   
		$("#PPPOEUserPsw").prop("disabled",false); 
		$("#PswConfirm").prop("disabled",false);
	}else
	{
		$("#PPPOEUserName").prop("disabled",true);   
		$("#PPPOEUserPsw").prop("disabled",true); 
		$("#PswConfirm").prop("disabled",true);
	}
}
/*************************************************
Function:		GetPPPOEAddress
Description:	获取PPPOE IP地址
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetPPPOEAddress()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/PPPoE/1/status";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if(xmlDoc.documentElement.getElementsByTagName('ipAddress')[0].hasChildNodes())
			{
				$("#PPPoEIP").val($(xmlDoc).find('ipAddress').eq(0).text());
			}
			else
			{
				$("#PPPoEIP").val('0.0.0.0');
			}
		}
	});
}
/*************************************************
Function:		GetDDNSCapabilities
Description:	获取DDNS能力集
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetDDNSCapability()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/DDNS/capabilities";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var DDNSType = [];
			if($(xmlDoc).find('provider').length > 0)
			{
				$("#provider").empty();
				DDNSType = $(xmlDoc).find('provider').eq(0).attr("opt").split(",");
			}
			for(i = 0;i < DDNSType.length; i++)
			{
				switch(DDNSType[i])
				{
					case 'DynDns':
						strTemp = 'DynDNS';
						break;
					case 'PeanutHall':
						strTemp = 'PeanutHull';
						break;
					case 'NoIpDns':
						strTemp = 'NO-IP';
						break;
					default:
						strTemp = DDNSType[i];
						break;
				}
				$("<option value ='"+DDNSType[i]+"'>"+strTemp+"</option>").appendTo("#provider");
			}
		}
	});
}
/*************************************************
Function:		GetDDNSInfo
Description:	获取网络基本信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetDDNSInfo()
{
	GetDDNSCapability();
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/DDNS/1",
		async: false,
		timeout: 15000,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
			{
				$("#DDNSenabled").prop("checked",true);
			}
			else
			{
				$("#DDNSenabled").prop("checked",'');
			}
			
			m_szDDNS[0] = $(xmlDoc).find('provider').eq(0).text();
			
			addressingFormatType = $(xmlDoc).find('addressingFormatType').eq(0).text();  
			if(addressingFormatType == 'hostname')
			{
				m_szDDNS[1] = $(xmlDoc).find('hostName').eq(0).text();
			}
			else
			{
				m_szDDNS[1] = $(xmlDoc).find('ipAddress').eq(0).text();
			}
			
			if($(xmlDoc).find('portNo').length > 0)
			{
				$('#portNoDDNS_tr').show();
				m_szDDNS[2] = $(xmlDoc).find('portNo').eq(0).text();
			}
			
			m_szDDNS[3] = $(xmlDoc).find('userName').eq(0).text();
			if(m_szDDNS[3] != "" && m_szDDNS[3] != undefined)
			{
				m_szDDNS[4] = oCheckPassword.m_szDefaultPassword;
			}
			else
			{
				m_szDDNS[4] = ""; 
			}
			
			m_szDDNS[5] = $(xmlDoc).find('deviceDomainName').eq(0).text();
				 
			$("#provider").val(m_szDDNS[0]);
			SelectDDNSType(m_szDDNS[0]);
			EnableDDNS();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);
		}
	});
}
/*************************************************
Function:		SetDDNSInfo
Description:	设置DDNS参数
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetDDNSInfo()
{
	if(!$("#serverIPAddress").prop("disabled")) {
		if(!CheackStringLenthNull($("#serverIPAddress").val(),'ServerIPAddressStips','laServerAdd',64))
		{
			return;
		}
	}
	if(!CheackStringLenth($("#UserName").val(),'UserNametips','geUserName',32))
	{
		return;
	}
	if(!CheackStringLenth($("#Password").val(),'Passwordtips','gePassword',16))
	{
		return;
	}
	if(!$("#domainName").prop("disabled")) {
		if(!CheackStringLenthNull($("#domainName").val(),'ServerNameDDNStips2','laDeviceDomain',64))
		{
			return;
		}
	}
	
	if($("#DDNSenabled").prop("checked") && !$('#UserName').prop("disabled"))
	{
		if($("#Password").val() != $("#ConfirmPassword").val() )
		{
			var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szAreaNameInfo += getNodeValue('jsPwdCheckMismatch');
			$("#SetResultTips").html(szAreaNameInfo);
			return -1;
		}
		if($('#Password').val().length == 0 && $('#UserName').val().length != 0)
		{
			var szPasswordInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szPasswordInfo += getNodeValue("gePassword") + getNodeValue("NullTips");
			$("#Passwordtips").html(szPasswordInfo);
			return -1;
		}		
	}
	$("#ConfirmPasswordtips").html('');
	//开始更改
	var szXml = "<?xml version='1.0' encoding='utf-8'?>";
	szXml += "<DDNS><id>1</id>";
	szXml += "<enabled>"+$("#DDNSenabled").prop("checked").toString()+"</enabled>";
	szXml += "<provider>"+$('#provider').val()+"</provider>";
	
	if(!$("#serverIPAddress").prop("disabled"))
	{
		szXml += "<serverAddress>";
		//服务器地址类型
		var strIpAddressType = CheckAddressingType($("#serverIPAddress").val());
		var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		if(strIpAddressType == "hostName")
		{
			if("'" === $("#serverIPAddress").val())
			{
				$("#ServerIPAddressStips").html(szTipsInfo + getNodeValue("WrongTips") + getNodeValue("laServerAdd"));
				setTimeout(function(){$("#ServerIPAddressStips").html("");}, 5000);
				return;
			}
			szXml += "<addressingFormatType>hostname</addressingFormatType><hostName>"+$("#serverIPAddress").val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</hostName>";
		}
		else if(strIpAddressType == "ipv6Address")
		{
			if(!$.isIPv6($("#serverIPAddress").val()))
			{
				$("#ServerIPAddressStips").html(getNodeValue(szTipsInfo + "WrongTips") + getNodeValue("laServerAdd"));
				setTimeout(function(){$("#ServerIPAddressStips").html("");}, 5000);
				return;
			}
			szXml += "<addressingFormatType>ipaddress</addressingFormatType><ipv6Address>"+$("#serverIPAddress").val()+"</ipv6Address>";
		}
		else
		{
			if(!$.isIpAddress($("#serverIPAddress").val()))
			{
				$("#ServerIPAddressStips").html(szTipsInfo + getNodeValue("WrongTips") + getNodeValue("laServerAdd"));
				setTimeout(function(){$("#ServerIPAddressStips").html("");}, 5000);
				return;
			}
			szXml += "<addressingFormatType>ipaddress</addressingFormatType><ipAddress>"+$("#serverIPAddress").val()+"</ipAddress>";
		}
		szXml += "</serverAddress>";
	}
	
	if($('#portNoDDNS_tr').css('display') && !$('#portNo').prop('disabled'))
	{
		if(!CheackServerIDIntNum($("#portNo").val(),'Porttips','gePort',1,65535))
		{
			return;
		}
		szXml += "<portNo>"+$("#portNo").val()+"</portNo>";
	}
	if(!$("#domainName").prop("disabled")) {
		if($('#provider').val().toLocaleLowerCase() != "easyddns" && $('#provider').val().toLocaleLowerCase() != "hiddns" && $('#provider').val().toLocaleLowerCase() != "hkddns") {
			if("'" === $("#domainName").val())
			{
				$("#ServerNameDDNStips2").html(szTipsInfo + getNodeValue("WrongTips") + getNodeValue("laDeviceDomain"));
				setTimeout(function(){$("#ServerNameDDNStips2").html("");}, 5000);
				return;
			}
		} else {
			if(m_szDDNS[0].toLocaleLowerCase() !== "hkddns" || m_szDDNS[5] !== $("#domainName").val()) {
				if(!$.isHKDDNS($("#domainName").val())) {
					$("#ServerNameDDNStips2").html(szTipsInfo + getNodeValue("WrongTips") + getNodeValue("laDeviceDomain"));
					setTimeout(function(){$("#ServerNameDDNStips2").html("");}, 5000);
					return;
				}
			}
		}
	}
	szXml += "<deviceDomainName>"+$('#domainName').val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</deviceDomainName>";

	szXml += "<userName>"+$('#UserName').val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</userName>";

    if($("#Password").val() != "" && $('#Password').val() != oCheckPassword.m_szDefaultPassword)
	{
		szXml += "<password>"+$('#Password').val()+"</password>";
	}
	
	szXml += "</DDNS>";
	var xmlDoc = parseXmlFromStr(szXml);
	//结束更改  
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/DDNS/1";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		error: function(xhr, textStatus, errorThrown)
		{
			if("102" == $(xhr.responseXML).find("Extensions").eq(0).find("detailedStatusCode").eq(0).text())
			{
				var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
				$("#ServerNameDDNStips2").html(szAreaNameInfo+getNodeValue("jsDomainAlreadyExist"));
				$("#domainName").focus().val($("#domainName").val());
				setTimeout(function(){$("#ServerNameDDNStips2").html("");},5000)
			}
			else
			{
				SaveState(xhr);
			}
		},
		success: function(xmlDoc, textStatus, xhr)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		SelectDDNSType
Description:	选择协议类型
Input:			无			
Output:			无
return:			无				
*************************************************/
function SelectDDNSType(iType)
{
	if(iType == "IPServer")
	{
		$("#serverIPAddress").prop("disabled",false);
		$("#UserName").prop("disabled",true); 
		$("#Password").prop("disabled",true);
		$("#ConfirmPassword").prop("disabled",true);
		$("#domainName").prop("disabled",true); 
		$("#portNo").prop("disabled",true);
	}
	else if(iType == "DynDns" || iType == "NoIpDns" || iType == "DynDNS")
	{
		$("#serverIPAddress").prop("disabled",false);
		$("#UserName").prop("disabled",false); 
		$("#Password").prop("disabled",false); 
		$("#ConfirmPassword").prop("disabled",false);
		$("#domainName").prop("disabled",false); 
		$("#portNo").prop("disabled",true);
	}
	else if(iType == "PeanutHall")
	{
		$("#serverIPAddress").prop("disabled",true);
		$("#domainName").prop("disabled",true); 
		$("#UserName").prop("disabled",false); 
		$("#Password").prop("disabled",false); 
		$("#ConfirmPassword").prop("disabled",false);
		$("#portNo").prop("disabled",true);
	}
	else if(iType.toLocaleLowerCase() == "easyddns" || iType.toLocaleLowerCase() == "hiddns" || iType.toLocaleLowerCase() == "hkddns")
	{
		$("#serverIPAddress").prop("disabled",false);
		$("#domainName").prop("disabled",false); 
		$("#UserName").prop("disabled",true); 
		$("#Password").prop("disabled",true); 
		$("#ConfirmPassword").prop("disabled",true);
		$("#portNo").prop("disabled",true);
	}
	else
	{
		$("#serverIPAddress").prop("disabled",false);
		$("#UserName").prop("disabled",false); 
		$("#Password").prop("disabled",false); 
		$("#ConfirmPassword").prop("disabled",false);
		$("#domainName").prop("disabled",false); 
		$("#portNo").prop("disabled",true);
	}
	if(iType == m_szDDNS[0])
	{
		$("#domainName").val(m_szDDNS[5]);
		$("#portNo").val(m_szDDNS[2]);
		$("#UserName").val(m_szDDNS[3]);
		if($("#DDNSenabled").prop("checked") && iType != 'IPServer')
		{
			oCheckPassword.checkUserName(m_szDDNS[3], $('#Password'), $('#ConfirmPassword'));
		}
		$("#serverIPAddress").val(m_szDDNS[1]);	
	}
	else
	{
		$("#domainName").val('');
		$("#portNo").val('0');
		$("#UserName").val('');
		$("#Password").val('');
		$("#ConfirmPassword").val('');
		$("#serverIPAddress").val('');
	}
}
/*************************************************
Function:		EnableDDNS
Description:	设置DDNS状态
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableDDNS()
{
	$("#portNo").prop("disabled",true); 
	if($("#DDNSenabled").prop("checked"))
	{
		$("#provider").prop("disabled",false);   
		$("#UserName").prop("disabled",false); 
		$("#Password").prop("disabled",false);  
		$("#ConfirmPassword").prop("disabled",false);
		$("#domainName").prop("disabled",false);
		$("#serverIPAddress").prop("disabled",false);
		SelectDDNSType($("#provider").val());
	}
	else
	{
		$("#provider").prop("disabled",true);   
		$("#UserName").prop("disabled",true); 
		$("#Password").prop("disabled",true); 
		$("#ConfirmPassword").prop("disabled",true);
		$("#domainName").prop("disabled",true);
		$("#serverIPAddress").prop("disabled",true);
	}
}
/*************************************************
Function:		GetEmailInfo
Description:	获取Email信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetEmailInfo()
{
	$.ajax(
	{
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/Event/notification/mailing",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if($(xmlDoc).find('MailingNotification').length > 0)
			{
				if("hostname" == $(xmlDoc).find('addressingFormatType').eq(0).text())
				{
					$("#SMTPServerAddress").val($(xmlDoc).find('hostName').eq(0).text()); 
				}
				else
				{
					if($(xmlDoc).find('ipAddress').length > 0)
					{
						if($(xmlDoc).find('ipAddress').eq(0).text() == '0.0.0.0')
						{
							$('#SMTPServerAddress').val('');
						}
						else
						{
							$("#SMTPServerAddress").val($(xmlDoc).find('ipAddress').eq(0).text());
						}
					}
					else
					{
						$("#SMTPServerAddress").val($(xmlDoc).find('ipv6Address').eq(0).text());
					}
				}
				
				if($(xmlDoc).find('authenticationMode').eq(0).text() == 'none')
				{
					$("#authenticationMode").prop("checked", false);
					$("#UserName").val('');
					$("#Password").val('');
					$("#PwdConfirm").val('');
					oCheckPassword.checkUserName("", $('#Password'), $('#PwdConfirm'));
				}
				else
				{
					$("#authenticationMode").prop("checked", true);
					$("#UserName").val($(xmlDoc).find('accountName').eq(0).text()); 
					$("#Password").val(oCheckPassword.m_szDefaultPassword);
					$("#PwdConfirm").val(oCheckPassword.m_szDefaultPassword);
					oCheckPassword.checkUserName($(xmlDoc).find('accountName').eq(0).text(), $('#Password'), $('#PwdConfirm'));
				}
				EnableAuthen();
				$("#SMTPPort").val($(xmlDoc).find('portNo').eq(0).text()); 
				if($(xmlDoc).find('useSSL').eq(0).text() == 'true')
				{
					$("#SSL").prop("checked",true);
				}
				else
				{
					$("#SSL").prop("checked",false);
				}
				if($(xmlDoc).find('sendInterval').eq(0).text() == '0')
				{
					document.getElementById('MailInterval').selectedIndex = 0;
				}
				else
				{
					$("#MailInterval").val($(xmlDoc).find('sendInterval').eq(0).text());
				}
				
				if($(xmlDoc).find('sendAttachment').eq(0).text() == 'true')
				{
					$("#Attachment").prop("checked",true);
					$("#MailInterval").prop("disabled",false);
				}
				else
				{
					$("#Attachment").prop("checked",false);
					$("#MailInterval").prop("disabled",true);
				}
			}
			$("#SenderName").val($(xmlDoc).find('sender').eq(0).find('name').eq(0).text());
			$("#SenderAddress").val($(xmlDoc).find('sender').eq(0).find('emailAddress').eq(0).text());
			
			for(var i = 0; i < $(xmlDoc).find('receiver').length; i++)
			{
				 $("#ReceiverName" + (i + 1) ).val( $(xmlDoc).find('receiver').eq(i).find('name').eq(0).text() );
                 $("#ReceiverAddress" + (i + 1) ).val( $(xmlDoc).find('receiver').eq(i).find('emailAddress').eq(0).text() );
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
		}
	});
}
/*************************************************
Function:		SetEmailInfo
Description:	设置Email信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetEmailInfo()
{
	if(!CheackStringLenthNull($("#SMTPServerAddress").val(),'SMTPServerAddressStips','laServerAdd',32))
	{
		return;
	}
	if(!CheackServerIDIntNum($("#SMTPPort").val(),'SMTPPorttips','laSMTPPort',1,65535))
	{
		return;
	}
	if(!CheackStringLenth($("#Password").val(),'Passwordtips','gePassword',32))
	{
		return;
	}
	if(!CheackStringLenth($("#SenderName").val(), 'SenderNametips','laSenderName', 32))
	{
		return;
	}
	if(!CheackStringLenth($("#SenderAddress").val(), 'SenderAddresstips','laSenderAddress', 48))
	{
		return;
	}
	if(!CheckEmail($("#SenderAddress").val(), 'SenderAddresstips', 'jsEmailAdd'))
	{
		return;
	}
	if(!CheackStringLenth($("#ReceiverAddress1").val(), 'ReceiverAddresstips1','laReceiverAddress1', 48) || !CheckEmail($("#ReceiverAddress1").val(), 'ReceiverAddresstips1', 'jsEmailAdd'))
	{
		return;
	}
	if(!CheackStringLenth($("#ReceiverAddress2").val(), 'ReceiverAddresstips2','laReceiverAddress2', 48) || !CheckEmail($("#ReceiverAddress2").val(), 'ReceiverAddresstips2', 'jsEmailAdd'))
	{
		return;
	}	
	if($("#authenticationMode").prop("checked"))
	{
		if(!CheackStringLenthNull($("#UserName").val(),'UserNametips','geUserName',32))
		{
			return;
		}
		if($("#Password").val() != $("#PwdConfirm").val() )
		{
			var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szAreaNameInfo += getNodeValue('jsPwdCheckMismatch');
			$("#SetResultTips").html(szAreaNameInfo);
			return -1;
		}
		if($('#Password').val().length == 0 && $('#UserName').val().length != 0)
		{
			var szPasswordInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szPasswordInfo += getNodeValue("gePassword") + getNodeValue("NullTips");
			$("#Passwordtips").html(szPasswordInfo);
			return -1;
		}		
	}
	$("#PwdConfirmtips").html('');
	
	var szXml = "<?xml version='1.0' encoding='utf-8'?><MailingNotificationList><MailingNotification><id>1</id>";
	 
	//是否认证
	if($("#authenticationMode").prop("checked"))
	{
		szXml += "<authenticationMode>SMTP</authenticationMode>";
	}
	else
	{
		szXml += "<authenticationMode>none</authenticationMode>";
	}
	
	//服务器地址类型
	var strIpAddressType = CheckAddressingType($("#SMTPServerAddress").val());
	if(strIpAddressType == "hostName")
	{
		szXml += "<addressingFormatType>hostname</addressingFormatType><hostName>"+$("#SMTPServerAddress").val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</hostName>";
	}
	else
	{
		szXml += "<addressingFormatType>ipaddress</addressingFormatType><ipAddress>"+$("#SMTPServerAddress").val()+"</ipAddress>";
	}
	
	szXml += "<portNo>"+$("#SMTPPort").val()+"</portNo>";
	
	if($("#authenticationMode").prop("checked"))
	{
		szXml += "<accountName>"+$("#UserName").val()+"</accountName>";
		if($("#Password").val() != "" && $('#Password').val() != oCheckPassword.m_szDefaultPassword)
		{
			szXml += "<password>"+$("#Password").val()+"</password>";
		}
	}
	
	szXml += "<Extensions>";
	szXml += "<useSSL>"+$("#SSL").prop("checked").toString()+"</useSSL>";
	try
	{
		szXml += "<sendInterval>"+$("#MailInterval").val()+"</sendInterval>";
	}
	catch(err)
	{
		szXml += "<sendInterval>0</sendInterval>";
	}
	
	szXml += "<sendAttachment>"+$("#Attachment").prop("checked").toString()+"</sendAttachment>";
	
	szXml += "<sender><name>"+$("#SenderName").val().replace(/&/g, "&amp;").replace(/</g, "&lt;")+"</name><emailAddress>"+$("#SenderAddress").val()+"</emailAddress></sender>";
	
	szXml += "<receiverList>";
	for(var i = 0; i < 2; i++)
	{
		/*if($("#ReceiverName" + (i + 1) ).val() != '' ||  $("#ReceiverAddress" + (i + 1) ).val() != '')*/
		{
			szXml += "<receiver><id>"+(i+1)+"</id><name>"+$("#ReceiverName"+(i + 1)).val()+"</name><emailAddress>"+$("#ReceiverAddress"+(i + 1)).val()+"</emailAddress></receiver>";
		}
	}
	szXml += "</receiverList></Extensions></MailingNotification></MailingNotificationList>";
	
	xmlDoc = parseXmlFromStr(szXml);
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/Event/notification/mailing";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		EnableAuthen
Description:	使能服务器认证
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableAuthen()
{
	if($("#authenticationMode").prop("checked"))
	{
		$("#UserName").prop("disabled",false);   
		$("#Password").prop("disabled",false); 
		$("#PwdConfirm").prop("disabled",false);   
	}
	else
	{
		$("#UserName").prop("disabled",true);   
		$("#Password").prop("disabled",true); 
		$("#PwdConfirm").prop("disabled",true);   
	}
}
/*************************************************
Function:		EnableAttachment
Description:	使能发送间隔
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableAttachment()
{
	if($("#Attachment").prop("checked"))
	{
		$("#MailInterval").prop("disabled",false);   
	}
	else
	{
		$("#MailInterval").prop("disabled",true);    
	}
}

/*************************************************
Function:		GetQoSInfo
Description:	获取QoS信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetQoSInfo()
{
	$.ajax({
		type: "GET",
		url:  m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/qos/dscp",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var iLength = $(xmlDoc).find('DSCP').length;
			for(var i = 0; i < iLength; i++)
			{
				switch($(xmlDoc).find('trafficType').eq(i).text())
				{
					case 'devicemanagement':
					{
						$("#ManageDSCP").val($(xmlDoc).find('priorityValue').eq(i).text());
						break;
					}
					case 'commandcontrol':
					{
						$("#EADSCP").val($(xmlDoc).find('priorityValue').eq(i).text());
						break;
					}
					case 'video':
					{
						$("#VideoDSCP").val($(xmlDoc).find('priorityValue').eq(i).text());
						break;
					}
					default:
					{
						break;
					}
				  
				}
			}
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		},
		complete:function(XHR, textStatus)
		{
			
		}
	});
}

/*************************************************
Function:		SetQoSInfo
Description:	设置QoS信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetQoSInfo()
{
	if(!CheackServerIDIntNum($("#VideoDSCP").val(),'VideoDSCPtips','laVideoDSCP',0,63))
	{
		return;
	}
	if(!CheackServerIDIntNum($("#EADSCP").val(),'EADSCPtips','laEADSCP',0,63))
	{
		return;
	}
	if(!CheackServerIDIntNum($("#ManageDSCP").val(),'ManageDSCPtips','laManageDSCP',0,63))
	{
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><DSCPList>" + 
	"<DSCP>"+ "<id>1</id><enabled>true</enabled>" + "<priorityValue>"+$("#ManageDSCP").val()+"</priorityValue><trafficType>devicemanagement</trafficType></DSCP>" + 
	"<DSCP>"+ "<id>2</id><enabled>true</enabled>" + "<priorityValue>"+$("#EADSCP").val()+"</priorityValue><trafficType>commandcontrol</trafficType></DSCP>" + 
	"<DSCP>"+ "<id>3</id><enabled>true</enabled>" + "<priorityValue>"+$("#VideoDSCP").val()+"</priorityValue><trafficType>video</trafficType></DSCP>" +
	"</DSCPList>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/qos/dscp",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		initNetwork
Description:	初始化网络配置
Input:			无			
Output:			无
return:			无				
*************************************************/
function initNetwork()
{
	//802.1x
	$("#enable8021x").bind("click",function()
	{
		if(this.checked)
		{
			$("#EAPOLVersion").prop("disabled", false);
			$("#userName").prop("disabled", false);
			$("#password8021").prop("disabled", false);
			$("#password8021Confirm").prop("disabled", false);
		}
		else
		{
			$("#EAPOLVersion").prop("disabled", true);
			$("#userName").prop("disabled", true);
			$("#password8021").prop("disabled", true);
			$("#password8021Confirm").prop("disabled", true);
		}
	});
	//SNMP
	$("#enablev1").bind("click",function()
	{
		if(!$(this).prop("checked") && !$("#enablev2c").prop("checked"))
		{
			var self = this;
			$("#snmpv1v2c").find(":input").each(function()
			{
				if(this != self && this != $("#enablev2c")[0])
				{
					$(this).prop("disabled","true");
				}
			});
		}
		else
		{
			$("#snmpv1v2c").find("input").each(function()
			{
				$(this).prop("disabled","");
			});
		}
	});
	$("#enablev2c").bind("click",function()
	{
		if(!$(this).prop("checked") && !$("#enablev1").prop("checked"))
		{
			var self = this;
			$("#snmpv1v2c").find(":input").each(function()
			{
				if(this != self && this != $("#enablev1")[0])
				{
					$(this).prop("disabled","true");
				}
			});
		}
		else
		{
			$("#snmpv1v2c").find("input").each(function()
			{
				$(this).prop("disabled","");
			});
		}
	});
	
	$("#enablev3c").bind("click",function()
	{
		var self = this;
		if(!$(this).prop("checked"))
		{
			$("#snmpv3c").find(":input,select").each(function()
			{
				if(this != self)
				{
					$(this).prop("disabled","true");
				}
			});
		}
		else
		{
			$("#snmpv3c").find("input,select").prop("disabled","");
			
			var szSecValue = $("#rSecurityLevel").val();
			var bAuthAlg = (szSecValue.split("_")[0] == "1");
			var bPrivacyAlg = (szSecValue.split("_")[1] == "1");
			if(bAuthAlg)
			{
				$(document.getElementsByName("rAuthAlg")).prop("disabled", false);
				$("#rAuthPsd").prop("disabled", false);
			}
			else
			{
				$(document.getElementsByName("rAuthAlg")).prop("disabled", true);
				$("#rAuthPsd").prop("disabled", true);
			}
			if(bPrivacyAlg)
			{
				$(document.getElementsByName("rPrivacyAlg")).prop("disabled", false);
				$("#rPrivacyPsd").prop("disabled", false);
			}
			else
			{
				$(document.getElementsByName("rPrivacyAlg")).prop("disabled", true);
				$("#rPrivacyPsd").prop("disabled", true);
			}
			szSecValue = $("#rwSecurityLevel").val();
			bAuthAlg = (szSecValue.split("_")[0] == "1");
			bPrivacyAlg = (szSecValue.split("_")[1] == "1");
			if(bAuthAlg)
			{
				$(document.getElementsByName("rwAuthAlg")).prop("disabled", false);
				$("#rwAuthPsd").prop("disabled", false);
			}
			else
			{
				$(document.getElementsByName("rwAuthAlg")).prop("disabled", true);
				$("#rwAuthPsd").prop("disabled", true);
			}
			if(bPrivacyAlg)
			{
				$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", false);
				$("#rwPrivacyPsd").prop("disabled", false);
			}
			else
			{
				$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", true);
				$("#rwPrivacyPsd").prop("disabled", true);
			}
		}
	});
	$("#rSecurityLevel").bind("change", function()
	{
		var bAuthAlg = (this.value.split("_")[0] == "1");
		var bPrivacyAlg = (this.value.split("_")[1] == "1");
		if(bAuthAlg)
		{
			$(document.getElementsByName("rAuthAlg")).prop("disabled", false);
			$("#rAuthPsd").prop("disabled", false);
		}
		else
		{
			$(document.getElementsByName("rAuthAlg")).prop("disabled", true);
			$("#rAuthPsd").prop("disabled", true);
		}
		if(bPrivacyAlg)
		{
			$(document.getElementsByName("rPrivacyAlg")).prop("disabled", false);
			$("#rPrivacyPsd").prop("disabled", false);
		}
		else
		{
			$(document.getElementsByName("rPrivacyAlg")).prop("disabled", true);
			$("#rPrivacyPsd").prop("disabled", true);
		}
	});
	$("#rwSecurityLevel").bind("change", function()
	{
		var bAuthAlg = (this.value.split("_")[0] == "1");
		var bPrivacyAlg = (this.value.split("_")[1] == "1");
		if(bAuthAlg)
		{
			$(document.getElementsByName("rwAuthAlg")).prop("disabled", false);
			$("#rwAuthPsd").prop("disabled", false);
		}
		else
		{
			$(document.getElementsByName("rwAuthAlg")).prop("disabled", true);
			$("#rwAuthPsd").prop("disabled", true);
		}
		if(bPrivacyAlg)
		{
			$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", false);
			$("#rwPrivacyPsd").prop("disabled", false);
		}
		else
		{
			$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", true);
			$("#rwPrivacyPsd").prop("disabled", true);
		}
	});
	$(":text,:password").addClass("inputwidth");
	$("select").addClass("selectwidth");
	/*******密码框行为********/
	$("#rAuthPsd").bind(
	{
		blur:function()
		{
			if("" != $("#rUserName").val())
			{
				if(this.value == "")
				{
					this.value = "******";
				}
			}
		},
		focus:function()
		{
			if("" != $("#rUserName").val())
			{
				if(this.value == "******")
				{
					this.value = "";
				}
			}
		}
	});
	$("#rPrivacyPsd").bind(
	{
		blur:function()
		{
			if("" != $("#rUserName").val())
			{
				if(this.value == "")
				{
					this.value = "******";
				}
			}
		},
		focus:function()
		{
			if("" != $("#rUserName").val())
			{
				if(this.value == "******")
				{
					this.value = "";
				}
			}
		}
	});
	$("#rwAuthPsd").bind(
	{
		blur:function()
		{
			if("" != $("#rwUserName").val())
			{
				if(this.value == "")
				{
					this.value = "******";
				}
			}
		},
		focus:function()
		{
			if("" != $("#rwUserName").val())
			{
				if(this.value == "******")
				{
					this.value = "";
				}
			}
		}
	});
	$("#rwPrivacyPsd").bind(
	{
		blur:function()
		{
			if("" != $("#rwUserName").val())
			{
				if(this.value == "")
				{
					this.value = "******";
				}
			}
		},
		focus:function()
		{
			if("" != $("#rwUserName").val())
			{
				if(this.value == "******")
				{
					this.value = "";
				}
			}
		}
	});
	
	$("#selPathDepth").bind("change", function()
	{
		switch(this.value)
		{
			case '0':
				$("#selTopPath").prop("disabled", true);
				$("#selSubPath").prop("disabled", true);
				break;
			case '1':
				$("#selTopPath").prop("disabled", false);
				$("#selSubPath").prop("disabled", true);
				break;
			case '2':
				$("#selTopPath").prop("disabled", false);
				$("#selSubPath").prop("disabled", false);
				break;
			default:
				break;
		}
	});
	//FTP
	$("#chAnonyFtp").click(function(){
		if($(this).prop("checked")){
			$("#FtpUserName").prop("disabled", true);
			$("#FtpPassword").prop("disabled", true);
			$("#FtpPasswordConfirm").prop("disabled", true);
		} else{
			$("#FtpUserName").prop("disabled", false);
			$("#FtpPassword").prop("disabled", false);
			$("#FtpPasswordConfirm").prop("disabled", false);
		}
	});
	//WIFI
	$("#wifiChannel").empty().append("<option value='auto' name='aModeAuto'>"+getNodeValue("aModeAuto")+"</option>");
	for(var i = 0; i < 14; i++)
	{
		$("#wifiChannel").append("<option value='"+(i+1)+"'>"+(i+1)+"</option>");
	}
	var oAuthTypeList = $("#dvWifiSetting").find(":radio[name='authenticationType']");
	var oKeyLengthRadioList = $("#dvWifiSetting").find(":radio[name='KeyLength']");
	var oKeyTypeRadioList = $("#dvWifiSetting").find(":radio[name='KeyType']");
	var oEncryKeyRadioList = $("#dvWifiSetting").find(":radio[name='encryptionKey']");
	var oEncryKeyTextList = $("#dvWifiSetting").find(":text[id*='encryptionKey']");
	$("#securityMode").bind("change", function()
	{
		switch (this.value)
		{
			case "disable":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
				    if(i > 3) {
					    $(this).hide();
					}
				});
				break;
			case "WEP":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
					$(this).show();
					if(i === 4 || i > 11) {
					    $(this).hide();
					}
				});
				oEncryKeyRadioList.filter(":checked").click();
				break;
			case "WPA-personal":
			case "WPA2-personal":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
					$(this).show();
					if(i > 4 && i !== 8) {
					    $(this).hide();
					}
				});
				oEncryKeyRadioList.eq(0).click();
			    break;
			case "WPA-enterprise":
			case "WPA2-enterprise":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
					$(this).show();
					if(i > 3 && i < 12) {
					    $(this).hide();
					}
				});
				oEncryKeyRadioList.eq(0).click();
				$("#enterpriseType").change();
			    break;				
			default :
				break;
		}
		$("#dvWifiSetting").children("div:visible[class!='mainparams margintop26']").each(function(i)
		{
			if(i%2 == 0)
			{
				$(this).attr("class", "subparamswhite");
			}
			else
			{
				$(this).attr("class", "subparamsgray");
			}
		});		
		autoResizeIframe();
	});
	$("#enterpriseType").bind("change", function()
	{
		switch (this.value)
		{
			case "EAP-TLS":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
				    if(i > 11) {
					    $(this).show();    
					}
					if(i > 12 && i < 20) {
					    $(this).hide();
					}
				});
				break;
			case "EAP-PEAP":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
				    if(i > 11) {
					    $(this).show();    
					}
					if((i > 17 && i < 22 && i != 19) || (i > 23)) {
					    $(this).hide();
					}
				});
				break;
			case "EAP-TTLS":
				$("#dvWifiSetting").children("div[class!='displaynone']").each(function(i) {
				    if(i > 11) {
					    $(this).show();    
					}
					if((i > 19 && i < 22) || (i > 14 && i < 18) || (i > 23)) {
					    $(this).hide();
					}
				});					
			default :
				break;
		}
		$("#dvWifiSetting").children("div:visible[class!='mainparams margintop26']").each(function(i)
		{
			if(i%2 == 0)
			{
				$(this).attr("class", "subparamswhite");
			}
			else
			{
				$(this).attr("class", "subparamsgray");
			}
		});		
		autoResizeIframe();
	});	
	//密码类型改变事件
	oKeyTypeRadioList.bind("click", function()
	{
		oEncryKeyRadioList.filter(":checked").click();
	});
	//密码长度改变事件
	oKeyLengthRadioList.bind("click", function()
	{
		oEncryKeyRadioList.filter(":checked").click();
	});
	//密码选择单选框点击事件
	oEncryKeyRadioList.bind("click", function()
	{
		$(this).prop("checked", true);
		oEncryKeyTextList.prop("disabled", true);
		oEncryKeyTextList.eq(this.value-1).prop("disabled", false).focus().keyup();
	});
	//密码输入框事件
	oEncryKeyTextList.bind(
	{
		keyup: function()
		{
			var szVal = this.value;
			if($.isChinese(szVal)) { 
				szVal = szVal.replace(/[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/g, "");
			}
			var szKeyType = oKeyTypeRadioList.filter(":checked").val();
			var szKeyLength = oKeyLengthRadioList.filter(":checked").val();
			if($("#securityMode").val() == "WEP")
			{
				if("HEX" == szKeyType) //16进制
				{
					if("64" == szKeyLength)  //64位
					{
						szVal = szVal.substring(0, 10);
					}
					else   //128位
					{
						szVal = szVal.substring(0, 26);
					}
					var reg = /[^0-9a-fA-F]/i;
					if(reg.test(szVal)) {
						szVal = szVal.replace(/[^0-9a-fA-F]/g,"");
					}
				}
				else    //ASCII码
				{
					if("64" == szKeyLength)  //64位
					{
						szVal = szVal.substring(0, 5);
					}
					else   //128位
					{
						szVal = szVal.substring(0, 13);
					}
				}
			}
			else
			{
				szVal = szVal.substring(0, 63);
			}
			if(szVal !== $(this).val()) {
				$(this).val(szVal);
			}
		}
	});
	$("#privateKeyPassword").unbind().bind({
		focus: function() {
			if($("#enterprise1Identify").val() !== "") {
				if($(this).val() === oCheckPassword.m_szDefaultPassword) {
					$(this).val("");
				}
			}
		},
		blur: function() {
			if($("#enterprise1Identify").val() !== "") {
				if($(this).val() === "") {
					$(this).val(oCheckPassword.m_szDefaultPassword);
				}
			}
		}
	});
	$("#wifiPassword").unbind().bind({
		focus: function() {
			if($("#wifiUser").val() !== "") {
				if($(this).val() === oCheckPassword.m_szDefaultPassword) {
					$(this).val("");
				}
			}
		},
		blur: function() {
			if($("#wifiUser").val() !== "") {
				if($(this).val() === "") {
					$(this).val(oCheckPassword.m_szDefaultPassword);
				}
			}
		}
	});
	//UPnP
	$("#chEnablePortMap").change(function (){
		if($(this).prop("checked")) {
			$("#divPortsMapList").find(":checkbox").prop("checked", true);
			$("#selUPnPMapType").prop("disabled", false);
		} else {
			$("#divPortsMapList").find(":checkbox").prop("checked", false);
			$("#selUPnPMapType").prop("disabled", true);
		}
	});
	var oMapPorts = $("#divPortsMapList").children("div").find(".upnpthird");
	oMapPorts.each(function (i){
		$(this).click(function (){
			if($("#selUPnPMapType").val() == "auto") {
				return;
			}
			if($(this).find(":text").length > 0) {
				return;
			}
			var self = this;
			var szVal = $(this).text();
			$(this).html("<input type='text' style='margin:0 auto; width:"+($(this).width()-5)+"px;' maxlength='5'/>").find(":text").eq(0).keyup(function(){
				if(13 == event.keyCode) {
					$(this).blur();
					return;
				}
				var szVal = $(this).val();
				if(szVal !== "") {
					if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9') {
						if(szVal.length > 1) {
							$(this).val(szVal.substring(0, szVal.length - 1));
						} else {
							$(this).val('1');
						}
					}
					var iVal = parseInt(szVal, 10);
					if(iVal > 65535) {
						$(this).val('65535');
					}
					if(iVal < 1) {
						$(this).val('1');
					}
				}
			}).blur(function(){
				if(this.value !== "") {
					$(self).html(this.value);
				} else {
					$(self).html("1");
				}
			}).focus().val(szVal);
		});
	});
}
/*************************************************
Function:		Get8021xCab
Description:	获取8021x能力
Input:			无			
Output:			无
return:			无				
*************************************************/
function Get8021xCab()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ieee802.1x/capabilities",
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			//协议类型
			$("#ProtocolType").empty();
			var ProtocolType = xmlDoc.documentElement.getElementsByTagName('authenticationProtocolType')[0].getAttribute("opt").split(",");		
			for(var i = 0; i < ProtocolType.length; i++)
			{
				$("<option value='"+ ProtocolType[i] +"'>"+ ProtocolType[i] +"</option>").appendTo("#ProtocolType");
			}
			if(ProtocolType.length <= 1)
			{
				$("#ProtocolType").prop("disabled", true);
			}
			/*//认证方法
			$("#AuthMethodTr").show();
			var AuthMethods = xmlDoc.documentElement.getElementsByTagName('innerTTLSAuthenticationMethod')[0].getAttribute("opt").split(",");
			for(var i = 0; i < AuthMethods.length; i++)
			{
				$("<option value='"+ AuthMethods[i] +"'>"+ AuthMethods[i] +"</option>").appendTo("#AuthMethod");
			}
			if(AuthMethods.length <= 1)
			{
				$("#AuthMethod").prop("disabled", true);
			}
			if("EAP-TTLS" == $("#ProtocolType").val())
			{
				$("#AuthMethod").val(xmlDoc.documentElement.getElementsByTagName('innerTTLSAuthenticationMethod')[0].childNodes[0].nodeValue);
			}
			else
			{
				$("#AuthMethodTr").hide();
			}*/
			//Version
			var VersionType = xmlDoc.documentElement.getElementsByTagName('EAPOLVersion')[0].getAttribute("opt").split(",");
			$("#EAPOLVersion").empty();
			for(var i = 0; i < VersionType.length; i++)
			{
				$("<option value='"+ VersionType[i] +"'>"+ VersionType[i] +"</option>").appendTo("#EAPOLVersion");
			}
			if(VersionType.length <= 1)
			{
				$("#EAPOLVersion").prop("disabled", true);
			}
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}
/*************************************************
Function:		Get8021xInfo
Description:	获取8021x信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function Get8021x()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ieee802.1x",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("true" == $(xmlDoc).find('enabled').eq(0).text())
			{
				$("#enable8021x").prop("checked", true);
				$("#EAPOLVersion").prop("disabled", false);
				$("#userName").prop("disabled", false);
				$("#password8021").prop("disabled", false);
				$("#password8021Confirm").prop("disabled", false);
			    $("#ProtocolType").val($(xmlDoc).find('authenticationProtocolType').eq(0).text());
			    $("#EAPOLVersion").val($(xmlDoc).find('EAPOLVersion').eq(0).text());				
			}
			else
			{
				$("#enable8021x").prop("checked", false);
				$("#EAPOLVersion").prop("disabled", true);
				$("#userName").prop("disabled", true);
				$("#password8021").prop("disabled", true);
				$("#password8021Confirm").prop("disabled", true);
			}
			//用户名
			try
			{
				$("#userName").val($(xmlDoc).find("userName").eq(0).text());
				oCheckPassword.checkUserName($(xmlDoc).find("userName").eq(0).text(), $('#password8021'), $('#password8021Confirm'));
			}
			catch(e)
			{
				$("#userName").val("");
			}
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}

/*************************************************
Function:		Set8021x
Description:	设置8021x信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function Set8021x()
{
	var szXml = "";
	if(!$("#enable8021x").prop("checked"))
	{
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IEEE802_1x version='1.0' xmlns='urn:psialliance-org'>"+
		"<enabled>false</enabled>"+
		"<authenticationProtocolType></authenticationProtocolType>"+
		"<innerTTLSAuthenticationMethod></innerTTLSAuthenticationMethod>"+
		"<innerEAPProtocolType></innerEAPProtocolType>"+
		"<validateServerEnabled></validateServerEnabled>"+
		"<userName></userName>"+
		"<password></password>"+
		"<anonymousID></anonymousID>"+
		"<autoPACProvisioningEnabled></autoPACProvisioningEnabled>"+
		"<Extensions><EAPOLVersion></EAPOLVersion></Extensions></IEEE802_1x>";
	}
	else
	{
		if($("#userName").val() == "")
		{
			$("#userNametips").html(getNodeValue("geUserName")+getNodeValue("NullTips"));
			return;
		}
		if($("#password8021").val() == "")
		{
			$("#passwordtips").html(getNodeValue("gePassword")+getNodeValue("NullTips"));
			return;
		}
		if(!CheackStringLenth($("#userName").val(),'userNametips','geUserName',32))
		{
			return;
		}
		if(!CheackStringLenth($("#password8021").val(),'passwordtips','gePassword',16))
		{
			return;
		}
		if($("#password8021").val() != $("#password8021Confirm").val() )
		{
			var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szAreaNameInfo += getNodeValue('jsPwdCheckMismatch');
			$("#SetResultTips").html(szAreaNameInfo);
			return -1;
		}		
		szXml = "<?xml version='1.0' encoding='UTF-8'?><IEEE802_1x version='1.0' xmlns='urn:psialliance-org'>"+
		"<enabled>true</enabled>"+
		"<authenticationProtocolType>"+$("#ProtocolType").val()+"</authenticationProtocolType>"+
		"<innerTTLSAuthenticationMethod></innerTTLSAuthenticationMethod>"+
		"<innerEAPProtocolType></innerEAPProtocolType>"+
		"<validateServerEnabled></validateServerEnabled>"+
		"<userName>"+$("#userName").val()+"</userName>";
		if($("#password8021").val() != "" && $('#password8021').val() != oCheckPassword.m_szDefaultPassword)
		{
		    szXml += "<password>"+$("#password8021").val()+"</password>";
		}
		szXml += "<anonymousID></anonymousID>"+
		"<autoPACProvisioningEnabled>true</autoPACProvisioningEnabled>"+
		"<Extensions><EAPOLVersion>"+$("#EAPOLVersion").val()+"</EAPOLVersion></Extensions></IEEE802_1x>";
	}
	var xmlDoc = parseXmlFromStr(szXml);
	
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ieee802.1x",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}

/*************************************************
Function:		initIpconfig
Description:	初始化IpConfig页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initIpConfig()
{
	if(g_bSupportWIFI)
	{
		$("#dvSelectNetCard").show()
	}
	else
	{
		$("#dvSelectNetCard").hide()
	}
	$("#divIpConfig").children("div").first().children("div:visible[class!='mainparams']").each(function(i)
	{
		if($(this).hasClass("subparamswhite") || $(this).hasClass("subparamsgray"))
		{
			return false;
		}
		if(i%2 == 0)
		{
			$(this).attr("class", "subparamswhite");
		}
		else
		{
			$(this).attr("class", "subparamsgray");
		}
	});
	$("#Multicast").unbind("blur").blur(function(){
		if(this.value != "")
		{
			CheckMulticastIP(this.value,'Multicasttips','laMulticast');
		}
	});
    GetNetBasicInfo();
	//获取多播
	getMulticast();
	autoResizeIframe();
}
/*************************************************
Function:		initPortConfig
Description:	初始化IpConfig页面
Input:			无
Output:			无
return:			无				
*************************************************/
function initPortConfig()
{
    getPortInfo();
	autoResizeIframe();
}
/*************************************************
Function:		getPortInfo
Description:	获取端口号信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getPortInfo()
{
    getHttpPortInfo();
	getRtspPortInfo();
}
/*************************************************
Function:		setPortInfo
Description:	设置端口号信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function setPortInfo()
{
	if(!CheackServerIDIntNum($("#inputHttpPort").val(),'HttpPortTips','jsHttpPortParam',1,65535))
	{
	    return;
	}
	if(!CheackServerIDIntNum($("#inputRtspPort").val(),'RtspPortTips','jsRtspPortParam',1,65535))
	{
	    return;
	}
	if(!CheackServerIDIntNum($("#inputHttpsPort").val(),'HttpsPortTips','jsHttpsPortParam',1,65535))
	{
	    return;
	}
	if(!CheackServerIDIntNum($("#inputSDKPort").val(),'SDKPortTips','laSDKPort',1,65535))
	{
	    return;
	}
	if($("#inputSDKPort").val() === $("#inputHttpPort").val() || $("#inputSDKPort").val() === $("#inputRtspPort").val() || $("#inputSDKPort").val() === $("#inputHttpsPort").val() || $("#inputRtspPort").val() === $("#inputHttpPort").val() || $("#inputRtspPort").val() === $("#inputHttpsPort").val() || $("#inputHttpPort").val() === $("#inputHttpsPort").val()) {
		var szErrorInfo = m_szErrorState + getNodeValue("jsPortConflict");
		$("#SetResultTips").html(szErrorInfo);
		setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
		return;
	}
	g_bIsRestart = true;
	if($('#divRtspPort').css('display') != "none")
	{
		setRtspPortInfo();
	}
	if( ($('#divHttpPort').css('display') != "none" || $('#divHttpsPort').css('display') != "none"))
	{
		setHttpPortInfo();
	}
}
/*************************************************
Function:		getHttpPortInfo
Description:	获取HTTP端口号
Input:			无			
Output:			无
return:			无				
*************************************************/
function getHttpPortInfo()
{ 
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Security/AAA/adminAccesses",
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			var oPortsArray = $(xmlDoc).find('AdminAccessProtocol');
			for(var i = 0; i < oPortsArray.length; i++){
				switch (oPortsArray.eq(i).find("id").eq(0).text()){
					case '1':
						$("#divHttpPort").show();
				    	$("#inputHttpPort").val(oPortsArray.eq(i).find("portNo").eq(0).text());
						break;
					case '2':
						$("#divHttpsPort").show();
				    	$("#inputHttpsPort").val(oPortsArray.eq(i).find("portNo").eq(0).text());
						break;
					case '3':
						$("#divSDKPort").show();
				    	$("#inputSDKPort").val(oPortsArray.eq(i).find("portNo").eq(0).text());
						break;
					default:
						break;
				}
			}
		},
		error: function(xhr, textStatus, errorThrown){
			$("#divHttpsPort").hide();
			$("#divHttpPort").hide();
			$("#divSDKPort").hide();
		}
	});	
}
/*************************************************
Function:		setHttpPortInfo
Description:	设置Http和Https端口
Input:			无
Output:			无
return:			无
*************************************************/
function setHttpPortInfo()
{
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><AdminAccessProtocolList>";
	if($('#divHttpPort').css('display') != "none"){
		szXml += "<AdminAccessProtocol><id>1</id><enabled>true</enabled><protocol>HTTP</protocol><portNo>"+$("#inputHttpPort").val()+"</portNo></AdminAccessProtocol>";
	}
	if($('#divHttpsPort').css('display') != "none"){
        szXml += "<AdminAccessProtocol><id>2</id><enabled>true</enabled><protocol>HTTPS</protocol><portNo>"+$("#inputHttpsPort").val()+"</portNo></AdminAccessProtocol>";
	}
	if($('#divSDKPort').css('display') != "none"){
		 szXml += "<AdminAccessProtocol><id>3</id><enabled>true</enabled><protocol>SDK</protocol><portNo>"+$("#inputSDKPort").val()+"</portNo></AdminAccessProtocol>";
	}
	szXml += "</AdminAccessProtocolList>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp+m_szHostName+":"+m_lHttpPort+"/PSIA/Security/AAA/adminAccesses",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus){
			var xmlDoc =xhr.responseXML;
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			if("7" == state) {	//Reboot Required
				if(g_bIsRestart){
					g_bIsRestart = false;
					SaveState(xhr);
				}
			} else{
				SaveState(xhr);
			}
		}
	});	
}
/*************************************************
Function:		getRtspPortInfo
Description:	获取RTSP端口
Input:			无
Output:			无
return:			无
*************************************************/
function getRtspPortInfo()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_oXmlRtspPort = xmlDoc;
			if($(xmlDoc).find('rtspPortNo').length > 0)
			{
			    $("#divRtspPort").show();
				$("#inputRtspPort").val($(xmlDoc).find('rtspPortNo').eq(0).text());
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{

		}
	});	
}
/*************************************************
Function:		setRtspPortInfo
Description:	设置RTSP端口
Input:			无
Output:			无
return:			无
*************************************************/
function setRtspPortInfo()
{
	var xmlDoc = g_oXmlRtspPort;
	if($('#divRtspPort').css('display') != "none"){
        $(xmlDoc).find('rtspPortNo').eq(0).text($("#inputRtspPort").val());
	}
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: true,
		timeout: 15000,
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			var xmlDoc =xhr.responseXML;
			var state = $(xmlDoc).find('statusCode').eq(0).text();
			if("7" == state){	//Reboot Required
				if(g_bIsRestart){
					g_bIsRestart = false;
					SaveState(xhr);
				}
			}else{
				SaveState(xhr);
			}
		}
	});		
}
/*************************************************
Function:		initDDNS
Description:	初始化initDDNS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initDDNS()
{
    GetDDNSInfo();
	autoResizeIframe();
}
/*************************************************
Function:		initPPPOE
Description:	初始化initPPPOE页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initPPPOE()
{
    GetPPPOEInfo();	
	autoResizeIframe();
}
/*************************************************
Function:		init8021x
Description:	初始化8021x页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function init8021x()
{
	Get8021xCab();
	Get8021x();
	autoResizeIframe();
}
/*************************************************
Function:		initQos
Description:	初始化QoS页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initQos()
{
    GetQoSInfo();
	autoResizeIframe();
}

/*************************************************
Function:		initSNMP
Description:	初始化SNMP页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initSNMP()
{
    GetSNMPInfo();
}

/*************************************************
Function:		GetSNMPInfo
Description:	获取SNMP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetSNMPInfo()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/snmp",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			g_oSNMPXml = xmlDoc;
			//SNMPv1v2c
			if($(xmlDoc).find('SNMPv2c').length > 0)
			{
				$("#snmpv1v2c").show();
				var oSNMPv2c = $(xmlDoc).find('SNMPv2c').eq(0);
				$("#enablev2c")[0].checked = (oSNMPv2c.find('enabled').eq(0).text() == "true"?true:false);
				$("#enablev1")[0].checked = (oSNMPv2c.find('v1Enabled').eq(0).text() == "true"?true:false);
				$("#rwCommunity").val(oSNMPv2c.find('writeCommunity').eq(0).text());
				$("#rCommunity").val(oSNMPv2c.find('readCommunity').eq(0).text());
				if("hostname" == oSNMPv2c.find("addressingFormatType").eq(0).text())
				{
					$("#trapIP").val(oSNMPv2c.find('hostName').eq(0).text());
				}
				else
				{
					if(0 != oSNMPv2c.find("ipAddress").length)
					{
						$("#trapIP").val(oSNMPv2c.find("ipAddress").eq(0).text());
					}
					else
					{
						$("#trapIP").val(oSNMPv2c.find("ipv6Address").eq(0).text());
					}
				}
				$("#trapPort").val(oSNMPv2c.find("portNo").eq(0).text());
				if(oSNMPv2c.find('communityString').length > 0)
				{
					$("#trapCommunityArea").show();
					$("#trapCommunity").val(oSNMPv2c.find('communityString').eq(0).text());
				}
			}
			else
			{
				$("#snmpv1v2c").hide();
			}
			//SNMPv3c
			if($(xmlDoc).find('SNMPAdvanced').length > 0)
			{
				$("#snmpv3c").show();
				var oSNMPv3c = $(xmlDoc).find('SNMPAdvanced').eq(0);
				$("#enablev3c")[0].checked = (oSNMPv3c.find('enabled').eq(0).text() == "true"?true:false);
				//仅读用户
				$("#rUserName").val(oSNMPv3c.find('userName').eq(0).text());
				var szRAuthAlg = oSNMPv3c.find('snmpAuthenticationMethod').eq(0).text();
				var szRPrivacyAlg = oSNMPv3c.find('snmpPrivacyMethod').eq(0).text();
				if(szRAuthAlg == "none")
				{
					$("#rSecurityLevel").val("0_0");
					$(document.getElementsByName("rAuthAlg")).prop("disabled", true);
					$(document.getElementsByName("rPrivacyAlg")).prop("disabled", true);
					$("#rAuthPsd").prop("disabled", true);
					$("#rPrivacyPsd").prop("disabled", true);
				}
				else
				{
					$(document.getElementsByName("rAuthAlg")).each(function()
					{
						if(this.value == szRAuthAlg)
						{
							this.checked = true;
							return;
						}
					});
					if(szRPrivacyAlg == "none")
					{
						$("#rSecurityLevel").val("1_0");
						$(document.getElementsByName("rPrivacyAlg")).prop("disabled", true);
						$("#rPrivacyPsd").prop("disabled", true);
					}
					else
					{
						$(document.getElementsByName("rPrivacyAlg")).each(function()
						{
							if(this.value == szRPrivacyAlg)
							{
								this.checked = true;
								return;
							}
						});
						$("#rSecurityLevel").val("1_1");
					}
				}
				//读写用户
				$("#rwUserName").val(oSNMPv3c.find('userName').eq(1).text());
				var szRwAuthAlg = oSNMPv3c.find('snmpAuthenticationMethod').eq(1).text();
				var szRwPrivacyAlg = oSNMPv3c.find('snmpPrivacyMethod').eq(1).text();
				if(szRwAuthAlg == "none")
				{
					$(document.getElementsByName("rwAuthAlg")).prop("disabled", true);
					$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", true);
					$("#rwSecurityLevel").val("0_0");
					$("#rwAuthPsd").prop("disabled", true);
					$("#rwPrivacyPsd").prop("disabled", true);
				}
				else
				{
					$(document.getElementsByName("rwAuthAlg")).each(function()
					{
						if(this.value == szRwAuthAlg)
						{
							this.checked = true;
							return;
						}
					});
					if(szRwPrivacyAlg == "none")
					{
						$("#rwSecurityLevel").val("1_0");
						$(document.getElementsByName("rwPrivacyAlg")).prop("disabled", true);
						$("#rwPrivacyPsd").prop("disabled", true);
					}
					else
					{
						$(document.getElementsByName("rwPrivacyAlg")).each(function()
						{
							if(this.value == szRwPrivacyAlg)
							{
								this.checked = true;
								return;
							}
						});
						$("#rwSecurityLevel").val("1_1");
					}
				}
				
				if("" != $("#rUserName").val())
				{
					$("#rAuthPsd").val("******");
					$("#rPrivacyPsd").val("******");
				}
				if("" != $("#rwUserName").val())
				{
					$("#rwAuthPsd").val("******");
					$("#rwPrivacyPsd").val("******");
				}
				if(!$("#enablev2c")[0].checked && !$("#enablev1")[0].checked)
				{
					$("#snmpv1v2c").find(":input").each(function()
					{
						if(this != $("#enablev1")[0] && this != $("#enablev2c")[0])
						{
							$(this).prop("disabled","true");
						}
					});
				}
				if(!$("#enablev3c")[0].checked)
				{
					$("#snmpv3c").find(":input,select").each(function()
					{
						if(this != $("#enablev3c")[0])
						{
							$(this).prop("disabled","true");
						}
					});
				}
			}
			else
			{
				$("#snmpv3c").hide();
			}
			autoResizeIframe();
			$("#snmpPort").val($(xmlDoc).find('listenPort').last().text());
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}

/*************************************************
Function:		SetSNMPInfo
Description:	设置SNMP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetSNMPInfo()
{
	/*if(!$("#enablev1")[0].checked && !$("#enablev2c")[0].checked && !$("#enablev3c")[0].checked)
	{
		alert(getNodeValue("jsOneLeast"));
		return;
	}*/
	if(!CheackServerIDIntNum($("#snmpPort").val(),"snmpPortTips","gePort",1,65535))
	{
		$("#snmpPort").focus();
		return;
	}
	if($("#enablev2c")[0].checked || $("#enablev1")[0].checked)
	{
		if(!CheackServerIDIntNum($("#trapPort").val(),"trapPortTips","gePort",1,65535))
		{
			$("#trapPort").focus();
			return;
		}
		if(!CheckIPAddress($("#trapIP").val(),"trapIPTips","jsTrapIp"))
		{
			$("#trapIP").focus();
			return;
		}
		if(!CheckUserNamePlus($("#rwCommunity").val(),"rwCommunityTips","laRwCommunity",0))
		{
			$("#rwCommunity").focus();
			return;
		}
		if(!CheckUserNamePlus($("#rCommunity").val(),"rCommunityTips","laRCommunity",0))
		{
			$("#rCommunity").focus();
			return;
		}
		if(!CheckUserNamePlus($("#trapCommunity").val(),"trapCommunityTips","laTrapCommunity",0))
		{
			$("#trapCommunity").focus();
			return;
		}
	}
	if($("#enablev3c")[0].checked)
	{
		if(!CheckUserNamePlus($("#rUserName").val(),"rUserNameTips","laRUserName",0))
		{
			$("#rUserName").focus();
			return;
		}
		if(!CheckUserNamePlus($("#rwUserName").val(),"rwUserNameTips","laRwUserName",0))
		{
			$("#rwUserName").focus();
			return;
		}
		//读用户安全级别
		var szRSecurityLevel = $("#rSecurityLevel").val();
		var bRAuthAlg = (szRSecurityLevel.split("_")[0] == "1");
		var bRPrivacyAlg = (szRSecurityLevel.split("_")[1] == "1");
		if(bRAuthAlg)
		{
			if(!CheackStringLenthNull($("#rAuthPsd").val(),"rAuthPsdTips","laAuthPsd",16))
			{
				$("#rAuthPsd").focus();
				return;
			}
		}
		if(bRPrivacyAlg)
		{
			if(!CheackStringLenthNull($("#rPrivacyPsd").val(),"rPrivacyPsdTips","laPrivacyPsd",16))
			{
				$("#rPrivacyPsd").focus();
				return;
			}
		}
		//读写用户安全级别
		var szRwSecurityLevel = $("#rwSecurityLevel").val();
		var bRwAuthAlg = (szRwSecurityLevel.split("_")[0] == "1");
		var bRwPrivacyAlg = (szRwSecurityLevel.split("_")[1] == "1");
		if(bRwAuthAlg)
		{
			if(!CheackStringLenthNull($("#rwAuthPsd").val(),"rwAuthPsdTips","laAuthPsd",16))
			{
				$("#rwAuthPsd").focus();
				return;
			}
		}
		if(bRwPrivacyAlg)
		{
			if(!CheackStringLenthNull($("#rwPrivacyPsd").val(),"rwPrivacyPsdTips","laPrivacyPsd",16))
			{
				$("#rwPrivacyPsd").focus();
				return;
			}
		}
	}
	var xmlDoc = g_oSNMPXml;
	if(!$("#enablev2c")[0].checked && !$("#enablev1")[0].checked)
	{
		$(xmlDoc).find('SNMPv2c').eq(0).find('enabled').eq(0).text("false");
		$(xmlDoc).find('SNMPv2c').eq(0).find('v1Enabled').eq(0).text("false");
	}
	else
	{
		var oSNMPv2c = xmlDoc.createElement("SNMPv2c");
		
		var Element = xmlDoc.createElement("notificationEnabled");
		var text = xmlDoc.createTextNode("true");
		Element.appendChild(text);
		oSNMPv2c.appendChild(Element);
		
		var oTrapReceiverList = xmlDoc.createElement("SNMPTrapReceiverList");
		var oTrapReceiver = xmlDoc.createElement("SNMPTrapReceiver");
		oTrapReceiverList.appendChild(oTrapReceiver);
		
		Element = xmlDoc.createElement("id");
		text = xmlDoc.createTextNode("1");
		Element.appendChild(text);
		oTrapReceiver.appendChild(Element);
		
		var oReceiverAddress = xmlDoc.createElement("ReceiverAddress");
		
		var strIpAddressType = CheckAddressingType($("#trapIP").val());
		if(strIpAddressType == "hostName")
		{
			Element = xmlDoc.createElement("addressingFormatType");
			text = xmlDoc.createTextNode("hostname");
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("hostName");
			text = xmlDoc.createTextNode($("#trapIP").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("portNo");
			text = xmlDoc.createTextNode($("#trapPort").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
		}
		else if(strIpAddressType == "ipv6Address")
		{
			Element = xmlDoc.createElement("addressingFormatType");
			text = xmlDoc.createTextNode("ipaddress");
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("ipv6Address");
			text = xmlDoc.createTextNode($("#trapIP").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("portNo");
			text = xmlDoc.createTextNode($("#trapPort").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
		}
		else
		{
			Element = xmlDoc.createElement("addressingFormatType");
			text = xmlDoc.createTextNode("ipaddress");
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("ipAddress");
			text = xmlDoc.createTextNode($("#trapIP").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
			
			Element = xmlDoc.createElement("portNo");
			text = xmlDoc.createTextNode($("#trapPort").val());
			Element.appendChild(text);
			oReceiverAddress.appendChild(Element);
		}
		oTrapReceiver.appendChild(oReceiverAddress);
		
		Element = xmlDoc.createElement("notificationType");
		text = xmlDoc.createTextNode("trap");
		Element.appendChild(text);
		oTrapReceiver.appendChild(Element);
		
		if("none" != $("#trapCommunityArea").css("display"))
		{
			Element = xmlDoc.createElement("communityString");
			text = xmlDoc.createTextNode($("#trapCommunity").val());
			Element.appendChild(text);
			oTrapReceiver.appendChild(Element);
		}
		oSNMPv2c.appendChild(oTrapReceiverList);
		
		var oSNMPv2cExt = xmlDoc.createElement("Extensions");
		var oSNMPv2cSelf = xmlDoc.createElement("selfExt");
		
		Element = xmlDoc.createElement("enabled");
		text = xmlDoc.createTextNode($("#enablev2c")[0].checked.toString());
		Element.appendChild(text);
		oSNMPv2cSelf.appendChild(Element);
		
		Element = xmlDoc.createElement("v1Enabled");
		text = xmlDoc.createTextNode($("#enablev1")[0].checked.toString());
		Element.appendChild(text);
		oSNMPv2cSelf.appendChild(Element);
		
		Element = xmlDoc.createElement("writeCommunity");
		text = xmlDoc.createTextNode($("#rwCommunity").val());
		Element.appendChild(text);
		oSNMPv2cSelf.appendChild(Element);
		
		Element = xmlDoc.createElement("readCommunity");
		text = xmlDoc.createTextNode($("#rCommunity").val());
		Element.appendChild(text);
		oSNMPv2cSelf.appendChild(Element);
		
		oSNMPv2cExt.appendChild(oSNMPv2cSelf);
		oSNMPv2c.appendChild(oSNMPv2cExt);
		
		xmlDoc.documentElement.replaceChild(oSNMPv2c, xmlDoc.documentElement.getElementsByTagName("SNMPv2c")[0]);
	}
	if($("#enablev3c")[0].checked)
	{
		//读用户认证算法
		var szRAuthAlg = "";
		if(bRAuthAlg)
		{
			$(document.getElementsByName("rAuthAlg")).each(function()
			{
				if(this.checked)
				{
					szRAuthAlg = this.value;
					return false;
				}
			});
		}
		else
		{
			szRAuthAlg = "none";
		}
		//读用户私钥算法
		var szRPrivacyAlg = "";
		if(bRPrivacyAlg)
		{
			$(document.getElementsByName("rPrivacyAlg")).each(function()
			{
				if(this.checked)
				{
					szRPrivacyAlg = this.value;
					return false;
				}
			});
		}
		else
		{
			szRPrivacyAlg = "none";
		}
		//读写用户认证算法
		var szRwAuthAlg = "";
		if(bRwAuthAlg)
		{
			$(document.getElementsByName("rwAuthAlg")).each(function()
			{
				if(this.checked)
				{
					szRwAuthAlg = this.value;
					return false;
				}
			});
		}
		else
		{
			szRwAuthAlg = "none";
		}
		//读写用户私钥算法
		var szRwPrivacyAlg = "";
		if(bRwPrivacyAlg)
		{
			$(document.getElementsByName("rwPrivacyAlg")).each(function()
			{
				if(this.checked)
				{
					szRwPrivacyAlg = this.value;
					return false;
				}
			});
		}
		else
		{
			szRwPrivacyAlg = "none";
		}
		
		var oSNMPv3  = xmlDoc.createElement("SNMPAdvanced");
		
		var Element = xmlDoc.createElement("localEngineID");
		oSNMPv3.appendChild(Element);
		
		var oUserList = xmlDoc.createElement("SNMPUserList");
		var oRUser = xmlDoc.createElement("SNMPUser");
		var oRwUser = xmlDoc.createElement("SNMPUser");
		//读用户
		Element = xmlDoc.createElement("id");
		var text = xmlDoc.createTextNode("1");
		Element.appendChild(text);
		oRUser.appendChild(Element);
		
		Element = xmlDoc.createElement("userName");
		text = xmlDoc.createTextNode($("#rUserName").val());
		Element.appendChild(text);
		oRUser.appendChild(Element);
		
		Element = xmlDoc.createElement("remoteEngineID");
		oRUser.appendChild(Element);
		
		Element = xmlDoc.createElement("snmpAuthenticationMethod");
		text = xmlDoc.createTextNode(szRAuthAlg);
		Element.appendChild(text);
		oRUser.appendChild(Element);
		if($("#rAuthPsd").val() != "******")
		{
			Element = xmlDoc.createElement("snmpAuthenticationPassword");
			text = xmlDoc.createTextNode($("#rAuthPsd").val());
			Element.appendChild(text);
			oRUser.appendChild(Element);
		}
		
		Element = xmlDoc.createElement("snmpPrivacyMethod");
		text = xmlDoc.createTextNode(szRPrivacyAlg);
		Element.appendChild(text);
		oRUser.appendChild(Element);
		if($("#rPrivacyPsd").val() != "******")
		{
			Element = xmlDoc.createElement("snmpPrivacyPassword");
			text = xmlDoc.createTextNode($("#rPrivacyPsd").val());
			Element.appendChild(text);
			oRUser.appendChild(Element);
		}
		//写用户
		Element = xmlDoc.createElement("id");
		var text = xmlDoc.createTextNode("2");
		Element.appendChild(text);
		oRwUser.appendChild(Element);
		
		Element = xmlDoc.createElement("userName");
		text = xmlDoc.createTextNode($("#rwUserName").val());
		Element.appendChild(text);
		oRwUser.appendChild(Element);
		
		Element = xmlDoc.createElement("remoteEngineID");
		oRwUser.appendChild(Element);
		
		Element = xmlDoc.createElement("snmpAuthenticationMethod");
		text = xmlDoc.createTextNode(szRwAuthAlg);
		Element.appendChild(text);
		oRwUser.appendChild(Element);
		if($("#rwAuthPsd").val() != "******")
		{
			Element = xmlDoc.createElement("snmpAuthenticationPassword");
			text = xmlDoc.createTextNode($("#rwAuthPsd").val());
			Element.appendChild(text);
			oRwUser.appendChild(Element);
		}
		
		Element = xmlDoc.createElement("snmpPrivacyMethod");
		text = xmlDoc.createTextNode(szRwPrivacyAlg);
		Element.appendChild(text);
		oRwUser.appendChild(Element);
		if($("#rwPrivacyPsd").val() != "******")
		{
			Element = xmlDoc.createElement("snmpPrivacyPassword");
			text = xmlDoc.createTextNode($("#rwPrivacyPsd").val());
			Element.appendChild(text);
			oRwUser.appendChild(Element);
		}
		
		oUserList.appendChild(oRUser);
		oUserList.appendChild(oRwUser);
		oSNMPv3.appendChild(oUserList);
		
		var oExt = xmlDoc.createElement("Extensions");
		var oSelf = xmlDoc.createElement("selfExt");
		Element = xmlDoc.createElement("enabled");
		text = xmlDoc.createTextNode($("#enablev3c")[0].checked.toString());
		Element.appendChild(text);
		oSelf.appendChild(Element);
		oExt.appendChild(oSelf);
		
		oSNMPv3.appendChild(oExt);
		
		xmlDoc.documentElement.replaceChild(oSNMPv3, xmlDoc.documentElement.getElementsByTagName("SNMPAdvanced")[0]);
	}
	else
	{
		$(xmlDoc).find('SNMPAdvanced').eq(0).find('enabled').eq(0).text("false");
	}
	$(xmlDoc).find('SNMPAdvanced').eq(0).next().find('listenPort').eq(0).text($("#snmpPort").val());
	
	$.ajax({
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/snmp",
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		initFTP
Description:	初始化FTP页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initFTP()
{
    GetFTPInfo();
	autoResizeIframe();
}
/*************************************************
Function:		GetFTPInfo
Description:	获取FTP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetFTPInfo()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/Event/notification/ftp/1",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var xmlRoot = $(xmlDoc);
			if("hostname" == xmlRoot.find("addressingFormatType").eq(0).text())
			{
				$("#FtpAddress").val(xmlRoot.find("hostName").eq(0).text());
			}
			else
			{
				if(0 != xmlRoot.find("ipAddress").length)
				{
					$("#FtpAddress").val(xmlRoot.find("ipAddress").eq(0).text());
				}
				else
				{
					$("#FtpAddress").val(xmlRoot.find("ipv6Address").eq(0).text());
				}
			}
			$("#FtpPort").val(xmlRoot.find("portNo").eq(0).text());
			$("#FtpUserName").val(xmlRoot.find("userName").eq(0).text());
			oCheckPassword.checkUserName(xmlRoot.find("userName").eq(0).text(), $('#FtpPassword'), $('#FtpPasswordConfirm'));
			$("#FtpPath").val(xmlRoot.find("uploadPath").eq(0).text());
			if(0 == xmlRoot.find("baseFileName").length)
			{
				$("#baseFileName").hide();
			}
			else
			{
				$("#baseFileName").show();
				$("#baseFileName").val(xmlRoot.find("baseFileName").eq(0).text());
			}
			$("#selPathDepth").val(xmlRoot.find("pathDepth").eq(0).text());
			switch($("#selPathDepth").val())
			{
				case '0':
					$("#selTopPath").prop("disabled", true);
					$("#selSubPath").prop("disabled", true);
					break;
				case '1':
					$("#selTopPath").prop("disabled", false);
					$("#selTopPath").val(xmlRoot.find("topDirNameRule").eq(0).text());
					$("#selSubPath").prop("disabled", true);
					break;
				case '2':
					$("#selTopPath").prop("disabled", false);
					$("#selTopPath").val(xmlRoot.find("topDirNameRule").eq(0).text());
					$("#selSubPath").prop("disabled", false);
					$("#selSubPath").val(xmlRoot.find("subDirNameRule").eq(0).text());
					break;
				default:
					$("#selPathDepth").val("0");
					$("#selTopPath").prop("disabled", true);
					$("#selSubPath").prop("disabled", true);
					break;	
			}
			$("#uploadPicture").prop("checked", xmlRoot.find("uploadPicture").eq(0).text() == "true"?true:false);
			if(xmlRoot.find("anonymousModeEnabled").length > 0){
				$("#spAnonyFtp").show();
				var szAnonymous = xmlRoot.find("anonymousModeEnabled").eq(0).text();
				if(szAnonymous == "true"){
					$("#chAnonyFtp").prop("checked", true);
					$("#FtpUserName").prop("disabled", true);
					$("#FtpPassword").prop("disabled", true);
					$("#FtpPasswordConfirm").prop("disabled", true);
				} else{
					$("#chAnonyFtp").prop("checked", false);
					$("#FtpUserName").prop("disabled", false);
					$("#FtpPassword").prop("disabled", false);
					$("#FtpPasswordConfirm").prop("disabled", false);
				}
			} else {
				$("#spAnonyFtp").hide();
			}
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}
/*************************************************
Function:		SetFTPInfo
Description:	设置FTP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetFTPInfo()
{
	if(!CheckIPAddress($("#FtpAddress").val(),"FtpAddresstips","laServerAdd"))
	{
		return;
	}
	if(!CheackServerIDIntNum($("#FtpPort").val(),"FtpPorttips","gePort",1,65535))
	{
		return;
	}
	if($("#spAnonyFtp").css("display") == "none" || !$("#chAnonyFtp").prop("checked")){
		if(!CheackStringLenthNull($("#FtpUserName").val(),"FtpUserNametips","geUserName",32))
		{
			return;
		}
		if($("#FtpPassword").val() != $("#FtpPasswordConfirm").val() )
		{
			var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szAreaNameInfo += getNodeValue('jsPwdCheckMismatch');
			$("#SetResultTips").html(szAreaNameInfo);
			return -1;
		}
		if($('#FtpPassword').val().length == 0)
		{
			var szPasswordInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			szPasswordInfo += getNodeValue("gePassword") + getNodeValue("NullTips");
			$("#SetResultTips").html(szPasswordInfo);
			return -1;
		}
	}
	var szXml = '<?xml version="1.0" encoding="UTF-8"?>';
	var strIpAddressType = CheckAddressingType($("#FtpAddress").val());
	
	szXml += "<FTPNotification>"+
	"<id>1</id>";
	if(strIpAddressType == "hostName")
	{
		szXml += "<addressingFormatType>hostname</addressingFormatType>"+"<hostName>"+$("#FtpAddress").val()+"</hostName>";
	}
	else
	{
		szXml += "<addressingFormatType>ipaddress</addressingFormatType>"+"<ipAddress>"+$("#FtpAddress").val()+"</ipAddress>";
	}
	
	szXml += "<portNo>"+$("#FtpPort").val()+"</portNo>";
	if($("#spAnonyFtp").css("display") != "none" && $("#chAnonyFtp").prop("checked")){
		szXml += "<userName>"+$("#FtpUserName").val()+"</userName>";
	} else{
		szXml += "<userName>"+$("#FtpUserName").val()+"</userName>";
		if($('#FtpPassword').val() != "" && $('#FtpPassword').val() != oCheckPassword.m_szDefaultPassword)
		{
			szXml += "<password>" + $('#FtpPassword').val() + "</password>";
		}
	}
	
	szXml += "<Extensions><selfExt><uploadPicture>"+$("#uploadPicture")[0].checked.toString()+"</uploadPicture>";
	switch($("#selPathDepth").val())
	{
		case '0':
			szXml += "<pathDepth>"+$("#selPathDepth").val()+"</pathDepth>";
			break;
		case '1':
			szXml += "<pathDepth>"+$("#selPathDepth").val()+"</pathDepth>"+
			"<topDirNameRule>"+$("#selTopPath").val()+"</topDirNameRule>";
			break;
		case '2':
			szXml += "<pathDepth>"+$("#selPathDepth").val()+"</pathDepth>"+
			"<topDirNameRule>"+$("#selTopPath").val()+"</topDirNameRule>"+
			"<subDirNameRule>"+$("#selSubPath").val()+"</subDirNameRule>";
			break;
		default:
			break;	
	}
	if($("#spAnonyFtp").css("display") != "none"){
		szXml += "<anonymousModeEnabled>"+$("#chAnonyFtp").prop("checked").toString()+"</anonymousModeEnabled>";
	}
	szXml += "</selfExt></Extensions></FTPNotification>";
	
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/Event/notification/ftp/1",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) 
		{
			
		},
		error: function()
		{
			//alert(getNodeValue('NetworkErrorTips'));
		},
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		initWIFI
Description:	初始化WIFI页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initWIFI() {
	$("#dvWifiSetting").children("div:visible[class!='mainparams margintop26']").each(function(i) {
		if($(this).hasClass("subparamswhite") || $(this).hasClass("subparamsgray")) {
			return false;
		}
		if(i%2 == 0) {
			$(this).attr("class", "subparamswhite");
		}
		else {
			$(this).attr("class", "subparamsgray");
		}
	});
	var szInfo = getNodeValue('laPlugin');
	if(checkPlugin('0', szInfo)) {
		if(!CompareFileVersion()) {
			UpdateTips();
		}
	}
	m_PreviewOCX = document.getElementById("PreviewActiveX");
	getWIFIList();
	getWIFI();
	getWIFI8021x();
	getWPSEnable();
}
/*************************************************
Function:		getWIFI
Description:	获取WIFI列表
Input:			无			
Output:			无
return:			无				
*************************************************/
function getWIFIList() {
	$("#btnSearchWiFi").prop("disabled", true);
	$("#btnSearchWiFi").val(getNodeValue("SearchingTips"));
	$("#dvWifiList").empty();
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interfaces/1/accessPointList",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			var oAccessPoint = $(xmlDoc).find("accessPoint");
			var iLen = oAccessPoint.length;
			var szSSID = "";
			var szMode = "";
			var szSecurityMode = "";
			var szChannel = "";
			var szSignal = "";
			var szSpeed = "";
			for(var i = 0; i < iLen; i++) {
				szSSID = oAccessPoint.eq(i).find("ssid").eq(0).text();
				szMode = oAccessPoint.eq(i).find("wirelessNetworkMode").eq(0).text();
				szSecurityMode = oAccessPoint.eq(i).find("securityMode").eq(0).text();
				szChannel = oAccessPoint.eq(i).find("channel").eq(0).text();
				szSignal = oAccessPoint.eq(i).find("signalStrength").eq(0).text();
				szSpeed = oAccessPoint.eq(i).find("speed").eq(0).text();
				insertOneWIFI((i+1), szSSID, szMode, szSecurityMode, szChannel, szSignal, szSpeed);
			}
		},
		complete: function() {
			$("#btnSearchWiFi").prop("disabled", false);
			$("#btnSearchWiFi").val(getNodeValue("laSearch"));
		}
	});
}
/*************************************************
Function:		insertOneWIFI
Description:	插入一个WIFI信息
Input:			iIndex : 序号	
                szSSID : 网络ID
				szMode : 工作模式
				szSecurityMode : 加密模式
				szChannel : 频道
				szSignal : 信号强度
				szSpeed : 速度			
Output:			无
return:			无				
*************************************************/
function insertOneWIFI(iIndex, szSSID, szMode, szSecurityMode, szChannel, szSignal, szSpeed) {
	$('<div><span class="wifiline width54"><label>'+iIndex+'</label></span><span class="wifiline width156"><label>'+(szSSID==""?"&nbsp;":szSSID)+'</label></span><span class="wifiline width100"><label>'+szMode+'</label></span><span class="wifiline width100"><label>'+(szSecurityMode=="disable"?"NONE":szSecurityMode)+'</label></span><span class="wifiline width65"><label>'+szChannel+'</label></span><span class="wifiline width85"><label>'+szSignal+'</label></span><span class="wifiline width75"><label>'+szSpeed+'</label></span></div>').appendTo("#dvWifiList").bind({
		click:function() {		
			if(!$(this).hasClass("wifilistselect")) {
				$(this).siblings(".wifilistselect").removeClass().addClass(iIndex%2 == 0?"wifilisteven":"wifilistodd");
				$(this).removeClass().addClass("wifilistselect");
			}			
			$("#teSSID").val(szSSID);
			$("#txtWPSSSID").val(szSSID);
			$("#wifiChannel").val(szChannel);
			$("#dvWifiSetting").find(":radio[name='networkMode'][value='"+szMode+"']").prop("checked", true);
			$("#securityMode").val(szSecurityMode).change();
		},
		mouseover:function() {
			if(!$(this).hasClass("wifilistselect")) {
			    $(this).removeClass().addClass("wifilistenter");
			}
		},
		mouseout:function() {
			if(!$(this).hasClass("wifilistselect")) {
			    $(this).removeClass().addClass(iIndex%2 == 0?"wifilisteven":"wifilistodd");
			}
		}
	}).addClass((iIndex%2 == 0?"wifilisteven":"wifilistodd")).attr("title",getNodeValue(''));
}
/*************************************************
Function:		getWIFI
Description:	获取WIFI信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getWIFI() {
	$.ajax({
		type: "get",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/2/wireless",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#teSSID").val($(xmlDoc).find("ssid").eq(0).text());
			$("#wifiChannel").val($(xmlDoc).find("channel").eq(0).text());
			$("#dvWifiSetting").find(":radio[name='networkMode'][value='"+$(xmlDoc).find("wirelessNetworkMode").eq(0).text()+"']").prop("checked", true);
			var szSecurityMode = $(xmlDoc).find("securityMode").eq(0).text();
			$("#securityMode").val(szSecurityMode).change();
			if("WEP" == szSecurityMode) {
				$("#dvWifiSetting").find(":radio[name='authenticationType'][value='"+$(xmlDoc).find("WEP").eq(0).find("authenticationType").eq(0).text()+"']").prop("checked", true);
				$("#dvWifiSetting").find(":radio[name='encryptionKey'][value='"+$(xmlDoc).find("WEP").eq(0).find("defaultTransmitKeyIndex").eq(0).text()+"']").prop("checked", true).click();
				$("#dvWifiSetting").find(":radio[name='KeyLength'][value='"+$(xmlDoc).find("WEP").eq(0).find("wepKeyLength").eq(0).text()+"']").prop("checked", true);
				$("#dvWifiSetting").find(":radio[name='KeyType'][value='"+$(xmlDoc).find("keyType").eq(0).text()+"']").prop("checked", true);
				if($(xmlDoc).find("keyType").eq(0).text() === "HEX") {
					var oEncryptionKeyList = $(xmlDoc).find("WEP").eq(0).find("encryptionKey");
					for(var i = 0; i < oEncryptionKeyList.length; i++) {
						$("#encryptionKey"+(i+1)).val(oEncryptionKeyList.eq(i).text());
					}
				} else {
					var oASCIIKeyList = $(xmlDoc).find("WEP").eq(0).find("ASCIIKey");
					for(var i = 0; i < oASCIIKeyList.length; i++) {
						$("#encryptionKey"+(i+1)).val(oASCIIKeyList.eq(i).text());
					}				
				}
				autoResizeIframe();
			} else if("disable" == szSecurityMode) {
			
			} else {
				$("#algorithmType").val($(xmlDoc).find("WPA").eq(0).find("algorithmType").eq(0).text());
				$("#dvWifiSetting").find(":text[id*='encryptionKey']").eq(0).val($(xmlDoc).find("WPA").eq(0).find("sharedKey").eq(0).text());
			}
		}
	});
}
/*************************************************
Function:		getWIFI8021x
Description:	获取WIFI版本相关信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getWIFI8021x() {
	$.ajax({
		type: "get",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/2/ieee802.1x",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#enterpriseType").val($(xmlDoc).find("authenticationProtocolType").eq(0).text());
			$("#wifiUser").val($(xmlDoc).find("userName").eq(0).text());
			if($("#wifiUser").val() != "") {
				$("#wifiPassword").val(oCheckPassword.m_szDefaultPassword);
			} else {
			    $("#wifiPassword").val("");
			}
			$("#PEAPVersion").val($(xmlDoc).find("PEAPVersion").eq(0).text());
			$("#PEAPLabel").val($(xmlDoc).find("PEAPLabel").eq(0).text());
			$("#innerEAPProtocolType").val($(xmlDoc).find("innerEAPProtocolType").eq(0).text());
			$("#innerAuthenticationMode").val($(xmlDoc).find("innerTTLSAuthenticationMethod").eq(0).text());
			$("#anonymousID").val($(xmlDoc).find("anonymousID").eq(0).text());
			$("#enterprise1Identify").val($(xmlDoc).find("userName").eq(0).text());
			$("#anonymousID").val($(xmlDoc).find("anonymousID").eq(0).text());
			if($("#enterprise1Identify").val() != "") {
				$("#privateKeyPassword").val(oCheckPassword.m_szDefaultPassword);
			} else {
			    $("#privateKeyPassword").val("");
			}			
			$("#wifiEAPOLVersion").val($(xmlDoc).find("EAPOLVersion").eq(0).text());
			if($("#securityMode").val() == "WPA-enterprise" || $("#securityMode").val() == "WPA2-enterprise") {
			    $("#enterpriseType").change();
			}
		}
	});
}
/*************************************************
Function:		getWPSEnable
Description:	获取WPS使能
Input:			无			
Output:			无
return:			无				
*************************************************/
function getWPSEnable() {
	$.ajax({
		type: "get",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#checkEnableWPS").prop("checked", $(xmlDoc).find("enable").eq(0).text() === "true" ? true : false);
			getDevicePinCode();
			enableWPS();
		}
	});
}
/*************************************************
Function:		setWPSEnable
Description:	设置WPS使能
Input:			无			
Output:			无
return:			无				
*************************************************/
function setWPSEnable() {
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><WPS><enable>" + $("#checkEnableWPS").prop("checked").toString() + "</enable></WPS>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "put",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) {
			
		},
		complete:function(xhr, textStatus) {
			if($(xhr.responseXML).find('statusCode').eq(0).text() !== "1") {
				g_oXhr = xhr;
			}
		}
	});	
}
/*************************************************
Function:		getDevicePinCode
Description:	获取PinCode
Input:			无			
Output:			无
return:			无				
*************************************************/
function getDevicePinCode() {
	$.ajax({
		type: "get",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS/devicePinCode",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#devicePinCode").val(xhr.responseText);		
		}
	});
}
/*************************************************
Function:		generagePINCode
Description:	生成PINCode
Input:			无			
Output:			无
return:			无				
*************************************************/
function generagePINCode() {
	$.ajax({
		type: "put",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS/devicePinCodeUpdate",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			$("#wpsSetting").find(":input").prop("disabled", true);
		},
		success: function(xmlDoc, textStatus, xhr) {
			getDevicePinCode();	
		},
		complete: function() {
			$("#wpsSetting").find(":input").prop("disabled", false);
			if($("#radioAutoConnect").prop("checked")) {
			    chooseConnectMode(0);
			} else {
			    chooseConnectMode(1);
			}
		}
	});
}
/*************************************************
Function:		chooseConnectMode
Description:	选择WPS连接方式
Input:			无			
Output:			无
return:			无				
*************************************************/
function chooseConnectMode(iType) {
	if(iType === 0) {
		$("#txtApPinCode").prop("disabled", true);
		$("#txtWPSSSID").prop("disabled", true);
		$("#btnManuConnect").prop("disabled", true);
		$("#btnAutoConnect").prop("disabled", false);
		$("#radioManuConnect").prop("checked", false);
		$("#radioAutoConnect").prop("checked", true);
	} else {
		$("#btnAutoConnect").prop("disabled", true);
		$("#txtApPinCode").prop("disabled", false);
		$("#txtWPSSSID").prop("disabled", false);
		$("#btnManuConnect").prop("disabled", false);
		$("#radioManuConnect").prop("checked", true);
		$("#radioAutoConnect").prop("checked", false);
	}
}
/*************************************************
Function:		enableWPS
Description:	启用WPS
Input:			无			
Output:			无
return:			无				
*************************************************/
function enableWPS() {
	if(!$("#checkEnableWPS").prop("checked")) {
		$("#wpsSetting").find("input[type!='checkbox']").each(function(i) {
			$(this).prop("disabled", true);
		});
	} else {
		$("#wpsSetting").find("input[type!='checkbox']").each(function(i) {
			$(this).prop("disabled", false);
			if($("#radioAutoConnect").prop("checked")) {
			    chooseConnectMode(0);
			} else {
			    chooseConnectMode(1);
			}
		});	    
	}
}
/*************************************************
Function:		pbcConnect
Description:	PBC连接
Input:			无			
Output:			无
return:			无				
*************************************************/
function pbcConnect() {
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS/AutoConnect",
		timeout: 121000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			$("#pbcConnectTips").html(getNodeValue("jsConnecting"));
			$("#wpsSetting").find(":input").prop("disabled", true);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#pbcConnectTips").html(getNodeValue("jsConnectSuc"));
		},
		error: function(xhr, textStatus, errorThrown){
			$("#pbcConnectTips").html(getNodeValue("jsConnectFail"));
			
		},
		complete: function() {
			setTimeout(function () {
			    $("#pbcConnectTips").html("");
			}, 5000);
			$("#wpsSetting").find(":input").prop("disabled", false);
			if($("#radioAutoConnect").prop("checked")) {
			    chooseConnectMode(0);
			} else {
			    chooseConnectMode(1);
			}
		}
	});
}
/*************************************************
Function:		uploadCertificate
Description:	上传证书
Input:			无			
Output:			无
return:			无				
*************************************************/
function uploadCertificate(iType) {
	if(m_PreviewOCX === null) {
	    return;
	}
	var szUrl = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Security/deviceCertificate";
	if(iType === 0) {
		if(0 !== m_PreviewOCX.HWP_UploadFile(szUrl, m_szUserPwdValue, $("#certificatePath1").val(), "application/x-x509-ca-cert", 0)) {
			return;
		} else {
			$("#certificateTips1").html(getNodeValue("jsUploadSuc"));
			setTimeout(function () {
			    $("#certificateTips1").html("");
			}, 5000);			
		}
	} else if(iType === 1) {
		if(0 !== m_PreviewOCX.HWP_UploadFile(szUrl, m_szUserPwdValue, $("#certificatePath2").val(), "application/x-x509-client-cert", 0)) {
			return;
		} else {
			$("#certificateTips2").html(getNodeValue("jsUploadSuc"));
			setTimeout(function () {
			    $("#certificateTips2").html("");
			}, 5000);
		}	    
	} else {
		if(0 !== m_PreviewOCX.HWP_UploadFile(szUrl, m_szUserPwdValue, $("#certificatePath3").val(), "application/x-x509-client-key", 0)) {
			return;
		} else {
			$("#certificateTips3").html(getNodeValue("jsUploadSuc"));
			setTimeout(function () {
			    $("#certificateTips3").html("");
			}, 5000);
		}	    
	}
}
/*************************************************
Function:		manuConnect
Description:	手动连接
Input:			无			
Output:			无
return:			无				
*************************************************/
function manuConnect() {
	if(!CheckDeviceName($("#txtWPSSSID").val(),"spWPSSSIDTips", 0)) {
		return;
	}
	if(!CheckDeviceName($("#txtApPinCode").val(),"manuConnectTips", 0)) {
		return;
	}	
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><WpsApPincode><ssid>" + $("#txtWPSSSID").val() + "</ssid><pinCode>" + $("#txtApPinCode").val() + "</pinCode></WpsApPincode>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/Wireless/Interface/1/WPS/ApPinCode",
		timeout: 121000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
			$("#doManuConnectTips").html(getNodeValue("jsConnecting"));
			$("#wpsSetting").find(":input").prop("disabled", true);
		},
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) {
			$("#doManuConnectTips").html(getNodeValue("jsConnectSuc"));			
		},
		error: function(xhr, textStatus, errorThrown){
			$("#doManuConnectTips").html(getNodeValue("jsConnectFail"));
		},
		complete: function() {
			setTimeout(function () {
			    $("#doManuConnectTips").html("");
			}, 5000);
			$("#wpsSetting").find(":input").prop("disabled", false);
			if($("#radioAutoConnect").prop("checked")) {
			    chooseConnectMode(0);
			} else {
			    chooseConnectMode(1);
			}
		}
	});
}
/*************************************************
Function:		setWIFI
Description:	设置WIFI信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function setWIFI() {
	g_oXhr = null;
	var oAuthTypeList = $("#dvWifiSetting").find(":radio[name='authenticationType']");
	var oKeyLengthRadioList = $("#dvWifiSetting").find(":radio[name='KeyLength']");
	var oKeyTypeRadioList = $("#dvWifiSetting").find(":radio[name='KeyType']");
	var oEncryKeyRadioList = $("#dvWifiSetting").find(":radio[name='encryptionKey']");
	var oEncryKeyTextList = $("#dvWifiSetting").find(":text[id*='encryptionKey']");
	if(!CheckDeviceName($("#teSSID").val(),"spSSIDTips", false)) {
		$("#teSSID").focus();
		setTimeout(function(){$("#spSSIDTips").html("");}, 5000);
		return;
	}
	if($("#securityMode").val() == "WEP" || $("#securityMode").val() == "WPA-personal" || $("#securityMode").val() == "WPA2-personal") {
		if(!checkEncryptionKeyLength(oEncryKeyTextList.get(parseInt(oEncryKeyRadioList.filter(":checked").val(),10)-1), "spEncryptKeyTips"+oEncryKeyRadioList.filter(":checked").val())) {
			return;
		}
	}
	if($("#securityMode").val() == "WPA-enterprise" || $("#securityMode").val() == "WPA2-enterprise") {
		//EAP-TLS
		if($("#enterpriseType").val() == "EAP-TLS") {
			if(!CheckDevUserName($("#enterprise1Identify").val(), "identifyTips", "laIdentify", 0, 32)) {
				return;
			}
			/*if(!CheackStringLenth($("#enterprise1Identify").val(), 'identifyTips', 'laIdentify', 32)) {
				return;
			}*/
			if(!CheckDevUserName($("#privateKeyPassword").val(), "identifyPasswordTips", "laPrivateKeyPassword", 0, 32)) {
				return;
			}
			/*if(!CheackStringLenth($("#privateKeyPassword").val(), 'identifyPasswordTips', 'laPrivateKeyPassword', 32)) {
				return;
			}*/
		}
		//EAP-PEAP, EAP-TTLS
		if($("#enterpriseType").val() == "EAP-PEAP" || $("#enterpriseType").val() == "EAP-TTLS") {
			if(!CheckDevUserName($("#wifiUser").val(), "wifiUserTips", "geUserName", 0, 32)) {
				return;
			}
			/*if(!CheackStringLenth($("#wifiUser").val(), 'wifiUserTips', 'geUserName', 32)) {
				return;
			}*/
			if(!CheckDevUserName($("#wifiPassword").val(), "wifiPasswordTips", "gePassword", 0, 32)) {
				return;
			}
			/*if(!CheackStringLenth($("#wifiPassword").val(), 'wifiPasswordTips', 'gePassword', 32)) {
				return;
			}*/
			if(!CheackStringLenth($("#anonymousID").val(), 'anonymousIDTips', 'laAnonymousID', 32)) {
				return;
			}			
		}
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><Wireless version='1.0' xmlns='urn:psialliance-org'><enabled>true</enabled><wirelessNetworkMode>"+$("#dvWifiSetting").find(":radio[name='networkMode']").filter(":checked").val()+"</wirelessNetworkMode><channel>auto</channel><ssid>"+$("#teSSID").val()+"</ssid><wmmEnabled>false</wmmEnabled><WirelessSecurity><securityMode>"+$("#securityMode").val()+"</securityMode>";
	if($("#securityMode").val() == "WEP") {
		var szKeyType = $("#dvWifiSetting").find(":radio[name='KeyType']").filter(":checked").val();
		szXml += "<WEP><authenticationType>"+oAuthTypeList.filter(":checked").val()+"</authenticationType><defaultTransmitKeyIndex>" + oEncryKeyRadioList.filter(":checked").val() + "</defaultTransmitKeyIndex><wepKeyLength>"+oKeyLengthRadioList.filter(":checked").val()+"</wepKeyLength>";
		szXml += "<keyType>" +  szKeyType + "</keyType>";
		
		if(szKeyType == "HEX") {
			szXml += "<EncryptionKeyList>";
			for(var i = 0; i < oEncryKeyTextList.length; i++) {
				szXml += "<encryptionKey>" + oEncryKeyTextList.eq(i).val() + "</encryptionKey>"
			}
			szXml += "</EncryptionKeyList>";
		} else {
			szXml += "<ASCKeyList>";
			for(var i = 0; i < oEncryKeyTextList.length; i++) {
				szXml += "<ASCIIKey>" + oEncryKeyTextList.eq(i).val() + "</ASCIIKey>"
			}
			szXml += "</ASCKeyList>";
		}
	    szXml += "</WEP>";
	} else if($("#securityMode").val() == "disable") {
		
	} else {
		if($("#securityMode").val() == "WPA-enterprise" || $("#securityMode").val() == "WPA2-enterprise") {
			szXml += "<WPA><algorithmType>"+$("#algorithmType").val()+"</algorithmType></WPA>"; 
		} else {
		    szXml += "<WPA><algorithmType>"+$("#algorithmType").val()+"</algorithmType><sharedKey>"+oEncryKeyTextList.eq(0).val()+"</sharedKey><wpaKeyLength>"+oEncryKeyTextList.eq(0).val().length+"</wpaKeyLength></WPA>";
		}
	}
	szXml += "</WirelessSecurity></Wireless>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/2/wireless",
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) {
			if($("#securityMode").val() == "WPA-enterprise" || $("#securityMode").val() == "WPA2-enterprise") {
				//EAP-TLS
				if($("#enterpriseType").val() == "EAP-TLS") {
					setWIFI8021x("EAP-TLS");	
				}
				//EAP-PEAP
				if($("#enterpriseType").val() == "EAP-PEAP") {
					setWIFI8021x("EAP-PEAP");		
				}
				//EAP-TTLS
				if($("#enterpriseType").val() == "EAP-TTLS") {
					setWIFI8021x("EAP-TTLS");	
				}
			}
			setWPSEnable();
		},
		complete:function(xhr, textStatus) {
			if(g_oXhr !== null) {
			    SaveState(g_oXhr);
			} else {
			    SaveState(xhr);
			}
		}
	});
}
/*************************************************
Function:		setWIFI8021x
Description:	设置wifi相关的8021x信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function setWIFI8021x(szType) {	
	var szXml = "";
	if(szType === "EAP-TLS") {		
	    szXml = "<?xml version='1.0' encoding='UTF-8' ?><IEEE802_1x><enabled>true</enabled>" +
        "<authenticationProtocolType>" + $("#enterpriseType").val() + "</authenticationProtocolType>" + 
        "<userName>" + $("#enterprise1Identify").val() + "</userName>";
		if($("#privateKeyPassword").val() != oCheckPassword.m_szDefaultPassword) {
		    szXml += "<password>" + $("#privateKeyPassword").val() + "</password>";
		}
        szXml += "<Extensions><EAPOLVersion>" + $("#wifiEAPOLVersion").val() + "</EAPOLVersion></Extensions></IEEE802_1x>";		
	} else if(szType === "EAP-PEAP") {
	    szXml = "<?xml version='1.0' encoding='UTF-8' ?><IEEE802_1x><enabled>true</enabled>" +
        "<authenticationProtocolType>" + $("#enterpriseType").val() + "</authenticationProtocolType>" + 
        "<innerEAPProtocolType>" + $("#innerEAPProtocolType").val() + "</innerEAPProtocolType>" + 
        "<userName>" + $("#wifiUser").val() + "</userName>";
		if($("#wifiPassword").val() != oCheckPassword.m_szDefaultPassword) {
		    szXml += "<password>" + $("#wifiPassword").val() + "</password>";
		}
		szXml += "<anonymousID>" + $("#anonymousID").val() + "</anonymousID>" +
        "<Extensions><EAPOLVersion>" + $("#wifiEAPOLVersion").val() + "</EAPOLVersion>" +
		"<PEAPVersion>" + $("#PEAPVersion").val() + "</PEAPVersion>" +
		"<PEAPLabel>" + $("#PEAPLabel").val() + "</PEAPLabel>" +
		"</Extensions></IEEE802_1x>";		
	} else {
	    szXml = "<?xml version='1.0' encoding='UTF-8' ?><IEEE802_1x><enabled>true</enabled>" +
        "<authenticationProtocolType>" + $("#enterpriseType").val() + "</authenticationProtocolType>" + 
        "<innerTTLSAuthenticationMethod>" + $("#innerAuthenticationMode").val() + "</innerTTLSAuthenticationMethod>" + 
        "<userName>" + $("#wifiUser").val() + "</userName>";
		if($("#wifiPassword").val() != oCheckPassword.m_szDefaultPassword) {
		    szXml += "<password>" + $("#wifiPassword").val() + "</password>";
		}
		szXml += "<anonymousID>" + $("#anonymousID").val() + "</anonymousID>" +
        "<Extensions><EAPOLVersion>" + $("#wifiEAPOLVersion").val() + "</EAPOLVersion></Extensions></IEEE802_1x>";
	}
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "put",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/2/ieee802.1x",
		timeout: 15000,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		success: function(xmlDoc, textStatus, xhr) {
			
		},
		complete:function(xhr, textStatus) {
			if($(xhr.responseXML).find('statusCode').eq(0).text() !== "1") {
				g_oXhr = xhr;
			}
		}
	});
}
/*************************************************
  Function:    	checkEncryptionKeyLength
  Description:	检查输入密钥长度是否合法
  Input:        szStr:传入的参数
  				tipsId:提示信息
  Output:      	无
  Return:		bool:true false
*************************************************/
function checkEncryptionKeyLength(obj, tipsId) {
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	var iTipsLen = szTipsInfo.length;
	var szVal = $(obj).val();
	var szKeyType = $("#dvWifiSetting").find(":radio[name='KeyType']").filter(":checked").val();
	var szKeyLength = $("#dvWifiSetting").find(":radio[name='KeyLength']").filter(":checked").val();
	if($("#securityMode").val() == "WEP") {
		//16进制
		if("HEX" == szKeyType) {
			//64位
			if("64" == szKeyLength) {
				if(szVal.length < 10) {
					szTipsInfo += getNodeValue("jsTenHex");
				}
			//128位
			} else {
				if(szVal.length < 26) {
					szTipsInfo += getNodeValue("jsXXVIHex");
				}
			}
		//ASCII码
		} else {
			//64位
			if("64" == szKeyLength) {
				if(szVal.length < 5) {
					szTipsInfo += getNodeValue("jsFiveASCII");
				}
			//128位
			} else {
				if(szVal.length < 13) {
					szTipsInfo += getNodeValue("jsTenASCII");
				}
			}
		}
	} else {
		if(szVal.length < 8) {
			szTipsInfo += getNodeValue("jsEightMoreChar");
		}
	}
	if(szTipsInfo.length > iTipsLen) {
		$("#" + tipsId).html(szTipsInfo); 
		$(obj).focus().val(szVal);
		setTimeout(function(){$("#" + tipsId).html("");}, 5000);
		return false;
	} else {
		$("#" + tipsId).html(""); 
		return true;
	}
}
/*************************************************
Function:		initUPNP
Description:	初始化UPNP页面
Input:			无			
Output:			无
return:			无				
*************************************************/
function initUPNP()
{
	getUPNP();
	getUPNPStatus();
	autoResizeIframe();
}
/*************************************************
Function:		getUPNP
Description:	获取UPNP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getUPNP()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UPnP";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		timeout: 15000,
		async: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			$("#chEnableUPnP").prop("checked",$(xmlDoc).find("UPnP").eq(0).find("enabled").eq(0).text() == "true");
			$("#txtUPnPName").val($(xmlDoc).find("UPnP").eq(0).find("name").eq(0).text());
			$("#selUPnPMapType").val($(xmlDoc).find("UPnP").eq(0).find("mapmode").eq(0).text());
			$("#chEnablePortMap").prop("checked",$(xmlDoc).find("ports").eq(0).find("enabled").eq(0).text() == "true").change();
			
			var oMapPorts = $("#divPortsMapList").children("div");
			
			/*oMapPorts.eq(0).find(":checkbox").prop("checked", $(xmlDoc).find("UPnP").eq(0).find("port").eq(0).find("enabled").eq(0).text() == "true");
			oMapPorts.eq(1).find(":checkbox").prop("checked", $(xmlDoc).find("UPnP").eq(0).find("port").eq(2).find("enabled").eq(0).text() == "true");
			oMapPorts.eq(2).find(":checkbox").prop("checked", $(xmlDoc).find("UPnP").eq(0).find("port").eq(1).find("enabled").eq(0).text() == "true");*/
			
			oMapPorts.eq(0).find(".upnpthird").html($(xmlDoc).find("UPnP").eq(0).find("port").eq(0).find("externalPort").eq(0).text());
			oMapPorts.eq(1).find(".upnpthird").html($(xmlDoc).find("UPnP").eq(0).find("port").eq(2).find("externalPort").eq(0).text());
			oMapPorts.eq(2).find(".upnpthird").html($(xmlDoc).find("UPnP").eq(0).find("port").eq(1).find("externalPort").eq(0).text());
		}
	});
}
/*************************************************
Function:		getUPNPStatus
Description:	获取UPNP状态信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function getUPNPStatus()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UPnP/ports/status";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		timeout: 15000,
		async: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			var oMapPorts = $("#divPortsMapList").children("div");
			var szHttpPortStatus = $(xmlDoc).find("portStatusList").eq(0).find("portStatus").eq(0).find("status").eq(0).text()=="inactive"?"geNotValid":"geValid";
			var szRtspPortStatus = $(xmlDoc).find("portStatusList").eq(0).find("portStatus").eq(2).find("status").eq(0).text()=="inactive"?"geNotValid":"geValid";
			var szSDKPortStatus = $(xmlDoc).find("portStatusList").eq(0).find("portStatus").eq(1).find("status").eq(0).text()=="inactive"?"geNotValid":"geValid";
			
			oMapPorts.eq(0).find(".upnpfouth").html("<label name='"+szHttpPortStatus+"'>"+getNodeValue(szHttpPortStatus)+"</label>");
			oMapPorts.eq(1).find(".upnpfouth").html("<label name='"+szRtspPortStatus+"'>"+getNodeValue(szRtspPortStatus)+"</label>");
			oMapPorts.eq(2).find(".upnpfouth").html("<label name='"+szSDKPortStatus+"'>"+getNodeValue(szSDKPortStatus)+"</label>");
		}
	});
}
/*************************************************
Function:		setUPNP
Description:	设置UPNP信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function setUPNP()
{
	if(!CheackStringLenth($("#txtUPnPName").val(), 'spUPnPNameTips', 'laUPnPName', 64)){
		return;
	}
	var oMapPorts = $("#divPortsMapList").children("div");
	if(oMapPorts.eq(0).find(".upnpthird").html() == oMapPorts.eq(1).find(".upnpthird").html() || oMapPorts.eq(0).find(".upnpthird").html() == oMapPorts.eq(2).find(".upnpthird").html() || oMapPorts.eq(1).find(".upnpthird").html() == oMapPorts.eq(2).find(".upnpthird").html()) {
		$("#SetResultTips").html(m_szErrorState + getNodeValue("jsPortConflict"));
		setTimeout(function(){$("#SetResultTips").html("");},5000);  //5秒后自动清除
		return;
	}
	var szXml = "<?xml version='1.0' encoding='UTF-8'?><UPnP><enabled>"+$("#chEnableUPnP").prop("checked").toString()+"</enabled><name>"+$("#txtUPnPName").val()+"</name><ports><enabled>"+$("#chEnablePortMap").prop("checked").toString()+"</enabled><mapmode>"+$("#selUPnPMapType").val()+"</mapmode><portList>";
	/*if(oMapPorts.eq(0).find(":checkbox").prop("checked"))*/{
		szXml += "<port><id>1</id><enabled>"+oMapPorts.eq(0).find(":checkbox").prop("checked").toString()+"</enabled><internalPort>http</internalPort><externalPort>"+oMapPorts.eq(0).find(".upnpthird").html()+"</externalPort></port>";
	}
	/*if(oMapPorts.eq(2).find(":checkbox").prop("checked"))*/{
		szXml += "<port><id>2</id><enabled>"+oMapPorts.eq(2).find(":checkbox").prop("checked").toString()+"</enabled><internalPort>admin</internalPort><externalPort>"+oMapPorts.eq(2).find(".upnpthird").html()+"</externalPort></port>";
	}
	/*if(oMapPorts.eq(1).find(":checkbox").prop("checked"))*/{
		szXml += "<port><id>3</id><enabled>"+oMapPorts.eq(1).find(":checkbox").prop("checked").toString()+"</enabled><internalPort>rtsp</internalPort><externalPort>"+oMapPorts.eq(1).find(".upnpthird").html()+"</externalPort></port>";
	}
	szXml += "</portList></ports></UPnP>";
	var xmlDoc = parseXmlFromStr(szXml);
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UPnP";
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}