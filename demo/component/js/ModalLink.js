define(['ractive'], function(Ractive) {
	/**
	 * @requires ractive
	 * @alias ModalLink
	 * @class
	 * @classdesc Modal of Set Link Url
	 */
	function ModalLink(){
		this.ractiveObj = null;
		this.callback = null;
		this.dom = null;
	}

	ModalLink.prototype = {
		/**
		 * init 
		 * @param  {json} $data   - data for ractive instance
		 * @param  {function} $callback - click btn-close or btn-confirm fire
		 */
		init : function($data, $callback){
			var self = this;
			self.callback = $callback;
			//
			var html = `<div class="modal">
					        <div class="table-box">
					            <div class="modal-dialog  table-cell">                
					            </div>
					        </div>
					    </div>
					    <div class="modal-backdrop"></div>`;
			$('body').append(html);
			//
			self.ractiveObj = new Ractive({
				el : $('.modal-dialog')[0],
	            template : '#template-modal-link',
	            data : $data,
	            oncomplete:function(){
	            	self.renderComplete();	            	
	            }
	        });
		},

		/**
		 * Render Complete, define btn-event
		 */
		renderComplete : function(){
			var self = this;
			$('.modal').show();
			$('.modal-backdrop').show();
			//
			self.dom = $('#modal-link');
			//
			var btnConfirm = self.dom.find('.btn-confirm');
			btnConfirm.click(function(event) {
				var data = self.ractiveObj.get();
				self.destroy();
				self.callback(true, data);
			});
			//
			var btnClose = self.dom.find('.btn-close');
			btnClose.click(function(event) {
				self.destroy();
				self.callback(false, null)
			});
		},

		/**
		 * destroy
		 */
		destroy : function(){
			var self = this;
			$('.modal').remove();
			$('.modal-backdrop').remove();
			self.ractiveObj.teardown();
			self.ractiveObj = null;
		}
	}
	
	return ModalLink;
})

