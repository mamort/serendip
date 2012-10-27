Serendip.InProgressView = Serendip.Class.extend({
  view: null,
  serendip: null,
  
  init : function(serendip){
  	var self = this;
 	this.serendip = serendip;
  	this.view.hide();
      
  	this.serendip.on("wait", function(){
  		self.view.show();  
  	});
  	
  	this.serendip.on("render", function(){
  	    self.view.hide();
  	});
  }
});