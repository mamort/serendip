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
 */
 
var mytheme = new Serendip.Theme({

    translation: serendipTranslation,
    fieldMap: serendipThemeFieldMap,
    
    // Private variables holding JQuery references
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
    docRow_Prototype: null,
    facetRow_Prototype: null,
    facetValueRow_Prototype: null,
    sortfield_prototype: null,
    activeFacetRow_prototype: null,
    results_prototype: null,
    pagingRow_prototype: null,
    pagingCurrentRow_prototype: null,
    pagingNextRow_prototype: null,
    pagingPrevRow_prototype: null,
    paging_prototype: null,
    emptyResults_prototype: null,
    searchSuggestions_Prototype: null,
    autocomplete_prototype: null,
    autocompleteRow_prototype: null,
    errorMsg_prototype: null,
    spellingSuggestions_prototype: null,
      
    resultbar_html: null,
    
    preInit : function(){

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
        
        this.docRow_Prototype = $("#DocRow_Prototype").html();
        this.facetRow_Prototype = $("#FacetRow_Prototype").html();
        this.facetValueRow_Prototype = $("#FacetRow_ValueRow_Prototype").html();
        this.sortfield_prototype = $("#SortField_Prototype").html();
        this.activeFacetRow_prototype = $("#ActiveFacetRow_Prototype").html();
        this.results_prototype = $("#Results_Prototype").html();
        this.pagingRow_prototype = $("#PagingRow_Prototype").html();
        this.pagingCurrentRow_prototype = $("#PagingCurrentRow_Prototype").html();
        this.pagingNextRow_prototype = $("#PagingNextRow_Prototype").html();
        this.pagingPrevRow_prototype = $("#PagingPrevRow_Prototype").html();
        this.paging_prototype = $("#Paging_Prototype").html();
        this.emptyResults_prototype = $("#EmptyResults_Prototype").html();
        this.searchSuggestions_Prototype = $("#SearchSuggestions_Prototype").html();
        this.autocomplete_prototype = $("#Autocomplete_Prototype").html();
        this.autocompleteRow_prototype = $("#AutocompleteRow_Prototype").html();
        this.errorMsg_prototype = $("#ErrorMsg_Prototype").html();
        this.spellingSuggestions_prototype = $("#SpellingSuggestions_Prototype").html();
        
        this.resultbar_html = this.$resultbar.html();
        
        this.$resultsInProgress.hide();
        this.$resultbar.fadeTo(0,0);
        
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
    
        $inProgress = this.$resultsInProgress;
    
        this.$results.fadeTo(200, 0, function(){
            var height = $(this).height();
            if(height > 0)
                $inProgress.height(height);
            $(this).hide();
            $inProgress.show();
            
            callback();
        });

    },

    init : function(data){
        var numDocs = data.response.numFound; 
        
        $inProgress = this.$resultsInProgress;
        
         this.$results.queue(function(){
            $(this).fadeTo(200, 1, function(){
                $inProgress.hide();
            });
            
            $(this).dequeue();
         });      
        
        dateFormat.i18n.dayNames = this.translation["Date:DayNames"];
        dateFormat.i18n.monthNames = this.translation["Date:MonthNames"];
        
        if(numDocs > 0)
          this.$activeFacets.html("");
          
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
          this.$resultbar.fadeTo(0, 1);
        }
      
        var html = [];
              
        var sortFieldHtml = this.sortfield_prototype;
        
        var relevansActiveStr = "active";
      
        for(var i = 0; i < sortFields.length; i++){
            var sField = sortFields[i].name; 
            var sFieldHeader = sortFields[i].header;
                        
            var isActive = isSortFieldActive(sField, sortValue);  
            
            if(isActive){
                relevansActiveStr = "";
            }
            
            sortFieldHtml = renderSortValue(sortFieldHtml, sField, sFieldHeader, isActive, sortDirection);

            html.push(sortFieldHtml);
        }     
        
        var sortBarHtml = this.resultbar_html; 
      
        sortBarHtml = sortBarHtml.replace(/\[sortfield:relevansActive\]/gi, relevansActiveStr);
        sortBarHtml = sortBarHtml.replace(/\[sortfield:hits\]/gi, numDocsFound);
        sortBarHtml = sortBarHtml.replace(/\[sortfield:time\]/gi, responseTimeInMillis);
        
        sortBarHtml = sortBarHtml.replace(/\[sortfield:list\]/gi, html.join(""));

        this.$resultbar.html(sortBarHtml);
        
        function isRelevansActive(sortValue){
            if(typeof(sortValue) == "undefined" || sortValue == "")
                return true
            else
                return false;
        }
        
        function renderSortValue(sortFieldHtml, field, header, isActive, sortDirection){
            var isActiveStr = "";
            if(isActive){
                isActiveStr = "active";
            }
            
            sortFieldHtml = sortFieldHtml.replace(/\[sortfield:currentDirection\]/gi, sortDirection);
            
            if(sortDirection == "asc")
              sortDirection = "desc";
            else
              sortDirection = "asc";
                         
            var title = header.substr(0, 1).toUpperCase() + header.substr(1);
      
            sortFieldHtml = sortFieldHtml.replace(/\[sortfield:active\]/gi, isActiveStr);
            sortFieldHtml = sortFieldHtml.replace(/\[sortfield:name\]/gi, field);
            sortFieldHtml = sortFieldHtml.replace(/\[sortfield:direction\]/gi, sortDirection);
            sortFieldHtml = sortFieldHtml.replace(/\[sortfield:displayValue\]/gi, title);
            
            return sortFieldHtml;
        }
        
        function isSortFieldActive(sortField, sortValue){
          if(sortValue.length > 0 && sortValue.substring(0,sortField.length) == sortField)
              return true;
          else
              return false;
        }
    },

    renderPager : function(currentPage, totalPages, windowStart, windowEnd){
        var pagingRowsHtml = [];
        
        var pagingHtml = this.paging_prototype;
        var pagingRowHtml = this.pagingRow_prototype;
        var pagingCurrentRowHtml = this.pagingCurrentRow_prototype;
        var pagingNextRowHtml = this.pagingNextRow_prototype;
        var pagingPrevRowHtml = this.pagingPrevRow_prototype;
        
        // Render previous page
        if(currentPage > 1){
          var prevPage = currentPage-1;
          pagingPrevRowHtml = pagingPrevRowHtml.replace(/\[paging:prevPage\]/gi, prevPage);
          pagingRowsHtml.push(pagingPrevRowHtml);
        }
            
        // Render pages
        for(var i = windowStart; i < windowEnd; i++){
          var rowHtml = "";
          
          if(i == currentPage){
            rowHtml = pagingCurrentRowHtml.replace(/\[paging:page\]/gi, i);
          }else{
            rowHtml = pagingRowHtml.replace(/\[paging:page\]/gi, i);
          }
          
          pagingRowsHtml.push(rowHtml);
        }
        
        // Render next page
        if(currentPage < totalPages){
          var nextPage = currentPage+1;
          pagingNextRowHtml = pagingNextRowHtml.replace(/\[paging:nextPage\]/gi, nextPage);
          pagingRowsHtml.push(pagingNextRowHtml);
        }            
                
        if(totalPages > 1){
            pagingHtml = pagingHtml.replace(/\[paging:pageList\]/gi, pagingRowsHtml.join(""));
            this.$paging.html(pagingHtml);
        }else{
            this.$paging.html("");
        }
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
      var html = [];
        
      var docRowPrototypeHtml = this.docRow_Prototype;
               
      var url = this.getParam(fields, 
          this.fieldMap["field:url"], 
          this.fieldMap["field:url:empty"]); 
          
      var title = this.getParam(fields, 
          this.fieldMap["field:title"], 
          this.fieldMap["field:title:empty"]);
        
      var content = this.getParamRestrictChars(fields, 
          this.fieldMap["field:content"], 
          this.fieldMap["field:content:empty"], 
          this.fieldMap["field:content:maxlen"]);
            
      var date = this.getParamAsDate(fields, 
          this.fieldMap["field:date"], 
          this.fieldMap["field:date:format"], 
          this.fieldMap["field:date:empty"]);
        
      docRowPrototypeHtml = docRowPrototypeHtml.replace(/\[field:url\]/gi, url);
      docRowPrototypeHtml = docRowPrototypeHtml.replace(/\[field:title\]/gi,title);
      docRowPrototypeHtml = docRowPrototypeHtml.replace(/\[field:content\]/gi,content);
      docRowPrototypeHtml = docRowPrototypeHtml.replace(/\[field:date\]/gi,date);

      return docRowPrototypeHtml;
    },   
    
    renderDocuments : function(docsHtml){
        
        var resultsHtml = this.results_prototype;
        resultsHtml = resultsHtml.replace(/\[results:list\]/gi,docsHtml);

        this.$results
            .hide()
            .html(resultsHtml)
            .fadeIn('slow');
            
    },
    
    renderSpellSuggestions: function(suggestions){
        var spellingSuggestionsHtml = this.spellingSuggestions_prototype;
        
        if(suggestions.length > 0){
            spellingSuggestionsHtml = spellingSuggestionsHtml.replace(/\[spellingsuggestion:suggestion\]/gi,suggestions[0]);
            
            this.$spellsuggestions
              .hide()
              .html(spellingSuggestionsHtml)
              .fadeIn('slow');
        }
    },
    
    renderFacets : function(facetsHtml, facets){
        this.$inactiveFacets
            .hide()
            .html(facetsHtml)
            .fadeIn('slow');
    },
    
    replaceTagWithClass: function(tagName, className, text, replacement){
        var regStr = "<" + tagName + "[\\s]*class=\"" + className + "\"[^>]*>([\\s\\S]*?)<\\/" + tagName +">";
        var reg = new RegExp(regStr, "gi");
        text = text.replace(reg, replacement);
        return text;
    },
    
    replaceTagWithId: function(tagName, id, text, replacement){
        var regStr = "<" + tagName + "[\\s]*id=\"" + id + "\"[^>]*>([\\s\\S]*?)<\\/" + tagName +">";
        var reg = new RegExp(regStr, "gi");
        text = text.replace(reg, replacement);
        return text;
    },    
    
    renderFacet : function(facet, facetFieldsHtml, facets, moreFacetsCount){
      
      var facetRowHtml = this.facetRow_Prototype
      var facetValueRowHtml = this.facetValueRow_Prototype;
      
      if(facetFieldsHtml != ""){
          facetRowHtml = facetRowHtml.replace(/\[facet:name\]/gi, facet.id);
          facetRowHtml = facetRowHtml.replace(/\[facet:header\]/gi, facet.header);
          facetRowHtml = facetRowHtml.replace(/\[facet:valueList\]/gi, facetFieldsHtml);
          
          if(moreFacetsCount <= 0){
            facetRowHtml = facetRowHtml.replace(/\moreFacetsActive/gi, "moreFacetsInactive");
          }
      }else{
          facetRowHtml = "";
      }

      return facetRowHtml;
    },
    
    renderFacetField : function(facet, value, formattedValue, count, isActive){
      if(isActive) return "";
    
      formattedValue = this.convertFacetFieldValue(facet, formattedValue);
    
      var facetValueRowHtml = this.facetValueRow_Prototype;
      
      facetValueRowHtml = facetValueRowHtml.replace(/\[facet:name\]/gi, facet.id);
      facetValueRowHtml = facetValueRowHtml.replace(/\[facet:value\]/gi, value);
      facetValueRowHtml = facetValueRowHtml.replace(/\[facet:displayValue\]/gi, formattedValue);
      
      if(count > 0){
          facetValueRowHtml = facetValueRowHtml.replace(/\[facet:count\]/gi, count);
      }else{
          facetValueRowHtml = this.replaceTagWithClass("span", "count", facetValueRowHtml, "");
      }
      
      return facetValueRowHtml;
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
      var list = [];
      
      list["text/html"] = "Html";
      list["pdf"] = "PDF";
      
      return list;
    },    
    
    renderActiveFacet: function(facetFieldsHtml){
        if(facetFieldsHtml && facetFieldsHtml.length > 0){
            var html = "<ul>" + facetFieldsHtml + "</ul>";

            this.$activeFacets
                .hide()
                .html(html)
                .fadeIn('slow');
        }else{
            this.$activeFacets.html("");
        }
    },
    
    renderActiveFacetField : function(facet, value, formattedValue){
    
        var activeFacetHtml = this.activeFacetRow_prototype;
        activeFacetHtml = activeFacetHtml.replace(/\[activeFacet:header\]/gi, facet.activeHeader);
        activeFacetHtml = activeFacetHtml.replace(/\[activeFacet:name\]/gi, facet.id);
        activeFacetHtml = activeFacetHtml.replace(/\[activeFacet:value\]/gi, value);
        activeFacetHtml = activeFacetHtml.replace(/\[activeFacet:displayValue\]/gi, formattedValue);
        
        return activeFacetHtml;
    },
        
    renderEmptyResult : function(searchSuggestions){
        var html = [];
        
        var emptyResultsHtml = this.emptyResults_prototype;
        html.push(emptyResultsHtml);
        
        var len = searchSuggestions.length;
        if (len > 0) {
          var searchSuggestionHtml = this.searchSuggestions_Prototype
          searchSuggestionHtml = searchSuggestionHtml.replace(/\[searchsuggestion:suggestion\]/gi, value);
          html.push(searchSuggestionHtml);
        } 
    
        html = html.join("");
        this.$results.html(html);
    },     
    
    renderAutocompleteTerms : function(terms){
      
      var html = [];
      
      var autocompleteHtml = this.autocomplete_prototype;
      var autocompleteRowHtml = this.autocompleteRow_prototype;
      
      for(var i = 0; i < terms.length; i++){
        autocompleteRowHtml = autocompleteRowHtml.replace(/\[autocomplete:value\]/gi, terms[i].value);
        autocompleteRowHtml = autocompleteRowHtml.replace(/\[autocomplete:count\]/gi, terms[i].count);
        html.push(autocompleteRowHtml);
      }
      
      autocompleteHtml = autocompleteHtml.replace(/\[autocomplete:list\]/gi, html.join(""));
      
      this.$autocomplete
          .html(autocompleteHtml)
          .fadeIn(300);
      
    },
    
    renderComplete : function(data){

      var html = this.$activeFacets.html();

      if(html == null || html.length == 0){
          this.$noActiveFacets.show();
      }
    },     
    
    renderError: function(httpReq, ajaxOpts, thrownError){
      var errorMsgHtml = this.errorMsg_prototype;
      
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
          
          handler.handleSortClick(value);
          
          // Return false to avoid the a:href executing
          return false;
      });
    },  
    
    bindFacetClickHandler : function(handler){
    
      this.$facetRemoveHrefs.unbind('click').bind('click',function(){
          var id = $(this).parent().find("a").attr("facetname");
          var value = $(this).parent().find("a").attr("facetvalue");
          
          handler.handleFacetClick(id, value, false);
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
          
          var selector = "." + id + " div.moreFacets";
          var $moreFacets = $(selector, this.$inactiveFacets);
          
          selector = "." + id + " div.moreFacetsTxt";
          var $moreFacetsTxt = $(selector, this.$inactiveFacets);  
          
          selector = "." + id + " div.lessFacetsTxt";
          var $lessFacetsTxt = $(selector, this.$inactiveFacets);           
              
          if($moreFacets.css("display") == "none"){
          
              $moreFacets.slideDown("slow", function(){
                  $(this).show();
              });
              
              $moreFacetsTxt
                .removeClass("active")
                .addClass("inactive");
                
              $lessFacetsTxt
                .removeClass("inactive")
                .addClass("active");    
                            
          }else{
          
              $moreFacets.slideUp("slow", function(){
                $(this).hide();
              });
              
              $lessFacetsTxt
                .removeClass("moreFacetsActive")
                .addClass("moreFacetsInactive");
                
              $moreFacetsTxt
                .removeClass("moreFacetsInactive")
                .addClass("moreFacetsActive");               
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