/*************************************************
Function:		RecordCoverInitDay
Description:	添加通道名称
Input:			无			
Output:			无
return:			无				
*************************************************/
function RecordCoverInitDay()
{
	var szInfo = getNodeValue('laPlugin');
	if(!checkPlugin('1', szInfo, 1, 'privacymask'))
	{
		return;
	}
	
	if(!CompareFileVersion())
	{
		UpdateTips();
	}
	ia(DeviceInfo).queryChannelInfo(); //用于获取视频制式
	m_iPicinform = 1;
	setTimeout(function() {
		if (HWP.Play() !== 0) {
			alert(getNodeValue("previewfailed"));
		}
	}, 10);
	GetCoverInfo();
}
/*************************************************
Function:		GetCoverInfo	
Description:	设置硬盘录像机的通道视频遮盖参数信息
Input:			无
Output:			无	
Return:			无
*************************************************/
function GetCoverInfo()
{
	$.ajax({
		type: "get",
		url: m_lHttp + m_szHostName + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/" + m_iPicinform + "/privacyMask",
		beforeSend: function(xhr) 
		{
			xhr.setRequestHeader("If-Modified-Since", "0");  
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		success: function(xmlDoc, textStatus, xhr) 
		{
			if ("true" == $(xmlDoc).find('enabled').eq(0).text())
			{
				 $("#IsUseCover").prop("checked",true);
			}
			else
			{
				 $("#IsUseCover").prop("checked",false);
			}			
			
			//设置遮盖区域
			m_szCoverXmlStr = xhr.responseText.replace(/\n/g,'');
			HWP.SetRegionInfo(TransDevToOcxRegion(m_szCoverXmlStr, "videoshelter"));
		},
		error: function(xhr, textStatus, errorThrown)
		{
			if (xhr.status == 403)
			{
				HWP.ClearRegion();//清除所画区域
				$("input",document).each(function(i)
				{
					$(this).prop("disabled", true);										   
				});
				alert(m_szError77);
				$("#SaveConfigBtn").prop('disabled',true); //保存按钮为不可用状态
				return;
			}
			else
			{
				alert(m_szError400);   
				return;
			}
		}
	});
}

/*************************************************
Function:		SaveCoverInfo	
Description:	设置硬盘录像机的通道视频遮盖参数信息
Input:			lChannelNum 对应通道号
				lpMotionCfgXML 以XML形式记录硬盘录像机通道移动侦测参数信息的一个字符串。
Output:			无	
Return:			无
*************************************************/
function SaveCoverInfo()
{		
	if($("#CoverStartMapbutton").html() == getNodeValue('CoverStopMapbuttonTips'))
	{
		HWP.SetDrawStatus(false);
		$("#CoverStartMapbutton").html(getNodeValue('CoverStartMapbutton'));
	}
	DeleteCoverInfo();
	m_szAreaXmlInfo = HWP.GetRegionInfo();
	if($("#IsUseCover").prop("checked"))		//是否启用遮挡
	{
		var strIsUseCover = "true";
	}
	else
	{
		var strIsUseCover = "false";
	}
	//获取移动侦测区域
	var xmlDoc = TransOcxToDevRegion(m_szCoverXmlStr, m_szAreaXmlInfo, 'videoshelter');
	$(xmlDoc).find('enabled').eq(0).text(strIsUseCover);
	if($(xmlDoc).find('videoFormat').length > 0)
	{
	    $(xmlDoc).find('videoFormat').eq(0).remove();
	}
    
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/" + m_iPicinform + "/privacyMask";
	$.ajax(
	{
		type: "PUT",
		url: szURL,
		data:xmlDoc,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		},
		complete: function(xhr,textStatus) {
			SaveState(xhr);
		}
	});
}
/*************************************************
Function:		DeleteCoverInfo
Description:	删除遮挡区域
Input:			无			
Output:			无
return:			无				
*************************************************/
function DeleteCoverInfo()
{
	var szURL = m_lHttp + m_strIp + ":" + m_lHttpPort + "/PSIA/System/Video/inputs/channels/" + m_iPicinform + "/privacyMask/regions";
	$.ajax(
	{
		type: "DELETE",
		url: szURL,
		async:false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("If-Modified-Since", "0");
			xhr.setRequestHeader("Authorization", "Basic " + m_szUserPwdValue);
		}
	});
}

function EnableVideoLost()
{
	if($("#IsUseVideoLost").prop("checked"))
	{
		$("#ScheduleEditBtn").prop("disabled",false);
	}
	else
	{
		$("#ScheduleEditBtn").prop("disabled",true);
	}
}
