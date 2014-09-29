var m_szOSDTextInfo = "";
var m_iFontSize = 0;
/*************************************************
Function:		RecordOverlayInit
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordOverlayInit()
{
	var szInfo = getNodeValue('laPlugin');
	m_iPicinform = 1;
	
	if(checkPlugin('1', szInfo, 1, 'textoverlay'))
	{
		if(!CompareFileVersion())
		{
			UpdateTips();
		}
		ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
		setTimeout(function() {
			if (HWP.Play() !== 0) {
				alert(getNodeValue("previewfailed"));
				return;
			}
			GetOverlayInfo();
		}, 10);
	}
}
/*************************************************
Function:		GetOverlayInfo
Description:	获取字符叠加信息
Input:			无			
Output:			无
return:			无				
*************************************************/
function GetOverlayInfo()
{
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/" + m_iPicinform,
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr)
		{
		   if(xmlDoc.documentElement.hasChildNodes())
		   {
			   if(xmlDoc.documentElement.getElementsByTagName('fontSize').length > 0)
			   {
			       m_iFontSize = xmlDoc.documentElement.getElementsByTagName('fontSize')[0].childNodes[0].nodeValue;
			   }
			   m_iOverlayNum = xmlDoc.getElementsByTagName("TextOverlay").length;
			   
			   for(i = 0;i < m_iOverlayNum;i++)
			   {
				   var j = xmlDoc.documentElement.getElementsByTagName('TextOverlay')[i].getElementsByTagName('id')[0].childNodes[0].nodeValue;
				   if("true" == xmlDoc.documentElement.getElementsByTagName('TextOverlay')[i].getElementsByTagName('enabled')[0].childNodes[0].nodeValue)
				   {
					   $("#IsShowString" + j).prop("checked",true);
				   }
				   else
				   {
					   $("#IsShowString" + j).prop("checked",'');
				   }
				   
				   if(xmlDoc.documentElement.getElementsByTagName('displayText')[i].firstChild != null)
				   {
				   		$("#String" + j).val(xmlDoc.documentElement.getElementsByTagName('displayText')[i].childNodes[0].nodeValue);
				   }
				   else
				   {
					   $("#String" + j).val('');
				   }
				   
				   ia(TextOverlay).m_arrTextX[j] = parseInt(xmlDoc.documentElement.getElementsByTagName('TextOverlay')[i].getElementsByTagName('positionX')[0].childNodes[0].nodeValue, 10);
				   ia(TextOverlay).m_arrTextY[j] = parseInt(xmlDoc.documentElement.getElementsByTagName('TextOverlay')[i].getElementsByTagName('positionY')[0].childNodes[0].nodeValue, 10);
				}
			}
			var strTemp = CreateOSDTextInfo();			   
			HWP.SetTextOverlay(strTemp);
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(m_szError400);
		}
	});
}

