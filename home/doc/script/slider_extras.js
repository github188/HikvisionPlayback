
if (typeof getElementById!="function") {
  var getElementById = function (id) {
    if   (typeof(id)=="object") return id;
    if   (document.getElementById(id)) { return document.getElementById(id); } 
    else { throw new Error(id +" argument error, can not find \"" +id+ "\" element"); }
  }
}

function getElCoordinate (e) {
  var t = e.offsetTop;
  var l = e.offsetLeft;
  var w = e.offsetWidth;
  var h = e.offsetHeight;
  while (e=e.offsetParent) {
    t += e.offsetTop;
    l += e.offsetLeft;
  }; return {
    top: t,
    left: l,
    width: w,
    height: h,
    bottom: t+h,
    right: l+w
  }
}

var neverModules     = window.neverModules  || {};
neverModules.modules = neverModules.modules || {}; 

neverModules.modules.slider = function (cfg) {
	if ((typeof cfg)!="object") 
	{
		cfg = {};  
	}

	this.targetId  = cfg.targetId;
	this.hints     = cfg.hints?cfg.hints:"";
	this.sliderCss = cfg.sliderCss?cfg.sliderCss:"";
	this.barCss    = cfg.barCss?cfg.barCss:"";
	this.boxCss    = cfg.boxCss?cfg.boxCss:"";
	this.min       = cfg.min?cfg.min:0;
	this.max       = cfg.max?cfg.max:100;
	this.bBox      = cfg.bBox?cfg.bBox:false; //add by tangzz 是否创建输入框
	this.step      = cfg.step?(cfg.step > 0?cfg.step:1) :1;
	this.parent    = cfg.parent?cfg.parent:window;
	this.onstart   = function(){};
	this.onchange  = function(){};
	this.onend     = function(){};
  
	this._defaultInitializer.apply(this);
}

