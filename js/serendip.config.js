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
 
$(document).ready(function(){
    var search = new Serendip.Search({
      solrBaseUrl: "http://localhost:8080/solr",
      numResults: 5,
      maxFacetsToDisplay: 6,
      
      searchFieldId: "#queryInput",
      searchBtnId: "#searchbutton", 
      autocompleteId: "#Autocomplete_Theme",
      autocompleteValuesSelector: "li span.value",
      
      theme : mytheme
    });

    // Set fields to search in here or specify them in the request handler Solr config
    search.setFields(["id", "contents", "title","date", "url"]);
    
    search.setDefaultFieldValues({  contents:"No description available", 
                                    title:"No title available"});    
                                    
    search.setDateFieldFormat({date: "dd.mm.yyyy HH:MM"});
    
    search.setAutocompleteField("title");
    
    search.addSortField(new Serendip.SortField({name: "date", header: "date"}));
    
    // Use DISMAX request handler
    search.addQueryParam("qt", "dismax"); 
    
    // Enable facets
    search.addQueryParam("facet", "true");
    search.addQueryParam("facet.mincount", "1");
    search.addQueryParam("facet.limit", "20");
    
    // Enable highlighting
    search.addQueryParam("hl", "true");
    search.addQueryParam("hl.fragmenter", "regex");
    
    search.addQueryParam("hl.regex.pattern", "\w[^\.!\?]{40,600}[\.!\?]");
    
    // Highlighting fields (separate with ["","",""])
    search.setHighlightFields(["title", "contents"]);
        
    // Basically says that if we dont have a highlighted text, get the text to display from the contents field
    // When that happens, use a maximum of 600 characters from the contents field
    search.addQueryParam("f.contents.hl.alternateField", "contents");
    search.addQueryParam("f.contents.hl.maxAlternateFieldLength", "600");
    
    // Number of characters to use for highlighting
    search.addQueryParam("hl.fragsize", "250"); 
    search.addQueryParam("hl.snippets ", "3");
      
    // Enable spellchecking 
    // Make sure to configure spellcheck component to be used in RequestHandler 
    // Issue "spellcheck.build=true" once to build the dictionary
    search.addQueryParam("spellcheck", "true");
    
    // Person facet
    search.addFacet(new Serendip.Facet({
      id: "person",
      name: "person", 
      activeHeader: "Person", 
      header: "Filter by person", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10
    }));
    
    // Content type facet
    search.addFacet(new Serendip.Facet({
      id: "type",
      name: "type", 
      activeHeader: "Type", 
      header: "Filter by type", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10
    }));    
    
    
    // Date facet [dynamic range]
    search.addFacet(new Serendip.DateFacet({
      id: "date",
      name: "date", 
      activeHeader: "Date", 
      header: "Filter by date", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10,
      
      dateStart: "NOW/YEAR-5YEARS",
      dateEnd: "NOW/YEAR+1YEAR",
      dateGap: "+1YEAR",
      
      dateFormat: "yyyy",
      sortDir: "desc"
    }));
    
    
    search.init("index.html");     
    
    $("#queryInput").focus();
});
    