/*
*	Tex.js  version 1.0.9
*	author Tangoboy
*	Copyright 2010
*	Dual licensed under the MIT or GPL Version 2 licenses.
*	http://hi.baidu.com/tangoboy/
*	2010-07-15 20:21
*
*/




/*
**************************************************************
	$Class Namespace
	author Tangoboy
	This anonymous function acts as a namespace wrapper for the rest
	of the methods. Methods are then assigned to the window object
	using: window['$Class']['methodName'] = methodReference;

**************************************************************
    Example:
	//******创建类******
	var man  = $Class.create({
		//构造方法
		__:function(m){
			this.type = m||"tangoboy";
			
			//私有属性
			var money = 100;
			//私有方法
			function buy(){
			
			}
			this.getmoney = function(){
				return this.money;
			} 
		},
		//共有属性
		sex:"男",
		//共有方法
		showtype:function(){alert(this.type);}
	});
	
	var m = new man("abc");
	
	//******继承******
	
	var boy = $Class.inherit(man);
	
	//or
	
	var boy = $Class.inherit(man,{
		__:function(m){
			this.type = m||"tangoboy";
			
			//私有属性
			var money = 500;
			this.boygetmoney = function(){
				alert(money);
			} 
		},alse:function(){alert(this.sex);}
	});
	
	
	var b = new boy("tan");
	
	
	//******包含，添加原型成员******
  var run = function(){
    alert("run");
  }
	var jump = function(){
    alert("jump");
  }
	$Class.include(boy,{"run":run,"jump":jump});
	
	
	
	//******对象检测******
	//类似于php的print_r()
	
	$Class.dump(obj);
	
	
	$Class.dump(b);


*/
;
(function(){
window['$Class']={
	//创建一个类  混合构造函数/原型方式
	create: function(config) {
		var obj = function(){};
		//过滤构造方法和原型方法
		for(k in config){
			if(k==="__construct" || k ==="__"){
				obj = config[k];
			}else{
				obj.prototype[k] = config[k];
			}
		};
		return obj;
	},
	//继承  混合对象冒充原型链
	inherit:function(source,extd) {
		if(!$Is.Function(source))return;
		var obj = function(){},pty = {};
		//过滤构造方法和原型方法
		for(k in extd){
			if(k==="__construct" || k ==="__"){
				obj = extd[k];
			}else{
				pty[k] = extd[k];
			}
		};
		//对象冒充
		var exobj = function(){
			source.apply(this,arguments);
			obj.apply(this,arguments);
		};
		//原型链
		exobj.prototype = new source(arguments);
		//原型扩展
		for(k in source.prototype){
			exobj.prototype[k] = source.prototype[k];
		};
		for(k in pty){
			exobj.prototype[k] = pty[k];
		};
		return exobj;
	},
	//原型扩展
	include:function(target,ptys){
		if(!$Is.Function(target)){target = function(){};}
		if($Is.Object(ptys)){
			for(k in ptys){
				target.prototype[k] = ptys[k];
			};
		}
		return target;
	},
	dump:function(obj,alt){
		var msg = "";
		var t = "This is a "+$Is.getType(obj)+" :\r\n",p = "";
		if(obj===null)msg = "null";
		alt = typeof(alt) == 'undefined'?1:0;
		try{
			msg = walkd(obj);
		}catch(e){
			msg = e.toString();
		}
		msg = t+msg;
		if(alt){
			alert(msg);
		}else{
			return msg;
		}
		function walkd(obj){
			for(i in obj){
				var l = obj[i]["hasOwnProperty"]("length")?obj[i]["length"]:"";
				if(obj[i]&&$Is.Object(obj[i])){
					p+=""+i.toString()+":  {\r\n "+walkd(obj[i])+"};     --->"+$Is.getType(obj[i])+"("+l+")\r\n";
				}else{
					p+=""+i.toString()+":  "+obj[i].toString()+";     --->"+$Is.getType(obj[i])+"("+l+")\r\n ";
				}
			};
			return p;
		}
	}
};
})();
;
/*
**************************************************************
	$DOM Namespace
	author Tangoboy
	2010-07-08
*/

