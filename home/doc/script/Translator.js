/*****************************************************
Copyright 2007-2011 Hikvision Digital Technology Co., Ltd.   
FileName: Translator.js
Description: 翻译器相关
Author: wuyang
Date: 2012.1.5
*****************************************************/

function Translator()
{
    //debugger;
	this.szCurLanguage = null; // 原m_szLanguage
	this.languages = new Array();
	var that = this;
	$.ajax({
		url: "../xml/Languages.xml",
		type: "get",
		async: false,
		dataType: "xml",
		error: function(xml) {
			alert('Error loading XML document' + xml); // 可能文件编码错误，或XML不标准
		},
		success: function(xml) {
			$(xml).find("Language").each(function(i) {
				that.languages.push({
					value: $(this).children("value").text(),
					name: $(this).children("name").text(),
					isDefault: $(this).is("[default='true']")
				});
			});
		}
	});
	
	/*************************************************
	Function:		initLanguageSelect
	Description:	初始化$("LanguageSelect")，重置this.szCurLanguage
	Input:			szLanguage: 选中语言的标准缩写
	Output:			无
	return:			无
	*************************************************/
	this.initLanguageSelect = function(szLanguage) {
		$('#divLanguageChoose').empty();
		var that = this;
		var szOptions = "";
		$.each(this.languages, function(i) {
			szOptions += "<div class='mouseoutlan' onmouseover='this.className=\"mouseoverlan\"' onmouseout='this.className=\"mouseoutlan\"' onclick='chooseLanguage(\"" + this.value + "\")';><label id='"+ this.value + "'>"+ this.name +"</label></div>";
			if (this.isDefault === true) {
				that.szCurLanguage = this.value;
			}
		});
		$(szOptions).appendTo("#divLanguageChoose");
		if (szLanguage !== undefined && szLanguage !== null && szLanguage !== "") {
			$.each(this.languages, function(i) {
			    if (this.value === szLanguage) {
				    that.szCurLanguage = this.value;
			    }
		    });
		}
		else if(szLanguage === null)
		{
			this.szCurLanguage = "en";  //系统语言无法匹配到时默认显示英文
		}
		$('#laCurrentLanguage').html($('#' + this.szCurLanguage).html());
		return this.szCurLanguage;
	}

	/*************************************************
	Function:		appendLanguageXmlDoc
	Description:	将lxd合并至lxdObj，返回合并后的lxd
	Input:			lxdObj: 待合并的lxd
					lxd: 用于合并的lxd，不被改变
	Output:			lxdObj: 合并后的lxd同返回值
	return:			合并后的lxd
	*************************************************/
	this.appendLanguageXmlDoc = function(lxdObj, lxd) {
		if (lxdObj === null && lxd !== null) {
			return (this.s_lastLanguageXmlDoc = lxd);
		} else if (lxdObj !== null && lxd === null) {
			return (this.s_lastLanguageXmlDoc = lxdObj);
		} else if (lxdObj === null && lxd === null) {
			return (this.s_lastLanguageXmlDoc = null);
		} else {
			return (this.s_lastLanguageXmlDoc = $(lxdObj).append($(lxd.cloneNode(true)).children())[0]);
		}
	}
	
	/*************************************************
	Function:		getLanguageXmlDoc
	Description:	根据指定语言标示符和XML名称，获取LanguageXmlDoc，如指定szLanguage则重置this.szCurLanguage
	Input:			szXmls: (String)XML名称，不含后缀名；或(Array)XML名称及其子孙节点组成的数组
					szLanguage: 语言标示符，即文件夹名（可省略，默认this.szCurLanguage）
	Output:			无
	return:			指定语言的LanguageXmlDoc
	*************************************************/
	this.getLanguageXmlDoc = function(szXmls, szLanguage, bMergeCommon) {
		if (szLanguage !== undefined) {
			this.szCurLanguage = szLanguage;
		}
		if (typeof szXmls === "string") {
			szXmls = [szXmls];
		}
		$.each(szXmls, function(i, szXml) {
			szXmls[i] = szXml.replace(/^(\d)/, "_$1");
		});
		var lxd = $.ajax({
			url: "../xml/" + this.szCurLanguage + "/" + szXmls[0] + ".xml",
			type: "get",
			async: false,
			cache: true,
			dataType: "xml",
			error: function(xml, textStatus, errorThrown) {
				alert("Error loading XML document" + xml); // 可能文件编码错误，或XML不标准
			}
		}).responseXML;
		var lxdCommon = undefined;
		$.each(szXmls, function(i, szXml) {
			if (i === 1) {
				lxdCommon = $(lxd).children("Common")[0];
			}
			lxd = $(lxd).children(szXml)[0];
		});
		if (lxdCommon !== undefined && bMergeCommon !== false) {
			//this.appendLanguageXmlDoc(lxd, lxdCommon);
			$(lxd).append($(lxdCommon).children());
		}
		return (this.s_lastLanguageXmlDoc = lxd);
	}
	
	/*************************************************
	Function:		translateElements
	Description:	翻译指定文档的某类标签
	Input:			languageXmlDoc: 通过getLanguageXmlDoc获取的LanguageXmlDoc
					doc: 指定文档
					szTag: 标签类型
					szProp: 属性类型
					szKey: 用于翻译的键，如"id"、"name"、"class"，默认"name"
	Output:			无
	return:			无
	*************************************************/
	this.translateElements = function(languageXmlDoc, doc, szTag, szProp, szKey)
	{
		if (szKey === undefined) {
			szKey = "name";
		}
		$(doc).find(szTag).each(function(i) {
			//var szTranslated = $(languageXmlDoc).children("Page").find($(this).attr("name")).eq(0).text();
			var szTranslated = $(languageXmlDoc).find($(this).attr(szKey)).eq(0).text(); // 这里可进一步优化, wuyang
			if (szTranslated !== "") {
				if (szTag === "label" || szTag === "a") {
					szTranslated = szTranslated.replace(/ /g,"&nbsp;");
				}
				switch (szProp) {
					case "innerHTML":
						$(this).html(szTranslated);
						break;
					case "innerText":
						$(this).text(szTranslated);
						break;
					case "value":
						$(this).val(szTranslated);
						break;
					default:
						$(this).attr(szProp, szTranslated);
						break;
				}
			}
		});
	}
	
	/*************************************************
	Function:		translatePage
	Description:	翻译指定文档
	Input:			languageXmlDoc: 通过getLanguageXmlDoc获取的LanguageXmlDoc
					doc: 指定文档
					szKey: 用于翻译的键，如"id"、"name"、"class"，默认"name"
	Output:			无
	return:			无
	*************************************************/
	this.translatePage = function(languageXmlDoc, doc, szKey) {
		if (doc === undefined) {
			doc = document;
		}
		if (szKey === undefined) {
			szKey = "name";
		}
		// 这里可进一步优化，wuyang
		this.translateElements(languageXmlDoc, doc, "input", "value", szKey);
		this.translateElements(languageXmlDoc, doc, "label", "innerHTML", szKey);
		//this.translateElements(languageXmlDoc, doc, "img", "title", szKey);
		this.translateElements(languageXmlDoc, doc, "option", "innerText", szKey);
		this.translateElements(languageXmlDoc, doc, "a", "innerHTML", szKey);
		var that = this;
		if (translateTailor.bEnable) {
			setTimeout(function() {
//				translateTailor.clearXmlFiles("D:/xml", ["Login", "Main", "Preview", "Playback", "Download", "Log", "ParamConfig", 
//					"LocalConfig", "System", "Network", "VideoAudio", "VideoSettings", "Security", "Events", "Storage"], that.szCurLanguage);
				
//				translateTailor.sewXmlFiles("D:/xml", ["Login"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "Preview"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "Playback"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "Download"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "Log"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "LocalConfig"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "System"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "Network"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "VideoAudio"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "VideoSettings"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "Security"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "Events"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "Storage"], that.szCurLanguage, doc, szKey);
//				translateTailor.sewXmlFiles("D:/xml", ["Main", "ParamConfig", "ptzCfg"], that.szCurLanguage, doc, szKey);
			}, 10);
		}
	}
	
	/*************************************************
	Function:		translateNode
	Description:	翻译指定节点
	Input:			languageXmlDoc: 通过getLanguageXmlDoc获取的LanguageXmlDoc
					nodeName: XML中的节点名
	Output:			无
	return:			翻译结果
	*************************************************/
	this.translateNode = function(languageXmlDoc, nodeName)
	{
		return $(languageXmlDoc).find(nodeName).text();
	}
}

