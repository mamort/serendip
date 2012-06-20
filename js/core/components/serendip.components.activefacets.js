
Serendip.ActiveFacetsView = Serendip.Class.extend({
  configuredFacets: null,
  $activeFacets: null,
  $noActiveFacets: null,
  $activeFacets_prototype: null,
  
  activeFacetsSelector: "",
  noActiveFacetsSelector: "",
  activeFacetsPrototype: "",
  facetsRemoveSelector: "",
  
  manager: null,
  facetCore: null,
  
  init: function(manager){
      this.manager = manager;
  
      this.$activeFacets = $(this.activeFacetsSelector);  
      this.$noActiveFacets = $(this.noActiveFacetsSelector);
     
      this.$activeFacets_prototype = $(this.activeFacetsPrototype);      
      
      this.$noActiveFacets.hide();     
  },
  
  initFromQueryStr: function(queryStr, params){

      this.facetCore.initFromQueryStr(queryStr);
  },     
  
  saveInQueryStr: function(queryStr){
      var query = this.facetCore.getActiveFacetsQuery();
      queryStr += "&" + query;
      
      return queryStr;
  },  
  
  buildRequest : function(request){
      var query = this.facetCore.getActiveFacetsQuery();
      request += "&" + query;
      
      return request;
  },  
  
  renderInProgress: function(){
  
  },  
  
  bindEvents: function(){
      var self = this;
      
      this.$facetRemoveHrefs = $(this.facetsRemoveSelector, this.$activeFacets);
      this.$activeFacetHrefs = $("a", this.$activeFacets);
      
      this.$facetRemoveHrefs.unbind('click').bind('click',function(){
          var id = $(this).parent().find("a").attr("facetname");
          var value = $(this).parent().find("a").attr("facetvalue");
          
          self.facetCore.handleFacetClick(id, value, false);
          self.manager.search();
          
          // Return false to avoid the a:href executing
          return false;
      });
   
      this.$activeFacetHrefs.unbind('click').bind('click',function(){
      
          self.facetCore.onFacetClick($(this));
          self.manager.search();
          
          // Return false to avoid the a:href executing
          return false;
      });
  },  
  
  render: function(data) {
      this.renderActiveFacets();
      this.bindEvents();
  },
  
  renderActiveFacets: function() {
      var activeFacetData = [];
      
      var queries = this.facetCore.getActiveFacetsQueriesMap();
      var facetMap = this.facetCore.getActiveFacetsMap();
      
      for (var id in queries) {
          var facetQuery = queries[id];
          var facet = facetMap[id];
          
          // Skip non-active facets
          if (facetQuery.values.length == 0)
              continue;

          for (var i = 0; i < facetQuery.values.length; i++) {
              var val = facetQuery.values[i];

              var data = this.renderActiveFacetValue(facet, facet.facetType, val);
              activeFacetData.push(data);
          }
      }
      
      this.renderActiveFacet(activeFacetData);
      
      if(activeFacetData.length > 0){
          this.$noActiveFacets.hide();  
          this.$activeFacets.show();   
      }else{
         this.$noActiveFacets.show();  
          this.$activeFacets.hide();
      }
      

  },

  renderActiveFacetValue: function(facet, type, value) {

      if (type == "text") {
          return this.renderActiveTextFacet(facet, value);
      }

      if (type == "query") {
          return this.renderActiveQueryFacet(facet, value);
      }

      if (type == "date") {
          return this.renderActiveDateFacet(facet, value);
      }

      if (type == "customdate") {
          return this.renderActiveCustomDateFacet(facet, value);
      }
  },

  renderActiveTextFacet: function(facet, value) {
      var encodedValue = encodeURIComponent(value);
      return this.renderActiveFacetField(facet, encodedValue, value);
  },

  renderActiveQueryFacet: function(facet, field) {

      var formattedValue = field;
      for (var k in facet.queries) {
          var query = facet.queries[k];

          if (query.query == field) {
              formattedValue = query.header;
          }
      }

      var encodedValue = encodeURIComponent(field);
      return this.renderActiveFacetField(facet, encodedValue, formattedValue);
  },

  renderActiveDateFacet: function(facet, value) {
      var formattedValue = value;

      if (!facet.dateValue || facet.dateValue == "") {
          var facetDateStr = value.split(" TO ");
          var fromDate = facetDateStr[0];

          var date = ISODate.convert(fromDate);
          formattedValue = date.format(facet.dateFormat);
      } else {
          formattedValue = facet.dateValue;
      }

      var encodedValue = encodeURIComponent(value);
      return this.renderActiveFacetField(facet, encodedValue, formattedValue);
  },

  renderActiveCustomDateFacet: function(facet, value) {
      var formattedValue = value;

      var customFacetValues = facet.getFacetValues();
      for (var k = 0; k < customFacetValues.length; k++) {
          var customFacet = customFacetValues[k];

          if (customFacet.value == value) {
              formattedValue = customFacet.name;
              break;
          }
      }

      var encodedValue = encodeURIComponent(value);
      return this.renderActiveFacetField(facet, encodedValue, formattedValue);
  },
  
  renderActiveFacet: function(facetFields){
      if(facetFields && facetFields.length > 0){
         
          var data = {
            "activeFacet": facetFields
          };
      
          var prot = this.$activeFacets_prototype.clone();
          prot = prot.find(".Placeholder").autoRender(data); 

          this.$activeFacets
              .html(prot.html());
      }else{
      
          this.$activeFacets.html("").hide();
      }
  },
  
  renderActiveFacetField : function(facet, value, formattedValue){
  
      formattedValue = this.facetCore.convertFacetFieldValue(facet, formattedValue);
      
      var data = {
        "header": facet.activeHeader,
        "name": facet.id,
        "value": value,
        "displayValue": formattedValue,
        "isActive": "true"
      };
      
      return data;
  }  
});