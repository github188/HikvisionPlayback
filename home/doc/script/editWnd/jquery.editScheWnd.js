/*****************************************************
Copyright 2008-2013 Hikvision Digital Technology Co., Ltd.   
FileName: editSchedule
Description: 计划编辑插件
Author: Chenxiangzhen       
Date: 2012.02.27   
*****************************************************/
(function($)
{
	$.fn.editSchedule = function(options)
	{
		options = jQuery.extend(
		{
			outputTimeSec:null,  //输出时间片段信息
			weekNameSet: ["laMonday","laTuesday","laWednesday","laThursday","laFriday","laSaturday","laSunday"],     // 星期
			typeNameSet: ["WholeDayRecordTypeOpt1","aMoveDetection","WholeDayRecordTypeOpt3","WholeDayRecordTypeOpt4","WholeDayRecordTypeOpt5"],  //类型
			typeValueSet: ["CMR","MOTION","ALARM","EDR","ALARMANDMOTION"],      //类型对应的值
			typeColorSet: ["#6577FD","#74B557","#B83F42","#E58805","#B9E2FE"],  //类型对应的颜色
			tableTitlePublic: ["laTimerange", "laStartTime", "laEndTime"], 
			typeTitle: "laWholeDayRecordType", //类型标题的name属性
			typeNumTitle: "trTaskNum",         //类型编号的name属性
			titleName: "laRecordPlanEdit",     //窗口标题的name属性
			timeSecNum: 4,  //时间段个数
			isDisWhole:false, //是否显示全天计划
			disType:1,   //时间编辑区域显示类型
			clickOK: null  //点击确定的回调函数
        }, options);
		//内部使用的时间片段集合
		var oTimeSegmentSet = new Array(options.weekNameSet.length);
		for(var i = 0; i < options.weekNameSet.length; i++)
		{
			oTimeSegmentSet[i] = new Array(options.timeSecNum);
			for(var j = 0; j < options.timeSecNum; j++)
			{
				oTimeSegmentSet[i][j] = new TimeSegment();
			}
		}
		$.extend(this, 
		{
			timeSegmentSet: options.outputTimeSec,  //外部使用的时间片段集合，点击确定后更新外部的全局变量的值
			update: function(timeSegmentSet)
			{
				this.timeSegmentSet = timeSegmentSet;
				oTimeSegmentSet.length = 0;
				oTimeSegmentSet = new Array(options.weekNameSet.length);
				for(var i = 0; i < options.weekNameSet.length; i++)
				{
					oTimeSegmentSet[i] = new Array(options.timeSecNum);
					if(i < timeSegmentSet.length)
					{
						for(var j = 0; j < options.timeSecNum; j++)
						{
							if(j < timeSegmentSet[i].length)
							{
								var oTimeSeg = new TimeSegment();
								deepCopy(oTimeSeg, timeSegmentSet[i][j]);
								oTimeSegmentSet[i][j] = oTimeSeg;
							}
							else
							{
								oTimeSegmentSet[i][j] = new TimeSegment();
							}
						}
					}
					else
					{
						for(var j = 0; j < options.timeSecNum; j++)
						{
							oTimeSegmentSet[i][j] = new TimeSegment();
						}
					}
				}
				return this.selWeekDay(iCurWeekDay);
			},
			selWeekDay: function(iDay)
			{
				iCurWeekDay = iDay;
				oAllDayList.prop("checked", false);
				oChannelplandayList.prop("disabled", false).prop("checked", false);
				oChannelplandayList.eq(iDay).prop("disabled", true).prop("checked", true);
				var oOneDay = oTimeSegmentSet[iDay];
				if(oOneDay[0].m_szStartTime == "00:00" && oOneDay[0].m_szStopTime == "24:00")
				{
					oRootChild.find(":radio[value='wholeDay']").click();
				}
				else
				{
					oRootChild.find(":radio[value='section']").click();
					if(oTimeSegmentSet.length > 0)
					{
						oTimeSectionList.each(function(i)
						{
							var oSpanChildren = $(this).children("span");
							oSpanChildren.eq(1).text(oOneDay[i].m_szStartTime);
							oSpanChildren.eq(2).text(oOneDay[i].m_szStopTime);
							oSpanChildren.eq(3).find("select").val(oOneDay[i].m_szType).change();
							oSpanChildren.eq(4).find("select").val(oOneDay[i].m_iTaskNum);
						});
					}
				}
				return this;
			}
		});
		var that = this;
		$(this).html("<div id='timeInputWindow'><span class='left'></span><span class='mid'><input id='InputTimeH' type='text' value='00' style='width:80px' maxlength='2'><label>:</label><input id='InputTimeM' type='text' value='00' style='width:80px' maxlength='2'></span><span class='right'></span></div><div id='dvEditWnd'><div id='dvScheduleTitle'><label style='font-weight:bold' name='"+options.titleName+"'></label></div><div id='dvEditScheduleArea'></div></div>");
		/***********************过滤异常时间*******************************/
		$(this).find("#InputTimeH").bind('keyup', function()
		{
			var szVal = $(this).val();
			if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9')
			{
				if(szVal.length > 1)
				{
					$(this).val(szVal.substring(0, szVal.length - 1));
				}
				else
				{
					$(this).val('00');
				}
			}
			if(parseInt(szVal, 10) > 24)
			{
				$(this).val('24');
			}
		});
		$(this).find("#InputTimeM").bind('keyup', function()
		{
			var szVal = $(this).val();
			if(szVal.charAt(szVal.length - 1) < '0' || szVal.charAt(szVal.length - 1) > '9')
			{
				if(szVal.length > 1)
				{
					$(this).val(szVal.substring(0, szVal.length - 1));
				}
				else
				{
					$(this).val('00');
				}
			}
			if(parseInt($("#InputTimeH").val(), 10) >= 24)
			{
				$(this).val('00');
			}
			else
			{
				if(parseInt(szVal, 10) > 59)
				{
					$(this).val('59');
				}
			}
		});
		/***********************过滤异常时间*******************************/
		/***********************创建窗口*******************************/
		var oRootChild = $("#dvEditScheduleArea");
		
    	var szDiv = "<ul class='tabs' id='ulScheduleTabs'>"
		for(var i = 0; i < options.weekNameSet.length; i++)
		{
        	szDiv+= "<li><a id='laMonday' name='"+options.weekNameSet[i]+"' href='#this'></a></li>";
		}
    	szDiv+= "</ul>";
		oRootChild.append(szDiv);
		var oWeekTabs = $("#ulScheduleTabs").tabs("", {markCurrent: false});  //初始化星期切换tabs
		var iCurWeekDay = oWeekTabs.curTab;   //当前选中的星期号
		oRootChild.find("a").each(function(i)
		{
			$(this).bind("mouseup", {iIndex:i}, function(event)
			{
				if(!verifyData())
				{
					return false;
				}
				that.selWeekDay(event.data.iIndex);
			})
		});
		var szTypeOpt = "";
		for(var i = 0; i < options.typeNameSet.length; i++)
		{
			szTypeOpt += ("<option value='"+options.typeValueSet[i]+"' name='"+options.typeNameSet[i]+"'></option>");
		}
		
		oRootChild.append('<div class="panes" style="padding:20px 0 0 0;"></div>');
		if(options.isDisWhole)
		{
			//添加全时段录像和分段录像，并绑定事件
			oRootChild.children("div").last().append('<div id="dvWholeDay" style="height:25px; padding-left:10px;"><span style="width:100px"><input type="radio" name="EnableWholeDayRecord" value="wholeDay"/><label name="laEnableWholeDayRecord"></label></span></div><div id="dvSection" style="height:25px; padding-left:10px;"><span><input type="radio" name="EnableWholeDayRecord" value="section"/><label name="laSectionRecord"></label></span></div>').find(":radio[name=EnableWholeDayRecord]").bind("click", function()
			{
				if(this.value == "wholeDay")
				{
					$("#dvWholeDay").find("select").prop("disabled", false);
					
					oTimeSegmentSet[iCurWeekDay][0].m_szStartTime = "00:00";
					oTimeSegmentSet[iCurWeekDay][0].m_szStopTime = "24:00";
					$("#wholeDayScheduleType").val(oTimeSegmentSet[iCurWeekDay][0].m_szType).change();
					$("#dvWholeDay").find("select[id!='wholeDayScheduleType']").eq(0).val(oTimeSegmentSet[iCurWeekDay][0].m_iTaskNum).change();
					for(var j = 1; j < options.timeSecNum; j++)
					{
						oTimeSegmentSet[iCurWeekDay][j].m_szStartTime = "00:00";
						oTimeSegmentSet[iCurWeekDay][j].m_szStopTime = "00:00";
						oTimeSegmentSet[iCurWeekDay][j].m_szType = options.typeValueSet[0];
						oTimeSegmentSet[iCurWeekDay][j].m_iTaskNum = 0;
					}
					
					oTimeSectionList.children("span").prop("disabled", true);
				}
				else
				{
					$("#dvWholeDay").find("select").prop("disabled", true);
					oTimeSectionList.children("span").prop("disabled", false);
				}
				oTimeSectionList.each(function(i)
				{
					var oSpanChildren = $(this).children("span");
					oSpanChildren.eq(1).text(oTimeSegmentSet[iCurWeekDay][i].m_szStartTime);
					oSpanChildren.eq(2).text(oTimeSegmentSet[iCurWeekDay][i].m_szStopTime);
					oSpanChildren.eq(3).find("select").val(oTimeSegmentSet[iCurWeekDay][i].m_szType).change();
					oSpanChildren.eq(4).find("select").val(oTimeSegmentSet[iCurWeekDay][i].m_iTaskNum);
				});
			});
			//添加下拉框选项
			if(options.disType == 2 || options.disType == 3)
			{
				oRootChild.children("div").last().children("div").first().append('<span><select id="wholeDayScheduleType">'+szTypeOpt+'</select></span>').find("select").bind("change", function()
				{
					oTimeSegmentSet[iCurWeekDay][0].m_szType = this.value;
					var iValueIndex = $.inArray(this.value, options.typeValueSet); //值在数组中的索引位置
					//赋初始颜色值
					if(iValueIndex < options.typeColorSet.length)
					{
						oTimeSegmentSet[iCurWeekDay][0].m_szColor = options.typeColorSet[iValueIndex];
					}
					else
					{
						oTimeSegmentSet[iCurWeekDay][0].m_szColor = options.typeColorSet[0];
					}
					var szTaskTypeNumOpt = createTaskTypeNum(this.value);
					if(szTaskTypeNumOpt === "")
					{
						$(this).parent().next().html("");
						oTimeSegmentSet[iCurWeekDay][0].m_iTaskNum = 0;
					}
					else
					{
						$(this).parent().next().html(szTaskTypeNumOpt).find("select").bind("change", function()
						{
							oTimeSegmentSet[iCurWeekDay][0].m_iTaskNum = parseInt(this.value, 10);
						}).val(oTimeSegmentSet[iCurWeekDay][0].m_iTaskNum).change();
					}
					
				});
				if(options.disType == 3)
				{
					oRootChild.children("div").last().children("div").first().append("<span id='wholeDayTaskNum' style='margin-left:10px;'></span>");
				}
			}
		}
		//时间段编辑
		oRootChild.find(".panes").eq(0).append("<div id='dvTimeSection' class='disType"+options.disType+"'><div id='dvTimeSecTitle'><span class='first'><label name='"+options.tableTitlePublic[0]+"'></label></span><span class='second'><label name='"+options.tableTitlePublic[1]+"'></label></span><span class='third'><label name='"+options.tableTitlePublic[2]+"'></label></span></div></div>");
		var oTimeSection = $("#dvTimeSection");
		if(options.disType == 2 || options.disType == 3)
		{
			oTimeSection.children("div").first().append("<span class='fouth'><label name='"+options.typeTitle+"'></label></span>");
			if(options.disType == 3)
			{
				oTimeSection.children("div").first().append("<span class='five'><label name='"+options.typeNumTitle+"'></label></span>");
			}
		}
		for(var i = 0; i < options.timeSecNum; i++)
		{
			oTimeSection.append('<div id="timeSection'+(i+1)+'"><span class="first">'+(i+1)+'</span><span class="second clock">00:00</span><span class="third clock">00:00</span></div>');
			if(options.disType == 2 || options.disType == 3)
			{
				oTimeSection.children("div").last().append('<span class="fouth"><select id="ScheduleType'+(i+1)+'" style="">'+szTypeOpt+'</select></span>').find("select").bind("change", {iIndex:i}, function(event)
				{
					var iIndex = event.data.iIndex;
					oTimeSegmentSet[iCurWeekDay][iIndex].m_szType = this.value;
					var iValueIndex = $.inArray(this.value, options.typeValueSet); //值在数组中的索引位置
					//赋初始颜色值
					if(iValueIndex < options.typeColorSet.length)
					{
						oTimeSegmentSet[iCurWeekDay][iIndex].m_szColor = options.typeColorSet[iValueIndex];
					}
					else
					{
						oTimeSegmentSet[iCurWeekDay][iIndex].m_szColor = options.typeColorSet[0];
					}
					var szTaskTypeNumOpt = createTaskTypeNum(this.value);
					if(szTaskTypeNumOpt === "")
					{
						$(this).parent().next().html("");
						oTimeSegmentSet[iCurWeekDay][iIndex].m_iTaskNum = 0;
					}
					else
					{
						$(this).parent().next().html(szTaskTypeNumOpt).find("select").bind("change", function()
						{
							oTimeSegmentSet[iCurWeekDay][iIndex].m_iTaskNum = parseInt(this.value, 10);
						}).val(oTimeSegmentSet[iCurWeekDay][iIndex].m_iTaskNum).change();
					}
				});
				if(options.disType == 3)
				{
					oTimeSection.children("div").last().append("<span class='five'></span>");
				}
			}
		}
		var oTimeSectionList = oTimeSection.children("div[id!=dvTimeSecTitle]"); //时间片段div列表
		//注册点击事件
		oTimeSectionList.each(function(i)
		{
			$(this).children("span[class*=clock]").bind("click",{iTimeSecIndex:i},function(event)
			{
				var iIndex = event.data.iTimeSecIndex;
				var szValue = $(this).text();
				var oTimeInputWnd = $("#timeInputWindow");
				var iLeft = $(this).position().left;
				var iTop = $(this).position().top + $(this).height();
				var self = this;
				if(oTimeInputWnd.position().left != iLeft || oTimeInputWnd.position().top != iTop || oTimeInputWnd.css("display") == "none")
				{
					oTimeInputWnd.css({left:iLeft, top:iTop}).show().unbind().bind(
					{
						keydown:function(event)
						{
							if(13 == event.keyCode)
							{
								$(this).blur();
							}
						},
						blur:function()
						{
							var szHourVal = $("#InputTimeH").val();
							var szMinVal = $("#InputTimeM").val();
							if(szHourVal.length == 1)
							{
								szHourVal = "0"+szHourVal;
							}
							else if(szHourVal.length == 0)
							{
								szHourVal = "00";
							}
							if(szMinVal.length == 1)
							{
								szMinVal = "0"+szMinVal;
							}
							else if(szMinVal.length == 1)
							{
								szMinVal = "00";
							}
							$(self).text(szHourVal+ ":" + szMinVal);
							$(this).hide();
							if($(self).hasClass("second"))
							{
								oTimeSegmentSet[iCurWeekDay][iIndex].m_szStartTime = $(self).text();
							}
							else
							{
								oTimeSegmentSet[iCurWeekDay][iIndex].m_szStopTime = $(self).text();
							}
						}
					});
					$("#InputTimeH").focus().val(szValue.split(":")[0]);
					$("#InputTimeM").val(szValue.split(":")[1]);
				}
				else
				{
					oTimeInputWnd.blur();
				}
			});
		});
		//星期复制
		oRootChild.append("<div style='height:30px; line-height:30px;'><span class='skybluefont' style='margin-right:2px;'><label name='laCopyToWeek'></label></span><input name='alldaylist' type='checkbox' class='checkbox' id='allDayList'/>&nbsp;<label name='laSelectAll'></label></div><div style='height:30px;'></div>");
		for(var i = 0; i < options.weekNameSet.length; i++)
		{
			oRootChild.children("div").last().append("<input id='ChannelplandayList"+i+"' type='checkbox' class='checkbox'><label name='"+options.weekNameSet[i]+"'></label>&nbsp;");
		}
		//复选框事件
		var oAllDayList = oRootChild.find(":checkbox[id=allDayList]");
		var oChannelplandayList = oRootChild.find(":checkbox[id*=ChannelplandayList]");
		oAllDayList.bind("click", function()
		{
			if(this.checked)
			{
				oChannelplandayList.filter("[disabled!='disabled']").prop("checked", true);
			}
			else
			{
				oChannelplandayList.filter("[disabled!='disabled']").prop("checked", false);
			}
		});
		oChannelplandayList.bind("click", function()
		{
			for(var i = 0; i < oChannelplandayList.length; i++)
			{
				if(!oChannelplandayList.eq(i).prop("checked"))
				{
					oAllDayList.prop("checked", false);
					return;
				}
			}
			oAllDayList.prop("checked", true);
		});
		//复制按钮和点击事件
		$("<input type='button' name='CopyTo' value='' class='savebtn'/>").appendTo(oRootChild.children("div").last()).bind("click", function()
		{
			var oCurWeekDaySche = oTimeSegmentSet[iCurWeekDay];
			oChannelplandayList.each(function(i)
			{
				if(i != iCurWeekDay)
				{
					if(this.checked)
					{
						for(var j = 0; j < oTimeSegmentSet[iCurWeekDay].length; j++)
						{
							deepCopy(oTimeSegmentSet[i][j], oTimeSegmentSet[iCurWeekDay][j]);
						}
					}
				}
			});
		});
		//确认取消按钮
		oRootChild.append('<div style="height:30px; text-align:right;"><span id="SetResultTipsTwo" class="formtips"></span><input name="laOK" type="button" class="savebtn"><input name="laCancel" type="button"  class="savebtn"></div>');
		
		oRootChild.find(":button[name='laOK']").eq(0).bind("click", function()
		{
			//验证
			if(!verifyData())
			{
				return;
			}
			/*************************点击OK改变外部变量的值****************************/
			if(that.timeSegmentSet instanceof Array)
			{
				for(var i = 0; i < options.weekNameSet.length; i++)
				{
					if(i < that.timeSegmentSet.length)
					{
						if(that.timeSegmentSet[i] instanceof Array)
						{
							for(var j = 0; j < options.timeSecNum; j++)
							{
								if(j < that.timeSegmentSet[i].length)
								{
									var oTimeSeg = new TimeSegment();
									deepCopy(oTimeSeg, oTimeSegmentSet[i][j]);
									that.timeSegmentSet[i][j] = oTimeSeg;
								}
								else
								{
									var oTimeSeg = new TimeSegment();
									deepCopy(oTimeSeg, oTimeSegmentSet[i][j]);
									that.timeSegmentSet[i].push(oTimeSeg);
								}
							}
						}
						else
						{
							that.timeSegmentSet[i] = new Array(options.timeSecNum);
							for(var j = 0; j < options.timeSecNum; j++)
							{
								var oTimeSeg = new TimeSegment();
								deepCopy(oTimeSeg, oTimeSegmentSet[i][j]);
								that.timeSegmentSet[i][j] = oTimeSeg;
							}
						}
					}
					else
					{
						var aNewArray = new Array(options.timeSecNum);
						for(var j = 0; j < options.timeSecNum; j++)
						{
							var oTimeSeg = new TimeSegment();
							deepCopy(oTimeSeg, oTimeSegmentSet[i][j]);
							aNewArray[j] = oTimeSeg;
						}
						that.timeSegmentSet.push(aNewArray);
					}
				}
			}
			/*************************点击OK改变外部变量的值****************************/
			/*************************调用回调函数****************************/
			if($.isFunction(options.clickOK))
			{
				options.clickOK();
			}
			$.modal.impl.close();
			
			oTimeSection = $("#dvTimeSection");
			oTimeSectionList = oTimeSection.children("div[id!=dvTimeSecTitle]"); //时间片段div列表
			oRootChild = $("#dvEditScheduleArea");
			oAllDayList = oRootChild.find(":checkbox[id=allDayList]");
			oChannelplandayList = oRootChild.find(":checkbox[id*=ChannelplandayList]");
			
			oWeekTabs.tabs = $("#ulScheduleTabs").tabs("", {markCurrent: false});
		});
		oRootChild.find(":button[name='laCancel']").eq(0).bind("click", function()
		{
			$.modal.impl.close();
			
			oTimeSection = $("#dvTimeSection");
			oTimeSectionList = oTimeSection.children("div[id!=dvTimeSecTitle]"); //时间片段div列表
			oRootChild = $("#dvEditScheduleArea");
			oAllDayList = oRootChild.find(":checkbox[id=allDayList]");
			oChannelplandayList = oRootChild.find(":checkbox[id*=ChannelplandayList]");
			
			oWeekTabs.tabs = $("#ulScheduleTabs").tabs("", {markCurrent: false});
		});
		/*************************************************
		Function:		createTaskTypeNum
		Description:	下拉列表框任务的选择
		Input:			szValue 值
						szId 目标ID			
		Output:			无
		return:			选项				
		*************************************************/
		var createTaskTypeNum =  function (szValue)
		{
			var szOptionInfo = "";
			var iTaskNum = 0;
			switch(szValue)
			{
				case "preset":
					iTaskNum = 8;
					break;
				case "patrol":
					iTaskNum = 8;
					break;
				case "pattern":
					iTaskNum = 4;
					break;
				case "auxoutput":
					iTaskNum = m_iAlarmOutputTotalNum;
					break;
				default:
					break;
				
			}
			if(iTaskNum == 0)
			{
				return "";
			}
			szOptionInfo = "<select>";
			for(j = 1;j <= iTaskNum; j++)
			{
			   szOptionInfo += "<option value ='"+j+"'>"+j+"</option>";
			}
			szOptionInfo += "</select>";
			return szOptionInfo;
		}
		/*************************************************
		Function:		verifyData
		Description:	验证时间的有效性
		Input:			无			
		Output:			无
		return:			true or false				
		*************************************************/
		var verifyData = function()
		{
			var oSelWeekDay = oTimeSegmentSet[iCurWeekDay];
			var szTipsInfo = "<img src='../images/config/tips.png' class='verticalmiddle'>&nbsp;";
			for(var i = 0; i < oSelWeekDay.length; i++)
			{
				//跳过00:00-00:00时间段
				if(oSelWeekDay[i].m_szStartTime == "00:00" && oSelWeekDay[i].m_szStopTime == "00:00")
				{
					continue;
				}
				//开始时间不能大于结束时间
				if(oSelWeekDay[i].m_szStartTime >= oSelWeekDay[i].m_szStopTime)
				{
					szTipsInfo += (getNodeValue("laTimerange")+(i+1)+getNodeValue("jsTimeSegmentErrorSegTips"));
					$("#SetResultTipsTwo").html(szTipsInfo);
					setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);
					//setTimeout(function(){oWeekTabs.selectTab(iCurWeekDay);},10);
					return false;
				}
				//时间不能有重叠
				for(var j = i+1; j < oSelWeekDay.length; j++)
				{
					if(oSelWeekDay[j].m_szStartTime >= oSelWeekDay[i].m_szStopTime || oSelWeekDay[j].m_szStopTime <= oSelWeekDay[i].m_szStartTime)
					{
						continue;
					}
					szTipsInfo += (getNodeValue("laTimerange")+(i+1)+getNodeValue("WithTimeSegmentTips")+(j+1)+getNodeValue("OverlappedTips"));
					$("#SetResultTipsTwo").html(szTipsInfo);
					setTimeout(function(){$("#SetResultTipsTwo").html("");},5000);
					//setTimeout(function(){oWeekTabs.selectTab(iCurWeekDay);},10);
					return false;
				}
			}
			return true;
		}
		
		return this;
	}
})(jQuery);