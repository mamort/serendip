
Serendip.SearchView = Serendip.Class.extend({
  searchFieldSelector: null,
  searchButtonSelector: null,
  manager: null,
  
  init : function(manager){
      this.manager = manager;
      var self = this;

      $(this.searchButtonSelector).unbind('click').bind('click', function () {

          var value = self.getSearchValue();

          // do search
          self.manager.searchValue = value;
          self.manager.search();

          return false;
      });
  },
  
  initFromQueryStr: function(queryStr, params){
      $(this.searchFieldSelector).val(params["q_param"]);
  },  
  
  saveInQueryStr: function(queryStr){
      var value = this.getSearchValue();
      value = encodeURIComponent(value);
      queryStr += "&q=" + value;
      
      return queryStr;
  },  
  
  buildRequest : function(request){
      var queryValue = this.manager.searchValue;
      
      // Illegal to start query with '*' or '?'
      if (queryValue[0] == '*' || queryValue[0] == '?') {
          queryValue = queryValue.substring(1, queryValue.length);
          this.setSearchValue(queryValue);
      }

      if (queryValue == "") {
          queryValue = "*:*";
      }

      var query = encodeURIComponent(queryValue);
      
      request += "&q=" + query;
    
      return request;
  },
  
  renderInProgress: function(){
  
  },
  
  render : function(data){
  
  },
  
  getSearchValue : function(){
    return $(this.searchFieldSelector).val();
  },
  
  setSearchValue : function(value){
    $(this.searchFieldSelector).val(value);
  }

});