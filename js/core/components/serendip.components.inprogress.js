Serendip.InProgressView = Serendip.Class.extend({
  view: null,
  serendip: null,
  
  init : function(serendip){
  	var self = this;
 	this.serendip = serendip;
  	this.view.hide();
      
  	this.serendip.on("wait", function(){
  		self.renderInProgress();
  	});
  },
  
  initFromQueryStr: function(queryStr, params){
      
  },  
  
  saveInQueryStr: function(queryStr){
      return queryStr;
  },
  
  buildRequest : function(request){
      return request;
  },   
  
  renderInProgress: function(){
      this.view.show();   
  },  
  
  render : function(data) {
      this.view.hide();
  }
});