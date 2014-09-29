/*************************************************
Function:		RecordDisplayInit
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordDisplayInit()
{
	m_iPicinform = 1;
	var szInfo = getNodeValue('laPlugin');
	if(checkPlugin('1', szInfo, 1, 'osdsetting'))
	{
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
		ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
		if (!HWP.wnds[0].isPlaying)
		{
			setTimeout(function() {
				if (HWP.Play() !== 0) {
					alert(getNodeValue("previewfailed"));
				}
			}, 10);
		}
	}
	if(m_iPicinform != null)
	{
	    GetOSDInfo();
	}
}
/*************************************************
Function:		GetOSDCab
Description:	获取OSD能力
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetOSDCab()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/capabilities";
	$.ajax({
		type: "GET",
		url: szURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		async: false,
		success: function(xmlDoc, textStatus, xhr) {
		    if($(xmlDoc).find('fontSize').length > 0) {//字体大小
				$("#OSDFontSize_tr").show();
				$("#OSDFontSize").show();   //兼容IE6
				$("#OSDFontSize").empty();
				var sizeOpt = $(xmlDoc).find("fontSize").attr("opt").split(",");
				for(var i = 0; i < sizeOpt.length; i++){
					if("selfadaption" == sizeOpt[i]){
						$("<option value='"+sizeOpt[i]+"' name='windowAuto'>"+getNodeValue("windowAuto")+"</option>").appendTo("#OSDFontSize");
						continue;
					}
					$("<option value='"+sizeOpt[i]+"'>"+sizeOpt[i]+"*"+sizeOpt[i]+"</option>").appendTo("#OSDFontSize");
				}
			}
			if($(xmlDoc).find('DateTimeOverlay').eq(0).find("type[opt]").length > 0){
				$("#OSDType").empty();
				var aDateTimeType = $(xmlDoc).find('DateTimeOverlay').eq(0).find("type").eq(0).attr("opt").split(",");
				for(var j = 0; j < aDateTimeType.length; j++){
					$("<option value='"+aDateTimeType[j]+"' name='OSDTypeOpt"+(parseInt(aDateTimeType[j], 10)+1)+"'>"+getNodeValue("OSDTypeOpt"+(parseInt(aDateTimeType[j], 10)+1))+"</option>").appendTo("#OSDType");
				}
			}
		},
		error: function(xhr, textStatus, errorThrown){
			
		}
	});
}
/*************************************************
Function:		GetOSDInfo
Description:	获取OSD叠加信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetOSDInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1";
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
			GetOSDCab();
		    m_szOSDXmlStr = xhr.responseText;
			$("#OSDAttrib").val($(xmlDoc).find('attribute').eq(0).text());
			if($(xmlDoc).find('fontSize').length > 0) //字体大小
			{
				$("#OSDFontSize_tr").show();
				$("#OSDFontSize").val($(xmlDoc).find('fontSize').eq(0).text());
			}
			else
			{
				$("#OSDFontSize_tr").css("display", "none");
			}
			if($(xmlDoc).find('DateTimeOverlay').length > 0)
			{
				DatetimeOverlay = $(xmlDoc).find('DateTimeOverlay').eq(0);
				if("true" == $(DatetimeOverlay).find('enabled').eq(0).text())
				{
					$("#IsShowOSD").prop("checked", true);
				}
				else
				{
					$("#IsShowOSD").prop("checked", false);
				}
	 
				if("true" == $(DatetimeOverlay).find('displayWeek').eq(0).text())
				{
					$("#IsShowWeek").prop("checked", true);
				}
				else
				{
					$("#IsShowWeek").prop("checked", false);
				}
	
				$("#HourOSDType").val($(DatetimeOverlay).find('clockType').eq(0).text());
				$("#OSDType").val($(DatetimeOverlay).find('type').eq(0).text());
			    $("#OSDXPos").val($(DatetimeOverlay).find('positionX').eq(0).text());
			    $("#OSDYPos").val($(DatetimeOverlay).find('positionY').eq(0).text());
			}
			
			if($(xmlDoc).find('channelNameOverlay').length > 0)
			{
				channelNameOverlay = $(xmlDoc).find('channelNameOverlay').eq(0);
				if("true" == $(channelNameOverlay).find('enabled').eq(0).text())
				{
					$("#IsShowChanNme").prop("checked", true);
				}
				else
				{
					$("#IsShowChanNme").prop("checked", false);
				}
				$("#ChannelNameXPos").val($(channelNameOverlay).find('positionX').eq(0).text());
			    $("#ChannelNameYPos").val($(channelNameOverlay).find('positionY').eq(0).text());
				GetChannelName();
			}
			var strTemp = CreateOSDDateInfo();
			HWP.SetTextOverlay(strTemp);
			EnabledChanNme();
			EnableDate();
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		SetOSDInfoAll
Description:	设置OSD时间叠加信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function SetOSDInfoAll()
{
	m_szOverlayInfo = HWP.GetTextOverlay();
	if(m_szOverlayInfo != "")
	{
		var XmlTempDoc = parseXmlFromStr(m_szOverlayInfo);
		OSDPositionX = $(XmlTempDoc).find('DateTimeOverlay').eq(0).find('positionX').eq(0).text();
		OSDPositionY = $(XmlTempDoc).find('DateTimeOverlay').eq(0).find('positionY').eq(0).text();
		ChannelPositionX = $(XmlTempDoc).find('channelNameOverlay').eq(0).find('positionX').eq(0).text();
		ChannelPositionY = $(XmlTempDoc).find('channelNameOverlay').eq(0).find('positionY').eq(0).text();
	}
	else
	{
		OSDPositionX = $("#OSDXPos").val();
		OSDPositionY = $("#OSDYPos").val();
		ChannelPositionX = $("#ChannelNameXPos").val();
		ChannelPositionY = $("#ChannelNameYPos").val();
	}
	var iSetSuccess = 1;
	SetOSDInfo(1);
	if(m_b403Error)
	{
		szRetInfo = m_szErrorState + m_szError8;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}		
	if(m_bNetAbnormal)
	{
		szRetInfo = m_szErrorState + m_szError1;
		$("#SetResultTips").html(szRetInfo); 
		return;
	}

	if(iSetSuccess == 1)
	{
		var szRetInfo = m_szSuccessState + m_szSuccess1;
		GetOSDInfo();//重新获取OSD显示信息
		$("#SetResultTips").html(szRetInfo);
	}
	else
	{
		var szRetInfo = m_szErrorState + m_szError55  + szErrorChan + m_szError44;
		$("#SetResultTips").html(szRetInfo);
	}
}
/*************************************************
Function:		SetOSDInfo
Description:	设置OSD时间信息
Input:			iNo:通道号			
Output:			无
return:			无				
*************************************************/
function SetOSDInfo(iNo)
{
	m_bSetOSD = false;
	m_b403Error = false;
	m_bNetAbnormal = false;
	var XmlDoc = parseXmlFromStr(m_szOSDXmlStr);
	
	$(XmlDoc).find('id').eq(0).text(iNo);
	$(XmlDoc).find('videoInputID').eq(0).text(iNo);
	
	if($('#OSDAttrib').val() == null)
	{
		$(XmlDoc).find('attribute').eq(0).text('1');
	}
	else
	{
	    $(XmlDoc).find('attribute').eq(0).text($('#OSDAttrib').val());
	}
		
	if($(XmlDoc).find('fontSize').length > 0)
	{
		$(XmlDoc).find('fontSize').eq(0).text($('#OSDFontSize').val()); 
	}
	if($(XmlDoc).find('DateTimeOverlay').length > 0)
	{
		DatetimeOverlay = $(XmlDoc).find('DateTimeOverlay').eq(0);
		if($("#IsShowOSD").prop("checked"))
		{
			$(DatetimeOverlay).find('enabled').eq(0).text("true");
		}else
		{
			$(DatetimeOverlay).find('enabled').eq(0).text("false");
		}
	
		if($("#IsShowWeek").prop("checked"))
		{
			$(DatetimeOverlay).find('displayWeek').eq(0).text("true");
		}else
		{
			$(DatetimeOverlay).find('displayWeek').eq(0).text("false");
		}
		$(DatetimeOverlay).find('type').eq(0).text($('#OSDType').val());
		$(DatetimeOverlay).find('positionX').eq(0).text(OSDPositionX);
		$(DatetimeOverlay).find('positionY').eq(0).text(OSDPositionY);
		$(DatetimeOverlay).find('clockType').eq(0).text($('#HourOSDType').val());
	}
	else
	{
		OSD = XmlDoc.documentElement.getElementsByTagName('OSD')[0];
		DatetimeOverlay = XmlDoc.createElement("DateTimeOverlay");
		
		Element = XmlDoc.createElement("enabled");
		if($("#IsShowOSD").prop("checked"))
		{
			text = XmlDoc.createElement("true");
		}
		else
		{
			text = XmlDoc.createElement("false");
		}
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("positionX");
		text = XmlDoc.createElement(OSDPositionX);
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("positionY");
		text = XmlDoc.createElement(OSDPositionY);
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("type");
		text = XmlDoc.createElement($('#OSDType').val());
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("clockType");
		text = XmlDoc.createElement($('#HourOSDType').val());
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("displayWeek");
		if($("#IsShowWeek").prop("checked"))
		{
			text = XmlDoc.createElement("true");
		}
		else
		{
			text = XmlDoc.createElement("false");
		}
		Element.appendChild(text);
		DatetimeOverlay.appendChild(Element);
		OSD.appendChild(DatetimeOverlay);
	}
	if($(XmlDoc).find('channelNameOverlay').length > 0)
	{
		channelNameOverlay = $(XmlDoc).find('channelNameOverlay').eq(0);
		if($("#IsShowChanNme").prop("checked"))
		{
			$(channelNameOverlay).find('enabled').eq(0).text("true");
		}else
		{
			$(channelNameOverlay).find('enabled').eq(0).text("false");
		}
		$(channelNameOverlay).find('positionX').eq(0).text(ChannelPositionX);
		$(channelNameOverlay).find('positionY').eq(0).text(ChannelPositionY);
	}
	else
	{
		OSD = XmlDoc.documentElement.getElementsByTagName('OSD')[0];
		channelNameOverlay = XmlDoc.createElement("channelNameOverlay");
		
		Element = XmlDoc.createElement("enabled");
		if($("#IsShowChanNme").prop("checked"))
		{
			text = XmlDoc.createElement("true");
		}
		else
		{
			text = XmlDoc.createElement("false");
		}
		Element.appendChild(text);
		channelNameOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("positionX");
		text = XmlDoc.createElement(ChannelPositionX);
		Element.appendChild(text);
		channelNameOverlay.appendChild(Element);
		
		Element = XmlDoc.createElement("positionY");
		text = XmlDoc.createElement(ChannelPositionY);
		Element.appendChild(text);
		channelNameOverlay.appendChild(Element);
		OSD.appendChild(channelNameOverlay);
	}
	if($(XmlDoc).find('TextOverlayList').length > 0)
	{
		$(XmlDoc).find('TextOverlayList').eq(0).remove();
	}
	
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/" + iNo;
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data: XmlDoc,
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
			    m_bSetOSD = true;
		    }
		    else
		    {
			    m_bSetOSD = false;
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
/*************************************************
Function:		EnableDate
Description:	是否启用显示日期
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnableDate()
{
	if($("#IsShowOSD").prop("checked"))
	{
		$("#IsShowWeek").prop("disabled",false);   
		$("#OSDType").prop("disabled",false);
		$("#OSDXPos").prop("disabled",false);   
		$("#OSDYPos").prop("disabled",false);
		$("#HourOSDType").prop("disabled",false);
	}
	else
	{
		$("#IsShowWeek").prop("disabled",true);   
		$("#OSDType").prop("disabled",true);
		$("#OSDXPos").prop("disabled",true);   
		$("#OSDYPos").prop("disabled",true);
		$("#HourOSDType").prop("disabled",true);
	}
	var strTemp = HWP.GetTextOverlay();
	if(strTemp != "")
	{
	    var xmlDoc = parseXmlFromStr(strTemp);	
		if($("#IsShowOSD").prop("checked"))
		{
	        $(xmlDoc).find('DateTimeOverlay').eq(0).find('enabled').eq(0).text("true");
		}
		else
		{
			$(xmlDoc).find('DateTimeOverlay').eq(0).find('enabled').eq(0).text("false");
		}
	}
	
	strTemp = xmlToStr(xmlDoc);
	HWP.SetTextOverlay(strTemp);
}
/*************************************************
Function:		EnabledChanNme
Description:	是否显示通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnabledChanNme()
{
	if($("#IsShowChanNme").prop("checked"))
	{
      	$("#ChannelName").prop("disabled",false);
	} 
	else
	{
      	$("#ChannelName").prop("disabled",true);
	}
	var strTemp = HWP.GetTextOverlay();
	if(strTemp != "")
	{
	    var xmlDoc = parseXmlFromStr(strTemp);	
		if($("#IsShowChanNme").prop("checked"))
		{
	        $(xmlDoc).find('channelNameOverlay').eq(0).find('enabled').eq(0).text("true");
		}
		else
		{
			$(xmlDoc).find('channelNameOverlay').eq(0).find('enabled').eq(0).text("false");
		}
	}
	
	strTemp = xmlToStr(xmlDoc);
	HWP.SetTextOverlay(strTemp);
}
/*************************************************
Function:		EnabledWeek
Description:	是否显示星期
Input:			无			
Output:			无
return:			无				
*************************************************/
function EnabledWeek()
{
	var strTemp = HWP.GetTextOverlay();
	if(strTemp != "")
	{
	    var xmlDoc = parseXmlFromStr(strTemp);	
		if($("#IsShowWeek").prop("checked"))
		{
	        $(xmlDoc).find('displayWeek').eq(0).text("true");
		}
		else
		{
			$(xmlDoc).find('displayWeek').eq(0).text("false");
		}
	}
	
	strTemp = xmlToStr(xmlDoc);
	HWP.SetTextOverlay(strTemp);
}
/*************************************************
Function:		GetChannelName
Description:	获取通道名称
Input:			无
Output:			无
return:			无
*************************************************/
function GetChannelName()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1";
	$.ajax(
	{
		type: "GET",
		url: szURL,
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
		    m_szChanNameXmlStr = xhr.responseText;
			try
		    {
				$("#ChannelName").val($(xmlDoc).find('name').eq(0).text());
			}
			catch(err)
			{
				$("#ChannelName").val('');
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);   
		    return;
		}
	});
}
/*************************************************
Function:		SetChannelName
Description:	设置通道名称
Input:			无
Output:			无
return:			无
*************************************************/
function SetChannelName()
{
	var xmlDoc = new createxmlDoc();			
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
	
	var Root = xmlDoc.createElement("VideoInputChannel");	

	Element = xmlDoc.createElement("id");
	text = xmlDoc.createTextNode("1");
	Element.appendChild(text);
	Root.appendChild(Element); 
	
	Element = xmlDoc.createElement("inputPort");
	text = xmlDoc.createTextNode("1");
	Element.appendChild(text);
	Root.appendChild(Element); 
	
	Extensions = xmlDoc.createElement("Extensions");
	Element = xmlDoc.createElement("name");
	text = xmlDoc.createTextNode($("#ChannelName").val());
	Element.appendChild(text);
	Extensions.appendChild(Element);
	
	Root.appendChild(Extensions); 
	xmlDoc.appendChild(Root);

	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/1";
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
		complete: function(xhr, textStatus) 
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		CreateOSDDateInfo
Description:	创建设置给插件的叠加信息
Input:			无
Output:			无
return:			无
*************************************************/
function CreateOSDDateInfo()
{
	var xmlDoc = new createxmlDoc();			
	var Instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	xmlDoc.appendChild(Instruction);
		
	var Root = xmlDoc.createElement("OSD");	
	
	Element = xmlDoc.createElement("videoResolutionWidth");
	text = xmlDoc.createTextNode('704');
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("videoResolutionHeight");
	if(m_iVideoOutNP == 'PAL')
	{
	    text = xmlDoc.createTextNode('576');
	}
	else
	{
		text = xmlDoc.createTextNode('480');
	}
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = xmlDoc.createElement("fontSize");
	text = xmlDoc.createTextNode($("#OSDFontSize").val());
	Element.appendChild(text);
	Root.appendChild(Element);
	
	channelNameOverlay = xmlDoc.createElement("channelNameOverlay");
	Element = xmlDoc.createElement("enabled");
	if($("#IsShowChanNme").prop("checked"))
	{
		text = xmlDoc.createTextNode('true');
	}
	else
	{
		text = xmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	channelNameOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("ChannelName");
	text = xmlDoc.createTextNode($("#ChannelName").val());
	Element.appendChild(text);
	channelNameOverlay.appendChild(Element);
		
	Element = xmlDoc.createElement("positionX");
	text = xmlDoc.createTextNode($("#ChannelNameXPos").val());
	Element.appendChild(text);
	channelNameOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("positionY");
	text = xmlDoc.createTextNode($("#ChannelNameYPos").val());
	Element.appendChild(text);
	channelNameOverlay.appendChild(Element);
	Root.appendChild(channelNameOverlay);
	
	DateTimeOverlay = xmlDoc.createElement("DateTimeOverlay");
	Element = xmlDoc.createElement("enabled");
	if($("#IsShowOSD").prop("checked"))
	{
		text = xmlDoc.createTextNode('true');
	}
	else
	{
		text = xmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("type");
	text = xmlDoc.createTextNode($("#OSDType").val());
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("clockType");
	text = xmlDoc.createTextNode($('#HourOSDType').val());
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("displayWeek");
	if($("#IsShowWeek").prop("checked"))
	{
	    text = xmlDoc.createTextNode("true");
	}
	else
	{
		text = xmlDoc.createTextNode("false");
	}
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
		
	Element = xmlDoc.createElement("positionX");
	text = xmlDoc.createTextNode($("#OSDXPos").val());
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
	
	Element = xmlDoc.createElement("positionY");
	text = xmlDoc.createTextNode($("#OSDYPos").val());
	Element.appendChild(text);
	DateTimeOverlay.appendChild(Element);
	Root.appendChild(DateTimeOverlay);
	
	xmlDoc.appendChild(Root);
	return xmlToStr(xmlDoc);
}
/*************************************************
Function:		SetHourOSDType
Description:	切换时间格式时重新设置传入插件的信息
Input:			无
Output:			无
return:			无
*************************************************/
function SetHourOSDType()
{
	var strTemp = HWP.GetTextOverlay();
	if(strTemp != "")
	{
	    var xmlDoc = parseXmlFromStr(strTemp);	
		$(xmlDoc).find('clockType').eq(0).text($('#HourOSDType').val());
	}
	
	strTemp = xmlToStr(xmlDoc);
	HWP.SetTextOverlay(strTemp);
}
/*************************************************
Function:		SetOSDType
Description:	切换日期格式时重新设置传入插件的信息
Input:			无
Output:			无
return:			无
*************************************************/
function SetOSDType()
{
	var strTemp = HWP.GetTextOverlay();
	if(strTemp != "")
	{
	    var xmlDoc = parseXmlFromStr(strTemp);	
	    $(xmlDoc).find('Type').eq(0).text($('#OSDType').val()); 
	}
	
	strTemp = xmlToStr(xmlDoc);
	HWP.SetTextOverlay(strTemp);
}