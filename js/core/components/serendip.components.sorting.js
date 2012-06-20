
Serendip.SortingView = Serendip.Class.extend({
  searchFieldSelector: null,
  searchButtonSelector: null,
  manager: null,
  
  sortQuery: "",
  sortValue: "",
  sortDir: "",
  sortFields: null,
  
  $sortbar_prototype: null,
  $resultbar: null,
  
  init : function(manager){
		this.manager = manager;
		var self = this;
      
		this.$resultbar = $("#ResultBar_Theme");
		this.$sortbar_prototype = $("#SortBar_Prototype");
	  
		this.manager.OnRenderFinished(function(){
			self.OnRenderFinished(self);
		});
  },
  
  bindEvents: function(){
      var $sortbarHrefs = $("a", this.$resultbar);
  },
  
  initFromQueryStr: function(queryStr, params){
		var sortParam = params["sort_param"];
      if (sortParam) {
          this.sortQuery = "&sort=" + sortParam;
          this.sortValue = this.GetSortField(sortParam);
		  this.sortDir = this.GetSortDirection(sortParam);
      }
      
      queryStr += this.sortQuery;
      
      return queryStr;
  },  
  
  handleSortClick: function (sortValue, sortDirection) {

      if (sortValue && sortDirection && sortValue != "relevans") {
          this.sortQuery = "&sort=" + sortValue + " " + sortDirection;
      } else {
          this.sortQuery = "";
      }

      this.sortValue = sortValue;
	  this.sortDir = sortDirection;
      
      this.manager.search();
  },
  
  saveInQueryStr: function(queryStr){
		if (this.sortValue && this.sortDir && this.sortValue != "relevans") {
			queryStr += "&rows=" + "&sort=" + this.sortValue + " " + this.sortDir;
		}
      return queryStr;
  },  
  
  buildRequest : function(request){
		if (this.sortValue && this.sortDir && this.sortValue != "relevans") {
			request += "&rows=" + "&sort=" + this.sortValue + " " + this.sortDir;
		}
		return request;
  },
  
  renderInProgress: function(){
  
  },
  
  render : function(data){

  },
  
  OnRenderFinished: function(self){
    var sortField = self.sortValue;
    var sortDirection = self.sortDir;
		
    var sortFieldId = self.GetIdForFieldName(sortField);

    self.setSortFieldActive(sortFieldId, sortDirection);
	
	$(".view th .sortfield a").unbind('click').bind('click', function () {

		var id = $(this).attr("sort");
		var dir = $(this).attr("direction");

		var fieldname = self.GetFieldNameForId(id);

		self.handleSortClick(fieldname, dir);

		// Return false to avoid the a:href executing
		return false;
	});
  },
  
  setSortFieldActive: function(sortFieldId, sortDirection){
	var cls = this.GetClassNameForRows(sortFieldId);

	// Remove all active sortfields
    $(".view .sortfield .active").removeClass("active").addClass("inactive");
	
	// Make current sortfield active
    var row = $("." + cls);

    var newSortDirection = this.ReverseSortDirection(sortDirection);

    var dirElement = row.find(".sortfield ." + sortDirection);
    dirElement.removeClass(sortDirection).addClass(newSortDirection);
	
	row.find(".sortfield .inactive").removeClass("inactive").addClass("active");
    row.find(".sortfield a").attr("direction", newSortDirection);
  },
  
	GetSortField: function(value) {
		var values = value.split(" ");
		return values[0];
	},

	GetSortDirection: function(sortValue) {
		var sortDirection = "asc";
		var values = sortValue.split(" ");
		if (values.length > 0) {
			var index = values.length - 1;
			if (values[index] == "desc")
				sortDirection = "desc";
		}

		return sortDirection;
	},

	ReverseSortDirection: function(direction) {
		if (direction == "asc") {
			return "desc";
		} else {
			return "asc";
		}
	},
	
	GetFieldNameForId: function(id) {
	  var fieldConfig = serendip.fieldConfig;

	  for (var i = 0; i < fieldConfig.length; i++) {
		  var config = fieldConfig[i];
		  if (config.id == id) {
			  return config.name;
		  }
	  }

	  return "";
	},

	GetIdForFieldName: function(name) {
	  var fieldConfig = serendip.fieldConfig;

	  for (var i = 0; i < fieldConfig.length; i++) {
		  var config = fieldConfig[i];
		  if (config.name == name) {
			  return config.id;
		  }
	  }

	  return "";
	},
	
	GetClassNameForRows: function(cls){
		return cls + "Row";
	},

	getSearchValue : function(){
	return $(this.searchFieldSelector).val();
	},

	setSearchValue : function(value){
	$(this.searchFieldSelector).val(value);
	}

});