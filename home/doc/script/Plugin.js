/*****************************************************
Copyright 2007-2011 Hikvision Digital Technology Co., Ltd.   
FileName: Plugin.js
Description: 插件管理类
Author: wuyang    
Date: 2011.12.27
*****************************************************/

function Plugin(iWndNum, szIP, szHttpPort, szRtspPort) {
	this.iWndNum = iWndNum; // 子窗体个数
	this.iProtocolType = 0; // 取流方式，默认为RTSP
	this.wnds = new Array(this.iWndNum);
	var that = this;
	$.each(this.wnds, function(iWndNo) {
		that.wnds[iWndNo] = {
			isPlaying: false
		};
	});
	this.isPlaying = function() {
		var ret = false;
		$.each(this.wnds, function(iWndNo, wnd) {
			if (wnd.isPlaying) {
				ret = true;
				return false;
			}
		});
		return ret;
	};
	this.destory = function() {
		this.Stop();
		$("#main_plugin").empty();
	};
	this.ArrangeWindow = function(iWndType) {
		try {
			$("#PreviewActiveX")[0].HWP_ArrangeFECWindow(iWndType);
		} catch (e) {}
	}
	this.Play = function(iWndNo) {
		if (arguments.length === 0) {
			iWndNo = 0;
		}
		if (this.wnds[iWndNo].isPlaying) {
			return 0;
		}
		try
		{
			var previewOCX = $("#PreviewActiveX")[0];
			try {
				var szLocalCfg = previewOCX.HWP_GetLocalConfig();
			} catch (e) {
				var szLocalCfg = previewOCX.GetLocalConfig();
			}
			var xmlDoc = parseXmlFromStr(szLocalCfg);
			m_iProtocolType = this.iProtocolType = parseInt(xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue); // 此全局变量暂时保留，wuyang
			var szURL = "rtsp://" + szIP + ":" + ((this.iProtocolType === 4) ? szHttpPort : szRtspPort) + "/PSIA/streaming/channels/" + (101 + iWndNo);
			var iRet = previewOCX.HWP_Play(szURL, m_szUserPwdValue, iWndNo, "", "");
			if (iRet === 0) {
				this.wnds[iWndNo].isPlaying = true;
			}
			return iRet;
		} catch (e) { return -1; }
	};
	this.Stop = function(iWndNo) {
		function Stop(iWndNo) {
			if (!that.wnds[iWndNo].isPlaying) {
				return 0;
			}
			that.wnds[iWndNo].isPlaying = false;
			try {
				return $("#PreviewActiveX")[0].HWP_Stop(iWndNo);
			} catch (e) { return -1; }
		}
		
		if (arguments.length === 0) {
			var iRet = 0;
			$.each(this.wnds, function(iWndNo, wnd) {
				if (Stop(iWndNo) !== 0) {
					iRet = -1;
				}
			});
			return iRet;
		} else {
			return Stop(iWndNo);
		}
	};
	this.SetDrawStatus = function(bStartDraw) {
		try {
			return $("#PreviewActiveX")[0].HWP_SetDrawStatus(bStartDraw);
		} catch (e) { return -1; }
	};
	this.GetRegionInfo = function() {
		try {
			return $("#PreviewActiveX")[0].HWP_GetRegionInfo();
		} catch (e) {
			return "";
		}
	};
	this.SetRegionInfo = function(szRegionInfo) {
		try {
			return $("#PreviewActiveX")[0].HWP_SetRegionInfo(szRegionInfo);
		} catch (e) { return -1; }
	};
	this.ClearRegion = function() {
		try {
			return $("#PreviewActiveX")[0].HWP_ClearRegion();
		} catch (e) { return -1; }
	};
	this.GetTextOverlay = function() {
		try {
			return $("#PreviewActiveX")[0].HWP_GetTextOverlay();
		} catch (e) {
			return "";
		}
	};
	this.SetTextOverlay = function(szTextOverlay) {
		try {
			return $("#PreviewActiveX")[0].HWP_SetTextOverlay(szTextOverlay);
		} catch (e) { return -1; }
	};
	this.SetPlayModeType = function(iPlayMode) {
		try {
			return $("#PreviewActiveX")[0].HWP_SetPlayModeType(iPlayMode);
		} catch (e) { return -1; }
	};
	var bOpenFileBrowsing = false; // 解决Linux下Firefox的非模态
	this.OpenFileBrowser = function(iMode, szReserve) { // iMode: 0-文件夹, 1-文件
		if (bOpenFileBrowsing) {
			return;
		}
		bOpenFileBrowsing = true;
		var szPath = null;
		try {
			szPath = $("#PreviewActiveX")[0].HWP_OpenFileBrowser(iMode, szReserve);
		} catch (e) {}
		setTimeout(function() { bOpenFileBrowsing = false; }, 10); // 解决Linux下Chrome的click记忆
		return szPath;
	};
}