/*****************************************************
Copyright 2007-2011 Hikvision Digital Technology Co., Ltd.   
FileName: Menu
Description: 菜单插件
Author: Chenxiangzhen       
Date: 2011.12.11    
*****************************************************/
(function($)
{
	$.fn.Menu = function(options)
	{
		options = jQuery.extend(
		{
			current : "current",
			collapsed : "collapsed",// 收缩菜单后的效果
			//currentMenu: "currentMenu",
            markCurrent : true,		// 记住当前选中二级菜单，需要jquery.cookie插件支持
            oneSmOnly : true,
            remember : true,		// 记住当前选中一级菜单，需要jquery.cookie插件支持
			defaultCur : "0_0"		// 默认菜单项
        }, options);
		//为该对象添加方法和局部变量
		$.extend(this, 
		{
			oneMenus:$(this).children("div"),
			toggleMenu:function(iIndex)
			{
				if (this.oneMenus.eq(iIndex).hasClass(options.collapsed))
				{
					this.expandMenu(iIndex);
				}
				else
				{
					this.collapseMenu(iIndex);
				}
			},
			expandMenu:function(iIndex) 
			{
				this.oneMenus.eq(iIndex).removeClass(options.collapsed);
				if (options.oneSmOnly) 
				{
					this.collapseOthers(iIndex);
				}
				this.memorize();
			},
			collapseMenu:function(iIndex) 
			{
				this.oneMenus.eq(iIndex).addClass(options.collapsed);
				this.memorize();
			},
			collapseOthers:function(iIndex) 
			{
				this.oneMenus.each(function(i)
				{
					if(i != iIndex && !$(this).hasClass(options.collapsed))
					{
						if(i != 0 && iIndex != 0)//本地配置不互斥
						{
						    $(this).addClass(options.collapsed);
						}
					}
				});
			},
			expandAll:function() 
			{
				this.oneMenus.each(function(i)
				{
					$(this).removeClass(options.collapsed);
				});
			},
			collapseAll:function() 
			{
				this.oneMenus.each(function(i)
				{
					$(this).addClass(options.collapsed);
				});
			},
			memorize:function() 
			{
				if (options.remember) 
				{
					try
					{
						$.cookie();
					}
					catch(e)
					{
						return;
					}
					var states = new Array();
					this.oneMenus.each(function(i)
					{
						states.push($(this).hasClass(options.collapsed) ? 0 : 1);
					});
					$.cookie(encodeURIComponent($(this)[0].id) + "_onemenu", states.join(""));
				}
			},
			focusById:function(szIndex)
			{
				var i = szIndex.split("_")[0];
				this.expandMenu(i);
				var j = szIndex.split("_")[1];
				var active = this.oneMenus.eq(i).children("a").eq(j);
				active.click();
				if(active[0].href != "")
				{
					window.document.location.href = this.oneMenus.eq(i).children("a")[j].href;
				}
			},
			hide:function(szIndex)
			{
				var i = szIndex.split("_")[0];
				var j = szIndex.split("_")[1];
				this.oneMenus.eq(i).children("a").eq(j).hide();
			},
			show:function(szIndex)
			{
				var i = szIndex.split("_")[0];
				var j = szIndex.split("_")[1];
				this.oneMenus.eq(i).children("a").eq(j).show();
			}
		});
		var container = this;   //包含所有菜单项的对象
		
		//一级菜单点击事件
		this.oneMenus.each(function(i)
		{
			$(this).children("span").first().bind("click",function() 
			{
				container.toggleMenu(i);
			});
			$(this).children("a").last().css("borderBottom", "none");
		});
		//为超链接添加click事件
		//var currentMenu = this;
		this.oneMenus.each(function(i)
		{
			$(this).children("a").each(function(j)
			{
				$(this).bind("click", function()
				{
					/*for(p = 0; p < currentMenu.oneMenus.length; p++)
					{
						currentMenu.oneMenus.eq(p).removeClass(options.currentMenu);
					}
					currentMenu.oneMenus.eq(i).addClass(options.currentMenu);*/
					var obj = this;
					$(container).find("a").each(function(i)
					{
						if(obj == this)
						{
							$(this).addClass(options.current);
						}
						else
						{
							$(this).removeClass(options.current);
						}
					});
					if (options.markCurrent) 
					{
						try
						{
							$.cookie(encodeURIComponent($(container)[0].id) + "_twomenu", i+"_"+j);
						}
						catch(e)
						{
						}
					}
				});
			});
		});
		//默认全部收缩
		//this.collapseAll();
		//标记当前选中一级菜单
		if (options.remember) 
		{
			try
			{
				var states = $.cookie(encodeURIComponent($(this)[0].id) + "_onemenu");
				if(states != null)
				{
					states = states.split("");
					for (var i = 0; i < states.length; i++)
					{
						if(states[i] == 0)
						{
							this.oneMenus.eq(i).addClass(options.collapsed);
						}
						else
						{
							this.oneMenus.eq(i).removeClass(options.collapsed);
						}
					}
				}
			}
			catch(e)
			{
				;
			}
		}
		//标记当前选中二级菜单
		if (options.markCurrent) 
		{
			try
			{
				var currentId = $.cookie(encodeURIComponent($(this)[0].id) + "_twomenu");
				if(currentId != null)
				{
					this.focusById(currentId);
				}
				else
				{
					this.focusById(options.defaultCur);
				}
			}
			catch(e)
			{
				;
			}
		}
		return this;
	};
})(jQuery);