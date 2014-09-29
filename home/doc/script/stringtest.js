/* 使用方法
	var mobile = $("#txtMobile").get(0);
	if($.isMobile(mobile.value))
	{
	   alert("0k");
	}
	else
	{
	   alert("error");
	}
*/
jQuery.extend(
{
	//去除左边的空格
	ltrim: function(_str)
	{
		return _str.replace(/(^\s*)/g, "");
	},
	//去除右边的空格
	rtrim: function(_str)
	{
		return _str.replace(/(\s*$)/g, "");
	},
	//因为jquery本身已经有了trim方法,故这里不再重新定义
	//计算字符串长度，一个双字节字符长度计2，ASCII字符计1
	lengthw: function(_str)
	{
	   return  _str.replace(/[^\x00-\xff]/g,"rr").length; 
	},
	//按字节截取字符串长度
	getStr: function(str,n)
	{
		var tmpStr = str.substr(0,n);
		var tmpCode = tmpStr.replace(/[^\x00-\xff]/g,'\r\n').split('');
		n = (tmpCode[n-1]=='\n'?n-2:n-1);
		var l = tmpCode.slice(0,n).join('').replace(/\r\n/g,'*').length+1;
		return tmpStr.substr(0,l);
	},
	//转换为大写
	toUpper: function(_str)
	{
		return _str.toUpperCase();
	},
	//转换为小写
	toLower: function(_str)
	{
		return _str.toLowerCase();
	},
	//15位身份证转换为18位,如果参数字符串中有非数字字符,则返回"#"表示参数不正确
	idCardUpdate: function(_str)
	{ 
		var idCard18;
		var regIDCard15 = /^(\d){15}$/;
		if(regIDCard15.test(_str))
		{
			var nTemp = 0;
			var ArrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var ArrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			_str = _str.substr(0,6) + '1' + '9' + _str.substr(6,_str.length-6);
			for(var i=0;i<_str.length;i++)
			{
				nTemp += parseInt(_str.substr(i,1)) * ArrInt[i];
			}
			_str += ArrCh[nTemp % 11];
			idCard18 = _str;        
		}
		else
		{
			idCard18 = "#";
		}
		return idCard18;
	},
	//是否为空字符串
	isEmpty: function(_str)
	{
		var tmp_str = jQuery.trim(_str);
		return tmp_str.length == 0; 
	},
	isChinese: function(_str)
	{
		return /[^-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~;:,\[\]@()<>\u0022]/.test(_str);
	},
	//是否为合法电子邮件地址
	isEmail: function(_str)
	{
	   return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(_str); 
	},
	//是否合法url地址
	isURL: function(_str)
	{
		var regTextUrl = /^(file|http|https|ftp|mms|telnet|news|wais|mailto):\/\/(.+)$/;
		return regTextUrl.test(_str);
	},
	isDomain: function(_str)
	{
		var regTextUrl = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
		return regTextUrl.test(_str);
	},
	isHKDDNS: function(_str) 
	{
		var regTextUrl = /^([a-z]|[a-z][-a-z0-9]{0,62}[a-z0-9])$/;
		return regTextUrl.test(_str);
	},
	//是否为合法ip地址
	isIpAddress: function(_str)
	{
		if (_str.length == 0)
			return (false);
		reVal = /^(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
		return (reVal.test (_str));    
	},
	//是否为多播地址
	isMulticastIP: function(_str)    
	{  
	  var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式   
	  if(re.test(_str))   
	{   
	  if(RegExp.$1 ==0 && RegExp.$2==0 && RegExp.$3==0 && RegExp.$4==0)
		return true;
	  if(RegExp.$1 >223 &&RegExp.$1 <240 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) 
		return true;   
	}
	  return false;    
	},	
	//是否为D类地址
	isDIpAddress: function(_str)    
	{  
	  var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式   
	  if(re.test(_str))   
	{   
	  if(RegExp.$1 ==0 && RegExp.$2==0 && RegExp.$3==0 && RegExp.$4==0)
		return true;
	  if(RegExp.$1 >0 &&RegExp.$1 <224 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) 
		return true;   
	}
	  return false;    
	},
	//是否为有效的IPV6地址
	isIPv6: function(_str)
	{
	  return /:/.test(_str) && _str.match(/:/g).length<8 && /::/.test(_str)?(_str.match(/::/g).length==1 && /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(_str)):/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(_str);
	},
	//是否邮政编码(中国)
	isPostalCode: function(_str)
	{
		var regTextPost = /^(\d){6}$/;
		return regTextPost.test(_str);
	},
	//是否是有效中国身份证
	isIDCard: function(_str)
	{
		var iSum=0;
		var info="";
		var sId;
		var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		//如果输入的为15位数字,则先转换为18位身份证号
		if(_str.length == 15)    
			sId = jQuery.idCardUpdate(_str);    
		else
			sId = _str;
		
		if(!/^\d{17}(\d|x)$/i.test(sId))
		{
			return false;
		}
		sId=sId.replace(/x$/i,"a");
		//非法地区
		if(aCity[parseInt(sId.substr(0,2))]==null)
		{
			return false;
		}
		var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
		var d=new Date(sBirthday.replace(/-/g,"/"))    
		//非法生日
		if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
		{
			return false;
		}
		for(var i = 17;i>=0;i--) 
		{
			iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11);
		}
		if(iSum%11!=1)
		{
			return false;
		}
		return true;    
	},
	//是否有效的电话号码(中国)
	isPhoneCall: function(_str)
	{
		return /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^[0-9]{3,4}[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/.test(_str);
	},
	//是否有效的手机号码(最新的手机号码段可以是15开头的
	isMobile: function(_str)
	{
		return /^0{0,1}1(3|5)[0-9]{9}$/.test(_str);
	},
	//是否有效用户名,长度在1-16之间的，只包含字母，数字和下划线
	isValidUserName: function(_str)
	{
		return /^\w{1,16}$/.test(_str);
	},
	//是否有效密码,长度在6-20之间
	isValidPass: function(_str)
	{
		return /^\w{6,20}$/.test(_str);
	},
	//是否为非负整数0-65535端口
	isIntNumPort:function(_str)
	{
		if(_str > 65535)
		{
			return false;
		}
		var iret = /^[0-9]*$/.test(_str);
		if(iret == false)
		{
			return false;
		}
		return /^[1-9]\d*|0$/.test(_str);
	},
	//是否为非负整数1-223 合法IP地址的首位
	isIntNumIpFirst:function(_str)
	{
		if(_str > 223)
		{
			return false;
		}
		var iret = /^[0-9]*$/.test(_str);
		if(iret == false)
		{
			return false;
		}
		return /^[1-9]\d*|0$/.test(_str);
	},
	//是否为非负整数1-223 合法IP地址的后3位
	isIntNumIpEnd:function(_str)
	{
/*		if(_str > 255)
		{
			return false;
		}*/
		var iret = /^[0-9]*$/.test(_str);
		if(iret == false)
		{
			return false;
		}
		return /^[1-9]\d*|0$/.test(_str);
	},
	//是否为非负整数一定范围里 add 20091207
	isCosinaIntNum:function(_str,iMin,iMax)
	{
		if(_str > iMax || _str < iMin)
		{
			return false;
		}
		var iret = /^[0-9]*$/.test(_str);
		if(iret == false)
		{
			return false;
		}
		return /^[0-9]\d*|0$/.test(_str);
	}	
});
Date.prototype.Format = function(fmt) 
{ 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