/*************************************************
Function:		SetOverlayInfo
Description:	设置字符叠加
Input:			iNo:通道号			
Output:			无
return:			无				
*************************************************/
function SetOverlayInfo()
{
	$("#ThisCharTips").html("");
	
	for(var k = 1; k <= 4; k ++)
	{
		/*if($("#IsShowString"+k).prop("checked"))*/
		{
			var szTipsId = "ThisCharTips";
		
			var szStr = $("#String" + k).val();	
			if(CheckCharName(szStr,szTipsId) == false)
			{
				$("#String" + k).focus().val(szStr);
				return;
			}
		}
	}
	CheckOverlayInfo();
	m_szOSDTextInfo = HWP.GetTextOverlay();
	var XmlTempDoc = parseXmlFromStr(m_szOSDTextInfo);
	
	var XmlDoc = new createxmlDoc();
	var Instruction = XmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlDoc.appendChild(Instruction);
	var Root = XmlDoc.createElement("TextOverlayList");
	var szOverlayInfo = new Array();
	
	for (var i = 1; i < 5; i ++)
	{
		if ($("#IsShowString"+i+"").prop("checked") || $("#String"+i+"").val() != "" || ia(TextOverlay).m_arrTextX[i] !== -1 || ia(TextOverlay).m_arrTextY[j] !== -1)
		{
			szOverlayInfo[i] = XmlDoc.createElement("TextOverlay");
	
			Element = XmlDoc.createElement("id");
			text = XmlDoc.createTextNode(i);
			Element.appendChild(text);
			szOverlayInfo[i].appendChild(Element);	
			
			Element = XmlDoc.createElement("enabled");
			if($("#IsShowString" + i).prop("checked"))
			{
				text = XmlDoc.createTextNode("true");
			}
			else
			{
				text = XmlDoc.createTextNode("false");
			}
			Element.appendChild(text);
			szOverlayInfo[i].appendChild(Element);	
			
			Element = XmlDoc.createElement("positionX");
			if(m_szOSDTextInfo != "")
			{
				text = XmlDoc.createTextNode(XmlTempDoc.documentElement.getElementsByTagName('TextOverlay')[i-1].getElementsByTagName('positionX')[0].childNodes[0].nodeValue);
			}
			else
			{
			    text = XmlDoc.createTextNode(ia(TextOverlay).m_arrTextX[i]);
			}
			Element.appendChild(text);
			szOverlayInfo[i].appendChild(Element);	
			
			Element = XmlDoc.createElement("positionY");
			if(m_szOSDTextInfo != "")
			{
				text = XmlDoc.createTextNode(XmlTempDoc.documentElement.getElementsByTagName('TextOverlay')[i-1].getElementsByTagName('positionY')[0].childNodes[0].nodeValue);
			}
			else
			{
			    text = XmlDoc.createTextNode(ia(TextOverlay).m_arrTextY[i]);
			}
			Element.appendChild(text);
			szOverlayInfo[i].appendChild(Element);	
			
			Element = XmlDoc.createElement("displayText");
			text = XmlDoc.createTextNode($("#String" + i).val());
			Element.appendChild(text);
			szOverlayInfo[i].appendChild(Element);	
			
			Root.appendChild(szOverlayInfo[i]);
		}
	}
	XmlDoc.appendChild(Root);
	
	if(XmlDoc.documentElement.childNodes.length == 0)
	{
		m_bSetOverlayInfo = true;
		return;
	}
	 
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/OSD/channels/1/textOverlay";
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: XmlDoc,
		complete:function(xhr, textStatus)
		{
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		CreateOSDTextInfo
Description:	创建传送给插件的xml信息
Input:			无		
Output:			无
return:			bool				
*************************************************/
function CreateOSDTextInfo()
{
	var XmlTempDoc = parseXmlFromStr(m_szOSDTextInfo);
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
	text = xmlDoc.createTextNode(m_iFontSize);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	TextOverlayList = xmlDoc.createElement("TextOverlayList");
	for(var i = 1;i < 9;i ++)
	{
		szOverlayInfo = xmlDoc.createElement("TextOverlay");
	
		Element = xmlDoc.createElement("id");
		text = xmlDoc.createTextNode(i);
		Element.appendChild(text);
		szOverlayInfo.appendChild(Element);	
		
		Element = xmlDoc.createElement("enabled");
		if($("#IsShowString" + i).prop("checked"))
		{
			text = xmlDoc.createTextNode("true");
		}
		else
		{
			text = xmlDoc.createTextNode("false");
		}
		Element.appendChild(text);
		szOverlayInfo.appendChild(Element);	
		
		Element = xmlDoc.createElement("positionX");
		if(m_szOSDTextInfo == "")
		{
			if (ia(TextOverlay).m_arrTextX[i] === -1)
			{
				text = xmlDoc.createTextNode('0');
			}
			else
			{
				text = xmlDoc.createTextNode(ia(TextOverlay).m_arrTextX[i]);
			}
		}
		else
		{
			text = xmlDoc.createTextNode(XmlTempDoc.documentElement.getElementsByTagName("TextOverlayList")[0].getElementsByTagName('positionX')[i-1].childNodes[0].nodeValue);
		}
		Element.appendChild(text);
		szOverlayInfo.appendChild(Element);	
		
		Element = xmlDoc.createElement("positionY");
		if(m_szOSDTextInfo == "")
		{
			if (ia(TextOverlay).m_arrTextY[i] === -1)
			{
				text = xmlDoc.createTextNode('0');
			}
			else
			{
				text = xmlDoc.createTextNode(ia(TextOverlay).m_arrTextY[i]);
			}
		}
		else
		{
			text = xmlDoc.createTextNode(XmlTempDoc.documentElement.getElementsByTagName("TextOverlayList")[0].getElementsByTagName('positionY')[i-1].childNodes[0].nodeValue);
		}
		Element.appendChild(text);
		szOverlayInfo.appendChild(Element);	
		
		Element = xmlDoc.createElement("displayText");
		text = xmlDoc.createTextNode($("#String" + i).val());
		Element.appendChild(text);
		szOverlayInfo.appendChild(Element);	
		
		TextOverlayList.appendChild(szOverlayInfo);
	}
	Root.appendChild(TextOverlayList);
	
	xmlDoc.appendChild(Root);
	return xmlToStr(xmlDoc);
}
/*************************************************
Function:		CheckOverlayInfo
Description:	将当前页面信息传递给插件
Input:			无		
Output:			无
return:			bool				
*************************************************/
function CheckOverlayInfo()
{
	for(var k = 1; k <= 4; k ++)
	{
		/*if($("#IsShowString"+k).prop("checked"))*/
		{
			var szTipsId = "ThisCharTips";
		
			var szStr = $("#String" + k).val();	
			if(CheckCharName(szStr,szTipsId) == false)
			{
				$("#String" + k).focus().val(szStr);
				return;
			}
		}	
	}
	m_szOSDTextInfo = HWP.GetTextOverlay();
	var strTemp = CreateOSDTextInfo();
	HWP.SetTextOverlay(strTemp);
}