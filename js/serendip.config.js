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
 
$(document).ready(function(){
    var search = new Serendip.Search({
      solrBaseUrl: "http://localhost:8983/solr",
      numResults: 5,
      maxFacetsToDisplay: 4,
      
      searchFieldId: "#querystring",
      searchBtnId: "#searchbutton", 
      
      theme : mytheme
    });

    // Set fields here or specify them in the request handler Solr config
    search.setFields(["id","key_title", "title", "description","news_release_date", "url", "key_revisor"]);
    search.setAutocompleteField("key_revisor");
    
    search.addSortField(new Serendip.SortField({name: "news_release_date", header: "date"}));
    
    // Use DISMAX request handler
    search.addQueryParam("qt", "dismax"); 
    
    // Enable facets
    search.addQueryParam("facet", "true");
    search.addQueryParam("facet.mincount", "1");
    search.addQueryParam("facet.limit", "20");
    
    // Enable highlighting
    search.addQueryParam("hl", "true");
    
    // Enable spellchecking 
    // Make sure to configure spellcheck component to be used in RequestHandler 
    // Issue "spellcheck.build=true" once to build the dictionary
    search.addQueryParam("spellcheck", "true");
    
    // Highlighting fields (separate with ["","",""])
    search.setHighlightFields(["text"]);

    // Number of characters to use for highlighting
    search.addQueryParam("hl.fragsize", "500");
    
    // Page type facet
    search.addFacet(new Serendip.Facet({
      id: "pagetype",
      name: "page_type", 
      activeHeader: "Page Type", 
      header: "Filter by page type", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10
    }));
    
    // Key revisor facet
    search.addFacet(new Serendip.Facet({
      id: "revisor",
      name: "key_revisor", 
      activeHeader: "Revisor", 
      header: "Filtrer etter revisor", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10
    }));
    
    // News release date facet [dynamic range]
    search.addFacet(new Serendip.DateFacet({
      id: "news",
      name: "news_release_date", 
      activeHeader: "Release date", 
      header: "Filter by news release date", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10,
      
      dateStart: "NOW/MONTH-5MONTHS",
      dateEnd: "NOW/MONTH+1MONTH",
      dateGap: "+1MONTH",
      
      dateFormat: "mmmm"
    }));
    
    // News release date facet [custom range]
    search.addFacet(new Serendip.CustomDateFacet({
      id: "news2",
      name: "news_release_date", 
      activeHeader: "Release date", 
      header: "Filter by news release date", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10,
      
      getFacetValues: function(){
        var values = [];
        
        values.push(new Serendip.CustomDateFacetValue({name: "Last 3 months", value: "NOW-3MONTHS TO NOW"}));
        values.push(new Serendip.CustomDateFacetValue({name: "Last 5 years", value: "NOW-5YEAR TO NOW"}));
        
        return values;
      }
         
    }));
    
    
    
    search.init("search.html");     
    
    $("#querystring").focus();
});
    