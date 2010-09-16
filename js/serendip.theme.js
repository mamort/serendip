/*!
 * Serendip Javascript Library v1.0
 * http://github.com/mamort/serendip
 *
 * Copyright 2010, Mats Mortensen
 * Licensed under the MIT license.
 * http://github.com/mamort/serendip/blob/master/License.txt
 *
 * Includes: 
 * jquery-1.4.min.js (http://jquery.com/)
 * date.format-1.2.3.js (http://blog.stevenlevithan.com/archives/date-time-format)
 * pure_packed.js (http://beebole.com/pure/)
 */
 
var mytheme = new Serendip.Theme({

    translation: serendipTranslation,
    fieldMap: serendipThemeFieldMap,
    
    useAnimation: false,
    
    // Private variables holding JQuery references
    $searchInput: null,
    $content: null,
    $results: null,
    $activeFacets: null,
    $inactiveFacets: null,
    $resultbar: null,
    $paging: null,
    $spellsuggestions: null,
    $autocomplete: null,
    $facetsInProgress: null,
    $resultsInProgress: null,
    $facetsInProgress: null,
    $facetBox: null,
    
    // Binding vars
    $sortbarHrefs: null,
    $spellSuggestionsHrefs: null,
    $facetRemoveHrefs: null,
    $activeFacetHrefs: null,
    $inactiveFacetHrefs: null,
    $facetsShowMoreHrefs: null,
    $pagingHrefs: null,
    $resultbar: null,
    $noActiveFacets: null,
    
    // Prototypes
    $facetRow_Prototype: null,
    $activeFacets_prototype: null,
    $results_prototype: null,
    $paging_prototype: null,
    empty$results_prototype: null,
    $searchSuggestions_Prototype: null,
    $autocomplete_prototype: null,
    errorMsg_prototype_html: null,
    $spellingSuggestions_prototype: null,
    $sortbar_prototype: null,
      
    resultbar_html: null,
    
    preInit : function(){

        this.$searchInput = $("#queryInput");
        this.$content = $("#Content_Theme");
        this.$results = $("#Results_Theme");
        this.$activeFacets = $("#ActiveFacets_Theme");
        this.$inactiveFacets = $("#InactiveFacets_Theme");
        this.$resultbar = $("#ResultBar_Theme");
        this.$paging = $("#Paging_Theme");
        this.$spellsuggestions = $("#SpellSuggestions_Theme");
        this.$autocomplete = $("#Autocomplete_Theme");
        this.$resultsInProgress = $("#ResultsInProgress_Theme");
        this.$facetsInProgress = $("#facetsInProgress");
        this.$noActiveFacets = $("#NoActiveFacets_Theme");
        this.$facetBox = $("#Facets_Theme");
        
        this.$facetRow_Prototype = $("#FacetRow_Prototype");
        this.$activeFacets_prototype = $("#ActiveFacets_Prototype");
        this.$results_prototype = $("#Results_Prototype");
        this.$paging_prototype = $("#Paging_Prototype");
        this.$searchSuggestions_Prototype = $("#SearchSuggestions_Prototype");
        this.$autocomplete_prototype = $("#Autocomplete_Prototype");
        this.$spellingSuggestions_prototype = $("#SpellingSuggestions_Prototype");
        this.$sortbar_prototype = $("#SortBar_Prototype");
        
        this.emptyresults_prototype_html = $("#EmptyResults_Prototype").html();        
        this.errorMsg_prototype_html = $("#ErrorMsg_Prototype").html();
        
        this.resultbar_html = this.$resultbar.html();
        
        this.$resultsInProgress.hide();
        
        if(this.useAnimation){
            this.$resultbar.fadeTo(0,0, function(){
              $(this).hide();
            });
        }
        
    },
    
    bindPreInit : function(){
        this.$sortbarHrefs = $("a", this.$resultbar);
        this.$spellSuggestionsHrefs = $("a", this.$spellsuggestions);
        this.$facetRemoveHrefs = $("span.remove", this.$activeFacets);
        this.$activeFacetHrefs = $("a", this.$activeFacets);
        this.$inactiveFacetHrefs = $("a", this.$inactiveFacets);
        this.$facetsShowMoreHrefs = $("a.moreFacets", this.$inactiveFacets);
        this.$pagingHrefs = $("li a", this.$paging);
        
    },

    renderInProgress : function(callback){
    
        var self = this;
        $inProgress = this.$resultsInProgress;
        
        if(this.useAnimation){
            this.$results.fadeTo(200, 0, function(){
                self.renderInProgressIcon(self.$results, $inProgress);
                callback();
            });
        }else{
            this.renderInProgressIcon(this.$results, $inProgress);
            callback();
        }

    },
    
    renderInProgressIcon: function(element, $inProgress){
        var height = element.height();
        if(height > 0)
            $inProgress.height(height);
        element.hide();
        $inProgress.show();   
    },

    init : function(data){
        
        var $self = this;
        $inProgress = this.$resultsInProgress;
        
        if(this.useAnimation){
            this.$results.fadeTo(0, 1, function(){
                $inProgress.hide();
                
                $self.continueInit(data);
            }); 
        }else{
            this.$results.show();
            $inProgress.hide();
            $self.continueInit(data);
        }         
    },
    
    continueInit: function(data){ 
        var numDocs = data.response.numFound; 
        
        dateFormat.i18n.dayNames = this.translation["Date:DayNames"];
        dateFormat.i18n.monthNames = this.translation["Date:MonthNames"];
          
        this.$noActiveFacets.hide();
        
        // Hide facet box if no facets
        if(typeof(data.facet_counts) != "undefined"){
            this.$facetBox.fadeIn("slow"); 
        }else{
            this.$content.css("width", "100%");
        }
    },   
    
    renderHeader : function(numDocsFound, responseTimeInMillis, 
      sortValue, sortFields, sortDirection){
      
        if(numDocsFound > 0){
          this.$resultbar.show();
          
          if(this.useAnimation){
              this.$resultbar.fadeTo(0, 1);
          }
        }
      
        var html = [];
              
        var relevansActiveStr = "active";
        var activeName = "relevans";
        
        var fieldData = [];
      
        for(var i = 0; i < sortFields.length; i++){
            var sField = sortFields[i].name; 
            var sFieldHeader = sortFields[i].header;
                        
            var isActive = isSortFieldActive(sField, sortValue);  
            
            if(isActive){
                relevansActiveStr = "inactive";
                activeName = sFieldHeader;
            }
            
            var sortValueData = renderSortValue(sField, sFieldHeader, isActive, sortDirection);
            fieldData.push(sortValueData);
        }     
        
        var prot = this.$sortbar_prototype.clone();
        
        var data = {     
          "sortfield": fieldData
        };
        
        var data2 = {
          "relevansActive": relevansActiveStr,
          "numDocs": "" + numDocsFound,
          "time": "" + responseTimeInMillis,
          "activeName": activeName,
          "relevansSort": "relevans"
        };
        
        /*
          Remember: autoRender replaces the node its called from. This means the node its called from MUST have a parent node.
                    When nodes are cloned they DO NOT have a parent node anymore.
        */
        
        prot.find("#SortFields_Theme").autoRender(data);
        prot = prot.find(".Placeholder").autoRender(data2);
        
        this.$resultbar.html(prot.html());
        
        
        function isRelevansActive(sortValue){
            if(typeof(sortValue) == "undefined" || sortValue == "")
                return true
            else
                return false;
        }
        
        function renderSortValue(field, header, isActive, sortDirection){
            var isActiveStr = "inactive";
            if(isActive){
                isActiveStr = "active";
            }
            
            if(sortDirection == "asc"){
              oppositeDirection = "asc";
              sortDirection = "desc";
            }else{
              oppositeDirection = "desc";
              sortDirection = "asc";
            }
                         
            var title = header.substr(0, 1).toUpperCase() + header.substr(1);
            
            var data = {
              "active": isActiveStr,
              "name": field,
              "direction": sortDirection,
              "oppositeDirection": oppositeDirection,
              "title": title
            };
            
            return data;
        }
        
        function isSortFieldActive(sortField, sortValue){
          if(sortValue.length > 0 && sortValue.substring(0,sortField.length) == sortField)
              return true;
          else
              return false;
        }
    },

    renderPager : function(currentPage, totalPages, windowStart, windowEnd){
        var pagingRowsData = [];
        
        var paging = this.$paging_prototype.clone();
        
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
            this.$paging.html(paging.html());
        }else{
            this.$paging.html("");
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
    },
    
    getDocParam: function(fields, param){
        var value = this.getParam(fields, this.fieldMap["field:" + param], "");
        if(value == ""){
          value = this.getParam(fields, this.fieldMap["field:" + param + ":alt"], this.fieldMap["field:title:empty"]);
        }
        
        return value;
    },
    
    getParam: function(fields, param, defaultValue){
        var value = defaultValue;
        
        if(fields[param])
            value = fields[param];   
            
        if(isArray(value)){
            value = value.join("");
        }
            
         return value;
    },   
    
    getParamRestrictChars: function(fields, param, defaultValue, maxChars){
        var text = this.getParam(fields, param, defaultValue);

        if(text.length > maxChars){
          text = text.substring(0, maxChars);
        }
        
        return text;
    },
    
    getParamAsDate: function(fields, param, format, defaultValue){
        var dateValue = this.getParam(fields, param, "")

        if(dateValue != ""){
          var date = ISODate.convert(dateValue);
          dateValue = date.format(format);
        }else{
          dateValue = defaultValue;
        }    
        
        return dateValue;
    }, 
    
    renderDoc : function(fields){ 
      
      var url = this.getParam(fields, 
          this.fieldMap["field:url"], 
          this.fieldMap["field:url:empty"]); 
          
      var title = this.getDocParam(fields, "title");
        
      var content = this.getParamRestrictChars(fields, 
          this.fieldMap["field:content"], 
          this.fieldMap["field:content:empty"], 
          this.fieldMap["field:content:maxlen"]);
            
      var date = this.getParamAsDate(fields, 
          this.fieldMap["field:date"], 
          this.fieldMap["field:date:format"], 
          this.fieldMap["field:date:empty"]);
          
          
      var data = {url: url, title: title, content: content, date: date};
    
      return data;
    }, 
    
    renderDocuments : function(docsData){
        
        var data = {docs: docsData};

        var $element = this.$results_prototype.clone();
        $element = $element.find(".Placeholder").autoRender(data);
        
        if(this.useAnimation){
            this.$results.hide()
              .html($element.html())
              .fadeIn('slow'); 
        }else{
            this.$results
              .html($element.html());
        }

    },
    
    renderSpellSuggestions: function(suggestions){
    
        if(suggestions.length > 0){
        
            var suggestionLinks = [];
        
            for(var i = 0; i < suggestions.length; i++){
                var suggest = {
                  "suggestionLink": suggestions[i]
                };
                
                suggestionLinks.push(suggest);
            }
            
            var data = {
              "suggestion":suggestionLinks
            };
            
            var spellingSuggestions = this.$spellingSuggestions_prototype.clone();
            spellingSuggestions = spellingSuggestions.find(".Placeholder").autoRender(data);
            
            this.$spellsuggestions
              .hide()
              .html(spellingSuggestions.html())
              .fadeIn('slow');
        }else{
            this.$spellsuggestions.hide();
        }
    },
    
    renderFacets : function(facetsData, facets){

        if(this.useAnimation){
            this.$inactiveFacets
                .hide()
                .html(facetsData.join(""))
                .fadeIn('slow');
        }else{
            this.$inactiveFacets
                .html(facetsData.join(""));
        }
    },

    renderFacet : function(facet, facetFieldsData, facets, moreFacetsCount, moreFacetsFieldsData){
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
    
    renderFacetField : function(facet, value, formattedValue, count, isActive){
      if(isActive) return "";
          
      formattedValue = this.convertFacetFieldValue(facet, formattedValue);
      var facetFieldData = {
        "name": facet.id,
        "value": value,
        "displayValue": formattedValue,
        "countValue": count,
        "countValueCls": "count"+count,
        "isActive": "false"
      };      
      
      return facetFieldData;
    },
        
    convertFacetFieldValue : function(facet, value){
      var converted = value;
      
      if(facet.id == "contenttype"){
        converted = this.convertContentTypeFacetValue(value);
      }
      
      return converted;
    },
    
    convertContentTypeFacetValue : function(value){
        var convertedValue = value;

        value = value.toLowerCase();
        var convertionList = this.getFacetContentTypeConvertions();
        
        for(var key in convertionList){
          if(value.indexOf(key) > -1){
            convertedValue = convertionList[key];
            break;
          }  
        }
        
        return convertedValue;
    },
    
    getFacetContentTypeConvertions : function(){
      var list = new Object();
      
      list["text/html"] = "Html";
      list["pdf"] = "PDF";
      list["text/plain"] = "Text";
      list["application/msword"] = "Word";
      
      return list;
    },    
    
    renderActiveFacet: function(facetFields){
        if(facetFields && facetFields.length > 0){
           
            var data = {
              "activeFacet": facetFields
            };
        
            var prot = this.$activeFacets_prototype.clone();
            prot = prot.find(".Placeholder").autoRender(data); 

            if(this.useAnimation){
                this.$activeFacets
                    .hide()
                    .html(prot.html())
                    .fadeIn('slow');
            }else{
            
                this.$activeFacets
                    .html(prot.html());
            }
        }else{
        
            this.$activeFacets.html("").hide();
        }
    },
    
    renderActiveFacetField : function(facet, value, formattedValue){
    
        formattedValue = this.convertFacetFieldValue(facet, formattedValue);
        
        var data = {
          "header": facet.activeHeader,
          "name": facet.id,
          "value": value,
          "displayValue": formattedValue,
          "isActive": "true"
        };
        
        return data;
    },
        
    renderEmptyResult : function(){
        var html = "";
        
        var emptyResultsHtml = this.emptyresults_prototype_html;
        html = emptyResultsHtml;
    
        this.$results.html(html);
    },     
    
    renderAutocompleteTerms : function(terms){
      
      var termList = [];
      
      var autocomplete = this.$autocomplete_prototype.clone();
      
      for(var i = 0; i < terms.length; i++){
        var term = {
          "value": terms[i].value,
          "count": ""/*terms[i].count*/
        };

        termList.push(term);
      }
      
      var data = {
        "term": termList
      };
      
      var autocomplete = autocomplete.find(".Placeholder").autoRender(data);
      var autocompleteHtml = autocomplete.html();
      
      this.$autocomplete
          .html(autocompleteHtml)
          .fadeIn(300);
      
    },
    
    renderComplete : function(data){

      var html = this.$activeFacets.html();
      
      if(html == null || html.length == 0){
          this.$noActiveFacets.show();
      }else{
          this.$activeFacets.show();
      }
      
      this.$searchInput.focus();
    },     
    
    renderError: function(httpReq, ajaxOpts, thrownError){
      var errorMsgHtml = this.errorMsg_prototype_html;
      
      $inProgress = this.$resultsInProgress;
        
       this.$results.queue(function(){
          $(this).fadeTo(200, 1, function(){
              $inProgress.hide();
          });
          
          $(this).dequeue();
       });   

      this.$results
          .hide()
          .html(errorMsgHtml)
          .fadeIn('slow');
    },
	
	bindAutocompleteClickHandler: function(handler){
		var $input = this.$searchInput;

		this.$autocomplete.find("li")
			.unbind("mousedown").bind("mousedown", function(){
			
				var value = $(this).find(".value").text();
				$input.val(value).focus();
				
				handler.handleAutocompleteClick();
			
				return false;
			
			}).unbind("mouseover").bind("mouseover", function(){
			
				$(this).find(".value").removeClass("selected").addClass("selected");

			}).unbind("mouseout").bind("mouseout", function(){
			
				$(this).find(".value").removeClass("selected");
			});	
	},
    
    bindSuggestClickHandler: function(handler){
      this.$spellSuggestionsHrefs.unbind('click').bind('click', function(){
          var text = $(this).text();
          handler.handleSuggestClick(text);
          
          // Return false to avoid the a:href executing
          return false;
      });
    },
    
    bindSortClickHandler : function(handler){

      this.$sortbarHrefs.unbind('click').bind('click', function(){
 
          var value = $(this).attr("sort");
          var dir = $(this).attr("direction");
          
          handler.handleSortClick(value, dir);
          
          // Return false to avoid the a:href executing
          return false;
      });
    },  
    
    bindFacetClickHandler : function(handler){
    
      this.$facetRemoveHrefs.unbind('click').bind('click',function(){
          var id = $(this).parent().find("a").attr("facetname");
          var value = $(this).parent().find("a").attr("facetvalue");
          
          handler.handleFacetClick(id, value, false);
          
          // Return false to avoid the a:href executing
          return false;
      });
   
      this.$activeFacetHrefs.unbind('click').bind('click',function(){
          handleFacetClick($(this), handler);
          
          // Return false to avoid the a:href executing
          return false;
      });
      
      this.$inactiveFacetHrefs.unbind('click').bind('click',function(){
          handleFacetClick($(this), handler);
                   
          // Return false to avoid the a:href executing
          return false;
      });      
      
      function handleFacetClick(facet, handler){
      
          var id = facet.attr("facetname");
          var value = facet.attr("facetvalue");          
          var isActive = facet.attr("active");
          
          if(isActive == "false"){
            isActive = true;
          }else{
            isActive = false;         
          }

          handler.handleFacetClick(id, value, isActive);
      }
    }, 
    
bindShowMoreFacetsClickHandler : function(handler){
      this.$facetsShowMoreHrefs.unbind('click').bind('click', function(){
          
          var id = $(this).attr("facetname");
          
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
          
          return false;
      });
    },
    
    bindPagingClickHandler : function(handler){

      this.$pagingHrefs.unbind('click').bind('click', function(){
          var page = $(this).attr("page");
          
          handler.handlePagingClick(page);
       
          // Return false to avoid the a:href executing
          return false;
      });
    }     
    
});