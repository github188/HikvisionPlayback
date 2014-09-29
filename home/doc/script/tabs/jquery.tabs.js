/*****************************************************
Copyright 2007-2011 Hikvision Digital Technology Co., Ltd.   
FileName: tabs
Description: 标签页插件
Author: Chenxiangzhen       
Date: 2011.12.13    
*****************************************************/
(function($)
{
	$.fn.tabs = function(paneSelector, opt)
	{
		opt = jQuery.extend(
		{
			tabs : "a",
			current : "current",
			markCurrent : true,
			defaultCur : 0,		// 初始标签页
			beforeLeave : null,	// 标签页切换前被回调
			hideIndexes : null	// 隐藏的标签页
		}, opt);

		var container = this;

		$.extend(this, 
		{
			curTab: opt.defaultCur,
			tabs: $(this).find(opt.tabs),
			panes: $(paneSelector),
			showTab: function(iIndex)
			{
				this.tabs.eq(iIndex).parent().removeClass("hideBorder");
				this.tabs.eq(iIndex).show();
				return this;
			},
			hideTab: function(iIndex)
			{
				if (iIndex == this.curTab)
				{
					this.selectTab(opt.defaultCur);
				}
				this.tabs.eq(iIndex).parent().addClass("hideBorder");
				this.tabs.eq(iIndex).hide();
				return this;
			},
			showTabs: function(iIndexes)
			{
				$.each(iIndexes, function(i, n) {
					container.showTab(n);
				});
				return this;
			},
			hideTabs: function(iIndexes)
			{
				$.each(iIndexes, function(i, n) {
					container.hideTab(n);
				});
				return this;
			},
			selectTab:function(iIndex)
			{
				this.tabs.eq(iIndex).click();
				if(opt.tabs == "a")
				{
					window.location.href = this.tabs[iIndex].href;
				}
				return this;
			}
		});
		
		var bFirst = true;
		this.tabs.each(function(i)
		{
			$(this).unbind("click").bind("click", function(event)
			{
				if (!bFirst && i == container.curTab)
				{
					event.preventDefault();
				}
				if (!bFirst && opt.beforeLeave !== null)
				{
					opt.beforeLeave(container.curTab);
				}
				container.tabs.removeClass(opt.current);
				$(this).addClass(opt.current);
				container.panes.hide();
				container.showTab(i);
				container.panes.eq(i).show();
				container.curTab = i;
				if (opt.markCurrent)
				{
					try
					{
						$.cookie(encodeURIComponent($(container)[0].id) + "_curTab", i);
					}
					catch(e)
					{
					}
				}
			});
		});
		
		if (opt.hideIndexes instanceof Array) {
			$.each(opt.hideIndexes, function(i, n) {
				container.hideTab(n);
			});
		}
		
		//显示上次选中的tab
		if (opt.markCurrent)
		{
			try
			{
				var iCurTab = parseInt($.cookie(encodeURIComponent($(container)[0].id) + "_curTab"));
				if (iCurTab !== Number.NaN)
				{
					if (opt.hideIndexes instanceof Array) {
						if ($.inArray(iCurTab, opt.hideIndexes) != -1) {
							iCurTab = opt.defaultCur;
						}
					}
					this.selectTab(iCurTab);
				}
				else
				{
					this.selectTab(opt.defaultCur);
				}
			}
			catch(e)
			{
				this.selectTab(opt.defaultCur);
			}
		}
		else
		{
			this.selectTab(opt.defaultCur);
		}
		bFirst = false;
		return this;
	};
})(jQuery);