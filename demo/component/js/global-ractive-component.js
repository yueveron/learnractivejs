define(['ractive', 'ModalLink'], function(Ractive, ModalLink) {
	/**
    * Define Global Ractive Component
    */
    Ractive.components.componentlink = Ractive.extend({
		template:`
		   <button on-click="showLinkPanel">add Link</button>
		   <br>
		   <button on-click="removeLink">remove Link</button>
		   <br>
		   <button on-click="getData" class="btn-getData">get data</button>
		   `,
		data: {},
		onrender :function(){
			var self = this;
			//* this - refer to component-wrapper
			self.on('getData', function(event) {
				console.log($(self.find('.btn-getData')).attr('class')) //* API:this.find() - Can find the dom and conver dom to jQueryObject
				console.log(self.get('list'));
	        });

	        self.on('showLinkPanel', function(event){
	        	var modalLinkObj = new ModalLink();
	        	var data = self.get('list',{virtual : true});  //* .get({virtual:true}) - get pure-data, not shadow-clone
	        	if(typeof data === 'object'){
	        		// console.log(data)
	        		modalLinkObj.init(data, function($isConfirm, $data){
		        		if($isConfirm){
		        			self.set('list', $data); 
		        		}
		        		modalLinkObj = null;
		        	})	
	        	}else{
	        		console.log('none of data')
	        	}	        	
	        	// this.set('list',{type: 1, url: "http://www.tencent.com", blank: false})
	        });

	        self.on('removeLink', function(event){
	        	console.log('remove link');
	        	self.set('list',{type: 0, url: "", blank: true})
	        });
		},
		oncomplete:function(){
			// console.log('oncomplete')
	    }
	});
})
