    /*
    Here you can add more facets
    If a facet is not displayed it MIGHT be because there were NO matching values in the data
    */
  
  // Example simple facet / filter
  var cityFacet = Serendip.Facet(serendip);
  cityFacet.id = "City"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  cityFacet.selected = true; // If it is initially displayed
  cityFacet.name = "City"; // This is the name in Solr schema
  cityFacet.activeHeader = "City"; // The header used when displaying active facets
  cityFacet.header = "Filter by city"; // The header used when displaying available facets
  cityFacet.minFacetsToDisplay = 5; // Facets shown
  cityFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link


  var countyFacet = Serendip.Facet(serendip);
  countyFacet.id = "County"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  countyFacet.selected = true; // If it is initially displayed
  countyFacet.name = "County"; // This is the name in Solr schema
  countyFacet.activeHeader = "County"; // The header used when displaying active facets
  countyFacet.header = "Filter by county"; // The header used when displaying available facets
  countyFacet.minFacetsToDisplay = 5; // Facets shown
  countyFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link  
  
  countyFacet.getFormattedValue = function(value){ 
        return value; // Override how facet values are formatted
  };
  
  
  var childrenFacet = Serendip.RangeFacet(serendip);
  childrenFacet.id = "Children"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  childrenFacet.selected = true; // If it is initially displayed
  childrenFacet.name = "Children"; // This is the name in Solr schema
  childrenFacet.activeHeader = "Children"; // The header used when displaying active facets
  childrenFacet.header = "Filter by children"; // The header used when displaying available facets
  childrenFacet.minFacetsToDisplay = 5; // Facets shown
  childrenFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link  
  childrenFacet.rangeStart = 0;
  childrenFacet.rangeEnd = 20;
  childrenFacet.rangeGap = 3;
  
  
  var childrenQueryFacet = Serendip.QueryFacet(serendip);
  childrenQueryFacet.id = "ChildrenQuery"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  childrenQueryFacet.selected = true; // If it is initially displayed
  childrenQueryFacet.name = "Children"; // This is the name in Solr schema
  childrenQueryFacet.activeHeader = "Children"; // The header used when displaying active facets
  childrenQueryFacet.header = "Filter by children"; // The header used when displaying available facets
  childrenQueryFacet.minFacetsToDisplay = 5; // Facets shown
  childrenQueryFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link    
  
  childrenQueryFacet.addQuery({header: "0 til 2", query: "[0 TO 2]"})
  childrenQueryFacet.addQuery({header: "3 til 5", query: "[3 TO 5]"})
  
  
  var birthdateFacet = Serendip.DateFacet(serendip);
  birthdateFacet.id = "Birthdate"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  birthdateFacet.selected = true; // If it is initially displayed
  birthdateFacet.name = "Birthdate"; // This is the name in Solr schema
  birthdateFacet.activeHeader = "Birthdate"; // The header used when displaying active facets
  birthdateFacet.header = "Filter by birthdate"; // The header used when displaying available facets
  birthdateFacet.minFacetsToDisplay = 5; // Facets shown
  birthdateFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link  
  birthdateFacet.dateStart = "NOW/YEAR-100YEARS"; // Uses Solr/Lucene constants
  birthdateFacet.dateEnd = "NOW/YEAR+1YEAR";
  birthdateFacet.dateGap = "+10YEAR";
  birthdateFacet.dateFormat = "yyyy"; // Look in documentation for all available formats
  birthdateFacet.sortDir = "desc"; // Or 'asc' for ascending
  
  
  birthdateFacet.getFormattedValue = function(value){ // Override how dates are formatted
        var from = Serendip.Utils.formatISODate(value.from, this.dateFormat);
        var to = Serendip.Utils.formatISODate(value.to, this.dateFormat);        
        return from + " - " + to;
  };
  
    countyFacet.addSubFacet(birthdateFacet);
    cityFacet.addSubFacet(countyFacet);

    serendip.addFacet(childrenQueryFacet);
    serendip.addFacet(childrenFacet);
    serendip.addFacet(cityFacet);