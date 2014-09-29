/*****************************************************
Copyright 2008-2013 Hikvision Digital Technology Co., Ltd.   
FileName: schedule
Description: 计划绘图插件
Author: Chenxiangzhen       
Date: 2012.02.21    
*****************************************************/
(function($)
{
	$.fn.schedule = function(options)
	{
		options = jQuery.extend(
		{
			timeStringSet: ["0","2","4","6","8","10","12","14","16","18","20","22","24"],//时间
			weekNameSet: ["laMonday","laTuesday","laWednesday","laThursday","laFriday","laSaturday","laSunday"],     // 星期
			weekNameColorSet: ["#000000","#000000","#000000","#000000","#000000","#FF0000","#FF0000"],     // 星期颜色
			typeNameSet: ["WholeDayRecordTypeOpt1","aMoveDetection","WholeDayRecordTypeOpt3","WholeDayRecordTypeOpt4","WholeDayRecordTypeOpt5"],  //类型
			typeColorSet: ["#6577FD","#74B557","#B83F42","#E58805","#B9E2FE"],  //对应的颜色
			leftWidth: 50,
			rightWidth: 0,
			border: 2
        }, options);
		var oTimeSegmentSet = []; 
		$.extend(this, 
		{
			width: $(this).width()-2*options.border,
			height: $(this).height()-2*options.border,
			update: function(timeSegmentSet)
			{
				oTimeSegmentSet.length = 0;
				oTimeSegmentSet = new Array(options.weekNameSet.length);
				var iStartTimePos = 0;
				var iEndTimePos = 0;
				for(var i = 0; i < options.weekNameSet.length; i++)
				{
					oTimeSegmentSet[i] = new Array();
					if(i < timeSegmentSet.length)
					{
						for(var j = 0; j < timeSegmentSet[i].length; j++)
						{
							var oTimeSeg = new TimeSegment();
							deepCopy(oTimeSeg, timeSegmentSet[i][j])
							oTimeSegmentSet[i].push(oTimeSeg);
							
							iStartTimePos = Math.floor((oTimeSeg.m_szStartTime.split(":")[0]*3600+oTimeSeg.m_szStartTime.split(":")[1]*60)*fSecondWidth)+iCellStartPos;
							iEndTimePos = Math.ceil((oTimeSeg.m_szStopTime.split(":")[0]*3600+oTimeSeg.m_szStopTime.split(":")[1]*60)*fSecondWidth)+iCellStartPos;
							oTimeSeg.m_iX = iStartTimePos;
							oTimeSeg.m_iY = (i+1)*iWeekHeight-iMoveUp+iMarginTop;
							oTimeSeg.m_iWidth = iEndTimePos - iStartTimePos;
							oTimeSeg.m_iHeight = iWeekHeight-iMarginTop - iMarginBottom;
						}
					}
				}
				this.repaint();
			},
			repaint: function()  // 重绘
			{
				var that = this;
				if($.browser.msie)
				{
					if("CSS1Compat" == document.compatMode)
					{
						var iIEVersion = parseInt($.browser.version, 10);
						if(iIEVersion == 6 || iIEVersion == 7 || iIEVersion == 8)
						{
							$("#dvCanvas").html("<canvas id='cvSchedule' height='"+this.height+"' width='"+(this.width-(options.leftWidth+options.rightWidth))+"'></canvas>")
							G_vmlCanvasManager.init($("#dvCanvas")[0]);
						}
					}
					else
					{
						$("#dvCanvas").html("<canvas id='cvSchedule' height='"+this.height+"' width='"+(this.width-(options.leftWidth+options.rightWidth))+"'></canvas>")
						G_vmlCanvasManager.init($("#dvCanvas")[0]);
					}
				}
				canvas = $("#cvSchedule")[0];
				$(canvas).unbind().bind(
				{
					mousemove: function(event)
					{
						var iLeft = event.pageX - $(this).position().left;
						var iTop = event.pageY - $(this).position().top;
						var szTips = "";
						var oTimeRange = that.getMouseInTimeRange(iLeft, iTop);
						if(oTimeRange == null)
						{
							$(this).attr("title", "").find("g_vml").attr("title", "");
						}
						else
						{
							szTips = oTimeRange.m_szStartTime + "～" + oTimeRange.m_szStopTime + "\r\n";
							szTips +=  (oTimeRange.m_szType + " " + (oTimeRange.m_iTaskNum==0?"":oTimeRange.m_iTaskNum));
							$(this).attr("title", szTips).find("g_vml").attr("title", szTips);
						}
					},
					mouseout: function()
					{
						$(this).attr("title", "").find("g_vml").attr("title", "");
					}
				});
				var context = canvas.getContext('2d');
				
				context.clearRect(0, 0, canvas.width, canvas.height);
				//绘制时间段
				for(var i = 0; i < oTimeSegmentSet.length; i++)
				{
					for(var j = 0; j < oTimeSegmentSet[i].length; j++)
					{
						var oTimeSegment = oTimeSegmentSet[i][j];
						context.fillStyle = oTimeSegment.m_szColor;
						context.fillRect(oTimeSegment.m_iX, oTimeSegment.m_iY, oTimeSegment.m_iWidth, oTimeSegment.m_iHeight);
					}
				}
				//绘制水平线
				var iHorLinePosX = Math.floor(fCellWidht*24+iCellStartPos+0.5);  //水平线段末端坐标
				for(i = 0; i <= options.weekNameSet.length; i++)
				{
					context.lineWidth = 1;
					context.beginPath();
					context.strokeStyle = 'rgb(150, 150, 150)';
					context.moveTo(iCellStartPos,(i+1)*iWeekHeight-iMoveUp);
					context.lineTo(iHorLinePosX, (i+1)*iWeekHeight-iMoveUp);
					context.stroke(); 	
				}
				//绘制垂直实线和虚线
				var iSolidLineX = 0;
				var iDisHeight = (options.weekNameSet.length+1)*iWeekHeight-iMoveUp;   //实际显示区域高度
				var iTimeTextPosX = 0;
				for(i = 0; i <= 24; i++)
				{
					iSolidLineX = Math.floor(iCellStartPos+i*fCellWidht+0.5);
					context.lineWidth = 1;
			  
					context.beginPath();
					context.moveTo(iSolidLineX, iWeekHeight-iMoveUp);
					context.lineTo(iSolidLineX, iDisHeight);
					context.stroke();
					if(0 == i % 2) 
					{
						iTimeTextPosX = Math.floor(iCellStartPos/2+i*fCellWidht+0.5);
						context.fillStyle = '#000000';
						context.fillText(options.timeStringSet[i/2], iTimeTextPosX, iWeekHeight-10);
					}
					if(i != 24)
					{
						var iBrokenLineX = 0;
						var iBrokenLineY = 0;
						iBrokenLineX = Math.floor(iCellStartPos+fCellWidht*i+fCellWidht/2+0.5);
						var iBrokenLineNum = 25;
						var fEveryBLHeight = parseFloat((iDisHeight-iWeekHeight)/iBrokenLineNum);
						var iBLRealLine = Math.floor(Math.min(5, fEveryBLHeight));    //虚线每格的长度
						for(j = 0; j<=iBrokenLineNum; j++)
						{
							context.fillStyle = '#808080';
							iBrokenLineY = Math.floor(iWeekHeight-iMoveUp+j*fEveryBLHeight);
							if(j == iBrokenLineNum)
							{
								context.fillRect(iBrokenLineX, iBrokenLineY, 1, iMoveUp);
							}
							else
							{
								context.fillRect(iBrokenLineX, iBrokenLineY, 1, iBLRealLine);
							}
						}
					}
				}
			},
			getMouseInTimeRange: function(iX, iY)
			{
				for(var i = 0; i < oTimeSegmentSet.length; i++)
				{
					for(var j = 0; j < oTimeSegmentSet[i].length; j++)
					{
						var oTimeRange = oTimeSegmentSet[i][j];
						if((oTimeRange.m_iX <= iX && iX <= (oTimeRange.m_iX+oTimeRange.m_iWidth)) && (oTimeRange.m_iY <= iY && iY <= (oTimeRange.m_iY+oTimeRange.m_iHeight)))
						{
							return oTimeRange;
						}
					}
				}
				return null;
			}
		});
		var iCellStartPos = 10;   //离起始位置的距离
		var iCellEndPos = 20;     //离结束位置的距离
		var iDownHeight = 20;     //离底部的距离
		var iMoveUp = 0;          //向上偏移量
		
		var iWeekHeight = Math.floor((this.height-iDownHeight)/(options.weekNameSet.length+1));
		$(this).empty().append("<div id='dvCanvas' style='float:left; width:"+(this.width-(options.leftWidth+options.rightWidth))+"px; height:"+this.height+"px; border:"+options.border+"px solid #959595; border-left:none;'><canvas id='cvSchedule' height='"+this.height+"' width='"+(this.width-(options.leftWidth+options.rightWidth))+"'></canvas></div>");
		
		var canvas = $("#cvSchedule")[0];
		var fCellWidht = parseFloat((canvas.width-iCellStartPos-iCellEndPos)/24); //每小时所占的像素
		var fSecondWidth = parseFloat(fCellWidht/3600);   //每秒的宽度
		var iMarginTop = 1; //时间片段的上外边框
		var iMarginBottom = 1; //时间片段的下外边框
		//
		if(options.leftWidth > 0)
		{
			$(this).prepend("<div style='float:left; width:"+options.leftWidth+"px; height:"+this.height+"px; border:"+options.border+"px solid #959595; border-right:none;'><div style='height:"+iWeekHeight+"px;'></div></div>");
			for(var i = 0; i < options.weekNameSet.length; i++)
			{
				$(this).children("div").first().append("<div style='height:"+iWeekHeight+"px; line-height:"+iWeekHeight+"px; vertical-align:central; text-align:center; font-size:13px; color:"+options.weekNameColorSet[i]+"'><label name='"+options.weekNameSet[i]+"'></label></div>");
			}
		}
		//
		if(options.rightWidth > 0)
		{
			$(this).append("<div style='float:left; width:"+options.rightWidth+"px; height:"+this.height+"px'></div>");
			for(var i = 0; i < options.typeNameSet.length; i++)
			{
				$(this).children("div").last().append("<div style='height:"+iWeekHeight+"px; line-height:"+iWeekHeight+"px; font-size:13px;'><span style='display:inline-block; width:13px; height:13px; background:"+options.typeColorSet[i]+"; margin-left:10px; margin-right:5px;'></span><span><label name='"+options.typeNameSet[i]+"'></label></span></div>");
			}
		}
		
		this.repaint();
		
		return this;
	}
})(jQuery);