Serendip.ResultInfoView = Serendip.Class.extend({
  selector: "#ResultBar_Theme",
  prototypeSelector: "#ResultInfo_Prototype",
  
  manager: null,
  
  init : function(manager){
      this.manager = manager;
      this.$resultsView = $(this.selector);
      this.$prototypeView = $(this.prototypeSelector);
  },
  
  initFromQueryStr: function(queryStr, params){
      
  },  
  
  saveInQueryStr: function(queryStr){
      return queryStr;
  },
  
  buildRequest : function(request){
      return request;
  },   
  
  render : function(data) {
      var infodata = {numDocs: data.response.numFound, time: data.responseHeader.QTime};
	  
      var $element = this.$prototypeView.clone();
      $element = $element.find(".Placeholder").autoRender(infodata);
      
      this.$resultsView.html($element.html());
  },
  
  renderInProgress: function(){
  
  }

});