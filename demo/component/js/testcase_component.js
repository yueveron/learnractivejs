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
		        	customComponent : CustomComponent
		        },
		        data : { 
		        	"title" : "文字模块",
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
		        oncomplete:function(){
		        	var cs = this.findComponent('dropdown'); //* find component by name, return ractive instance
		        	// cs.destroy()
		        },
		        onteardown: function() {
		        	//* remove observer
		        	self.observerDropDown.cancel();
		        	self.observerRadioAlign.cancel();
		        	self.observerCustomComponent.cancel();
		        	//* destroy ueditor
		        	var cu = this.findAllComponents('componentueditor');	
					cu.forEach(function(c) {
					    c.destroy();
					})	        	
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
		oncomplete : function(){
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
		destroy : function(){
			var self = this;
			if(self.ueditorObj!= null){
				self.ueditorObj.destroy();			
			}
		},
		oncomplete:function(){
			var self = this;
			domTextArea = $(self.find('.input-textarea'));
			self.ueditorObj = self.newUeditor(domTextArea, self.get('value'), self.get('maxlength'));			
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
		oninit :function(){
			var self = this;
			// console.log(self.get('value'));	        
		},
		destroy : function(){
			console.log('destroy DropdownComponent')
		},
		oncomplete:function(){
			var self = this;
	        var domOL = $(self.find('ol'));
	        var domDropdownMenu = $(self.find('.dropdown-menu'));
	        var domMenuLi = domOL.children('li');
	        var btnToggle = $(self.find('.btn-toggle'));
	        //
	        var listener = function() {
	        	domDropdownMenu.addClass('hide');
		    	document.removeEventListener('click', listener);
		    };
		    //
		    var toggleList = function(){
		    	if(domDropdownMenu.hasClass('hide')){  //* case : show domDropdownMenu
	        		domDropdownMenu.removeClass('hide');
	        		document.addEventListener('click', listener);
	        	}else{								   //* case : hide domDropdownMenu	
	        		domDropdownMenu.addClass('hide');
	        		document.removeEventListener('click', listener);	        		
	        	}
		    }
		    //
		    var setItemsActive = function($domActive){
		    	domMenuLi.each(function(index, el) {
		    		$(el).removeClass('active');
		    	});
		    	$domActive.addClass('active');
		    }
	        //
	        btnToggle.click(function(event) {
	        	toggleList();
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
        }
	});

	return testcaseComponent;

})