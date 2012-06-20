Serendip.ResultPrPageView = Serendip.Class.extend({
  selector: "#ResultsPrPage",
  prototypeSelector: "#ResultsPrPage_Prototype",
  numResults: 10,
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
		request += "&rows=" + this.numResults;
		return request;
  },   
  
  render : function(data) {
	this.renderHtml();
	this.bindChangeResultsPrPage();
	
	$(this.selector).find("select").val(self.numResults);
  },
  
  renderHtml: function(){
	var infodata = {};
	  
	var $element = this.$prototypeView.clone();
	$element = $element.find(".Placeholder").autoRender(infodata);
      
	this.$resultsView.html($element.html());
  },
  
	bindChangeResultsPrPage: function(){
		self = this;
		
		$(this.selector).find("select").change(function(){
			self.numResults = $(this).val();
			self.manager.search();
		});
	},
  
  renderInProgress: function(){
  
  }

});