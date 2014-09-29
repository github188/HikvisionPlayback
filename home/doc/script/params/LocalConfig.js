
/*************************************************
Function:		LocalConfig
Description:	构造函数，Singleton派生类
Input:			无			
Output:			无
return:			无				
*************************************************/
function LocalConfig() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(LocalConfig);

/*************************************************
Function:		initCSS
Description:	初始化CSS 类方法
Input:			无			
Output:			无
return:			无				
*************************************************/
LocalConfig.prototype.initCSS = function() {
	$("#diLocalConfig :radio").addClass("radio");
	$("#diLocalConfig :button").addClass("button");
	g_transStack.clear();
	g_transStack.push(function() {
		switch (parent.translator.szCurLanguage)
		{
			case "zh":
				//alert(parent.translator.szCurLanguage);
				$("#diLocalConfig .firstspan").width(150);
				$("#spPackSize .firstspan").width(150);
				$("#diLocalConfig :text").width(425);
				$("#spRecordPath").width(430);
				$("#spDownloadPath").width(430);
				$("#teRecordPath").parent().width(430);
				$("#teDownloadPath").parent().width(430);
				$("#diCaptureClipParams .pathsecondspan").width(430);
				break;
			case "en":
				$("#diLocalConfig .firstspan").width(190);
				$("#spPackSize .firstspan").width(190);
				$("#diLocalConfig :text").width(385);
				$("#spRecordPath").width(390);
				$("#spDownloadPath").width(390);
				$("#teRecordPath").parent().width(390);
				$("#teDownloadPath").parent().width(390);
				$("#diCaptureClipParams .pathsecondspan").width(390);
				break;
			default:
				$("#diLocalConfig .firstspan").width(190);
				$("#spPackSize .firstspan").width(190);
				$("#diLocalConfig :text").width(385);
				$("#spRecordPath").width(390);
				$("#spDownloadPath").width(390);
				$("#teRecordPath").parent().width(390);
				$("#teDownloadPath").parent().width(390);
				$("#diCaptureClipParams .pathsecondspan").width(390);
				break;
		}
	}, true);
};

/*************************************************
Function:		update
Description:	更新本地配置信息
Input:			无			
Output:			无
return:			无				
*************************************************/
LocalConfig.prototype.update = function()
{
	$("#SaveConfigBtn").show();
	$("#SetResultTips").html("");
	
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc("LocalConfig"));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	
	var szInfo = parent.translator.translateNode(this.getLxd(), 'laPlugin');
	if (!checkPlugin('0', szInfo))
	{
		return;
	}
	m_PreviewOCX = document.getElementById("PreviewActiveX");
	
	if (!CompareFileVersion())
	{
		UpdateTips();
	}
	
	var szPathInfo = m_PreviewOCX.HWP_GetLocalConfig();
	
	if (szPathInfo === "")
	{
		var szRetInfo = m_szErrorState + m_szError2;
		$("#SetResultTips").html(szRetInfo); 
		DisabledSaveBtn();
	}
	var xmlDoc = parseXmlFromStr(szPathInfo);
	function hasValue4ChildNode(xmlDoc, index) { // IE中COM对象无法添加方法
		return xmlDoc.documentElement.childNodes[index].hasChildNodes();
	};
	function value4ChildNode(xmlDoc, index) {
		return xmlDoc.documentElement.childNodes[index].childNodes[0].nodeValue;
	};
	function radio4Value($selector, value) {
		$selector.each(function(i){
			if($(this).val() == value){
				$(this).prop("checked", true);
				return false;
			}
		});
	};
	
	if (hasValue4ChildNode(xmlDoc, 5))
	{
		$("#teRecordPath").val(value4ChildNode(xmlDoc, 5));
	}
	if (hasValue4ChildNode(xmlDoc, 6))
	{
		$("#tePreviewPicPath").val(value4ChildNode(xmlDoc, 6));
	}
	if (hasValue4ChildNode(xmlDoc, 8))
	{
		$("#tePlaybackPicPath").val(value4ChildNode(xmlDoc, 8));
	}
	if(hasValue4ChildNode(xmlDoc, 7))
	{
		$("#tePlaybackFilePath").val(value4ChildNode(xmlDoc, 7));
	}
	if (hasValue4ChildNode(xmlDoc, 0))
	{
		//radio4Value($("#spAgreementType :radio"), value4ChildNode(xmlDoc, 0));
		$("#spAgreementType :radio").filter(function() 
		{
			return this.value == value4ChildNode(xmlDoc, 0);
		}).prop("checked", true);
	}
	if (hasValue4ChildNode(xmlDoc, 4))
	{
		radio4Value($("#spNetsPreach :radio"), value4ChildNode(xmlDoc, 4));
	}
	if (hasValue4ChildNode(xmlDoc, 2))
	{
		radio4Value($("#spPackSize :radio"), value4ChildNode(xmlDoc, 2));
	}
	if (hasValue4ChildNode(xmlDoc, 1))
	{
		radio4Value($("#spStreamType :radio"), value4ChildNode(xmlDoc, 1));
	}
	if (hasValue4ChildNode(xmlDoc, 3))
	{
		radio4Value($("#spWindowProportion :radio"), value4ChildNode(xmlDoc, 3));
	}
	if (hasValue4ChildNode(xmlDoc, 9))
	{
		$("#teDownloadPath").val(value4ChildNode(xmlDoc, 9));
	}	
}

