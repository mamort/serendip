
Serendip.FacetsView = Serendip.Class.extend({
  configuredFacets: null,
  
  inactiveFacetsSelector: "",
  facetsInProgressSelector: "",
  facetViewSelector: "",
  facetRowPrototypeSelector: "",
  
  $inactiveFacets: null,     
  $facetsInProgress: null,
  $facetView: null,
 
  $facetRow_Prototype: null,
  manager: null,
  
  $view: null,
  $view_prototype: null,
  
  maxFacetsToDisplay: 0,
  
  init: function(manager){

      this.manager = manager;
  
      this.$inactiveFacets = $(this.inactiveFacetsSelector);      
      this.$facetsInProgress = $(this.facetsInProgressSelector);
      this.$facetView = $(this.facetViewSelector);
     
      this.$facetRow_Prototype = $(this.facetRowPrototypeSelector);  
      
      this.$facetsShowMoreHrefs = $("a.moreFacets", this.$inactiveFacets);
      
      this.facetCore.init();     
  },
  
  initFromQueryStr: function(queryStr, params){
      // All work done in Active Facets component
  },     
  
  saveInQueryStr: function(queryStr){
      // All work done in Active Facets component
      return queryStr;
  },  
  
  buildRequest : function(request){
      var query = this.facetCore.getFacetsAsQueryString(this.configuredFacets);
      
      request += "&facet=true&" + query;
      
      return request;
  },  
  
  renderInProgress: function(){
  
  },  
  
  bindEvents: function(){
      var self = this;
      
      this.$inactiveFacetHrefs = $("a", this.$inactiveFacets);
      this.$inactiveFacetHrefs.unbind('click').bind('click',function(){
      
          self.facetCore.onFacetClick($(this));
          self.manager.search();
              
          // Return false to avoid the a:href executing
          return false;
      });    
      
      
      var $facetsShowMoreHrefs = $("a.moreFacets", this.$inactiveFacets);
      
      $facetsShowMoreHrefs.unbind('click').bind('click', function(){
          
          self.handleShowMoreLess($(this));
          return false;
      });  
  },  
  
  handleShowMoreLess: function(element){
      var id = element.attr("facetname");
      
      var selector = "." + id + " .MoreFacetsValues";
      var $moreFacets = $(selector, this.$inactiveFacets);
      
      selector = "." + id + " .moreFacetsTxt";
      var $moreFacetsTxt = $(selector, this.$inactiveFacets);  
      
      selector = "." + id + " .lessFacetsTxt";
      var $lessFacetsTxt = $(selector, this.$inactiveFacets);           
          
      if($moreFacets.css("display") == "none"){
      
          $moreFacets.slideDown("slow", function(){
              $(this).show();
          });
          
          $moreFacetsTxt.hide();
          $lessFacetsTxt.show();
                        
      }else{
      
          $moreFacets.slideUp("slow", function(){
            $(this).hide();
          });
          
          $lessFacetsTxt.hide();
          $moreFacetsTxt.show();          
      }
  },
  
  render: function(data) {

      // Hide facet box if no facets
      if(typeof(data.facet_counts) != "undefined"){
          this.$facetView.fadeIn("slow"); 
      }
      
      this.processFacets(data, this.configuredFacets);
      
      this.bindEvents();
  },
  
  processFacets: function(data, facets) {
      if (typeof (data.facet_counts) != "undefined") {

          var facetfields = data.facet_counts.facet_fields;
          var facetdates = data.facet_counts.facet_dates;
          var facetqueries = data.facet_counts.facet_queries;

          var rows = [];

          var facetCount = Math.min(facets.length, this.maxFacetsToDisplay);

          for (var i = 0; i < facetCount; i++) {
              var facetHtml = this.renderFacetTypes(data, facetfields, facetdates, facetqueries, facets[i]);
              rows.push(facetHtml);
          }

          this.renderFacetsUI(rows, facets)
      }
  },

  renderFacetTypes: function(data, facetfields, facetdates, facetqueries, facet) {
      var html = "";
      var type = facet.facetType;

      if (type == "text") {
          html = this.renderTextFacet(data, facetfields, facet);
      } else if (type == "date") {
          html = this.renderDateFacet(data, facetdates, facet);
      } else if (type == "customdate") {
          html = this.renderCustomDateFacet(data, facet);
      } else if (type == "query") {
          html = this.renderQueryFacet(data, facetqueries, facet);
      }

      return html;
  },

  renderTextFacet: function(data, facetfields, facet) {

      var facetValues = facetfields[facet.name];

      if (typeof (facetValues != "undefined")) {
          return this.renderFacet(data, facet, facetValues);
      }

      return "";
  },

  renderDateFacet: function(data, facetdates, facet) {
      var dates = facetdates[facet.name];
      var values = [];

      for (var key in dates) {
          if (key != "gap" && key != "end") {
              values.push(key);
              values.push(dates[key]);
          }
      }

      var facetValues = [];

      if (facet.sortDir == "asc") {
          for (var k = 0; k < values.length; k += 2) {
              this.renderDateFacetValue(values, k, facetValues, dates, "asc");
          }
      } else {
          for (var k = values.length - 2; k > -1; k -= 2) {
              this.renderDateFacetValue(values, k, facetValues, dates, "desc");
          }
      }

      return this.renderFacet(data, facet, facetValues);
  },

  renderDateFacetValue: function(values, k, facetValues, dates, type) {
      var value = values[k];
      var count = values[k + 1];

      var dateFacet = new Object();
      dateFacet.from = value;

      var gapDays = this.getGapAsDays(dates["gap"]);

      //TODO: Must use GAP to calculate end date from start date here
      var isoDateStr = this.formatIsoDateWithGap(dateFacet.from, gapDays);

      if (type == "asc") {
          if (k + 2 < values.length) {
              dateFacet.to = values[k + 2];
          } else {
              dateFacet.to = isoDateStr;
          }
      } else {
          dateFacet.to = isoDateStr;
      }

      facetValues.push(dateFacet);
      facetValues.push(count);
  },
  
  formatIsoDateWithGap: function(inputDate, gapDays){
      var isoDateStr = "";
      try{
        var date = ISODate.convert(inputDate);
        date.setDate(date.getDate() + gapDays);

        isoDateStr = date.format("isoDateTime") + "Z";     
      }catch(ex){
        isoDateStr = "Could not parse date: " + inputDate;
      }
      
      return isoDateStr;
  },
  
  convertIsoDate: function(inputDate, format){
      var formattedDate = "";
      try{
        var date = ISODate.convert(inputDate);
        formattedDate =  date.format(format);
      }catch(ex){
        formattedDate = "Could not parse date: " + inputDate;
      }
      
      return formattedDate;
  },

  getGapAsDays: function(gap) {
      var modifier = 1;
      var dayModifier = 1;
      var days = 0;

      if (gap[0] == "-")
          modifier = -1;

      if (gap.match("YEARS")) {
          days = gap.substring(1, gap.length - 5);
          dayModifier = 365;
      }

      if (gap.match("MONTHS")) {
          days = gap.substring(1, gap.length - 6);
          dayModifier = 30;
      }

      if (gap.match("DAYS")) {
          days = gap.substring(1, gap.length - 4);
      }

      if (gap.match("YEAR")) {
          days = gap.substring(1, gap.length - 4);
          dayModifier = 365;
      }

      if (gap.match("MONTH")) {
          days = gap.substring(1, gap.length - 5);
          dayModifier = 30;
      }

      if (gap.match("DAY")) {
          days = gap.substring(1, gap.length - 3);
      }

      days = parseInt(days);

      return days * modifier * dayModifier;
  },

  renderCustomDateFacet: function(data, facet) {
      var facetValues = [];

      var customFacetValues = facet.getFacetValues();
      for (var k = 0; k < customFacetValues.length; k++) {
          var split = customFacetValues[k].value.split(" TO ");
          var dateFacet = new Object();

          dateFacet.from = split[0];
          dateFacet.to = split[1];
          dateFacet.name = customFacetValues[k].name;

          facetValues.push(dateFacet);
          facetValues.push(-1);
      }

      return this.renderFacet(data, facet, facetValues);
  },

  renderQueryFacet: function(data, facetfields, facet) {
      var facetValues = [];

      if (typeof (facetValues != "undefined")) {

          for (var k = 0; k < facet.queries.length; k++) {
              var query = facet.queries[k];
              var id = facet.id + "range[" + k + "]";
              var count = facetfields[id];

              facetValues.push({ formattedValue: query.header, value: query.query });
              facetValues.push(count);
          }


          return this.renderFacet(data, facet, facetValues);
      }

      return "";
  },

  renderFacet: function(data, facet, facetArray) {
      var facetRow = [];

      facetArray = this.removeEmptyFacets(facetArray);

      var len = facetArray.length;
      if (len > (facet.minFacetsToDisplay * 2)) len = facet.minFacetsToDisplay * 2;

      var currentIndex = 0;
      for (var i = 0; i < len; i += 2) {
          var value = facetArray[i];
          var count = facetArray[i + 1];

          if (value == "")
              continue;

          var isActive = this.isFacetFieldActive(data, facet, value);

          var facetFieldData = this.renderFacetField(facet, value, count, isActive);
          if (facetFieldData != "")
              facetRow.push(facetFieldData);

          currentIndex = i;
      }

      len = facetArray.length;
      var max = facet.maxFacetsToDisplay * 2;

      var moreFacetsCount = 0;
      var moreFacets = "";
      if (len > currentIndex && max > currentIndex) {
          moreFacets = this.addMoreFacets(data, facet, facetArray, len, max, currentIndex);
          moreFacetsCount = moreFacets.count;
      }

      return this.renderFacetUI(facet, facetRow, this.configuredFacets, moreFacetsCount, moreFacets.data);
  },

  addMoreFacets: function(data, facet, facetArray, len, max, currentIndex) {
      if (max < len) len = max;

      var moreFacetsData = [];

      var moreFacets = new Object();
      moreFacets.count = 0;
      moreFacets.data = "";

      for (var i = currentIndex + 2; i < len; i += 2) {
          var value = facetArray[i];
          var count = facetArray[i + 1];

          var isActive = this.isFacetFieldActive(data, facet, value);
          var facetData = this.renderFacetField(facet, value, count, isActive);

          if (facetData != "") {
              moreFacetsData.push(facetData);
              moreFacets.count++;
          }
      }

      if (moreFacets.count > 0) {
          moreFacets.data = moreFacetsData;
      }

      return moreFacets;
  },

  removeEmptyFacets: function(facets) {
      var result = [];
      for (var i = 0; i < facets.length; i += 2) {
          var value = facets[i];
          var docCount = facets[i + 1];

          // -1 is sentinel value for facets that cannot have count
          if (docCount > 0 || docCount == -1) {
              result.push(value);
              result.push(docCount);
          }
      }

      return result;
  },

  renderFacetField: function(facet, value, count, isActive) {

      var formattedValue = "";
      if (facet.facetType == "date") {
          if (!facet.dateValue || facet.dateValue == "") {
              formattedValue = this.convertIsoDate(value.from, facet.dateFormat);
          } else {
              formattedValue = facet.dateValue;
          }

          value = value.from + " TO " + value.to;

      } else if (facet.facetType == "customdate") {
          formattedValue = value.name;
          value = value.from + " TO " + value.to;

      } else if (facet.facetType == "query") {
          formattedValue = value.formattedValue;
          value = value.value;
      } else {
          formattedValue = value;
      }

      value = encodeURIComponent(value);

      return this.renderFacetFieldUI(facet, value, formattedValue, count, isActive);
  },

  isFacetFieldActive: function(data, facet, value) {
      var activeFacets = data.responseHeader.params.fq;

      if (activeFacets) {

          // Might be single value and not an array...
          if (!isArray(activeFacets) || activeFacets[0].length == 1) {
              if (this.isFacetMatch(activeFacets, facet, value)) {
                  return true;
              }
          } else {

              // If not previous match, we probably have an array with multiple active facets
              for (var i = 0; i < activeFacets.length; i++) {
                  if (this.isFacetMatch(activeFacets[i], facet, value)) {
                      return true;
                  }
              }
          }
      }

      return false;
  },

  isFacetMatch: function(activeFacet, facet, value) {
      var facetValue = "";
      var prefix = "{!tag=" + facet.id + "}" + facet.name + ":(";

      var activePrefix = activeFacet.substring(0, prefix.length);

      if (prefix != activePrefix) {
          return false;
      }

      var activeValue = activeFacet.substring(prefix.length, activeFacet.length - 1);

      if (facet.facetType == "text") {
          var vals = activeValue.split(/\"\s/);
          for (var k = 0; k < vals.length; k++) {
              var val = vals[k].replace(/\"/g, "").trim();

              if (val == value)
                  return true;
          }

      } else if (facet.facetType == "query") {

          if (value.value == activeValue) {
              return true;
          }

      } else if (facet.facetType == "date" || facet.facetType == "customdate") {
          vals = activeValue.split("]");

          for (var k = 0; k < vals.length; k++) {
              var val = vals[k].replace(/\[/g, "");
              val = val.replace(/]/g, "").trim();

              if (val.length > 0) {
                  var facetValue = value.from + " TO " + value.to;

                  if (val == facetValue)
                      return true;
              }

          }
      }

      return false;
  },
  

  renderFacetsUI : function(facetsData, facets){

      this.$inactiveFacets
          .html(facetsData.join(""));
  },

  renderFacetUI : function(facet, facetFieldsData, facets, moreFacetsCount, moreFacetsFieldsData){
    if(facetFieldsData == "") return "";
    
    var facetData = {
      "facetName": facet.id,
      "facetHeader": facet.header    
    };
    
    var facetRowData = {
      "facetRow": facetFieldsData
    };       
    
    var moreFacetsData = {
      "facetRow": moreFacetsFieldsData
    };
    
    var facetsElement = this.$facetRow_Prototype.clone();
    facetsElement = facetsElement.find(".Placeholder").autoRender(facetData);
    var facetValues = facetsElement.find(".FacetValues");
    var facetValuesHtml = facetValues.html();
    facetValues.autoRender(facetRowData);  
    
    facetsElement.find(".lessFacetsTxt").hide();
    if(moreFacetsCount <= 0){
      facetsElement.find(".moreFacetsTxt").hide();
    }
    
    // Copy html for displaying a single facet row
    // Auto render it using pure and finally hide it initially
    facetsElement.find(".MoreFacetsValues")
      .html(facetValuesHtml)
      .autoRender(moreFacetsData)
      .hide();   
    
    return facetsElement.html();
  },
  
  renderFacetFieldUI : function(facet, value, formattedValue, count, isActive){
    if(isActive) return "";
        
    formattedValue = this.facetCore.convertFacetFieldValue(facet, formattedValue);
    var facetFieldData = {
      "name": facet.id,
      "value": value,
      "displayValue": formattedValue,
      "countValue": count,
      "countValueCls": "count"+count,
      "isActive": "false"
    };      
    
    return facetFieldData;
  }
      
});