define(["ractive","ueditor"], function(Ractive) {
	var testcaseComponent = {
		dom : $('.dragula-container'),
		ractiveObj : null,
		observerDropDown : null,
		observerRadioAlign : null,
		observerCustomComponent : null,
		toggleSort : true,
		init : function(){
			var self = this;
			self.ractiveObj = new Ractive({
		        el : self.dom[0],
		        template : '#template-use-component',
		        components :{ 
		        	dropdown: DropdownComponent,
		        	componentueditor : UeditorComponent,
		        	customComponent : CustomComponent,
		        	textinput : TextInputComponent
		        },
		        data : { 
		        	"title" : "文字模块",
		        	"inputtext" : "单行文本内容",
		        	"inputtext1" : "百年孤寂",
		        	"detail" : "文字详情",
		        	"detail2" : "文字详情222",
		        	"isShowComment" : false,
		        	"selected" : "002",
		        	"selected2" : "003",
		        	"align" : "center",
		        	"color" : "green",
		        	"checked1" : true,
		        	"bgcolor" : "blue",
		        	"link" : {"type":0, "url":"http://www.qq.com", "blank":true},
		        	"customdata" : "blue"
		        },
		        formatClassName : function($isShow){
		        	if($isShow){
		        		return 'open';
		        	}else{
		        		return '';
		        	}
		        },
		        onrender:function(){
		        	var cs = this.findComponent('dropdown'); //* find component by name, return ractive instance
		        	// cs.destroy()
		        },
		        onteardown: function() {
		        	//* remove observer
		        	self.observerDropDown.cancel();
		        	self.observerRadioAlign.cancel();
		        	self.observerCustomComponent.cancel();
		        },
		        /**
		         * Set Ueditor Content to Ractive.keypath, use in : save project data
		         */
		        setUeditor : function(){
		        	//* destroy ueditor
		        	var cu = this.findAllComponents('componentueditor');	
					cu.forEach(function(c) {
					    c.setContent();
					})	        	
		        },
		        /**
		         * Recreate Ueditor-Instance, use in : After Sortable EditPanel
		         */
		        recreateUeditor : function(){
		        	var cu = this.findAllComponents('componentueditor');	
					cu.forEach(function(c) {
					    c.recreate();
					})
		        }
		    });
		    //* 组件回调函数的实现，利用 observe : dropdown-menu change
		    self.observerDropDown = self.ractiveObj.observe('selected', function($newValue, $oldValue) {
        		console.log('callback - observe :: selected:' + $newValue + ' oldValue:' + $oldValue);
        	})
        	self.observerRadioAlign = self.ractiveObj.observe('align', function($newValue, $oldValue){
        		console.log('callback - observe :: align, newValue:' + $newValue + ' oldValue:' + $oldValue);
        	})
        	self.observerCustomComponent = self.ractiveObj.observe('customdata', function($newValue, $oldValue){
        		console.log('callback - observe :: customdata, newValue:' + $newValue + ' oldValue:' + $oldValue);
        	})
		    //
		    self.initEvent();
		},

		initEvent : function(){
			var self = this;
			var btnGetData = $('.btn-getData-prj');
			btnGetData.click(function(event) {
				self.ractiveObj.setUeditor();
				console.log(self.ractiveObj.get())
			});
			//
			var btnSortUeditor = $('.btn-sortUeditor');
			btnSortUeditor.click(function(event) {
				var domTop = $('.row.top');
				var domBottom = $('.row.bottom');
				if(self.toggleSort){
					domTop.before(domBottom);
					self.toggleSort = false;
				}else{
					domBottom.before(domTop);
					self.toggleSort = true;
				}
				//
				self.ractiveObj.recreateUeditor();				
			});
			//
			btnDestroy = $('.btn-destroy-prj');
			btnDestroy.click(function(event) {
				self.ractiveObj.teardown();
			});
		}
	}

	/**
	 * Component : CustomDemo
	 */
	var CustomComponent = Ractive.extend({
		template : `
			<h4 class="title"></h4>
			<div class="btn-group">
				<a class="btn btn-color" value="blue">Blue</a>
				<a class="btn btn-color" value="yellow">Yellow</a>
				<a class="btn btn-color" value="red">Red</a>
			</div>
			<p><span></span> The select button is <span class="color-info"></span></p>
			<div>
				<a class="btn btn-getdata">Get Value</a>
			</div>
		`,
		css : `
			.btn{display:inline-block; cursor:pointer; border:1px solid #000; color:#000; padding:5px 8px; font-size:12px;}
			.btn:hover{background-color:#0057ff;color:#ffffff;}
			.btn.active{background-color:#0057ff; color:#ffffff;}
		`,
		data : {},
		oninit : function(){
			console.log(this.get('value'));
			console.log(this.get('initdata'));
		},
		onrender : function(){
			var self = this;
			var domTitle = $(self.find('.title'));
			domTitle.text(self.get('initdata'));
			//
			var domListBtn = $(self.findAll('.btn-color')); // .findAll() - belong to ractivejs api, $(ractive-dom)-  将 ractive-dom 转化为 jQ-dom
			domListBtn.each(function(index, el) {
				var btn = $(el);
				btn.click(function(event) {
					var value = $(this).attr('value');
					self.set('value', value);
					self.customfuncInfo(value);
					self.customfuncStyleBtn(value);
				});
			});
			//
			var btnGetData = $(self.find('.btn-getdata'));
			btnGetData.click(function(event) {
				console.log(self.get('value'));
			});
			//
			self.customfuncStyleBtn(self.get('value'));
			self.customfuncInfo(self.get('value'))
		},
		customfuncInfo : function($value){
			var domInfo = $(this.find('.color-info'));
			domInfo.text($value);
		},
		customfuncStyleBtn : function($value){
			var domListBtn = $(this.findAll('.btn-color'));
			domListBtn.each(function(index, el) {
				if($(el).attr('value') == $value){
					$(el).addClass('active');
				}else{
					$(el).removeClass('active');
				}
			});
		}
	})

	/**
	 * Component : TextInput 
	 */
	var TextInputComponent = Ractive.extend({
		template : `
			<input type="text" class="input-text" value={{value}}>
			<span class="input-maxlength">字数</span>
		`,
		css : `
			.input-text{width:100%; border:1px solid #000; padding:5px;}
			.input-maxlength{display:inline-block; font-size:10px; position:absolute;right:0; top:7px;}
		`,
		data:{},
		oninit : function(){
			// console.log(this.get('value'));
		},
		domInputText : null,
		onrender : function(){
			var self = this;
			var maxlength = self.get('maxlength');
			if(maxlength){
				self.domInputText = $(self.find('.input-text'));
				var domTips = $(self.find('.input-maxlength'));
				//
				self.initDomTips(self.get('value'), domTips, maxlength);
				//
				self.domInputText.focus(function(){
			        self.checkInputLenghtFun(self.domInputText, maxlength, domTips);
			    });
			}
		},
		onteardown : function(){
			var self = this;
			if(self.domInputText != null){
				self.domInputText.unbind("focus");
			}
		},

		/* init : dom-tips */
		initDomTips : function($initTextVal, $domTips, $maxlength){
			var self = this;
			var domTips = $domTips;
			domTips.text('0/'+$maxlength);
			//
			var maxStrLength = $maxlength;
	        //var tempMaxLenght = maxStrLength;
	        var inputStr = $initTextVal;
	        var currInputLength = self.inputCountLengthFun(inputStr);
	        var leavlNum = maxStrLength - currInputLength;
	        //改变已经输入字符
	        var currHmtlStr = Math.floor(currInputLength)+"/"+maxStrLength;
	        domTips.html(currHmtlStr);
	        //
	        if(currInputLength>maxStrLength){
	           	var overHtmlStr = "<label style='color: #f00;'>"+leavlNum+"</label>/"+maxStrLength;
	            domTips.html(overHtmlStr);
	        }
		},
		/* 判断输入框字符串长度 string length */
	    inputCountLengthFun : function (str) {
	        var r = 0;
	        for (var i = 0; i < str.length; i++) {
	            var c = str.charCodeAt(i);
	            if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
	                r += 0.5;
	            } else {
	                r += 1;
	            }
	        }
	        return r;
	    },
	    /* 在 change 事件里，改变字符串的长度提示 */
	    checkInputLenghtFun : function ($domInputText, $maxWords, $domTips){
	    	var self = this;
	    	var domInputText = $domInputText;
	        var maxStrLength = $maxWords;
	        var domTips = $domTips;
	        //
	        domInputText.off("input").on("input",function(){
	            var inputStr = domInputText.val();
	            var currInputLength = self.inputCountLengthFun(inputStr);
	            var leavlNum = maxStrLength - currInputLength;
	            //改变已经输入字符
	            var currHmtlStr = Math.floor(currInputLength)+"/"+maxStrLength;
	            domTips.html(currHmtlStr);
	            //
	            if(currInputLength>maxStrLength){
	               	var overHtmlStr = "<label style='color: #f00;'>"+leavlNum+"</label>/"+maxStrLength;
	                domTips.html(overHtmlStr);
	            }
	        });
	    }
	})

	/**
	 * Component : Ueditor
	 */
	var UeditorComponent = Ractive.extend({
		template:`
			<textarea class="input-textarea"></textarea>
		`,
		css :`
		`,
		data: {},
		ueditorObj : null,
		oninit :function(){
			var self = this;
			// console.log(self.get('maxlength'));
		},
		onrender:function(){
			var self = this;
			domTextArea = $(self.find('.input-textarea'));
			self.ueditorObj = self.newUeditor(domTextArea, self.get('value'), self.get('maxlength'));			
        },
        onteardown : function(){
			var self = this;
			if(self.ueditorObj!= null){
				self.ueditorObj.destroy();			
			}
		},
        newUeditor : function($element, $value, $maxWords){
			var editor;	
			if($maxWords){
				editor = new UE.ui.Editor({wordCount: true, maximumWords: $maxWords, wordCountMsg: "{#count} / {#leave}", wordOverFlowMsg:"<span style='color:red;''>你输入的文字个数已超出最大值，超出文字可能不会被显示！</span>"});
			}else{
				editor = new UE.ui.Editor({wordCount: false});
			}
			var textAreaDom = $element[0];
			editor.render(textAreaDom);			//@grammar editor.render(containerDom);   //可以直接指定容器对象
			editor.ready(function(){
				editor.setContent($value);		//init: editor data
			})
			return editor;
		},
		setContent : function(){
			try {this.set('value', this.ueditorObj.getContent());}
			catch(err) {console.log('setContent:' + err) }
		},
		recreate : function(){
			var self = this;
			self.setContent();
			try
			{	self.ueditorObj.destroy();
				domTextArea = $(self.find('.input-textarea'));
				self.ueditorObj = self.newUeditor(domTextArea, self.get('value'), self.get('maxlength'));	
			}catch(err)
			{
				console.log('recreate:' + err)
			}			
		}		
	});

	/**
	 * Component : Dropdown Menu
	 * 关键点：组件内的代码可以将组件实例自定义的属性值(eg:value)，作为 self's ractive.keypath，
	 * 由此实现对组件实例的读(self.get('value'))，或写(self.set('value', setvalue))。
	 */
	var DropdownComponent = Ractive.extend({
		template:`
			<a class="btn btn-default btn-toggle"><!-- btn toggle --></a>
			<div class="dropdown-menu hide">
				{{yield}}
			</div>
		`,
		css :`
			.dropdown-menu li{cursor:pointer;}
			.dropdown-menu li.active{background-color: #ff0000;}
		`,
		data: {},
		domDropdownMenu : null,
		oninit : function(){
			var self = this;
			// console.log(self.get('value'));	        
		},
		onrender : function(){
			var self = this;
	        var domOL = $(self.find('ol'));
	        self.domDropdownMenu = $(self.find('.dropdown-menu'));
	        var domMenuLi = domOL.children('li');
	        var btnToggle = $(self.find('.btn-toggle'));
	        //
		    var setItemsActive = function($domActive){
		    	domMenuLi.each(function(index, el) {
		    		$(el).removeClass('active');
		    	});
		    	$domActive.addClass('active');
		    }
	        //
	        btnToggle.click(function(event) {
	        	self.toggleList();
	        	event.stopPropagation();
	        });
	        //
	        domMenuLi.each(function(index, el) {
	        	var item = $(el);
	        	if(self.get('value') == item.attr('value')){
	        		btnToggle.text(item.text());
	        		item.addClass('active');
	        	}
	        	//
	        	item.click(function(event) {
	        		var selectVal = $(this).attr('value');
	        		self.set('value', selectVal);
	        		btnToggle.text($(this).text());
	        		setItemsActive($(this));
	        	});
	        });
        },
        onteardown : function(){
        	document.removeEventListener('click', self.listener);
        },

        listener : function($self) {
        	var self =  $self;
        	self.domDropdownMenu.addClass('hide');
	    	document.removeEventListener('click', self.listener);
	    },

	    toggleList : function(){
	    	var self = this;
	    	if(self.domDropdownMenu.hasClass('hide')){  //* case : show domDropdownMenu
        		self.domDropdownMenu.removeClass('hide');
        		document.addEventListener('click', self.listener.bind(null, self));
        	}else{								   //* case : hide domDropdownMenu	
        		self.domDropdownMenu.addClass('hide');
        		document.removeEventListener('click', self.listener);	        		
        	}
	    }
	});

	return testcaseComponent;

})