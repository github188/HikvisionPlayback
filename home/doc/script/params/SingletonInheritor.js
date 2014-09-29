/*****************************************************
Copyright 2007-2011 Hikvision Digital Technology Co., Ltd.   
FileName: SingletonInheritor.js
Description: 单件继承器
Author: wuyang    
Date: 2011.12.13
*****************************************************/

var SingletonInheritor = (function(){
	
	function Singleton() {
	}
	Singleton.prototype = {
		constructor: Singleton,
		s_languageXmlDoc: null,
		
		// 类方法
		initCSS: function() { // 初始化CSS
		},
		setRadioItem: function(parentId, index) { // 设置单选框的选中项（parentId: 单选框父id，index: 选中项的序号，从0开始）
			var raArr = $("#" + parentId + " :radio");
			for (var i = 0, len = raArr.length; i != len; ++i) {
				if (i == index)
					raArr[i].checked = true;
				else
					raArr[i].checked = false;
			}
		},
		name: function() { // 获取类名
			var s_name = null;
			var that = this;
			return (that.constructor.prototype.name = function() {
				if (s_name === null) {
					s_name = (typeof that.constructor.name === "string") ? that.constructor.name : /function\s+([^\{\(\s]+)/.test(that.constructor.toString()) ? RegExp["$1"] : null;
				}
				return s_name;
			})();
		},
		instance: function() { // 获取单件对象
			var s_instance = null;
			var that = this;
			return (that.constructor.prototype.instance = function() {
				if (s_instance === null) {
					s_instance = new that.constructor();
				}
				return s_instance;
			})();
		},
		getLxd: function() {
			return Singleton.prototype.s_languageXmlDoc;
		},
		setLxd: function(lxd) {
			Singleton.prototype.s_languageXmlDoc = lxd;
		},
		
		// 实例方法
		update: function() { // 更新表单，实例方法
		},
		submit: function() { // 提交表单，实例方法
		},
		beforeLeave: function() { // 页面离开前回调，实例方法
		}
	};
	
	return {
		implement: function(subObj) // 继承实现
		{
			Singleton.call(subObj);
		},

		declare: function(SubType) // 继承声明
		{
			function Shallow() {}
			Shallow.prototype = Singleton.prototype;
			SubType.prototype = new Shallow();
			SubType.prototype.constructor = SubType;
		},
		
		base: Singleton // 调用基类
	}

})();

function pr(Type) { // 调用原型方法的快捷函数
	return Type.prototype;
}

function ia(Type) { // 调用单件实例方法的快捷函数
	return Type.prototype.instance();
}

/*
// 示例：
// LocalConfig继承自Singleton
function LocalConfig() {
	SingletonInheritor.implement(this);
}
SingletonInheritor.declare(LocalConfig);

// 调用LocalConfig类方法
pr(LocalConfig).initCSS();

// 调用LocalConfig单件对象方法
pr(LocalConfig).instance().update();
// 或
ia(LocalConfig).update();
*/
