Serendip.PagerView = Serendip.Class.extend({
  selector: "#PagerView",
  prototypeSelector: "#Pager_Prototype",
  windowSize: 5,
  pages: 10,
  resultsPrPage: 10,
  startDoc: 0,
  
  manager: null,
  
  $view: null,
  $view_prototype: null,
  
  init: function(manager){
      this.manager = manager;
  
      this.$view = $(this.selector);     
      this.$view_prototype = $(this.prototypeSelector);
  },
  
  initFromQueryStr: function(queryStr, params){
      if (params["start_param"])
          this.startDoc = params["start_param"];
      else
          this.startDoc = 0;
          
      this.manager.startDoc = this.startDoc;
  },     
  
  saveInQueryStr: function(queryStr){
      queryStr += "&start=" + this.manager.startDoc;
      
      return queryStr;
  },  
  
  buildRequest : function(request){
     request += "&start=" + this.manager.startDoc;
     return request;
  },  
  
  renderInProgress: function(){
  
  },  
  
  bindEvents: function(){
      var $pagingHrefs = $("li a", this.$view);
      
      var self = this;
      
      $pagingHrefs.unbind('click').bind('click', function(){
          var page = $(this).attr("page");
          
          page = page - 1;
          self.startDoc = page * self.resultsPrPage;
          
          self.manager.startDoc = self.startDoc;
          self.manager.search();
          
          // Return false to avoid the a:href executing
          return false;
      });  
  },  
  
  render: function(data) {
      this.startDoc = data.response.start;
      var numDocs = data.response.numFound;

      var totalPages = Math.ceil(numDocs / this.resultsPrPage);
      var currentPage = Math.ceil(this.startDoc / this.resultsPrPage) + 1;

      var start = (currentPage - this.windowSize) + 1;
      var end = (currentPage + this.windowSize) + 1;

      if (start < 1) start = 1;
      if (end > totalPages) end = totalPages + 1;

      var dif = end - start;
      
      if (dif < this.pages){
          end += this.pages - dif + 1;
      }
      
      if (start < 1) start = 1;
      if (end > totalPages) end = totalPages + 1;

      this.renderPagerImpl(currentPage, totalPages, start, end);
      
      this.bindEvents();
  },

  renderPagerImpl : function(currentPage, totalPages, windowStart, windowEnd){
      var pagingRowsData = [];
      
      var paging = this.$view_prototype.clone();
      
      // Render previous page
      if(currentPage > 1){
        var prevPage = currentPage-1;
        
        var pageData = createPageData(prevPage, "inactive", "inactive", "inactive", "active");          
        pagingRowsData.push(pageData);
      }
          
      // Render pages
      for(var i = windowStart; i < windowEnd; i++){
        var rowHtml = "";
        
        var currentPageActive = "inactive";
        var regularPageActive = "active";
        if(i == currentPage){
          currentPageActive = "active";
          regularPageActive = "inactive";
        }
        
        var pageData = createPageData(i, regularPageActive, currentPageActive, "inactive", "inactive");
        pagingRowsData.push(pageData);
      }
      
      // Render next page
      if(currentPage < totalPages){
        var nextPage = currentPage+1;
        
        var pageData = createPageData(nextPage, "inactive", "inactive", "active", "inactive");
        pagingRowsData.push(pageData);
      } 
      
      var data = {
        "pageRow": pagingRowsData
      };           
              
      if(totalPages > 1){
          paging = paging.find(".Placeholder").autoRender(data);
          this.$view.html(paging.html());
      }else{
          this.$view.html("");
      }
      
      function createPageData(page, regularPageActive, currentPageActive, nextPageActive, prevPageActive){
        var pageData = {
          "page": page,
          "regularPageActive": regularPageActive,
          "currentPageActive": currentPageActive,
          "nextPageActive": nextPageActive,
          "prevPageActive": prevPageActive
        };
        
        return pageData;
      }
  }
});