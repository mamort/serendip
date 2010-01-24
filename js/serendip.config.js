
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
    
    search.addSortField(new Serendip.SortField({name: "news_release_date", header: "dato"}));
    
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
      header: "Filtrer etter type", 
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
    
    // Event country facet
    search.addFacet(new Serendip.Facet({
      id: "eventcountry",
      name: "event_country", 
      activeHeader: "Event Country", 
      header: "Filtrer etter land", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10
    }));    
    

    // News release date facet [dynamic range]
    search.addFacet(new Serendip.DateFacet({
      id: "news",
      name: "news_release_date", 
      activeHeader: "Release date", 
      header: "Filter by release date", 
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
      header: "Filtrer etter utgivelsesdato", 
      minFacetsToDisplay: 5, 
      maxFacetsToDisplay: 10,
      
      getFacetValues: function(){
        var values = [];
        
        values.push(new Serendip.CustomDateFacetValue({name: "Siste tre mnd", value: "NOW-3MONTHS TO NOW"}));
        values.push(new Serendip.CustomDateFacetValue({name: "Siste 5 år", value: "NOW-5YEAR TO NOW"}));
        
        return values;
      }
         
    }));
    
    
    
    search.init("search.html");     
    
    $("#querystring").focus();
});
    