Translator.prototype = {
	constructor: Translator,
	s_lastLanguageXmlDoc: null,
	translateNodeByLastLxd: function(nodeName) { // 模拟原getNodeValude
		if (this.s_lastLanguageXmlDoc === null) {
			return;
		}
		return translator.translateNode(this.s_lastLanguageXmlDoc, nodeName);
	}
}

/*************************************************
Function:		TransStack
Description:	翻译回调堆栈类
Input:			无
Output:			无
return:			无
*************************************************/
function TransStack()
{
	var _cbTransStack = [];

	this.clear = function() {
		_cbTransStack = [];
	}

	this.push = function(cbFun, bSync) {
		if (bSync === true) {
			cbFun();
		}
		_cbTransStack.push(cbFun);
	}
	
	this.pop = function() {
		return _cbTransStack.pop();
	}
	
	this.translate = function() {
		$.each(_cbTransStack, function(i, cbTrans) {
			cbTrans();
		});
	}
	
	this.getLength = function() {
		return _cbTransStack.length;
	}
}

/*************************************************
Function:		TranslateTailor
Description:	翻译字符串所在标签类型和限制长度的自动化
Input:			无
Output:			无
return:			无
*************************************************/
function TranslateTailor()
{
	this.bEnable = false;
	try {
		var _fso = null;//new ActiveXObject("Scripting.FileSystemObject");
		//this.bEnable = true;
	} catch (e) { }
	
	this.clearXmlFiles = function(szPath, szXmls, szLanguage) {
		if (!this.bEnable) {
			return;
		}
		if (typeof szXmls === "string") {
			szXmls = [szXmls];
		}
		$.each(szXmls, function(i, szXml) {
			_clearPage(szPath + "/" + szLanguage + "/" + szXml + ".xml", szLanguage);
		});
	}
	
	function _clearPage(szXmlPath, szLanguage) {
		var szXmlDoc = _readFile(szXmlPath);
		var lxd = parseXmlFromStr(szXmlDoc);
		
		$.each($(lxd).find("*"), function(i, elem) {
			$(elem).removeAttr("tag").removeAttr("length");
		})

		_writeFile(lxd.xml, szXmlPath);
	}
	
	this.sewXmlFiles = function(szPath, szXmls, szLanguage, doc, szKey) {
		if (!this.bEnable) {
			return;
		}
		if (typeof szXmls === "string") {
			szXmls = [szXmls];
		}
		$.each(szXmls, function(i, szXml) {
			_measurePage(szPath + "/" + szLanguage + "/" + szXml + ".xml", szLanguage, doc, szKey);
		});
	}
	
	function _measureElements(languageXmlDoc, doc, szTag, szKey)
	{
		if (szKey === undefined) {
			szKey = "name";
		}
		$(doc).find(szTag).each(function(i) {
			if ($(languageXmlDoc).find($(this).attr(szKey)).length !== 0) {
				var elemXmlDoc = $(languageXmlDoc).find($(this).attr(szKey))[0];
				var szElemTag = $(elemXmlDoc).attr("tag");
				if (szElemTag === undefined) {
					szElemTag = "";
				}
				if (-1 === szElemTag.indexOf(szTag + ";")) {
					$(elemXmlDoc).attr("tag", szElemTag + szTag + ";");
				}
				var szElemLength = $(elemXmlDoc).attr("length");
				switch (szTag) {
					case "option":
						var iWidth = $(this).parent("select").eq(0).width();
						break;
					case "a":
						if ($(this).parent().get(0).tagName === "LI") {
							iWidth = 9999; // 各配置页面的a标签
							break;
						}
					case "label":
//						var parent = $(this).parent().get(0);
//						if (parent !== null && (parent.tagName === "DIV" || parent.tagName === "SPAN" || parent.tagName === "TD" || parent.tagName === "TH")) {
//							var iParentWidth = $(this).parent().eq(0).width();
//							var iWidth = $(this).width();
//							iWidth = (iWidth !== iParentWidth) ? iParentWidth : 9999; // iWidth === iParentWidth时认为未设最大宽度，暂未想到更好的方法
//						} else {
//							var iWidth = 9999;
//						}
//						break;

						var iWidth = 9999;
						var $ancestor = $(this);
						var $ancestor2 = null; // 祖节点中$ancestor的child
						while ($ancestor.length !== 0) {
							if ($ancestor.css("display") === "block" || $ancestor.css("display") === "inline-block" || $ancestor.css("display") === "table-cell") {
								iWidth = $ancestor.width();
								break;
							}
							$ancestor2 = $ancestor;
							$ancestor = $ancestor.parent();
						}
						if ($ancestor2 !== null && $ancestor2.css("text-align") === "left") {
							var ancestor2Next = $ancestor2.next().get(0);
							if (ancestor2Next === undefined) {
								iWidth = $ancestor.position().left + $ancestor.width() - $ancestor2.position().left;
							} else if (ancestor2Next !== undefined && $(ancestor2Next).position().top <= $ancestor2.position().top + $ancestor2.height()) {
								iWidth = Math.abs($ancestor2.position().left - $(ancestor2Next).position().left); // 这里为什么有时是负数？？
							}
						}
						break;

					default: // "input"、"img"
						var iWidth = $(this).width();
						break;
				}

				if (iWidth > 0 && (szElemLength === undefined || szElemLength === "0" || szElemLength > iWidth)) {
					$(elemXmlDoc).attr("length", iWidth);
				}
			}
		});
	}
	
	function _measurePage(szXmlPath, szLanguage, doc, szKey) {		
		if (doc === undefined) {
			doc = document;
		}
		if (szKey === undefined) {
			szKey = "name";
		}
		
		var szXmlDoc = _readFile(szXmlPath);
		var lxd = parseXmlFromStr(szXmlDoc);

		_measureElements(lxd, doc, "input", szKey);
		_measureElements(lxd, doc, "label", szKey);
		_measureElements(lxd, doc, "img", szKey);
		_measureElements(lxd, doc, "option", szKey);
		_measureElements(lxd, doc, "a", szKey);
		
		_writeFile(lxd.xml, szXmlPath);
	}
	
	function _readFile(szPath) {
		var szContent = "";
		try {
			var reader = _fso.OpenTextFile(szPath, 1, false, 0);
			while (!reader.AtEndofStream) {
				szContent += reader.readline();
				szContent += "\n";
			}
			reader.close();
		} catch(e) { }
		return szContent;
	}
	
	function _writeFile(szContent, szPath){
		try {
		   var writer = _fso.CreateTextFile(szPath, true);
		   writer.WriteLine(szContent);
		   writer.Close();
		} catch (e) { }
	}
}

var translateTailor = new TranslateTailor();

var translator = new Translator();
