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
		        	customComponent : CustomComponent
		        },
		        data : { 
		        	"title" : "文字模块",
		        	"customdata" : "yellow",
		        	"customdata1" : "blue"
		        },
		        oncomplete:function(){
		        },
		        onteardown: function() {
		        	//* remove observer
		        	self.observerCustomComponent.cancel();
		        }
		    });
		    //* 组件回调函数的实现，利用 observe 
		    self.observerCustomComponent = self.ractiveObj.observe('customdata', function($newValue, $oldValue){
        		console.log('callback - observe :: customdata, newValue:' + $newValue + ' oldValue:' + $oldValue);
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
	 * Component : CustomDemo
	 */
	var CustomComponent = Ractive.extend({
		template : `
			<h4 class="title"></h4>
			<div class="btn-group">
				{{yield}}
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

	
	return testcaseComponent;

})