/*************************************************
Function:		submit
Description:	提交保存本地配置信息
Input:			无			
Output:			无
return:			无				
*************************************************/
LocalConfig.prototype.submit = function ()                            
{
	if(m_PreviewOCX != null)
	{
		var xmlDoc = new createxmlDoc();
		var instruction = xmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
		xmlDoc.appendChild(instruction);
		var root = xmlDoc.createElement("LocalConfigInfo");
		
		var element = xmlDoc.createElement("ProtocolType");
		var text = xmlDoc.createTextNode($("#spAgreementType :radio[checked='checked']").val());
	    element.appendChild(text);
		root.appendChild(element); 
		
		element = xmlDoc.createElement("StreamType");
		text = xmlDoc.createTextNode($("#spStreamType :radio[checked='checked']").val());
	    element.appendChild(text);		
		root.appendChild(element);
		
		element = xmlDoc.createElement("PackgeSize");
		text = xmlDoc.createTextNode($("#spPackSize :radio[checked='checked']").val());
	    element.appendChild(text);		
		root.appendChild(element);  
		
		element = xmlDoc.createElement("PlayWndType");
		text = xmlDoc.createTextNode($("#spWindowProportion :radio[checked='checked']").val());
	    element.appendChild(text);	
		root.appendChild(element); 
		
		element = xmlDoc.createElement("BuffNumberType");
		text = xmlDoc.createTextNode($("#spNetsPreach :radio[checked='checked']").val());
	    element.appendChild(text);
		root.appendChild(element);
		
		element = xmlDoc.createElement("RecordPath");
		text = xmlDoc.createTextNode($("#teRecordPath").val());
		element.appendChild(text);
		root.appendChild(element);  
		
		element = xmlDoc.createElement("CapturePath");
		text = xmlDoc.createTextNode($("#tePreviewPicPath").val());
		element.appendChild(text);
		root.appendChild(element); 
		
		element = xmlDoc.createElement("PlaybackFilePath");
		text = xmlDoc.createTextNode($("#tePlaybackFilePath").val());
		element.appendChild(text);
		root.appendChild(element); 
		
		element = xmlDoc.createElement("PlaybackPicPath");
		text = xmlDoc.createTextNode($("#tePlaybackPicPath").val());
		element.appendChild(text);
		root.appendChild(element); 
		
		element = xmlDoc.createElement("DownloadPath");
		text = xmlDoc.createTextNode($("#teDownloadPath").val());
		element.appendChild(text);
		root.appendChild(element); 
		
		xmlDoc.appendChild(root); 
		
		var xmlDocInfo = xmlToStr(xmlDoc);
	
		if (m_PreviewOCX.HWP_SetLocalConfig(xmlDocInfo))
		{
			var szRetInfo = m_szSuccessState + m_szSuccess1;
		}
		else
		{
			var szRetInfo = m_szErrorState + m_szError1;
		}
		$("#SetResultTips").html(szRetInfo); 
	}
}
