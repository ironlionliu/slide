(function(){
	
	window.slider = function(sliders){
		this._init(sliders);
		this._preNext();
		this._initListener();
		this._turnSlider();
		return this;
	}
	
	
	slider.prototype = {
		index : 0,
		num : 0,
		handleTurn : "",
		_init : function(sliders){
			this.num = sliders.length;
			this.sliders = sliders;
			this._renderSliders(this.sliders);
			return this;
		},
		_initListener : function(){
			var _self = this;
			var template_ctrl = _self._getDom("#template_ctrl").childNodes;		
			for(var i = 0; i < template_ctrl.length; i++){
				/*凡是类似代码，宜用时间代理完成，在dom上附加额外信息*/
				(function(i){
					template_ctrl[i].addEventListener("click",function(){
						_self._switchSlider(i,"");
					});
					})(i);
				
				/*
				template_ctrl[i].addEventListener("click",function(){
					(function(){
						var _i = i;
						alert(_i);
						_self._switchSlider(_i,"");
						})();
						
						
					});/*这个立即执行函数没有起到保存变量的效果，原因是它的外层都没有立即执行！*/
				}
				
			/*
			_self._getDom("#template_main").ontouchstart = function(e){	alert("haha")};
			
			console.log(_self._getDom("#template_main"))/**/
			_self._getDom("#template_main").addEventListener("touchstart",start);
			var startX = 0;
			var endX = 0;
			
			
			function start(e){
				var _self = this;
				var touch = e.touches[0];
				startX = touch.pageX;
			}
			_self._getDom("#template_main").addEventListener("touchend",end);/**/
			function end(e){
				var touch = e.changedTouches[0];
				endX = touch.pageX;
				var dx = startX - endX;
				if(dx < 50){
					_self._switchSlider((_self.index+4)%_self.num,"pre");
				}else if(dx > -50){
					_self._switchSlider((_self.index+1)%_self.num,"next");
				}
			}
		},
		_renderSliders : function(sliders){
			var main_i = this._getDom("#template_main").innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			var ctrl_i = this._getDom("#template_ctrl").innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			
			var main_html = [];
			var ctrl_html = [];
			var length = sliders.length;
			for(var i = 0; i< length; i++){
				var _html_main = main_i.replace(/{{index}}/g,sliders[i].index)
									   .replace(/{{src}}/g,sliders[i].src)
									   .replace(/{{class}}/g,sliders[i].class)
									   .replace(/{{h2}}/g,sliders[i].h2)
									   .replace(/{{h3}}/g,sliders[i].h3)
									   .replace(/{{href}}/g,sliders[i].href);
				var _html_ctrl = ctrl_i.replace(/{{index}}/g,sliders[i].index)
									   .replace(/{{src}}/g,sliders[i].src);
				main_html.push(_html_main);
				ctrl_html.push(_html_ctrl);
				}
			this._getDom("#template_main").innerHTML = main_html.join("");
			this._getDom("#template_ctrl").innerHTML = ctrl_html.join("");
		},
		
		
		_switchSlider : function(index,mode){
			var _self = this;
			var newClass = "";
			var oldClass = 'main-i_left|main-i_active|main-i_right|main-i_pre|main-i_next';
			var dom = this._getDom("#template_main").childNodes;
			var dom_ctrl = this._getDom("#template_ctrl").childNodes;
			if(mode == "next"){
				/*main-i_active --> main-i_left*/
				_self._changeClass("main-i_pre",oldClass,dom[_self.index]);
				dom_ctrl[_self.index].setAttribute("class","ctrl-i");
				/*main-i_active的下一个 --> main-i_right --> main-i_active*/
				_self.index = (_self.index + 1) % _self.num;
				_self._changeClass("main-i_right",oldClass,dom[_self.index]);
				setTimeout(_active,100);
				function _active(){
					_self._changeClass("main-i_active",oldClass,dom[_self.index]);
					dom_ctrl[_self.index].setAttribute("class","ctrl-i active");
				}
			}else if(mode == "pre"){
				/*main-i_active --> main-i_left*/
				_self._changeClass("main-i_next",oldClass,dom[_self.index]);
				dom_ctrl[_self.index].setAttribute("class","ctrl-i");
				/*main-i_active的下一个 --> main-i_right --> main-i_active*/
				_self.index = (_self.index + _self.num - 1) % _self.num;
				_self._changeClass("main-i_left",oldClass,dom[_self.index]);
				setTimeout(_active,100);
				function _active(){
					_self._changeClass("main-i_active",oldClass,dom[_self.index]);
					dom_ctrl[_self.index].setAttribute("class","ctrl-i active");
				}
				
			}else{
				
				if(index > _self.index){
					/*main-i_active --> main-i_pre*/
					_self._changeClass("main-i_pre",oldClass,dom[_self.index]);
					dom_ctrl[_self.index].setAttribute("class","ctrl-i");
					/*index在右 --> main-i_right --> main-i_active*/
					_self.index = index;
					_self._changeClass("main-i_right",oldClass,dom[_self.index]);
					setTimeout(_active,100);
					function _active(){
						_self._changeClass("main-i_active",oldClass,dom[_self.index]);
						dom_ctrl[_self.index].setAttribute("class","ctrl-i active");
					}
					
				}else if(index < _self.index){
					/*main-i_active --> main-i_next*/
					_self._changeClass("main-i_next",oldClass,dom[_self.index]);
					dom_ctrl[_self.index].setAttribute("class","ctrl-i");
					/*index在右 --> main-i_left --> main-i_active*/
					_self.index = index;
					_self._changeClass("main-i_left",oldClass,dom[_self.index]);
					setTimeout(_active,100);
					function _active(){
						_self._changeClass("main-i_active",oldClass,dom[_self.index]);
						dom_ctrl[_self.index].setAttribute("class","ctrl-i active");
					}
				}
				
			}
		},
		
		_changeClass : function(newClass,oldClass,_dom){
			newClass = _dom.getAttribute("class").replace(new RegExp(oldClass),newClass);
			_dom.setAttribute("class",newClass);
		},
		
		
		_turnSlider : function(){
			var _self = this;
			var _interval = 4000;
			function _turn(){
				_self._switchSlider((_self.index+1)%_self.num,"next");
				}
			this._getDom(".slider")[0].onmouseenter = function(){
				clearInterval(_self.handleTurn);
				}
			this._getDom(".slider")[0].onmouseleave = function(){
				_self.handleTurn = setInterval(_turn,_interval);
				}
			_self.handleTurn = setInterval(_turn,_interval);
			this.index = _self.index;
			this.handleTurn = _self.handleTurn;
		},
		_preNext : function(){
			var _self = this;
			_self._getDom("#pre").onclick = function(){
				_self._switchSlider((_self.index+4)%_self.num,"pre");
				}
			_self._getDom("#next").onclick = function(){
				_self._switchSlider((_self.index+1)%_self.num,"next");
				}
			},
		
		_getDom : function(name){
			if(name.substr(0,1) == "."){
				return document.getElementsByClassName(name.substr(1));
			}
			else if(name.substr(0,1) == "#"){
				return document.getElementById(name.substr(1));
			}
		}
		
	}	
})();