define(["ractive","dateTimePicker"], function(Ractive) {
	var testcaseComponent = {
		dom : $('.dragula-container'),
		ractiveObj : null,
		init : function(){
			var self = this;
			self.ractiveObj = new Ractive({
		        el : self.dom[0],
		        template : '#template-use-component',
		        components :{ 
		        	datePickerComponent : DatePickerComponent
		        },
		        data : { 
		        	"title" : "文字模块",
		        	"bookdate" : "2018-01-11",
		        	"studydate" : "2018-09-01"
		        },
		        oncomplete:function(){
		        },
		        onteardown: function() {		        	
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
	 * Component : DatePicker
	 */
	var DatePickerComponent = Ractive.extend({
		template : `
			<input type="text" class="datetimepicker"/>
			<a class="btn btn-getdata">Get Value</a>
		`,
		css : `
			.datetimepicker{border:1px solid #000;}
			.btn{display:inline-block; cursor:pointer; border:1px solid #000; color:#000; padding:5px 8px; font-size:12px;}
		`,
		data : {},
		customDom : null,
		oninit : function(){
			console.log(this.get('value'));
		},
		onrender : function(){
			var self = this;
			$.datetimepicker.setLocale('ch');
			self.customDom = $(this.find('.datetimepicker'));
			self.customDom.datetimepicker({
				format:"Y-m-d", //格式化日期
				timepicker:false, //关闭时间选项
				value:this.get('value'),
				onChangeDateTime : function(dp,$input){
					self.set('value', $input.val());
				}
			});
			//
			var btnGetData = $(self.find('.btn-getdata'));
			btnGetData.click(function(event) {
				console.log(self.get('value'));
			});
		},
		onteardown : function(){
			// console.log('datePickerComponent :: teardown')
			var self = this;
			self.customDom.datetimepicker('destroy');
		}
	})

	return testcaseComponent;

})