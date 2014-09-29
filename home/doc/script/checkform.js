/*************************************************
  Function:    	CheckPassword
  Description:	密码检测对象
*************************************************/
var oCheckPassword = new CheckPassword();
function CheckPassword()
{
    this.m_szDefaultPassword = "\177\177\177\177\177\177";
	this.m_szUserNmaeTag = "";
	this.checkUserName = function(szUserName, objPassword, objPasswordConfirm)
	{
		this.m_szUserNmaeTag = szUserName;
		if(szUserName == "")
		{
			objPassword.val("");
			objPasswordConfirm.val("");
		}
		else
		{
			objPassword.val(this.m_szDefaultPassword);
			objPasswordConfirm.val(this.m_szDefaultPassword);
		}
	}
	this.focusPassword = function(objPassword, objPasswordConfirm)
	{
		if(this.m_szUserNmaeTag != "")
		{
			if(objPassword.val() != "" && objPasswordConfirm.val() != "")
	        {
				objPassword.val("");
		        objPasswordConfirm.val("");
	        }
		}
	}
    this.blurPassword = function(objUserName, objPassword, objPasswordConfirm)
    {
		if(this.m_szUserNmaeTag != "")
		{
		    if(objPassword.val() == "" && objPasswordConfirm.val() == "")
	        {
				if(this.m_szUserNmaeTag == objUserName.val())
				{
					objPassword.val(this.m_szDefaultPassword);
					objPasswordConfirm.val(this.m_szDefaultPassword);
				}
	        }
		}
    }
}
<!--设备基本信息表单验证-->
/*************************************************
  Function:    	CheckDeviceName
  Description:	检查设备名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDeviceName(strInfo,tipsId,iNull)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue("DevNameNullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'",":","*","?","<",">","|", "/", "%","\\",'"', "\""); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue("DevNameWrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > 32)
	{
		szAreaNameInfo += getNodeValue("DevNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheackServerIDIntNum
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iMin:最小数
				iMax:最大数
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackServerIDIntNum(strInfo,tipsId,szName,iMin,iMax,Unit)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName); 
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isCosinaIntNum(strInfo,iMin,iMax) == false)
	{
		if(!Unit)
		{
		    Unit = "";	
		}
		szTipsInfo += getNodeValue(szName) + getNodeValue("RangeTips") + iMin + "-" + iMax + " " + Unit;
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
  Function:    	CheackStringLenth
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringLenth(strInfo,tipsId,szName,iLen)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo != "")
	{
		if($.lengthw(strInfo) > iLen)
		{
			szTipsInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckIPadd
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPadd(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckDIPadd
  Description:	检查是否D类地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDIPadd(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	if($.isDIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("DIPAddInvalidTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckEmail
  Description:	检查Email地址是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckEmail(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo != "")
	{
		if($.isEmail(strInfo) == false)
		{
			szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	
	$("#" + tipsId).html(""); 
	return true;
}

/*************************************************
Function:		CheckMacadd
Description:	验证Mac地址输入是否正确
Input:			iSetId: 需要验证的密码表单ID
				iSetValue：需要验证的表单的值
				tipsId:提示信息
Output:			无
return:			无				
*************************************************/
function CheckMacadd(iSetId,iSetValue,tipsId)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	chkstr = iSetValue;
   	if(chkstr.length == 0)     
   	{
	  	document.getElementById(iSetId).value = "00:00:00:00:00:00";     
      	$("#" + tipsId).html(""); 
		return true;
    }
	var szTipsInfo = "<img src='../images/tips.png' class='verticalmiddle'>&nbsp;";
    var pattern="/^([0-9A-Fa-f]{2})(-[0-9A-Fa-f]{2}){5}|([0-9A-Fa-f]{2})(:[0-9A-Fa-f]{2}){5}/";
    eval("var pattern=" + pattern);
    var add_p1 = pattern.test(chkstr);
    if(add_p1 == false)
    {
		szTipsInfo += getNodeValue("MacAddInvalidTips");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
    }
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckDevUserName
  Description:	检查设备登录名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
				iLen: 限制长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDevUserName(strInfo,tipsId,szName,iNull,iLen)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'",":","*","?","<",">","|", "/", "%","\\",'"', "\""); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("WrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	}
	}
	/*chenxiangzhen 2012-11-08 add*/
	if(iLen === undefined) {
		iLen = 16;
	}
	if($.lengthw(strInfo) > iLen)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckCharName
  Description:	检查字符叠加字符串是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckCharName(strInfo,tipsId)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	if($.lengthw(strInfo) > 44)
	{
		szAreaNameInfo += getNodeValue("CharNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);
		setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除   
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckMaskIP
  Description:	检查掩码
  Input:        strInfo:传入的参数
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckMaskIP(strInfo,tipsId,szName)
{
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	if($.isEmpty(strInfo))//为空时提示     
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	if($.isIpAddress(strInfo) == false)
	{
		szAreaNameInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szAreaNameInfo); 
		return false;
	}
	var IPArray = strInfo.split(".");
	var ip1 = parseInt(IPArray[0]);
	var ip2 = parseInt(IPArray[1]);
	var ip3 = parseInt(IPArray[2]);
	var ip4 = parseInt(IPArray[3]);
	
	var ip_binary = _checkIput_fomartIP(ip1) + _checkIput_fomartIP(ip2) + _checkIput_fomartIP(ip3) + _checkIput_fomartIP(ip4);
	if(-1 != ip_binary.indexOf("01") || ip_binary == "11111111111111111111111111111111" || ip_binary == "00000000000000000000000000000000" || ip_binary == "11111111111111111111111111111110")
	{
		szAreaNameInfo += getNodeValue("MaskAddInvalidTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	_checkIput_fomartIP
  Description:	返回传入参数对应的
  Input:         ip:点分十进制的值(0~255),int类型的值，
  Output:      	 ip对应的二进制值(如：传入255，返回11111111;传入1,返回00000001)
*************************************************/
function _checkIput_fomartIP(ip)
{
	return (ip+256).toString(2).substring(1); //格式化输出(补零)
}
/*************************************************
  Function:    	CheckDevFileName
  Description:	检查文件名称是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDevFileName(strInfo,tipsId,szName,iNull)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var forbidChar = new Array("'",":","*","?","<",">","|", "/", "%","\\",'"', "\""); //包含特殊字符时提示
	for(var i = 0;i < forbidChar.length ; i++)
	{ 
  		if(strInfo.indexOf(forbidChar[i]) >= 0)
		{ 
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("WrongCharTips") + " / \\ : * ? ' \" < > | % ";
			$("#" + tipsId).html(szAreaNameInfo);    
      		return false;
	  	} 
	} 
	if($.lengthw(strInfo) > 255)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("DevFileNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");    
	return true;
}
/*************************************************
  Function:    	CheckDNSIPadd
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckDNSIPadd(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheackStringLenthNull
  Description:	检查设备号是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
				iLen:长度
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheackStringLenthNull(strInfo,tipsId,szName,iLen)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if($.isEmpty(strInfo))//为空时提示     
	{
		szTipsInfo += getNodeValue(szName) + getNodeValue("NullTips");
		$("#" + tipsId).html(szTipsInfo);    
		return false;
	}
	if(strInfo != "")
	{
		if($.lengthw(strInfo) > iLen)
		{
			//szTipsInfo += szName + "长度不超过" + iLen  +"！";
			szTipsInfo += getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
			$("#" + tipsId).html(szTipsInfo); 
			return false;
		}
	}	
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckFilePathStrLen
  Description:	检查NFS配置文件路径长度是否合法
  Input:        szFilePath:文件路径
  				tipsID:显示提示信息ID
				szName:标题
				iDiskNo:虚拟磁盘号
				iLen:长度
  Output:      	无
  Return:		true:合法；false:非法
*************************************************/
function CheckFilePathStrLen(szFilePath, tipsID, szName, iDiskNo, iLen)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsID).html("");},5000);  //5秒后自动清除
	if(szFilePath == "")
	{
		szTipsInfo += getNodeValue("laDiskNumer") + iDiskNo + getNodeValue(szName) + getNodeValue("NullTips");
		$("#" + tipsID).html(szTipsInfo); 
		return false;
	}
	
	if($.lengthw(szFilePath) > iLen)
	{
		szTipsInfo += getNodeValue("laDiskNumer") + iDiskNo + getNodeValue(szName) + getNodeValue("LengthTips") + iLen;
		$("#" + tipsID).html(szTipsInfo); 
		return false;
	}
	
	$("#" + tipsID).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckUserNamePlus
  Description:	检查用户名是否合法
  Input:        strInfo:传入的参数
  				tipsId:提示信息ID
				iNull:是否可以为空
				szName:提示名词
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckUserNamePlus(strInfo,tipsId,szName,iNull)
{
	var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(iNull == 0)
	{
		if($.isEmpty(strInfo))//为空时提示     
		{
			szAreaNameInfo += getNodeValue(szName) + getNodeValue("NullTips");
			$("#" + tipsId).html(szAreaNameInfo);    
			return false;
		}
	}
	var usern = /^[a-zA-Z0-9_]{1,}$/; 	
	if (!strInfo.match(usern))
    {
		szAreaNameInfo += getNodeValue("UserNameCharTips");
		$("#" + tipsId).html(szAreaNameInfo); 
		return false;
    }
	if($.lengthw(strInfo) > 16)
	{
		szAreaNameInfo += getNodeValue(szName) + getNodeValue("UserNameLengthTips");
		$("#" + tipsId).html(szAreaNameInfo);    
		return false;
	}
	$("#" + tipsId).html("");   
	return true;
}
/*************************************************
  Function:    	CheckIPV6add
  Description:	检查是否有效的IPV6地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPV6add(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIPv6(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckIPAddress
  Description:	检查是否有效的D类IPV4或者IPV6地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckIPAddress(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIPv6(strInfo) == false &&　($.isIpAddress(strInfo) == false || $.isDIpAddress(strInfo) == false))
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}
/*************************************************
  Function:    	CheckMulticastIP
  Description:	检查是否多播地址
  Input:        strInfo:传入的参数
  				tipsId:提示信息
				szName:标题
  Output:      	无
  Return:		bool:true false
*************************************************/
function CheckMulticastIP(strInfo,tipsId,szName)
{
	var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
	setTimeout(function(){$("#" + tipsId).html("");},5000);  //5秒后自动清除
	if(strInfo == "")
	{
		szTipsInfo += getNodeValue("InputTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}	
	if($.isIpAddress(strInfo) == false)
	{
		szTipsInfo += getNodeValue("WrongTips") + getNodeValue(szName);
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	if($.isMulticastIP(strInfo) == false)
	{
		szTipsInfo += getNodeValue("jsMulticastRange");
		$("#" + tipsId).html(szTipsInfo); 
		return false;
	}
	$("#" + tipsId).html(""); 
	return true;
}