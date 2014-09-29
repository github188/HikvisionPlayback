/*************************************************
继承，未完成，wuyang
*************************************************/
function User() {
	SingletonInheritor.implement(this);
	this.m_szPermissionInfo = null;
	this.m_iView = 0; //是否普通用户进入 0不是 1是
	this.szUserSetRetInfo = '';
	this.m_oUserXml = null;
}
SingletonInheritor.declare(User);
pr(User).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").hide();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Security", "User"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	this.initUserPage();
	if($.browser.msie && parseInt($.browser.version, 10) == 6) {
		$("#selIPFilterType").hide();
		$("#selEnableAnonymous").hide();
	}
}

function RTSPAuth() {
	SingletonInheritor.implement(this);
	this.g_oRTSPXml = null;
}
SingletonInheritor.declare(RTSPAuth);
pr(RTSPAuth).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Security", "RTSPAuth"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	this.initRTSPAuth();
	if($.browser.msie && parseInt($.browser.version, 10) == 6) {
		$("#selIPFilterType").hide();
		$("#selEnableAnonymous").hide();
	}
}
//匿名访问
function AnonymousVisit() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(AnonymousVisit);
pr(AnonymousVisit).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Security"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	this.initAnonymousVisit();
	if($.browser.msie && parseInt($.browser.version, 10) == 6) {
		$("#selIPFilterType").hide();
		$("#selEnableAnonymous").show();
	}
}
//IP地址过滤
function IPFilter(){
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(IPFilter);
pr(IPFilter).update = function() {
	$('#SetResultTips').html('');
	$("#SaveConfigBtn").show();
	g_transStack.clear();
	var that = this;
	g_transStack.push(function() {
		that.setLxd(parent.translator.getLanguageXmlDoc(["Security", "IPFilter"]));
		parent.translator.appendLanguageXmlDoc(that.getLxd(), g_lxdParamConfig);
		parent.translator.translatePage(that.getLxd(), document);
	}, true);
	this.initIPFilter();
	if($.browser.msie && parseInt($.browser.version, 10) == 6) {
		$("#selIPFilterType").show();
		$("#selEnableAnonymous").hide();
	}
}
/*************************************************
Function:		initUserPage
Description:	用户页面初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
User.prototype.initUserPage = function()
{
	try
	{
	    var iLen = document.getElementById("UserTableList").rows.length;
	}
	catch(e)
	{
	    var iLen = 0;	
	}
	for(var i =1; i < iLen; i++)
	{
		document.getElementById("UserTableList").deleteRow(1);
	}
    this.HttpGetUserInfo();
}
/*************************************************
Function:		HttpGetUserInfo
Description:	获取用户结构
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.HttpGetUserInfo = function()
{
	var that = this;
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Security/AAA/users",
		async: true,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
		    that.m_oUserXml = xmlDoc;
			that.GetUserPermissionAll(0);
			that.SearchUserNo();
			autoResizeIframe();
		},
		error: function(xhr, textStatus, errorThrown)
		{
		   alert(m_szError400);
		   return;
		}
	});	
}
/*************************************************
Function:		SearchUserNo
Description:	获取硬盘录像机的用户号
Input:			无
Output:			无
Return:			无
*************************************************/
User.prototype.SearchUserNo = function()
{
	m_iHaveUser = 0;
	m_iSelectUser = -1;

	var xmlDoc = this.m_oUserXml;
	m_iHaveUser = $(xmlDoc).find("User").length;

	for(var i = 0; i < m_iHaveUser; i ++)
	{
		m_szIPCUserInfo[i][0] = $(xmlDoc).find('id').eq(i).text();
		m_szIPCUserInfo[i][1] = $(xmlDoc).find('userName').eq(i).text();
		m_szIPCUserInfo[i][2] = oCheckPassword.m_szDefaultPassword;
		m_szIPCUserInfo[i][4] = "0.0.0.0"; 
		if($(xmlDoc).find('User').eq(i).find('Extensions').length > 0)
		{
			if($(xmlDoc).find('User').eq(i).find('Extensions').eq(0).find('ipAddress').length > 0)
			{
				m_szIPCUserInfo[i][4] = $(xmlDoc).find('User').eq(i).find('ipAddress').eq(0).text();
			}
			else
			{
				m_szIPCUserInfo[i][4] = "0.0.0.0"; //ip地址绑定
			}
		}
		if(m_strUserName == "admin")
		{
			this.InsertUserList((i+1), m_szIPCUserInfo[i][1],m_szIPCUserInfo[i][3],m_szIPCUserInfo[i][4]);
		}
		else if(m_szIPCUserInfo[i][1] == m_strUserName)
		{
			m_iSelectUser = i;
			this.m_iView = 1;
		}
	}
	if(this.m_iView == 1)
	{
		this.ModifyUserInfo();
		return;
	}

	if(m_iHaveUser == m_iMaxUser) //用户总数达到上限后添加按钮不可用
	{
		$("#AddDigitalIpBtn").prop("disabled", true);
	}
	else
	{
		$("#AddDigitalIpBtn").prop("disabled", false);
	}
}
/*************************************************
Function:		GetUserPermissionAll
Description:	获取所有用户的权限
Input:			iType: 0 对用户类型赋值 1 不对用户类型赋值
Output:			无
return:			无
*************************************************/
User.prototype.GetUserPermissionAll = function(iType)
{
	var that = this;
	$.ajax({
		type: "GET",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UserPermission",
		async: false,
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			that.m_szPermissionInfo = xmlDoc;

			if(iType == 0)
			{
			    for(var i = 0 ; i < $(xmlDoc).find('userType').length; i++)
			    {
				    m_szIPCUserInfo[i][3] = $(xmlDoc).find('userType').eq(i).text();
			    }
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
Function:		GetUserInfo
Description:	获取硬盘录像机的用户参数信息
Input:			无
Output:			无
Return:			无
*************************************************/
User.prototype.GetUserInfo = function()
{
	$("#UserNameKing").val(m_szIPCUserInfo[m_iSelectUser][1]);
	$("#UserPsw").val(m_szIPCUserInfo[m_iSelectUser][2]);
	$("#UserPswConfirm").val(m_szIPCUserInfo[m_iSelectUser][2]);
	if(m_szIPCUserInfo[m_iSelectUser][3] != '')
	{
		$("#Priority").val(m_szIPCUserInfo[m_iSelectUser][3]);
	}
	/*$("#UserIP").val(m_szIPCUserInfo[m_iSelectUser][4]);*/
	if($("#UserNameKing").val() != 'admin')
	{
		document.getElementById('Priority').remove(0);
	}

	var xmlDoc = this.m_szPermissionInfo;
	var remotePermission = null;
	if(xmlDoc != null)
	{
		remotePermission = $(xmlDoc).find('UserPermission').eq(m_iSelectUser).find('remotePermission').eq(0);

		if($(remotePermission).find('preview').eq(0).text() == 'true')
		{
			$("#RemotePreview").prop("checked",true);
		}
		else
		{
			$("#RemotePreview").prop("checked",false);
		}
		if($(remotePermission).find('ptzControl').eq(0).text() == 'true')
		{
			$("#RemotePTZControl").prop("checked",true);
		}
		else
		{
			$("#RemotePTZControl").prop("checked",false);
		}
		if($(remotePermission).find('record').eq(0).text() == 'true')
		{
			$("#RemoteManualRecord").prop("checked",true);
		}
		else
		{
			$("#RemoteManualRecord").prop("checked",false);
		}
		if($(remotePermission).find('playBack').eq(0).text() == 'true')
		{
			$("#RemotePlayback").prop("checked",true);
		}
		else
		{
			$("#RemotePlayback").prop("checked",false);
		}

		if($(remotePermission).find('parameterConfig').eq(0).text() == 'true')
		{
			$("#RemoteSetParam").prop("checked",true);
		}
		else
		{
			$("#RemoteSetParam").prop("checked",false);
		}
		if($(remotePermission).find('restartOrShutdown').eq(0).text() == 'true')
		{
			$("#RemoteReboot").prop("checked",true);
		}
		else
		{
			$("#RemoteReboot").prop("checked",false);
		}
		if($(remotePermission).find('upgrade').eq(0).text() == 'true')
		{
			$("#RemoteUpgrade").prop("checked",true);
		}
		else
		{
			$("#RemoteUpgrade").prop("checked",false);
		}
		if($(remotePermission).find('logOrStateCheck').eq(0).text() == 'true')
		{
			$("#RemoteLog").prop("checked",true);
		}
		else
		{
			$("#RemoteLog").prop("checked",false);
		}
		if($(remotePermission).find('voiceTalk').eq(0).text() == 'true')
		{
			$("#RemoteTalk").prop("checked",true);
		}
		else
		{
			$("#RemoteTalk").prop("checked",false);
		}
		try
		{
			if($(remotePermission).find('transParentChannel').eq(0).text() == 'true')
			{
				$("#RemoteRS").prop("checked",true);
			}
			else
			{
				$("#RemoteRS").prop("checked",false);
			}
		}
		catch(oError)
		{
			if($(remotePermission).find('transparentChannel').eq(0).text() == 'true')
			{
				$("#RemoteRS").prop("checked",true);
			}
			else
			{
				$("#RemoteRS").prop("checked",false);
			}
		}
		try
		{
			if($(remotePermission).find('contorlLocalOut').eq(0).text() == 'true')
			{
				$("#RemoteCtrl").prop("checked",true);
			}
			else
			{
				$("#RemoteCtrl").prop("checked",false);
			}
		}
		catch(oError)
		{
			$("#RemoteCtrl").prop("checked",false);
		}
		if($(remotePermission).find('alarmOutOrUpload').eq(0).text() == 'true')
		{
			$("#RemoteAlarm").prop("checked",true);
		}
		else
		{
			$("#RemoteAlarm").prop("checked",false);
		}
	}
	if(m_szIPCUserInfo[m_iSelectUser][1] == "admin" || m_strUserName != "admin" || m_iOperatUserList != 0)
	{
		$("#UserNameKing").prop("disabled", true);
		$("#Priority").prop("disabled", true);
		$("input[type='checkbox']").prop("disabled", true);
	}
	else
	{
		$("#UserNameKing").prop("disabled", false);
		$("#Priority").prop("disabled", false);
		$("input[type='checkbox']").prop("disabled", false);
		if(window.parent.g_bIsIPDome)
		{
			if("viewer" == m_szIPCUserInfo[m_iSelectUser][3])
			{
				$("#taUserPermission").find(":checkbox").prop("disabled",true);
				$("#RemotePreview").prop("disabled",false);
				$("#RemotePlayback").prop("disabled",false);
				$("#RemoteLog").prop("disabled",false);
			}
		}
	}	
}
/*************************************************
Function:		GobackSearchUserNo
Description:	返回获取硬盘录像机的用户号
Input:			无
Output:			无
Return:			无
*************************************************/
User.prototype.GobackSearchUserNo = function()
{
	try
	{
	    var num = document.getElementById("UserTableList").rows.length;
	}
	catch(e)
	{
	    var num = 0;	
	}
	for(var i = 1; i < num; i++)
	{
		document.getElementById("UserTableList").deleteRow(1);
	}
	for(i = 0; i < m_iHaveUser; i ++)
	{
		this.InsertUserList((i+1), m_szIPCUserInfo[i][1],m_szIPCUserInfo[i][3],m_szIPCUserInfo[i][4]);
	}

	if(m_iSelectUser >= 0)
	{
		var iSel = m_iSelectUser + 1;
		$("#usertdA" + iSel).css({ color: "#ffffff", background: "#2882E2" });
		$("#usertdB" + iSel).css({ color: "#ffffff", background: "#2882E2" });
		$("#usertdC" + iSel).css({ color: "#ffffff", background: "#2882E2" });

		if(m_szIPCUserInfo[m_iSelectUser][1] == "admin")
		{
			$("#DelUserBtn").prop("disabled", true);
		}
		else
		{
			$("#DelUserBtn").prop("disabled", false);
		}
		$("#ModifyUserBtn").prop("disabled", false);
	}
	if(m_iHaveUser == m_iMaxUser) //用户总数达到上限后添加按钮不可用
	{
		$("#AddDigitalIpBtn").prop("disabled", true);
	}
	else
	{
		$("#AddDigitalIpBtn").prop("disabled", false);
	}
	parent.translator.translatePage(pr(SingletonInheritor.base).getLxd(), document);
}
/*************************************************
Function:		InsertUserList
Description:	插入文件条目信息到List中
Input:			a : 用户号
                b : 用户名
				c : 权限等级
				d : IP地址绑定
Output:			无
return:			无
*************************************************/
User.prototype.InsertUserList = function(a,b,c,d)
{
   var ObjTr;
   var ObjTd;
   ObjTr = document.getElementById("UserTableList").insertRow(document.getElementById("UserTableList").rows.length);
   ObjTr.style.height = 22 + 'px';
   ObjTr.style.cursor = "pointer";
   for(j = 0;j < document.getElementById("UserTableList").rows[0].cells.length;j++)
   {
		ObjTd = ObjTr.insertCell(j);
		$(ObjTd).css({border:"1px solid #d7d7d7",background:"#ffffff",padding:"0 0 0 5px"});
		switch(j)
		{
	    	case 0:
		    	ObjTd.innerHTML = a;
			   	ObjTd.id = "usertdA"+ a;
				ObjTd.style.color = "#39414A";
			   	break;
		  	case 1:
		       	ObjTd.innerHTML = b.replace(/\&/g, "&amp;");
			  	ObjTd.id = "usertdB"+ a;
				ObjTd.style.color = "#39414A";
			  	break;
		  	case 2:
		  		if(c == "admin")
				{
				    ObjTd.innerHTML = "<label name='PriorityOpt1' id='PriorityOpt1'>" + getNodeValue("PriorityOpt1") + "</label>";
				}
				else if(c == "operator")
				{
					ObjTd.innerHTML = "<label name='PriorityOpt2' id='PriorityOpt2'>" + getNodeValue("PriorityOpt2") + "</label>";
				}
				else
				{
					ObjTd.innerHTML = "<label name='PriorityOpt3' id='PriorityOpt3'>" + getNodeValue("PriorityOpt3") + "</label>";
				}
			   	ObjTd.id = "usertdC"+ a;
				ObjTd.style.color = "#39414A";
			   	break;
			case 3:
		  		ObjTd.innerHTML = d;
			   	ObjTd.id = "usertdD"+ a;
				ObjTd.style.color = "#39414A";
			   	break;
			default:
				break;
	   }
    }
}
/*************************************************
Function:		SelectUserTd
Description:	选中某个用户
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.SelectUserTd = function(event)
{
   event = event?event:(window.event?window.event:null);
   var ObjTable = event.srcElement?event.srcElement:event.target;
   if(ObjTable.tagName == "TD")
   {
      while(ObjTable.tagName != "TR")
	  {
		  ObjTable = ObjTable.parentNode;
	  }
      ObjParent = ObjTable.parentNode;
      var m_iSelFileIndex = ObjTable.rowIndex - 1;
      if(m_iSelFileIndex == -1)
      {
	      return;
      }
	  while(ObjParent.tagName!="TABLE")
	  {
	      ObjParent = ObjParent.parentNode;
		  if(m_iSelectUser >=  0)
		  {
			  $("#usertdA" + (m_iSelectUser + 1)).css({ color: "#39414A", background: "#ffffff" });
		      $("#usertdB" + (m_iSelectUser + 1)).css({ color: "#39414A", background: "#ffffff" });
		      $("#usertdC" + (m_iSelectUser + 1)).css({ color: "#39414A", background: "#ffffff" });
		   }

		   for(var i = 1;i < ObjParent.rows.length;i ++)
		   {
			    if(ObjTable.rowIndex == i)
				{
					$("#usertdA" + i).css({ color: "#ffffff", background: "#316ac5" });
		            $("#usertdB" + i).css({ color: "#ffffff", background: "#316ac5" });
		            $("#usertdC" + i).css({ color: "#ffffff", background: "#316ac5" });
					
					m_iSelectUser = i - 1;
					document.getElementById("ModifyUserBtn").disabled = 0;  //选择用户后修改按钮可用
					if(m_szIPCUserInfo[m_iSelectUser][1] != "admin" && m_strUserName == "admin")
					{
						$("#DelUserBtn").prop("disabled", false);  //选择用户后删除按钮可用
					}
					else
					{
						$("#DelUserBtn").prop("disabled", true);
					}
				}
			}
	    }
    }
}
/*************************************************
Function:		ModifyUserInfo
Description:	根据用户号修改相关显示信息
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.ModifyUserInfo = function()
{
	this.szUserSetRetInfo = '';
	if(m_iSelectUser == -1)
	{
		return;
	}
	m_iOperatUserList = 0;
	var that = this;
	$.ajax({
		url: "params/userdetail.asp",
		type: "GET",
		dataType:"html",
		error:function() {
			
		},
		success:function(msg) {
			if(that.m_iView == 1)
			{
				$("#UserPage").html(msg);
			}
			else
			{
				$("#UserOperationWnd").html(msg);
				$("#UserOperationWnd").modal();
			}
			parent.translator.translatePage(pr(SingletonInheritor.base).getLxd(), document);
			$("#laUserTitle").html("<label name='laUserModify'>" + getNodeValue('laUserModify') + "</label>");
			if(m_strUserName != "admin")
			{
			    $("#GoBackListBtn").hide();
			}
			that.GetUserInfo();
			oCheckPassword.checkUserName(m_szIPCUserInfo[m_iSelectUser][1], $('#UserPsw'), $('#UserPswConfirm'));
		}
	});
}
/*************************************************
Function:		AddNewUser
Description:	添加新用户
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.AddNewUser = function()
{
	$("#SetResultTips").html("");
	this.szUserSetRetInfo = '';
	m_iOperatUserList = 1;
	var that = this;
	$.ajax({ url: "params/userdetail.asp",
		type: "GET",
		dataType:"html",
		error:function() {
			
		},
		success:function(msg) {
			$("#UserOperationWnd").html(msg);
			$("#UserOperationWnd").modal();
			parent.translator.translatePage(pr(SingletonInheritor.base).getLxd(), document);
			$("#laUserTitle").html("<label name='UserAddTips'>" + getNodeValue('UserAddTips') + "</label>");
			document.getElementById('Priority').remove(0);
			that.ChangeUserTypePriority("operator");
			oCheckPassword.checkUserName("", $('#UserPsw'), $('#UserPswConfirm'));
		}
	});
}
/*************************************************
Function:		GoBackUserList
Description:	返回到用户列表
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.GoBackUserList =function()
{
	var that = this;
	$.ajax({
		url: "params/userlist.asp",
		type: "GET",
		dataType:"html",
		error:function() {
			
		},
		success:function(msg) {
			$.modal.impl.close();
			$("#UserPage").html(msg);
			m_iOperatUserList = -2;
			if(m_strUserName == "admin")
			{
				that.GobackSearchUserNo();
			}
			parent.translator.translatePage(pr(SingletonInheritor.base).getLxd(), document);
			$("#SetResultTips").html(that.szUserSetRetInfo);
		}
	});
}
/*************************************************
Function:		DelUserInfo
Description:	删除用户
Input:			无
Output:			无
return:			无
*************************************************/
User.prototype.DelUserInfo = function()
{
	this.szUserSetRetInfo = '';
	if(m_iSelectUser == -1)
	{
		return;
	}
	m_iOperatUserList = -1;
	Warning =confirm(m_szAsk1);
	if(Warning)
	{
		this.SaveDelUserInfo();
	}
}
/*************************************************
Function:		SaveUserInfo
Description:	设置硬盘录像机的用户参数信息
Input:			lUserIndex	对应用户号
				lpUserCfgXML 以XML形式记录硬盘录像机用户参数信息的一个字符串。
Output:			无
Return:			-1 -- 失败，0 -- 成功， 1 -- 成功并需要重启设备。
*************************************************/
User.prototype.SaveUserInfo =function()
{
	var UserNameKing = $.rtrim($.ltrim($("#UserNameKing").val()));
	$("#UserNameKing").val(UserNameKing);

	if(!CheckDevUserName(UserNameKing,"CheckResultTips",'geUserName',0))
	{
		return -1;
	}
	if($('#UserPsw').val().length == 0)
	{
		var szPasswordInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		szPasswordInfo += getNodeValue("gePassword") + getNodeValue("NullTips");
		$("#CheckResultTips").html(szPasswordInfo);    
		return -1;
	}	
	for(var i = 0; i < m_iHaveUser; i ++)
	{
		if(m_iOperatUserList == 1)
		{
			if(m_szIPCUserInfo[i][1] == UserNameKing)
			{
			  var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			  szAreaNameInfo += getNodeValue('UserExistTips');
			  $("#CheckResultTips").html(szAreaNameInfo);
			  return -1;
			}
		}
		else
		{
			if(m_szIPCUserInfo[i][1] == UserNameKing && i != m_iSelectUser)
			{
			  var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			  szAreaNameInfo += getNodeValue('UserExistTips');
			  $("#CheckResultTips").html(szAreaNameInfo);
			  return -1;
			}
		}
	}

	var UserPsw = $("#UserPsw").val();
	if(!CheckDevUserName(UserPsw,"CheckResultTips",'gePassword',1))
	{
		return -1;
	}
	if($('#UserPsw').val() != $('#UserPswConfirm').val() )
	{
		var szAreaNameInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		szAreaNameInfo += getNodeValue('jsPasswordDifferenceTips');
		$('#CheckResultTips').html(szAreaNameInfo);
		return -1;
	}	

	var XmlDoc = new createxmlDoc();
	var Instruction = XmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	XmlDoc.appendChild(Instruction);

	if(m_iOperatUserList == 0)
	{
		var Root = XmlDoc.createElement("UserList");
		var szUserInfo = new Array();

		for(var j = 0;j < m_iHaveUser;j ++)
		{
			szUserInfo[j] = XmlDoc.createElement("User");

			Element = XmlDoc.createElement("id");
			text = XmlDoc.createTextNode(m_szIPCUserInfo[j][0]);
			Element.appendChild(text);
			szUserInfo[j].appendChild(Element);

			Element = XmlDoc.createElement("userName");

			if(j == m_iSelectUser)
			{
				text = XmlDoc.createTextNode(UserNameKing);
			}
			else
			{
				text = XmlDoc.createTextNode(m_szIPCUserInfo[j][1]);
			}
			Element.appendChild(text);
			szUserInfo[j].appendChild(Element);

			if(j == m_iSelectUser && $("#UserPsw").val() != oCheckPassword.m_szDefaultPassword)
			{
				Element = XmlDoc.createElement("password");
				if(m_szIPCUserInfo[j][1] == m_strUserName)
				{
					m_strPassword = $("#UserPsw").val();
				}
				text = XmlDoc.createTextNode($("#UserPsw").val());
				Element.appendChild(text);
				szUserInfo[j].appendChild(Element);
			}
			
			/*Extensions = XmlDoc.createElement("Extensions");
			Element = XmlDoc.createElement("bondIp");
			ipAddress = XmlDoc.createElement("ipAddress");
			if(j == m_iSelectUser)
			{
				if($("#UserIP").val() == '')
				{
					text = XmlDoc.createTextNode('0.0.0.0');
				}
				else
				{
					text = XmlDoc.createTextNode($("#UserIP").val());
				}
			}
			else
			{
				text = XmlDoc.createTextNode(m_szIPCUserInfo[j][4]);
			}
			ipAddress.appendChild(text);
			Element.appendChild(ipAddress);
			Extensions.appendChild(Element);
			szUserInfo[j].appendChild(Extensions);*/
			
			Root.appendChild(szUserInfo[j]);
		}
		XmlDoc.appendChild(Root);
	}
	else if(m_iOperatUserList > 0)
	{
		m_iSelectUser = m_iHaveUser;
		m_iHaveUser ++;
		m_szIPCUserInfo[m_iSelectUser][3] = 0;

		szUserInfo = XmlDoc.createElement("User");

		Element = XmlDoc.createElement("id");
		text = XmlDoc.createTextNode(m_iHaveUser);
		Element.appendChild(text);
		szUserInfo.appendChild(Element);

		Element = XmlDoc.createElement("userName");
		text = XmlDoc.createTextNode(UserNameKing);
		Element.appendChild(text);
		szUserInfo.appendChild(Element);

		Element = XmlDoc.createElement("password");
		text = XmlDoc.createTextNode($('#UserPsw').val());
		Element.appendChild(text);
		szUserInfo.appendChild(Element);

		/*Extensions = XmlDoc.createElement("Extensions");
		Element = XmlDoc.createElement("bondIp");
		ipAddress = XmlDoc.createElement("ipAddress");
		if($("#UserIP").val() == '')
		{
			text = XmlDoc.createTextNode('0.0.0.0');
		}
		else
		{
			text = XmlDoc.createTextNode($("#UserIP").val());
		}
		ipAddress.appendChild(text);
		Element.appendChild(ipAddress);
		
		Extensions.appendChild(Element);
		szUserInfo.appendChild(Extensions);*/
		
		XmlDoc.appendChild(szUserInfo);
	}
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Security/AAA/users";
	var that = this;	
	$.ajax(
	{
		type: m_iOperatUserList>0?"POST":"PUT",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: szURL,
		processData: false,
		data: XmlDoc,
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("OK" == $(xmlDoc).find('statusString').eq(0).text())
			{
				szRetInfo = m_szSuccessState + m_szSuccess1;
				if(m_iOperatUserList > 0)
				{
					m_szIPCUserInfo[m_iSelectUser][0] = $(xmlDoc).find('id').eq(0).text();
				}
				m_szIPCUserInfo[m_iSelectUser][1] = $("#UserNameKing").val();
				m_szIPCUserInfo[m_iSelectUser][2] = $("#UserPsw").val();
				/*m_szIPCUserInfo[m_iSelectUser][4] = $("#UserIP").val();*/
				m_szUserPwdValue = Base64.encode(m_strUserName + ":" + m_strPassword);
				$.cookie('userInfo'+m_lHttpPort,m_szUserPwdValue);
				if(m_strUserName == "admin")
				{
					that.SetUserPermission();
					return;
				}
				else
				{
					$("#SetResultTips").html(szRetInfo);
					setTimeout(function(){$("#SetResultTips").html("");}, 5000);
				}
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
			    szRetInfo = m_szErrorState + m_szError8;
			    $("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");}, 5000);
			}
			else
		    {
			    SaveState(xhr)
		    }
		}
	});	
}
/*************************************************
Function:		SaveDelUserInfo
Description:	删除用户
Input:			无
Output:			无
Return:			-1 -- 失败，0 -- 成功， 1 -- 成功并需要重启设备。
*************************************************/
User.prototype.SaveDelUserInfo = function()
{
	var that = this;
	$.ajax(
	{
		type: "DELETE",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Security/AAA/users/" + m_szIPCUserInfo[m_iSelectUser][0],
		success: function(xmlDoc, textStatus, xhr) 
		{
			if("OK" == $(xmlDoc).find('statusString').eq(0).text())
			{
				szRetInfo = m_szSuccessState + m_szSuccess1;
				if(m_iOperatUserList < 0)
				{
					for(var i = m_iSelectUser; i < m_iHaveUser - 1; i ++)
					{
						for(var j = 0; j < 5; j ++)
						{
							m_szIPCUserInfo[i][j] = m_szIPCUserInfo[i + 1][j];
						}
					}
					m_iSelectUser = -1;
					m_iHaveUser --;
				}
				that.GobackSearchUserNo();
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
		    if(xhr.status == 403)
		    {
			    szRetInfo = m_szErrorState + m_szError8;
		    }
		}
	});	
}
/*************************************************
Function:		SetUserPermission
Description:	设置用户权限
Input:			无
Output:			无
Return:			-1 -- 失败，0 -- 成功， 1 -- 成功并需要重启设备。
*************************************************/
User.prototype.SetUserPermission = function()
{
	PermissionXmlDoc = new createxmlDoc();
	var Instruction = PermissionXmlDoc.createProcessingInstruction("xml","version='1.0' encoding='utf-8'");
	PermissionXmlDoc.appendChild(Instruction);
	var Root = PermissionXmlDoc.createElement("UserPermission");

	Element = PermissionXmlDoc.createElement("id");
	text = PermissionXmlDoc.createTextNode(m_szIPCUserInfo[m_iSelectUser][0]);
	Element.appendChild(text);
	Root.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("userID");
	text = PermissionXmlDoc.createTextNode(m_szIPCUserInfo[m_iSelectUser][0]);
	Element.appendChild(text);
	Root.appendChild(Element);

	Element = PermissionXmlDoc.createElement("userType");
	text = PermissionXmlDoc.createTextNode($("#Priority").val());
	Element.appendChild(text);
	Root.appendChild(Element);

	remotePermission = PermissionXmlDoc.createElement("remotePermission");
	Element = PermissionXmlDoc.createElement("playBack");
	if($("#RemotePlayback").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("preview");
	if($("#RemotePreview").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("record");
	if($("#RemoteManualRecord").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("ptzControl");
	if($("#RemotePTZControl").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);	

	Element = PermissionXmlDoc.createElement("upgrade");
	if($("#RemoteUpgrade").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);

	Element = PermissionXmlDoc.createElement("parameterConfig");
	if($("#RemoteSetParam").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);

	Element = PermissionXmlDoc.createElement("restartOrShutdown");
	if($("#RemoteReboot").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);

	Element = PermissionXmlDoc.createElement("logOrStateCheck");
	if($("#RemoteLog").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);

	Element = PermissionXmlDoc.createElement("voiceTalk");
	if($("#RemoteTalk").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);

	Element = PermissionXmlDoc.createElement("transParentChannel");
	if($("#RemoteRS").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("contorlLocalOut");
	if($("#RemoteCtrl").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	
	Element = PermissionXmlDoc.createElement("alarmOutOrUpload");
	if($("#RemoteAlarm").prop("checked"))
	{
		text = PermissionXmlDoc.createTextNode('true');
	}
	else
	{
		text = PermissionXmlDoc.createTextNode('false');
	}
	Element.appendChild(text);
	remotePermission.appendChild(Element);
	Root.appendChild(remotePermission);
	PermissionXmlDoc.appendChild(Root);
	
	var that = this;
	$.ajax(
	{
		type: "PUT",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UserPermission/" + m_szIPCUserInfo[m_iSelectUser][0],
		processData: false,
		data: PermissionXmlDoc,
		success: function(xmlDoc, textStatus, xhr) 
		{
			szRetInfo = m_szSuccessState + m_szSuccess1;
			m_szIPCUserInfo[m_iSelectUser][3] = $("#Priority").val();
			
			that.GetUserPermissionAll(1);
			$("#SetResultTips").html(szRetInfo);
			setTimeout(function(){$("#SetResultTips").html("");}, 5000);
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if(xhr.status == 403)
			{
			    szRetInfo = m_szErrorState + m_szError8;
			    $("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");}, 5000);
			}
		},
		complete: function(xhr, textStatus)
		{
		    if(m_strUserName == "admin")
		    {
			    $("#SetResultTips").html(szRetInfo);
				setTimeout(function(){$("#SetResultTips").html("");}, 5000);
			    that.GoBackUserList();
		    }
			that.szUserSetRetInfo = szRetInfo;
		}
	});	
}
/*************************************************需修改（3级权限）
Function:		ChangeUserTypePriority
Description:	更改用户类型后改变默认权限
Input:			iType ：0 普通用户 1操作员		
Output:			无
return:			无				
*************************************************/
User.prototype.ChangeUserTypePriority = function(iType)
{
	//先把checkbox清空
	/*$("#RemoteSetParam").prop("checked",false);
	$("#RemoteLog").prop("checked",false);
	$("#RemoteUpgrade").prop("checked",false);
	$("#RemoteTalk").prop("checked",false);
	$("#RemoteReboot").prop("checked",false);
	$("#RemoteAlarm").prop("checked",false);
	$("#RemoteCtrl").prop("checked",false);
	$("#RemoteRS").prop("checked",false);
	$("#RemotePreview").prop("checked",false);
	$("#RemotePTZControl").prop("checked",false);
	$("#RemoteManualRecord").prop("checked",false);
	$("#RemotePlayback").prop("checked",false);*/
	$("#taUserPermission").find(":checkbox").prop("checked",false).prop("disabled",false);
	
	//二者共有的权限
	$("#RemoteLog").prop("checked",true);
	$("#RemotePlayback").prop("checked",true);
	
	if(iType == "operator")
	{
		$("#RemotePTZControl").prop("checked",true);
	    $("#RemoteManualRecord").prop("checked",true);
	    $("#RemotePreview").prop("checked",true);
	    $("#RemoteTalk").prop("checked",true);
	}
	if(window.parent.g_bIsIPDome)
	{
		if(iType == "viewer"){
			$("#taUserPermission").find(":checkbox").prop("disabled",true);
			$("#RemotePreview").prop("disabled",false);
			$("#RemotePlayback").prop("disabled",false);
			$("#RemoteLog").prop("disabled",false);
		}
	}
}
/*************************************************
Function:		initRTSPAuth
Description:	RTSP认证页面初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
RTSPAuth.prototype.initRTSPAuth = function() {
    this.getRTSPAuthInfo();
}
/*************************************************
Function:		getRTSPAuthInfo
Description:	获取RTSP认证信息
Input:			无		
Output:			无
return:			无				
*************************************************/
RTSPAuth.prototype.getRTSPAuthInfo = function() {
	var that = this;
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			that.g_oRTSPXml = xmlDoc;
			var xmlRoot = $(xmlDoc);
			var szRTSPAuthType = xmlRoot.find("Security").eq(0).find("enabled").eq(0).text();
			$("#selRTSPAuth").val(szRTSPAuthType == ""?"false":szRTSPAuthType);
			autoResizeIframe();
		},
		error: function(xhr, textStatus, errorThrown) {
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}
/*************************************************
Function:		setRTSPAuthInfo
Description:	设置RTSP认证信息
Input:			无		
Output:			无
return:			无				
*************************************************/
RTSPAuth.prototype.setRTSPAuthInfo = function() {
	if(this.g_oRTSPXml == null) {
		return;
	}
	var xmlDoc = this.g_oRTSPXml;
	$(xmlDoc).find("Security").eq(0).find("enabled").eq(0).text($("#selRTSPAuth").val());
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Streaming/channels/101",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SaveState(xhr);	
		}
	});
}
/*************************************************
Function:		initAnonymousVisit
Description:	匿名访问页面初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
AnonymousVisit.prototype.initAnonymousVisit = function() {
    this.getAnonymousVisit();
}
/*************************************************
Function:		getAnonymousVisit
Description:	获取匿名访问信息
Input:			无		
Output:			无
return:			无				
*************************************************/
AnonymousVisit.prototype.getAnonymousVisit = function() {
	$.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UserPermission/anonymouslogin",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			var xmlRoot = $(xmlDoc);
			$("#selEnableAnonymous").val(xmlRoot.find("anonymouslogin").eq(0).find("enabled").eq(0).text());
			autoResizeIframe();
		},
		error: function(xhr, textStatus, errorThrown) {
			//alert(getNodeValue('NetworkErrorTips'));
		}
	});
}
/*************************************************
Function:		setAnonymousVisit
Description:	设置匿名访问信息
Input:			无		
Output:			无
return:			无				
*************************************************/
AnonymousVisit.prototype.setAnonymousVisit = function() {
	var szXml = "<?xml version='1.0' encoding='UTF-8' ?><anonymouslogin><enabled>"+$("#selEnableAnonymous").val()+"</enabled></anonymouslogin>"
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/Custom/SelfExt/UserPermission/anonymouslogin",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SaveState(xhr);	
		},
		success: function() {
			$.cookie("enableAnonymous"+m_lHttpPort,$("#selEnableAnonymous").val());
		}
	});
}
/*************************************************
Function:		initIPFilter
Description:	IP地址页面初始化
Input:			无		
Output:			无
return:			无				
*************************************************/
IPFilter.prototype.initIPFilter = function() {
    $.ajax({
		type: "GET",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ipFilter",
		timeout: 15000,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) {
			$("#divIPAddressFilterList").empty();
			var xmlRoot = $(xmlDoc);
			$("#chEnableIPFilter").prop("checked",xmlRoot.find("enabled").eq(0).text() == "true"?true:false);
			$("#selIPFilterType").val(xmlRoot.find("permissionType").eq(0).text());
			var oIPFilterList = xmlRoot.find("IPFilterAddress");
			var iIPFilterLen = oIPFilterList.length>48?48:oIPFilterList.length;
			if(iIPFilterLen == 48) {
				$("#btnAddIP").prop("disabled", true);
			}
			if(iIPFilterLen <= 0) {
				$("#btnCleanIP").prop("disabled", true);
			}
			for(var i = 0; i < iIPFilterLen; i++){
				insertOneIP(i+1, oIPFilterList.eq(i).find("ipAddress").eq(0).text());
			}
			autoResizeIframe();
		},
		error: function(xhr, textStatus, errorThrown) {
			$("#btnCleanIP").prop("disabled", true);
		}
	});
}
/*************************************************
Function:		saveIPAddressFilter
Description:	保存IP地址过滤
Input:			无
Output:			无
return:			无
*************************************************/
IPFilter.prototype.saveIPAddressFilter = function() {
	var szXml = "<?xml version='1.0' encoding='UTF-8' ?><IPFilter><enabled>"+$("#chEnableIPFilter").prop("checked").toString()+"</enabled><permissionType>"+$("#selIPFilterType").val()+"</permissionType><IPFilterAddressList>";
	$("#divIPAddressFilterList").children("div").each(function(i){
		if(i >= 48) {
			return false;
		}
		szXml += "<IPFilterAddress><id>"+(i+1)+"</id><permissionType>"+$("#selIPFilterType").val()+"</permissionType><addressFilterType>mask</addressFilterType><AddressMask><ipAddress>"+$(this).find(".second").eq(0).html()+"</ipAddress></AddressMask></IPFilterAddress>";
	});
	szXml += "</IPFilterAddressList></IPFilter>";
	var xmlDoc = parseXmlFromStr(szXml);
	$.ajax({
		type: "PUT",
		url: m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Network/interfaces/1/ipFilter",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		processData: false,
		data: xmlDoc,
		complete:function(xhr, textStatus) {
			SaveState(xhr);	
		}
	});
}
/*************************************************
Function:		insertOneIP
Description:	插入一条IP地址
Input:			iNo：序号
                szIP: IP地址
Output:			无
return:			无
*************************************************/
function insertOneIP(iNo, szIP)
{
	var szEnablePrivacy = "";
	var szLaEnablename = ""
	$("<div id="+iNo+"><span class='first'>"+iNo+"</span><span class='second'>"+szIP+"</span></div>").appendTo("#divIPAddressFilterList").bind(
	{
		click:function() {
			if(!$(this).hasClass("select"))
			{
				$(this).siblings(".select").each(function()
				{
					$(this).removeClass("select");
				});
				$(this).attr("class","select");
			}
			$("#btnDeleteIP").prop("disabled", false);
			$("#btnModifyIP").prop("disabled", false);
		},
		mouseover:function() {
			if(!$(this).hasClass("select")) {
				$(this).addClass("enter");
			}
		},
		mouseout:function() {
			$(this).removeClass("enter");
		}
	}).addClass((iNo%2 == 0?"even":"odd")).attr("title",getNodeValue('tipsSelectPrimary'));
	$("#divIPAddressFilterList").scrollTop(1000); //大数值保证滚动条一直在底部
}
/*************************************************
Function:		showAddIPAddressWnd
Description:	显示添加IP窗口
Input:			无
Output:			无
return:			无
*************************************************/
function showAddIPAddressWnd()
{
	$("#spAddIPAddress").html("<label name='laAddIPAddress'>" + getNodeValue('laAddIPAddress') + "</label>");
	$("#divAddIpAddress").modal();
	$("#btnIPFilterOK").unbind().bind("click", function(){
		editIPAddressOK(0);
	});
	$("#inIPAddress").focus();
}
/*************************************************
Function:		editIPAddressOK
Description:	确认编辑IP地址
Input:			iType   0 - 添加
						1 - 修改
Output:			无
return:			无
*************************************************/
function editIPAddressOK(iType)
{
	if(!CheckDIPadd($("#inIPAddress").val(),'spCheckResultTips','laIpAddress')) {
		return;
	}
	if($("#inIPAddress").val() === "0.0.0.0") {
		var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
		szTipsInfo += getNodeValue("DIPAddInvalidTips");
		$("#spCheckResultTips").html(szTipsInfo);
		return;
	}
	if(iType == 0) {
		var iIndex = $("#divIPAddressFilterList").children("div").length;
		insertOneIP(iIndex+1, $("#inIPAddress").val());
		if((iIndex + 1) >= 48) {
			$("#btnAddIP").prop("disabled", true);
		}
		$("#btnCleanIP").prop("disabled", false);
	} else {
		$("#divIPAddressFilterList").find(".select").eq(0).find(".second").eq(0).text($("#inIPAddress").val());
	}
	$.modal.impl.close();
}
/*************************************************
Function:		modifyIPAddress
Description:	修改IP地址
Input:			无
Output:			无
return:			无
*************************************************/
function modifyIPAddress()
{
	$("#spAddIPAddress").html("<label name='laModifyIPAddress'>" + getNodeValue('laModifyIPAddress') + "</label>");
	$("#divAddIpAddress").modal();
	var szVal = $("#divIPAddressFilterList").find(".select").eq(0).find(".second").eq(0).html();
	$("#inIPAddress").focus().val(szVal);
	$("#btnIPFilterOK").unbind().bind("click", function() {
		editIPAddressOK(1);
	});
}
/*************************************************
Function:		deleteIPAddress
Description:	删除一条IP地址
Input:			无
Output:			无
return:			无
*************************************************/
function deleteIPAddress()
{
	var oSelect = $("#divIPAddressFilterList").find(".select");
	if(oSelect.length > 0){
		var iSelectId = parseInt(oSelect.eq(0).attr("id"),10);
		var iLength = $("#divIPAddressFilterList").children("div").length;
		oSelect.remove();
		$("#divIPAddressFilterList").children("div").each(function(i){
			$(this).attr("id",i+1).find(".first").eq(0).html(i+1);
		});
		if(iSelectId <= 1) {
			$("#btnDeleteIP").prop("disabled", true);
			$("#btnModifyIP").prop("disabled", true);
		} else if(iSelectId < iLength) {
			$("#divIPAddressFilterList").children("div").eq(iSelectId-1).click();
		} else {
			$("#divIPAddressFilterList").children("div").last().click();
		}
		if(iLength <= 1) {
			$("#btnCleanIP").prop("disabled", true);
		}
		$("#btnAddIP").prop("disabled", false);
	}
}
/*************************************************
Function:		deleteAllIPAddress
Description:	删除所有IP地址
Input:			无
Output:			无
return:			无
*************************************************/
function deleteAllIPAddress()
{
	$("#divIPAddressFilterList").empty();
	$("#btnDeleteIP").prop("disabled", true);
	$("#btnModifyIP").prop("disabled", true);
	$("#btnAddIP").prop("disabled", false);
	$("#btnCleanIP").prop("disabled", true);
}