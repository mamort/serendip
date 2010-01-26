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
    
    // Private variables holding JQuery references
    $results: null,
    $facetBoxInactive: null,
    $activeFacets: null,
    $inactiveFacets: null,
    $resultbar: null,
    $paging: null,
    $spellsuggestions: null,
    $footer: null,
    $autocomplete: null,
    $facetsInProgress: null,
    $resultsInProgress: null,
    $facetsInProgress: null,
    
    // Binding vars
    $sortbarHrefs: null,
    $spellSuggestionsHrefs: null,
    $facetRemoveHrefs: null,
    $facetHrefs: null,
    $facetsShowMoreHrefs: null,
    $pagingHrefs: null,
    
    preInit : function(){

        $results = $("#results");
        $facetBoxInactive = $("#facetBox #inactive");
        $activeFacets = $("#facets #activeFacets");
        $inactiveFacets = $("#facets #inactive");
        $resultbar = $("#resultbar");
        $paging = $("#Paging");
        $spellsuggestions = $("#SpellSuggestions");
        $footer = $("#footer");
        $autocomplete = $("#autocomplete");
        $resultsInProgress = $("#inProgress");
        $facetsInProgress = $("#facetsInProgress");
    },
    
    bindPreInit : function(){
        $sortbarHrefs = $("#sortbar a");
        $spellSuggestionsHrefs = $("#SpellSuggestions a");
        $facetRemoveHrefs = $("#facets div.facet span.remove");
        $facetHrefs = $("#facets div.facet a");
        $facetsShowMoreHrefs = $("#facets a.moreFacets");
        $pagingHrefs = $("#Paging li a");
    },

    renderInProgress : function(callback){
    
        $results.fadeTo(200, 0, function(){
            var height = $(this).height();
            if(height > 0)
                $resultsInProgress.height(height);
            $(this).hide();
            $resultsInProgress.show();
            
            callback();
        });

    },

    init : function(data){
        var numDocs = data.response.numFound; 
        
         $results.queue(function(){
            $results.fadeTo(200, 1, function(){
                $resultsInProgress.hide();
            });
            
            $(this).dequeue();
         });      
        
        dateFormat.i18n.dayNames = this.translation["Date:DayNames"];
        dateFormat.i18n.monthNames = this.translation["Date:MonthNames"];
        
        if(numDocs > 0)
          $activeFacets.html("");
    },
    
    renderHeader : function(numDocsFound, responseTimeInMillis, 
      sortValue, sortFields, sortDirection){
      
        var html = [];

        html.push("<div id=\"sortbar\"><span class='left'>");
        html.push(this.translation["renderHeader:LeftText"]);
        html.push("</span>");
        
        var currentSortHeader = this.translation["renderHeader:SortByRelevansHeader"];
        var isRelevansActive = isRelevansActive(sortValue);
        
        var sortHtml = renderSortValue("", currentSortHeader, isRelevansActive);  
        html.push(sortHtml);        
        
        for(var i = 0; i < sortFields.length; i++){
            var sField = sortFields[i].name; 
            var sFieldHeader = sortFields[i].header;
                        
            var isActive = isSortFieldActive(sField, sortValue);  
            
            if(isActive){
                currentSortHeader = sFieldHeader;
            }
            
            var sortHtml = renderSortValue(sField, sFieldHeader, isActive, sortDirection);  
            html.push(sortHtml);
        }
        
        html.push("<span class='right'><strong>");
        html.push(numDocsFound);
        html.push("</strong>");
        html.push(this.translation["renderHeader:RightText"]);
        html.push(currentSortHeader);
        html.push(". (");
        html.push(responseTimeInMillis);
        html.push(" ms)</span></div>");    
        
        html = html.join("");
        
        $resultbar.html(html);
        
        function isRelevansActive(sortValue){
            if(typeof(sortValue) == "undefined" || sortValue == "")
                return true
            else
                return false;
        }
        
        function renderSortValue(field, header, isActive, sortDirection){
            var html = [];
                                                
            if (isActive) {
                html.push("<div class='sort active'><a href='#' sort='"); 
            }else{
                html.push("<div class='sort'><a href='#' sort='"); 
            }
            
            if(sortDirection == "asc")
              sortDirection = "desc";
            else
              sortDirection = "asc";
            
            
            if(field.length > 0)
                html.push(field + " " + sortDirection);
                
            var title = header.substr(0, 1).toUpperCase() + header.substr(1);

            html.push("'>");
            html.push("<span class='text'>");
            html.push(title);   
            html.push("</span>");   
            
            if(field.length > 0 && isActive){
              if(sortDirection == "asc"){
                  html.push("<div class='sortDesc'></div>");
              }else{
                   html.push("<div class='sortAsc'></div>");
              }
            }
            
            html.push("</a></div> ");  
            
            return html.join("");
        }
        
        function isSortFieldActive(sortField, sortValue){
          if(sortValue.length > 0 && sortValue.substring(0,sortField.length) == sortField)
              return true;
          else
              return false;
        }
    },

    renderPager : function(currentPage, totalPages, windowStart, windowEnd){

        var html = [];
        html.push("<ul>");
        
        // Render previous page
        if(currentPage > 0){
          html.push("<li><a page='");
          html.push(currentPage-1);
          html.push("' href=''><< Previous</a></li>");
        }
        
        // Render pages
        for(var i = windowStart; i < windowEnd; i++){
          var page = i + 1;
          
          if(i == currentPage){
            html.push("<li><b>");
            html.push(page);
            html.push("</b></li>");
          }else{
            html.push("<li><a page='");
            html.push(i);
            html.push("' href=''>");
            html.push(page);
            html.push("</a></li>");
          }
        }
        
        // Render next page
        if(currentPage < totalPages-1){
          html.push("<li><a page='");
          html.push(currentPage+1);
          html.push("' href=''>Next >></a></li>");
        }
        
        html.push("</ul>");
        
        if(totalPages > 1){
            $paging.html(html.join(""));
        }else{
            $paging.html("");
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
        
        var title = this.getParam(fields, "key_title", "");

        if(title == ""){
            title = this.getParam(fields, "title", "No title available for this document");
        }
        
        html.push("<li><div class=\"resulttitle\"><a href=\"");
        html.push(this.getParam(fields, "url", ""));
        html.push("\">");
        html.push(title);
        html.push("</a></div>");
        
        var paragraph = this.getParamRestrictChars(fields, "tika_paragraphs", "No description available", 600);
        
        // Format ISO date into displayed date format
        var moddate = this.getParamAsDate(fields, "moddate", "dd.mm.yyyy HH:MM", "No date available")
        
        html.push("<div class=\"resultbody\">");
        html.push(paragraph);
        html.push(" ...</div>");
 
        html.push("<div class=\"resultfooter\"><a href='");
        html.push(this.getParam(fields, "url", ""));
        html.push("'>");
        html.push(this.getParam(fields, "url", ""));
        html.push("</a><span class='date'>");
        html.push(moddate);
        html.push("</span></div></li>");
        
        return html.join("");
    },   
    
    renderSpellSuggestions: function(suggestions){
        var html = "";
        if(suggestions.length > 0)
            html = this.translation["renderSpellSuggestions:DidYouMean"] + " <a href='#'>" + suggestions[0] + "</a>";
            
        $spellsuggestions
            .hide()
            .html(html)
            .fadeIn('slow');
    },
    
    renderDocuments : function(docsHtml){
        var html = "<ul>" + docsHtml + "</ul>";

        $results
            .hide()
            .html(html)
            .fadeIn('slow');
    },
    
    renderFacets : function(facetsHtml, facets){
        $inactiveFacets
            .hide()
            .html(facetsHtml)
            .fadeIn('slow');
    },
    
    renderFacet : function(facet, facetFieldsHtml, facets, moreFacetsCount){
      
      var html = [];
      
      // No matches
      if(facetFieldsHtml == ""){
          facetFieldsHtml = this.translation["renderFacet:NoMatches"];
      }
      
      html.push("<div class='facet ");
      html.push(facet.name);
      html.push("'><h1>");
      html.push(facet.header);
      html.push("</h1>");
      
      html.push("<ul>");
      html.push(facetFieldsHtml);
      html.push("</ul>");
            
      if(moreFacetsCount > 0){
          html.push("<a class='moreFacets' facetname='");
          html.push(facet.id);
          html.push("'>");
          html.push(this.translation["renderFacet:ShowMore"]);
          html.push("</a>");
      }
      
      html.push("</div>");
      
      return html.join("");
    },
    
    renderFacetField : function(facet, value, formattedValue, count, isActive){
      var checkedStr = "";
      var html = [];
  
      formattedValue = this.convertFacetFieldValue(facet, formattedValue);   
          
      if(!isActive){
        html.push("<li><a href='#' active='false' facetname='");
        html.push(facet.id);
        html.push("' facetvalue='");
        html.push(value);
        html.push("'>");
        html.push(formattedValue);
        html.push("</a>");
        
        // -1 returned for facets that cannot display counts
        if(count > -1){
            html.push("<span class='count'>(");
            html.push(count);
            html.push(")</span></li>");  
        }  
      }
      
      return html.join("");
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

            $activeFacets
                .hide()
                .html(html)
                .fadeIn('slow');
        }
    },
    
    renderActiveFacetField : function(facet, value, formattedValue){
        var html = [];
        
        html.push("<li><span class='header'>");
        html.push(facet.activeHeader);
        html.push(": </span><a href='#' active='true' facetname='");
        html.push(facet.id);
        html.push("' facetvalue='");
        html.push(value);
        html.push("'>");
        html.push(formattedValue);
        html.push("</a>");
        html.push("<span class='remove' facetname='");
        html.push(facet.name);
        html.push("' facetvalue='");
        html.push(value);
        html.push("'></span></li>");   
        
        return html.join("");
    },
        
    renderEmptyResult : function(searchSuggestions){
        var html = [];
        
        html.push("<div id=\"zerohits\"><h1>");
        html.push(this.translation["renderEmptyResult:NoHits"]);
        html.push("</h1>");
    
        var len = searchSuggestions.length;
        if (len > 0) {
          html.push(this.translation["renderEmptyResult:SearchSuggestions"]);
          html.push("<span id=\"searchsuggestion\">");
          html.push(searchSuggestions[len-1]);
          html.push("</span>");
        } else {
          html.push(this.translation["renderEmptyResult:NoSearchSuggestions"]);
        }
    
        html = html.join("");
    
        $results.html(html);
        $footer.html("");
    },     
    
    renderAutocompleteTerms : function(terms){
      
      var html = [];
      
      html.push("<ul>");
      
      for(var i = 0; i < terms.length; i++){
        html.push("<li><span>");
        html.push(terms[i].value);
        html.push("</span> (");
        html.push(terms[i].count);
        html.push(")</li>");
      }
      
      html.push("</ul>");
      
      html = html.join("");
      
      $autocomplete
          .html(html)
          .fadeIn(300);
      
    },
    
    renderComplete : function(data){

      var html = $activeFacets.html();

      if(html == null || html.length == 0){
          $activeFacets.html(this.translation["renderFacets:NoActiveFacets"]);
      }
    },     
    
    renderError: function(httpReq, ajaxOpts, thrownError){
      var html = "<span class='error'>Could not communicate with remote server.<span>";
      $results
          .hide()
          .html(html)
          .fadeIn('slow');
    },
    
    bindSuggestClickHandler: function(handler){
      $spellSuggestionsHrefs.unbind('click').bind('click', function(){
          var text = $(this).text();
          handler.handleSuggestClick(text);
          
          // Return false to avoid the a:href executing
          return false;
      });
    },
    
    bindSortClickHandler : function(handler){

      $sortbarHrefs.unbind('click').bind('click', function(){
 
          var value = $(this).attr("sort");
          
          handler.handleSortClick(value);
          
          // Return false to avoid the a:href executing
          return false;
      });
    },  
    
    bindFacetClickHandler : function(handler){
    
      $facetRemoveHrefs.unbind('click').bind('click',function(){
          var id = $(this).parent().find("a").attr("facetname");
          var value = $(this).parent().find("a").attr("facetvalue");
          
          handler.handleFacetClick(id, value, false);
      });
   
      $facetHrefs.unbind('click').bind('click',function(){

          var id = $(this).attr("facetname");
          var value = $(this).attr("facetvalue");
          
          var isActive = $(this).attr("active");

          if(isActive == "false"){
            isActive = true;
          }else{
            isActive = false;         
          }

          handler.handleFacetClick(id, value, isActive);
          
          // Return false to avoid the a:href executing
          return false;
      });
    }, 
    
    bindShowMoreFacetsClickHandler : function(handler){
      $facetsShowMoreHrefs.unbind('click').bind('click', function(){
          
          var id = $(this).attr("facetname");
          
          var element = handler.handleShowMoreFacetsClick(id, $(this).parent());
          
          if(element.css("display") == "none"){
          
              element.slideDown("slow", function(){
                $(this).show();
              });
              
              $(this).text("Show less");
          }else{
              element.slideUp("slow", function(){
                $(this).hide();
              });
              
              $(this).text("Show more");
          }
          
          return false;
      });
    },
    
    bindPagingClickHandler : function(handler){
      $pagingHrefs.unbind('click').bind('click', function(){
          var page = $(this).attr("page");
            
          handler.handlePagingClick(page);
       
          // Return false to avoid the a:href executing
          return false;
      });
    }     
    
});