define(["ractive"], function(Ractive) {
	var testcaseComponent = {
		dom : $('.dragula-container'),
		ractiveObj : null,
		observerCustomComponent : null,
		init : function(){
			var self = this;
			self.ractiveObj = new Ractive({
		        el : self.dom[0],
		        template : '#template-use-component',
		        components :{ 
		        	customComponent : CustomComponent,
		        	innerComponent : InnerComponent
		        },
		        data : { 
		        	"title" : "文字模块",
		        	"customdata" : "yellow",
		        	"inputtext" : "这是引用了马尔克斯的话"
		        },
		        onrender : function(){
		        	var innerComponent = this.findComponent('innerComponent');
		        	innerComponent.resetTemplate('#template-inner-content-' + this.get('customdata'));
		        },
		        onteardown: function() {
		        	//* remove observer
		        	self.observerCustomComponent.cancel();
		        }
		    });
		    //* 组件回调函数的实现，利用 observe 
		    self.observerCustomComponent = self.ractiveObj.observe('customdata', function($newValue, $oldValue){
        		console.log('callback - observe :: customdata, newValue:' + $newValue + ' oldValue:' + $oldValue);
        		if($oldValue){
        			var innerComponent = self.ractiveObj.findComponent('innerComponent');
        			innerComponent.resetTemplate('#template-inner-content-'+$newValue);
        		}        		
        	});

        	self.initEvent();
		},

		initEvent : function(){
			var self = this;
			var btnGetData = $('.btn-getData-prj');
			btnGetData.click(function(event) {
				console.log(self.ractiveObj.get())
			});
			//
			btnDestroy = $('.btn-destroy-prj');
			btnDestroy.click(function(event) {
				self.ractiveObj.teardown();
			});
		}
	}

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
	 * Component : Inner Component
	 */
	var InnerComponent = Ractive.extend({
		template : ``,
		data : {},
		components :{ 
        	textinput : TextInputComponent
        }
	})

	/**
	 * Component : CustomDemo
	 */
	var CustomComponent = Ractive.extend({
		template : `
			<h4 class="title"></h4>
			<div class="btn-group">
				{{yield}}
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

	

	return testcaseComponent;

})