(function(){
	window["$DOM"] = {
		readyfn:[],
		isReady : false,
		doc:window.document,
		//选择ID
		$id:function (id) {
			var el = document.getElementById(id);
			if(!+"\v1"){
				if(el && el.attributes['id'].value === id){
					return el;
				}else{
					var els = document.all[id],n = els.length;
					for(var i=0;i<n;i++){
						if(els[i].attributes['id'].value === id){
						return els[i];
						}
					}
				}
			}
			return el;
		},
		//选择name
		$name:function(name,parent){
			parent = parent||this.doc;
			return parent.getElementsByName(name);
		},
		//选择标记
		$tag:function(tagName,parent){
			var result = [],i = 0;
			parent = parent||document;
			if(tagName === "BODY")
                return [parent.body];
            if (!+"\v1") {
                var els = parent.getElementsByTagName(tagName),
                i = els.length;
                while(i)
                    result[--i] = els[i];
                return result;
            }
            return Array["prototype"].slice.call(parent.getElementsByTagName(tagName));
		},
		//选择class
		$class:function(className, tag, parent){
			parent = parent || ((typeof(tag)!=="undefined"&&!$Is.String(tag))?tag:document);
			tag = $Is.String(tag)?tag:"*";
			var allTags = (tag === '*' && parent.all) ? parent.all : parent.getElementsByTagName(tag);
			if(allTags.getElementsByClassName){
				return allTags.getElementsByClassName(className);
			}else{
				var matchingElements = [],classn = [];
				className = $String.trim(className);
				var regex = this._regexpClass(className);
				var element;
				for (var i = 0; i < allTags.length; i++) {
					element = allTags[i];
					if (regex.test(element.className|| element.getAttribute("class"))) {
						matchingElements.push(element);
					}
				}
				return matchingElements;
			}
		},
		//选择属性
		$attr:function(search,parent){
		    var tag = /([\*a-zA-Z1-6]*)?(\[(\w+)\s*(\^|\$|\*|\||~|!)?=?\s*([\w\u00C0-\uFFFF\s\-_\.]+)?\])?/,
			parent = arguments[1] || document,
			agent = search.match(tag),
			tag = agent[1] || "*",
			attribute = agent[3],
			type =  agent[4]+"=",
			value = agent[5],
			ieAttrFix = {
				"class": "className",
				"for": "htmlFor"
			},
			returnElements = [],
			//IE5.5不支持"*"
			elements = (tag === "*" && parent.all)? parent.all : parent.getElementsByTagName(tag),
			length = elements.length;
			if((!!document.querySelectorAll) && type != "!="){
				elements = document.querySelectorAll(search);
				for(var i=0,length = elements.length;i < length;i++){
					returnElements.push(elements[i]);
				}
				return returnElements;
			}
			if(!+"\v1")
				attribute = ieAttrFix[attribute] ? ieAttrFix[attribute] : attribute;
			while(--length >= 0){
				var current = elements[length],
				_value = !+"\v1" ? current[attribute] : current.getAttribute(attribute);
				if(typeof _value === "string" && _value.length > 0){
					if(!!value){
						var condition =
						type === "=" ?//完全等于
						_value === value :
						type === "!=" ?//不等于
						_value != value :
						type === "*=" ?//包含
						_value.indexOf(value) >= 0 :
						type === "~=" ?//匹配当中的某个单词，如<span class="red bold">警告</span>
						(" " + _value + " ").indexOf(value) >= 0:
						type === "^=" ?//以XX开头
						_value.indexOf(value) === 0 :
						type === "$=" ?//以XX结尾
						_value.slice(-_value.length) === value:
						type === "|=" ?//匹配属性值为XX或以XX-打头的元素
						_value === value ||  _value.substring(0,value.length+1) === value+"-" :
						false;
						condition && returnElements.push(current);
					}else{
						returnElements.push(current)
					}
				}
			}
			return returnElements;
		},
		//单选css选择器 IE8以上
		$one:function(selector,parent){
			if(document.querySelector){
				parent = parent || this.doc;
				return parent.querySelector(selector);
			}
		},
		//多选css选择器 IE8以上
		$all:function(selector,parent){
			if(document.querySelectorAll){
				parent = parent || this.doc;
				return parent.querySelectorAll(selector);
			}
		},
		ready:function(fn){
			this._initReady();
			if($Is.Function(fn)){
			  if(this.isReady){
				fn();
			  }else{
				this.readyfn.push(fn);
			  }
			}
		 },
		 _fireReady:function(){
			if (this.isReady) return;
			this.isReady = true;
			for(var i=0,n=this.readyfn.length;i<n;i++){
			  var fn = this.readyfn[i];
			  fn();
			}
			this.readyfn.length = 0;//清空事件
		  },
		  _initReady:function(){
			var _this = this;
			if (document.addEventListener) {
			  document.addEventListener( "DOMContentLoaded", function(){
				document.removeEventListener( "DOMContentLoaded", arguments.callee, false );//清除加载函数
				_this._fireReady();
			  }, false );
			}else{
			  if (document.getElementById) {
				document.write('<script id="ie-domReady" defer="defer" src="//:"><\/script>');
				this.$id("ie-domReady").onreadystatechange = function() {
				  if (this.readyState === "complete") {
					_this._fireReady();
					this.onreadystatechange = null;
					this.parentNode.removeChild(this);
				  }
				};
			  }
			}
		 },
		attr: function(el,name, value){
			if (typeof(value) == 'undefined') {
				switch (name) {
					case 'class':
						return el.className;
					case 'style':
						return el.style.cssText;
					default:
						return el.getAttribute(name);
				}
			} else {
				switch(name){
					case 'class':
						el.className = value;
						break;
					case 'style':
						el.style.cssText = value;
						break;
					default:
						el.setAttribute(name, value);
				};
				return el;
			}
		},
		prop: function(el, name, value) {
			if (typeof(value) == 'undefined') {
				return el[name];
			} else {
				el[name] = value;
				return el;
			}
		},
		remove: function(el){
			el.parentNode.removeChild(el);
			return el;
		},
		css: function (el, name, value) {
			if (typeof(value) == 'undefined') {
				if (name == 'opacity') {
					if ($Browser.browser==="msie") {
						return el.filter && el.filter.indexOf("opacity=") >= 0 ? parseFloat(el.filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
					} else {
						return el.style.opacity ? parseFloat(el.style.opacity) : 1;
					}
				} else {
					function hyphenate(name) {
						return name.replace(/[A-Z]/g,
						function(match) {
							return '-' + match.toLowerCase();
						});
					}
					if (window.getComputedStyle) {
						return window.getComputedStyle(el, null).getPropertyValue(hyphenate(name));
					}
					if (document.defaultView && document.defaultView.getComputedStyle) {
						var computedStyle = document.defaultView.getComputedStyle(el, null);
						if (computedStyle){ return computedStyle.getPropertyValue(hyphenate(name))};
						if (name == "display"){return "none"};
					}
					if (el.currentStyle) {
						return el.currentStyle[name];
					}
					return el.style[name];
				}
			} else {
				if(name == 'opacity'){
					if($Browser.browser==="msie"){
						el.style.filter = 'Alpha(Opacity=' + value * 100 + ');';
						el.style.zoom = 1;
					} else {
						el.style.opacity = (value == 1? '': '' + value);
					}
				} else {
					if(typeof value == 'number'){value += 'px';}
					el.style[name] = value;
				}
				return el;
			}
		},
		text: function (el,value) {
			return this.prop(el,typeof(el.innerText) != 'undefined' ? 'innerText' : 'textContent', value);
		},
		html: function (el,value) {
			return this.prop(el,'innerHTML', value);
		},
		val: function(el, value){
			if(typeof(value) == 'undefined'){
				if(el.tagName.toLowerCase() == 'input'){
					switch(el.type){
						case 'checkbox':
							return el.checked ? true : false;
							break;
						case 'radio':
							return el.checked ? true : false;
							break;
					}
				}
				return el.value;
			} else {
				return this.prop(el,'value', value);
			}
		},
		show: function(el, val){
			this.css(el,'display', val ? val : 'block');
			return el;
		},
		hide: function(el){
			this.css(el,'display', 'none');
			return el;
		},
		toggle: function(el){
			var t = el.style.display == 'none' ? 'show' : 'hide';
			this[t](el);
			return el;
    	},
		hasClass: function(el, name){
			if(name && el.className){
				return this._regexpClass(name).test(el.className);
			}
			return false;
		},
		addClass: function(el, name){
			var arr = [];
			if(el.className){
				arr = el.className.split(' ');
				if($Array.indexOf(arr, name)==-1) arr.push(name);
			} else {
				arr.push(name);
			}
			el.className = arr.join(' ');
			return el;
		},
		removeClass: function(el, name){
			if(el.className){
				var regexp = this._regexpClass(name);
				el.className = $String.trim(el.className.replace(regexp, ''));
			}
			return el;
		},
		removeAttr: function(el, name){
			el.removeAttribute(name);
			return el;
		},
		removeCss: function(el, name){
			if(!name) {
				this.removeAttr(el,'style');
				return el;
			}
			var s = el.style;
			if(s.removeAttribute){
				s.removeAttribute(name);
			} else {
				name = name.replace(/([A-Z])/g, function(v){
					return '-' + v.toLowerCase();
				});
				s.removeProperty(name);
			}
			return el;
		},
		_regexpClass:function(s){
			//return new RegExp('\\b' + $String.trim(s) + '\\b', 'g');
			return new RegExp('(?:^|[ \\t\\r\\n\\f])' + s + '(?:$|[ \\t\\r\\n\\f])');
		}
	};
})();
/*
**************************************************************
	$Anim Namespace
	author Tangoboy
	2010-07-12
**************************************************************
    Example:
	
	var fm = {
			left:0,
			top:0,
			opacity:1,
			width:100,
			height:100
	},
	var at1 = {
			to:{
				left:0,
				top:400,
				width:80,
				height:80
			},
			delay:1000,
			duration:3000,
		};
	var at2 = {
			to:{
				left:500,
				top:400,
				opacity:0.8,
				width:150,
				height:30
			},
			delay:500,
			duration:2000,
		};
	var test = document.getElementById("test");
	var s = $Anim(test,{
						//from:fm,
						whileAnim:function(n){},
						onEnd:function(){
							this.restart();
						}
					}
			).add(at1).add(at2).start();
			
*/
;(function(){
var easing = {
	linear: function(t, b, c, d){
		return c*t/d + b;
	},
	quadIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	quadOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},
	quadInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	cubicIn: function(t, b, c, d){
		return c*(t/=d)*t*t + b;
	},
	cubicOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	cubicInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	quartIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t + b;
	},
	quartOut: function(t, b, c, d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	quartInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	quintIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t*t + b;
	},
	quintOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	quintInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	sineIn: function(t, b, c, d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	sineOut: function(t, b, c, d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	expoIn: function(t, b, c, d){
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	expoOut: function(t, b, c, d){
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	expoInOut: function(t, b, c, d){
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	circIn: function(t, b, c, d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	circOut: function(t, b, c, d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	circInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	elasticIn: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	elasticInOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5); if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	backIn: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	backInOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){
		return c - Fx.Transitions.bounceOut (d-t, 0, c, d) + b;
	},
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)){
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)){
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)){
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	bounceInOut: function(t, b, c, d){
		if (t < d/2) return Fx.Transitions.bounceIn(t*2, 0, c, d) * .5 + b;
		return Fx.Transitions.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};
window["$Anim"] = function(el,events){
	var bind = function(method,object) {
		return function() {
			return method.apply(object, arguments);
		}
	};
	var Fx = $Class.create({
		__:function(el,options){
			this.element = el;
			this.styles = [];
			this.queue = [];
			this.queueNow = 0;
			this.onStart = options["onStart"] || function(){};
			this.onEnd = options["onEnd"] || function(){};
			this.whileAnim = options["whileAnim"] || function(){};
			this.timer = null;
			this.options = {
				unit : 'px',
				fps: 65
			};
			this.status = "";
			this.pauseStatus = null;
			this.now = {};
			this.from = $Object.clone(options["from"]||{});
			this.initFrom = $Object.clone(this.from);
		},
		add:function(action){
			var action = action || {};
			if(typeof(action.to)==="undefined"||$Is.EmptyObject(action.to)){
				if(this.queue.length<1){
					action.to = $Object.clone(this.from);
				}else{
					action.to = $Object.clone(this.queue[this.queue.length-1].to);
				}
				action.duration = 0;
			}
			var action = $Object.extend({
				onQueueStart:function(){},
				onQueueComplete:function(){},
				transition:easing.linear,//easing.elasticInOut
				duration: 0,
				delay:0,
				to:{}
			}, action);
			this.queue.push(action);
			return this;
		},
		start:function(){
			if(this.timer) return;
			if(this.queue.length==0) return;
			if(this.queueNow==0){
				setTimeout(bind(this.onStart, this, this.element), 10);
			}
			if($Is.EmptyObject(this.from)){
				for(var i=0;i<this.queue.length;i++){
					for(var k in this.queue[i]["to"]){
						this.styles.push(k);
					}
				}
				this.styles = $Array.removeRepeat(this.styles);
				for(var i=0;i<this.styles.length;i++){
					this.from[this.styles[i]] = this.getStyle(this.element,this.styles[i]);
				}
				this.initFrom = $Object.clone(this.from);
			}
			this.time = new Date().getTime();
			setTimeout(bind(this.queue[this.queueNow].onQueueStart, this, this.element), 10);
			this.delay(this.queue[this.queueNow].delay);
			return this;
		},
		restart:function(){
			this.stop("start");
			this.from = $Object.clone(this.initFrom);
			this.now = {};
			this.start();
		},
		delay:function(time){
			this.status = "delay";
			setTimeout(bind(function(){
				if(!this.pauseStatus){
					this.time = new Date().getTime();
					this.timer = setInterval(bind(this.step, this, arguments), Math.round(1000/this.options.fps));
				}
			},this),
			time);
			return this;
		},
		step:function(){
			var time = new Date().getTime();
			this.status = "anim";
			if (time < this.time + this.queue[this.queueNow].duration){
				this.cTime = time - this.time;
				for (var p in this.queue[this.queueNow].to){
					this.now[p] = this.compute(this.from[p], this.queue[this.queueNow].to[p]);
				}
				this.whileAnim(this.now);
			} else {
				setTimeout(bind(this.queue[this.queueNow].onQueueComplete, this, this.element), 10);
				this.from = $Object.clone(this.queue[this.queueNow].to);
				this.now = {};
				if(this.queueNow<this.queue.length-1){
					this.stop();
					this.queueNow++;
					this.start();
				}else{
					this.stop("end");
					setTimeout(bind(this.onEnd, this, this.element), 10);
					return ;
				}
			}
			this.setNow();
		},
		setNow: function(){
			for (var p in this.now) this.setStyle(this.element, p, this.now[p]);
			return this;
		},
		compute: function(from, to){
			var change = to - from;
			return this.queue[this.queueNow].transition(this.cTime, from, change, this.queue[this.queueNow].duration);
		},
		pause:function(){
			var time = new Date().getTime();
			this.pauseStatus = {
				time:time-this.time,// 等待时或动画时已使用时间
				qn:this.queueNow
			};
			clearInterval(this.timer);
			this.timer = null;
			return this;
		},
		resume:function(){
			var ps = this.pauseStatus;
			if(ps){
				if(this.status==="delay"){
					var l = this.queue[ps.qn].delay-ps.time;
					this.delay(l);
				}else if(this.status==="anim"){
					this.time = new Date().getTime()-ps.time;
					this.timer = setInterval(bind(this.step, this, arguments), Math.round(1000/this.options.fps));
				}
				this.pauseStatus = null;
			}
			return this;
		},
		stop:function(q){
			this.status = "stop";
			clearInterval(this.timer);
			this.timer = null;
			if(q){
				switch(q){
				case "start":
					this.queueNow = 0;
					this.now = $Object.clone(this.initFrom);
					this.setNow();
					break;
				case "end":
					this.queueNow = this.queue.length-1;
					this.now = $Object.clone(this.queue[this.queue.length-1].to);
					this.setNow();
					break;
				case "astart":
					if(this.queueNow>0){
						this.queueNow--;
						this.now = $Object.clone(this.queue[this.queueNow].to);
					}else{
						this.now = $Object.clone(this.initFrom);
					}
					this.setNow();
					break;
				case "aend":
					this.now = $Object.clone(this.queue[this.queueNow].to);
					this.setNow();
					break;
				default:
					;
				}
			}
			return this;
		},
		setStyle: function(e, p, v){
			if (p === 'opacity'){
				if (v == 0 && e.style.visibility != "hidden"){
					e.style.visibility = "hidden";
				}else{
					if(e.style.visibility != "visible") e.style.visibility = "visible";
				}
				if ($Browser.browser==="msie"){e.style.filter = "alpha(opacity=" + v*100 + ")";}
				e.style.opacity = v;
			}else{
				 e.style[p] = v+this.options.unit;
			}
		},
		getStyle:function(e, p){
			var regpt = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;
			var regptunit =  /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;
			var s = 0;
			if(regpt.test(p)){
				s = regptunit.exec(e.style[p])[1]||0;
			}else{
				if(p === 'opacity'){
					if (e.style.visibility === "hidden"){s = 0;}
					else{s = 1;}
				}
			}
			return parseFloat(s)||0;
		},
		getQueue:function(){
			return this.queue;
		},
		getElement:function(){
			return this.element;
		}
	});
	return new Fx(el,events);	
};
})();
/*
**************************************************************
	$Is Namespace
	类型检测
	author Tangoboy
	2010-07-05
**************************************************************
    Example:
    $Is.String("hello"); //true;
    $Is.Function(function(){alert()}); //true;
    ...
    $Is.EmptyObject({}); //ture 空对象
    $Is.PlainObject(); //new Object() false; {} true;
    $Is.getType(190);  //Number;
    
*/
;(function(){
window["$Is"] = {
	opt:Object.prototype.toString,
	"String":function(s){
		return this.getType(s) === "String";
	},
	"Function":function(f){
		return this.getType(f) === "Function";
	},
	"Object":function(o){
		return this.getType(o) === "Object";
	},
	"Number":function(n){
		return this.getType(n) === "Number";
	},
	"Array":function(a){
		return this.getType(a) === "Array";
	},
	EmptyObject:function( o ) {
		for (var n in o ) {
			return false;
		}
		return true;
	},
	PlainObject: function(o) {
		if ( !o || this.Object(o) || o.nodeType || o.setInterval ) {
			return false;
		}
		if ( o.constructor
			&& !hasOwnProperty.call(o, "constructor")
			&& !hasOwnProperty.call(o.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		var key;
		for ( key in o ) {}
		return key === undefined || hasOwnProperty.call( o, key );
	},
	getType:function(o){
		var m = /\[object ([\w.]+)\]/.exec(this.opt.call(o));
		return $String.trim(m[1]||"");
	}
};
})();


/*
**************************************************************
	$Function Namespace
	author Tangoboy
	2010-07-05
*/
;(function(){
window["$Function"] = {
	//域绑定，可传参
	bind: function(fun) {
		var  _this = arguments[1], args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function(){
			var thisArgs =  args.concat();
			for (var i=0, il = arguments.length; i < il; i++) {
				thisArgs.push(arguments[i]);
			}
			return fun.apply(_this || this, thisArgs);
		}
	},
	// 域绑定，可传事件
	bindEvent: function(fun) {
		var  _this = arguments[1], args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function(e){
			var thisArgs = args.concat();
			thisArgs.unshift(e || window.event);
			return fun.apply(_this || this, thisArgs);
		}
	},
	clone: function(fun){
		var clone = function(){
			return fun.apply(this, arguments);	
		};
		clone.prototype = fun.prototype;
		for(prototype in fun){
			if(fun.hasOwnProperty(prototype) && prototype != 'prototype'){
				clone[prototype] = fun[prototype];
			}
		}
		return clone;
	}
};
})();
/**
 * $Cookie Namespace
 * author  Klaus Hartl/klaus.hartl@stilbuero.de
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $Cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $Cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'tangoboy.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $Cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $Cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 */
;
(function(){
window['$Cookie'] = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $String.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
})();


/*
**************************************************************
	XMLHttpRequest.js
	author Sergey Ilinsky (http://www.ilinsky.com)
*/
(function () {

	// Save reference to earlier defined object implementation (if any)
	var oXMLHttpRequest	= window.XMLHttpRequest;

	// Define on browser type
	var bGecko	= !!window.controllers,
		bIE		= window.document.all && !window.opera,
		bIE7	= bIE && window.navigator.userAgent.match(/MSIE ([\.0-9]+)/) && RegExp.$1 == 7;

	// Constructor
	function cXMLHttpRequest() {
		this._object	= oXMLHttpRequest && !bIE7 ? new oXMLHttpRequest : new window.ActiveXObject("Microsoft.XMLHTTP");
		this._listeners	= [];
	};

	// BUGFIX: Firefox with Firebug installed would break pages if not executed
	if (bGecko && oXMLHttpRequest.wrapped){
		cXMLHttpRequest.wrapped	= oXMLHttpRequest.wrapped;
	}

	// Constants
	cXMLHttpRequest.UNSENT				= 0;
	cXMLHttpRequest.OPENED				= 1;
	cXMLHttpRequest.HEADERS_RECEIVED	= 2;
	cXMLHttpRequest.LOADING				= 3;
	cXMLHttpRequest.DONE				= 4;

	// Public Properties
	cXMLHttpRequest.prototype.readyState	= cXMLHttpRequest.UNSENT;
	cXMLHttpRequest.prototype.responseText	= '';
	cXMLHttpRequest.prototype.responseXML	= null;
	cXMLHttpRequest.prototype.status		= 0;
	cXMLHttpRequest.prototype.statusText	= '';

	// Instance-level Events Handlers
	cXMLHttpRequest.prototype.onreadystatechange	= null;

	// Class-level Events Handlers
	cXMLHttpRequest.onreadystatechange	= null;
	cXMLHttpRequest.onopen				= null;
	cXMLHttpRequest.onsend				= null;
	cXMLHttpRequest.onabort				= null;

	// Public Methods
	cXMLHttpRequest.prototype.open	= function(sMethod, sUrl, bAsync, sUser, sPassword) {
		// Delete headers, required when object is reused
		delete this._headers;

		// When bAsync parameter value is omitted, use true as default
		if (arguments.length < 3){
			bAsync	= true;
		}

		// Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
		this._async		= bAsync;

		// Set the onreadystatechange handler
		var oRequest	= this,
			nState		= this.readyState,
			fOnUnload;

		// BUGFIX: IE - memory leak on page unload (inter-page leak)
		if (bIE && bAsync) {
			fOnUnload = function() {
				if (nState != cXMLHttpRequest.DONE) {
					fCleanTransport(oRequest);
					// Safe to abort here since onreadystatechange handler removed
					oRequest.abort();
				}
			};
			window.attachEvent("onunload", fOnUnload);
		}

		// Add method sniffer
		if (cXMLHttpRequest.onopen)
			cXMLHttpRequest.onopen.apply(this, arguments);

		if (arguments.length > 4)
			this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
		else
		if (arguments.length > 3)
			this._object.open(sMethod, sUrl, bAsync, sUser);
		else
			this._object.open(sMethod, sUrl, bAsync);

		if (!bGecko && !bIE) {
			this.readyState	= cXMLHttpRequest.OPENED;
			fReadyStateChange(this);
		}

		this._object.onreadystatechange	= function() {
			if (bGecko && !bAsync)
				return;

			// Synchronize state
			oRequest.readyState		= oRequest._object.readyState;

			//
			fSynchronizeValues(oRequest);

			// BUGFIX: Firefox fires unnecessary DONE when aborting
			if (oRequest._aborted) {
				// Reset readyState to UNSENT
				oRequest.readyState	= cXMLHttpRequest.UNSENT;

				// Return now
				return;
			}

			if (oRequest.readyState == cXMLHttpRequest.DONE) {
				//
				fCleanTransport(oRequest);
// Uncomment this block if you need a fix for IE cache

				// BUGFIX: IE - memory leak in interrupted
				if (bIE && bAsync)
					window.detachEvent("onunload", fOnUnload);
			}

			// BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
			if (nState != oRequest.readyState)
				fReadyStateChange(oRequest);

			nState	= oRequest.readyState;
		}
	};
	cXMLHttpRequest.prototype.send	= function(vData) {
		// Add method sniffer
		if (cXMLHttpRequest.onsend)
			cXMLHttpRequest.onsend.apply(this, arguments);

		// BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
		// BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
		// BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
		if (vData && vData.nodeType) {
			vData	= window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
			if (!this._headers["Content-Type"])
				this._object.setRequestHeader("Content-Type", "application/xml");
		}

		this._object.send(vData);

		// BUGFIX: Gecko - missing readystatechange calls in synchronous requests
		if (bGecko && !this._async) {
			this.readyState	= cXMLHttpRequest.OPENED;

			// Synchronize state
			fSynchronizeValues(this);

			// Simulate missing states
			while (this.readyState < cXMLHttpRequest.DONE) {
				this.readyState++;
				fReadyStateChange(this);
				// Check if we are aborted
				if (this._aborted)
					return;
			}
		}
	};
	cXMLHttpRequest.prototype.abort	= function() {
		// Add method sniffer
		if (cXMLHttpRequest.onabort)
			cXMLHttpRequest.onabort.apply(this, arguments);

		// BUGFIX: Gecko - unnecessary DONE when aborting
		if (this.readyState > cXMLHttpRequest.UNSENT)
			this._aborted	= true;

		this._object.abort();

		// BUGFIX: IE - memory leak
		fCleanTransport(this);
	};
	cXMLHttpRequest.prototype.getAllResponseHeaders	= function() {
		return this._object.getAllResponseHeaders();
	};
	cXMLHttpRequest.prototype.getResponseHeader	= function(sName) {
		return this._object.getResponseHeader(sName);
	};
	cXMLHttpRequest.prototype.setRequestHeader	= function(sName, sValue) {
		// BUGFIX: IE - cache issue
		if (!this._headers)
			this._headers	= {};
		this._headers[sName]	= sValue;

		return this._object.setRequestHeader(sName, sValue);
	};

	// EventTarget interface implementation
	cXMLHttpRequest.prototype.addEventListener	= function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
				return;
		// Add listener
		this._listeners.push([sName, fHandler, bUseCapture]);
	};

	cXMLHttpRequest.prototype.removeEventListener	= function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
				break;
		// Remove listener
		if (oListener)
			this._listeners.splice(nIndex, 1);
	};

	cXMLHttpRequest.prototype.dispatchEvent	= function(oEvent) {
		var oEventPseudo	= {
			'type':			oEvent.type,
			'target':		this,
			'currentTarget':this,
			'eventPhase':	2,
			'bubbles':		oEvent.bubbles,
			'cancelable':	oEvent.cancelable,
			'timeStamp':	oEvent.timeStamp,
			'stopPropagation':	function() {},	// There is no flow
			'preventDefault':	function() {},	// There is no default action
			'initEvent':		function() {}	// Original event object should be initialized
		};

		// Execute onreadystatechange
		if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
			(this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);

		// Execute listeners
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
			if (oListener[0] == oEventPseudo.type && !oListener[2])
				(oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
	};

	//
	cXMLHttpRequest.prototype.toString	= function() {
		return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
	};

	cXMLHttpRequest.toString	= function() {
		return '[' + "XMLHttpRequest" + ']';
	};

	// Helper function
	function fReadyStateChange(oRequest) {
		// Sniffing code
		if (cXMLHttpRequest.onreadystatechange)
			cXMLHttpRequest.onreadystatechange.apply(oRequest);

		// Fake event
		oRequest.dispatchEvent({
			'type':			"readystatechange",
			'bubbles':		false,
			'cancelable':	false,
			'timeStamp':	new Date + 0
		});
	};

	function fGetDocument(oRequest) {
		var oDocument	= oRequest.responseXML,
			sResponse	= oRequest.responseText;
		// Try parsing responseText
		if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
			oDocument	= new window.ActiveXObject("Microsoft.XMLDOM");
			oDocument.async				= false;
			oDocument.validateOnParse	= false;
			oDocument.loadXML(sResponse);
		}
		// Check if there is no error in document
		if (oDocument)
			if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
				return null;
		return oDocument;
	};

	function fSynchronizeValues(oRequest) {
		try {	oRequest.responseText	= oRequest._object.responseText;	} catch (e) {}
		try {	oRequest.responseXML	= fGetDocument(oRequest._object);	} catch (e) {}
		try {	oRequest.status			= oRequest._object.status;			} catch (e) {}
		try {	oRequest.statusText		= oRequest._object.statusText;		} catch (e) {}
	};

	function fCleanTransport(oRequest) {
		// BUGFIX: IE - memory leak (on-page leak)
		oRequest._object.onreadystatechange	= new window.Function;
	};

	// Internet Explorer 5.0 (missing apply)
	if (!window.Function.prototype.apply) {
		window.Function.prototype.apply	= function(oRequest, oArguments) {
			if (!oArguments)
				oArguments	= [];
			oRequest.__func	= this;
			oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
			delete oRequest.__func;
		};
	};

	// Register new object with window
	window.XMLHttpRequest	= cXMLHttpRequest;
})();

/*
**************************************************************
	$Ajax Namespace
	author Tangoboy
	2010-07-03
**************************************************************
    Example:
    $Ajax.jsonp(url,data,callback); //jsonp跨域
    
    $Ajax.get(url,data,callback,format);
    
    $Ajax.post(url,data,callback,format);
    
    $Ajax.ajax(url,{
      method:     'get',
      async:      true,
      data:       null,
      format:     'text',
      encode:     'UTF-8',
      success:   function(){},
      failure:   function(){},
			whatever: function(){}
    });
    
*/
;
(function(){
window['$Ajax'] = {
	jsonp:function(url,data,callback){
		if(typeof window.jsonp_callback== 'undefined'){
			window.jsonp_callback = {};
		};
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		var p = "";
		var fun = (function(){
			var id = '';
			do{
				id = Math.floor(Math.random()*10000);
			}while(window.jsonp_callback[id]);
			return {id : id,name : 'window.jsonp_callback['+id+']'};
		})();
		var _this = this;
		p = $Is.Object(data)?$Object.param(data):data;
		script.type = 'text/javascript';
		script.charset = 'utf-8';
		if(head){
			head.appendChild(script);
		}else{
			document.body.appendChild(script);
		}
		window.jsonp_callback[fun.id] = function(data){
			callback(data);
			setTimeout(function(){
				delete window.jsonp_callback[fun.id];
				script.parentNode.removeChild(script);
			}, 100);
		};
		script.src = url+'?callback='+fun.name+'&'+p;
	},
	get:function(url,data,callback,format){
		format = format||"text";
		if(!$Is.Function(data)){
			return this.ajax(url,{"data":data,success:callback,"format":format});
		}else{
			return this.ajax(url,{"data":null,success:data,"format":callback});
		}
	},
	post:function(url,data,callback,format){
		format = format||"text";
		if(!$Is.Function(data)){
			return this.ajax(url,{method:"post","data":data,success:callback,"format":format});
		}else{
			return this.ajax(url,{method:"post","data":null,success:data,"format":callback});
		}
	},
	ajax:function(url,options){
/*		if(!this.xhr){
			this.xhr = new XMLHttpRequest();
		}else if(this.xhr.readyState!=0){
			xhr.abort();
		}
		xhr = this.xhr;*/
		xhr = new XMLHttpRequest();
		var op = $Object.extend({
            method:     'get',
            async:      true,
            data:       null,
            format:     'text',
            encode:     'UTF-8',
            success:   function(){},
            failure:   function(){},
			whatever: function(){}
        }, options || {});
		if($Is.Object(op.data)){
			op.data = $Object.param(op.data);
		}
		if (op.method == 'get'){
            url += (url.indexOf('?') == -1 ? '?' : '&') + op.data;
            op.data = null;
        }
		xhr.open(op.method, url, op.async);
		if(op.method == 'post'){
            xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=' + op.encode);
        }
        xhr.onreadystatechange = $Function.bind(this._onStateChange, this, xhr, op);
        xhr.send(op.data || null);
	},
	xhr:null,
	_onStateChange:function(xhr,op){
		if(xhr.readyState == 4){
		xhr.onreadystatechange = function(){};
		var s = xhr.status, tmp = xhr;
		if(!op.success) return;
		if(op.whatever) op.whatever(xhr);
			if(!!s && s>= 200 && s < 300){
				if(typeof(op.format) == 'string'){
					switch (op.format){
						case 'text':
							tmp = xhr.responseText;
							break;
						case 'json':
							tmp = $Object.parseJSON(xhr.responseText);
							break;
						case 'xml':
							tmp = xhr.responseXML;
							break;
					}
				}
				op.success(tmp,xhr);
			} else {
				if(op.failure) op.failure(xhr);
			}
		}
	}
};
})();


/*
**************************************************************
	$String Namespace
	author Tangoboy
	2010-07-03
*/
;
(function(){
window['$String'] = {
	//去除空格
	trim: function( text ) {
		return (text || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );
	},
	//格式化HTML
	escapeHTML: function(str) {
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},
	//反格式化HTML
	unescapeHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	},
	// 取得字符的字节长度，汉字认为是两个字符
	byteLength: function(str) {
  		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	// 除去最后一个字符
	delLast: function(str){
		return str.substring(0, str.length - 1);
	},
	// String to Int
	toInt: function(str) {
		return Math.floor(str);
	},
	// String to Array
	toArray: function(str, o){
		return str.split(o||'');
	},
	// 取左边多少字符，中文两个字节
	left: function(str, n){
        var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(0, s);
    },
    // 取右边多少字符，中文两个字节
    right: function(str, n){
		var len = str.length;
		var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(s.length - n, s.length).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(len - s, len);
    },
    // 除去HTML标签
    removeHTML: function(str){
        return str.replace(/<\/?[^>]+>/gi, '');
    },
    //"<div>{0}</div>{1}".format(txt0,txt1);
    format: function(){
        var  str = arguments[0], args = [];
		for (var i = 1, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
        return str.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },
    // toLower
    toLower: function(str){
        return str.toLowerCase();
    },
    // toUpper
    toUpper: function(str){
        return str.toUpperCase();
    },
	// toString(16)
	on16: function(str){
		var a = [], i = 0;
        for (; i < str.length ;) a[i] = ("00" + str.charCodeAt(i ++).toString(16)).slice(-4);
        return "\\u" + a.join("\\u");
	},
	// unString(16)
	un16: function(str){
		return unescape(str.replace(/\\/g, "%"));
	}
};
})();


/*
**************************************************************
	$Array Namespace
	author Tangoboy
	2010-07-03
*/
;
(function(){
window['$Array'] = {
  // 删除
	del: function(arr,n){ 
		if (n<0) return arr; 
		return arr.slice(0,n).concat(arr.slice(n+1,arr.length)); 
	},
	// 数组洗牌 
	"random": function(arr){ 
		var nr=[], me=arr, t; 
		while(me.length>0){ 
			nr[nr.length] = me[t = Math.floor(Math.random() * me.length)]; 
			me = this.del(me,t); 
		} 
		return nr; 
	},
	// 数字数组排序 
	sortNum : function(arr,f){ 
		if (!f) f=0; 
		if (f==1) return arr.sort(function(a,b){return b-a;}); 
		return arr.sort(function(a,b){return a-b;}); 
	},
	// 获得数字数组的最大项 
	getMax : function(arr){ 
		return this.sortNum(arr,1)[0]; 
	},
	// 获得数字数组的最小项 
	getMin : function(arr){ 
		return this.sortNum(arr,0)[0]; 
	},
	// 数组第一次出现指定元素值的位置 
	"indexOf" : function(arr,o){
		if (arr.indexOf) {
			return arr.indexOf(o);
		}
		for (var i=0; i<arr.length; i++) if (arr[i]==o) return i; 
		return -1; 
	},
	// 移除数组中重复的项 
	removeRepeat:function(arr){ 
	var temp = {},a = [],len = arr.length;
      for(var i=0; i < len; i++)  {
          if(typeof temp[arr[i]] === "undefined") {
              temp[arr[i]] = 1;
          }
      }
	  len = 0;
      for(var i in temp) {
          a[len++] = i;
      }
      return a;
	} 
};
})();

/*
**************************************************************
	$Object Namespace
	author Tangoboy
	2010-07-05
*/
;
(function(){
window['$Object'] = {
	//Json转换为对象
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = $String.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			//jQuery.error( "Invalid JSON: " + data );
		}
	},
	//对象的扩展
	extend: function (target,src) {
		for (var it in src) {
			target[it] = src[it];
		}
		return target;
	},
	//循环对象
	each: function (obj, cb) {
		var i = 0;
		for (var it in obj) {
			if(cb(obj[it], it ,i++)=='break') break;
		}
	},
	 //对象的完全克隆
	 clone: function(obj){
		var con = obj.constructor, cloneObj = null;
		if(con == Object){
			cloneObj = new con();
		} else if (con == Function){
			return $Function.clone(obj);
		} else cloneObj = new con(obj.valueOf());

		for(var it in obj){
			if(cloneObj[it] != obj[it]){
				if(typeof(obj[it]) != 'object'){
					cloneObj[it] = obj[it];
				} else {
					cloneObj[it] = arguments.callee(obj[it])
				}
			}
		}
		//cloneObj.toString = obj.toString;
		//cloneObj.valueOf = obj.valueOf;
		return cloneObj;
	 },
	param:function(obj){
		var tarr = [];
		for(k in obj){
			tarr.push(k+"="+obj[k]);
		}
		return tarr.join('&');
	}
};
})();
/*
**************************************************************
	$Event Namespace
	author Tangoboy
	2010-07-05
**************************************************************
      Example:
      var fn = function(){
        alert("页面已加载！");
      }
      $Event.addEvent(window,"load",fn);
      
      $Event.removeEvent(window,"load",fn);
      
*/
;
(function(){
// written by Dean Edwards, 2005
function addEvent(element, type, handler) {
  // 为每个事件处理程序分配一个唯一的id
  if (!handler.$$guid) handler.$$guid = addEvent.guid++;
  // 为该元素的各种事件类型创建一个hash表
  if (!element.events) element.events = {};
  // 为每一个元素/事件对的所有事件处理程序创建一个hash表
  var handlers = element.events[type];
  if (!handlers) {
    handlers = element.events[type] = {};
    // 存储已经存在的事件处理程序(如果有的话)
    if (element["on" + type]) {
      handlers[0] = element["on" + type];
    }
  }
  // 将事件处理程序存储到hash表内
  handlers[handler.$$guid] = handler;
  // 剩下的任务交给一个全局的事件处理程序来搞定
  element["on" + type] = handleEvent;
};
// 一个用来分配唯一ID的计数器
addEvent.guid = 1;
function removeEvent(element, type, handler) {
  // 从hash表里面删除该事件处理程序
  if (element.events && element.events[type]) {
    delete element.events[type][handler.$$guid];
  }
};
function handleEvent(event) {
  var returnValue = true;
  // 取得event对象(IE使用了一个全局的事件对象)
  event = event || fixEvent(window.event);
  // 找到事件处理程序的hash表
  var handlers = this.events[event.type];
  // 执行各个事件处理程序
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};

function fixEvent(event) {
  // 增加符合W3C标准的事件模型
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function() {
  this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
};
window['$Event'] = {
	add:addEvent,
	remove:removeEvent
};
})();

/*
**************************************************************
	$Date Namespace
	author Tangoboy
	2010-07-05
**************************************************************
      Example:
      
      var d =new Date();
      $Date.format(d,'yyyy年MM月dd日'); //2010年07月05日
*/
;
(function(){
window['$Date'] = {
	format: function(date, f){
		var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(f)){
            f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o){
            if (new RegExp("(" + k + ")").test(f)){
                f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return f;
	}
};
})();

/*
**************************************************************
	$Browser Namespace
	author Tangoboy
	2010-07-05
	**************************************************************
      Example:
      $Browser.browser  //msie
      $Browser.browser  //8.0
*/
;
(function(){
window['$Browser'] = (function(){
	var ua=navigator.userAgent.toLowerCase();
	var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
			[];
	return { browser: match[1] || "", version: match[2] || "0" };
})();
})();