neverModules.modules.slider.prototype = {
	_defaultInitializer: function () {
    this._bar     = null;
    this._slider  = null;
	this._box     = null;  //用于显示和输入当前值的input对象 add by tangzz 
    this._wrapper = null;
    this._target  = this.parent.document.getElementById(this.targetId);
    if (this.min>this.max){var x=this.min;this.min=this.max;this.max=x;}
    this._value   = this.min;
  },

  create: function () {
    this._createSlider();
  },

  dispose: function () {
    //virtual function
  },

  createBar: function () { with(this) {
    //0.10 can not create mutilple bar
    //this interface is for next version
    //by never-online
    var _self = this;
    _bar = this.parent.document.createElement("DIV");
    _wrapper.appendChild(_bar);
    _bar.title = hints;	 	
    _bar.id = targetId + "_bar";
    _bar.className = barCss;
    _bar.style.position  = "absolute";
    _bar.onmousedown = function (evt) { _self._initMoveSlider(evt); }
  }},
  
  createBox: function(){ with(this) {//创建用于显示和输入的框
	_box = this.parent.document.createElement("INPUT");
	_box.type = "text";
	_wrapper.appendChild(_box);
	_box.id = targetId + "_box";
	_box.className = boxCss;
	_box.style.position = "absolute";
	_box.maxLength = (max + '').length; 
	_box.value = _value ;
	//事件绑定
	_box.onclick = function(){
			if(this.value != '' && this.value != 'undefined' && this.value != null){
						_value = parseInt(this.value);
			}
		};
		
	_box.onkeydown = function(evt){
			evt = (evt) ? evt : ((window.event) ? window.event : null); 
			if(evt.keyCode==13){
				this.blur();
			}
				
			if(evt.keyCode == 38)                          //键盘控制: 上--加
			{
				var iNum = parseInt(this.value, 10) + step;
				iNum = iNum>max?max:iNum;                  //判断是否越界
				this.value = iNum;
				
			}
														   //键盘控制: 下--减
			if(evt.keyCode ==40)
			{
				var iNum = parseInt(this.value, 10) - step;	
				iNum = iNum<min?min:iNum;                  //判断是否越界
				this.value = iNum;	
			}
		};
		
	_box.onkeyup = function(evt){
			if(this.value != '' && this.value != 'undefined' && this.value != null){
				var temValue = parseInt(this.value, 10);
				
				if(/^[1-9]\d*|0$/.test(temValue)){        //非负整数判断
					this.value = temValue;                //输入框赋值
				}
				else{
					this.value = min;                     //赋值最小值
				}
			}	
		
		};
	
	_box.onblur = function(){
			var temValue = parseInt(this.value, 10);	
			if(/^[1-9]\d*|0$/.test(temValue)){            //非负整数判断
				temValue = temValue>max?max:temValue<min?min:temValue; //判断是否越界
				
				if((temValue%step) != 0){				  //满足步长
					temValue = (parseInt(temValue/step) + 1) * step;
				}
				this.value = temValue; 
				wsetValue(temValue); 					  //滑动条赋值
			}
			else{
				this.value = min; 						  //赋值最小值
				wsetValue(min); 
			}
			fireChange();								  //执行外部回调函数
			fireEnd();
		};
  }},
/*
    setValue0: function (n) { with(this) {
    if (!_bar) return; n = _Number(Number(n)); n = n>max?max:n<min?min:n;
    _bar.style.left = Math.round((n-min)*((_slider.offsetWidth-_bar.offsetWidth)/(max-min)))+"px";
    _value = n; fireChange(); fireEnd();
  }},*/

  wsetValue: function (n) { with(this) {
    if (!_bar) return; n = _Number(Number(n)); n = n>max?max:n<min?min:n;
    _bar.style.left = Math.round((n-min)*((_slider.offsetWidth-_bar.offsetWidth)/(max-min)))+"px";
	_value = n; 
   
    if(bBox){_box.value = _value;}//将输入框赋值add by tangzz
   
   }},

  getValue: function () {
    return this._Number(this._value);
  },

  setTitle: function (tips) {
	this._bar.title = tips;
	this._target.title = tips;
  },
  
  fireStart: function () {
    this.onstart.call(this);
  },

  fireChange: function () {
    this.onchange.call(this);
  },

  fireEnd: function () {
    this.onend.call(this);
  },
  
  _createSlider: function () { with(this) {
    _wrapper = this.parent.document.createElement("DIV");
    _target.appendChild(_wrapper);
    _wrapper.id = targetId + "_wrapper";
    _wrapper.style.position = "relative";

    _slider = this.parent.document.createElement("DIV");
    _wrapper.appendChild(_slider);
    _slider.id = targetId + "_slider";
    _slider.className = sliderCss;
    _slider.style.position  = "absolute";

    createBar(); 
	
	if(bBox){createBox();} //需要显示的，则创建add by tangzz

	var _self = this;
    _slider.onclick = function (evt) { _self._moveTo(evt); }
  }},

  _moveTo: function (evt) {
	  with(this) {
    evt = evt?evt:this.parent.event; 
    var x = evt.clientX-getElCoordinate(_slider).left-Math.round(_bar.offsetWidth/2); 
	x = _coordsX(x);
	_value = Math.round(x/((_slider.offsetWidth-_bar.offsetWidth)/(max-min))+min);
	if((_value%step) != 0)
	{
		_value = (parseInt(_value/step) + 1) * step;
	}
	x = Math.ceil((_value - min) * ((_slider.offsetWidth-_bar.offsetWidth)/(max-min)));
    _bar.style.left = x+"px"; 
	
	if(bBox){ _box.value = getValue(); }//添加改变的值到输入框 add by tangzz
	
	fireChange();
	fireEnd();
  }},

  _coordsX: function (x) { with(this) {
    x = _Number(x);
    x = x<=_slider.offsetLeft?_slider.offsetLeft:x>=_slider.offsetLeft+_slider.offsetWidth-_bar.offsetWidth?_slider.offsetLeft+_slider.offsetWidth-_bar.offsetWidth:x;
    return x;  
  }},
  
  _coordsY: function (y) { with(this) {

  }},
  
  _Number: function (n) {
    return isNaN(n)?0:n;
  },

  _initMoveSlider: function (evt) {
	  
	  with(this) {
    evt  = evt?evt:this.parent.event; 
	var _self = this;
    _bar.slider_x = evt.clientX-_bar.offsetLeft;
    fireStart();
    this.parent.document.onmousemove = function (evt) { _self._changeHandle(evt); }
    this.parent.document.onmouseup   = function (evt) { _self._endHandle(evt); }
  }},

  _changeHandle: function (evt) { with(this) {
	  if(_target.style.display == "none")
	  {
		  _endHandle(evt);
		  return;
	  }
	  parent.getSelection ? parent.getSelection().removeAllRanges() : parent.document.selection.empty();
	  evt = evt?evt:this.parent.event; 
	  
	  var x = evt.clientX-_bar.slider_x;
	  x = _coordsX(x);
	  _value = Math.round(x/((_slider.offsetWidth-_bar.offsetWidth)/(max-min))+min);
	  if((_value%step) != 0)
	  {
		  _value = (parseInt(_value/step) + 1) * step;
		 
	  }
	  x = Math.ceil((_value - min) * ((_slider.offsetWidth-_bar.offsetWidth)/(max-min)));
	  /*if(x)*/
	  {
		  _bar.style.left = _Number(x)+"px"; 	
		  if(bBox){ setTimeout(function(){_box.value = _value;},1 )}//添加改变的值到输入框,这里加setTimeout解决消息堵塞问题 add by tangzz
		  fireChange();
	  }
	  /*else
	  {
		  _endHandle();
	  }*/
  }},

  _endHandle: function (evt) { with(this) {
    //Release event
    this.parent.document.onmousemove = null;
    this.parent.document.onmouseup   = null;
    fireEnd();
  }}
}
