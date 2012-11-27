
$(document).ready(function(){
	/*
    Here you can add more facets
	If a facet is not displayed it MIGHT be because there were NO matching values in the data
	*/
  
  // Example simple facet / filter
  
  var cityFacet = Serendip.Facet(serendip);
  cityFacet.id = "City";
  cityFacet.selected = true, // If it is initially displayed
  cityFacet.name = "City", // This is the name in Solr schema
  cityFacet.activeHeader = "City", // The header used when displaying active facets
  cityFacet.header = "Filter by city", // The header used when displaying available facets
  cityFacet.minFacetsToDisplay = 5, // Facets shown
  cityFacet.maxFacetsToDisplay = 30, // Facets that can be shown by by clicking "show more" link

  /*  
  var cityFacet = new Serendip.Facet({
      id: "City", // Must be unique for all filters/facets. Used in the url.
      selected: true, // If it is initially displayed
      name: "City", // This is the name in Solr schema
      activeHeader: "City", // The header used when displaying active facets
      header: "Filter by city", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30, // Facets that can be shown by by clicking "show more" link
  })
  
  var countyFacet = new Serendip.Facet({
      id: "County", // Must be unique for all filters/facets. Used in the url.
      selected: true, // If it is initially displayed
      name: "County", // This is the name in Solr schema
      activeHeader: "County", // The header used when displaying active facets
      header: "Filter by county", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30, // Facets that can be shown by by clicking "show more" link
      
      getFormattedValue : function(value){ // Override how values are formatted
        return value;
      }      
  });
  
  var childrenFacet = new Serendip.RangeFacet({
      id: "Children", // Must be unique for all filters/facets. Used in the url.
      selected: true, // If it is initially displayed
      name: "Children", // This is the name in Solr schema
      activeHeader: "Children", // The value used when displaying active facets
      header: "Filter by children", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30, // Facets that can be shown by by clicking "show more" link
      
      rangeStart: 0,
      rangeEnd: 20,
      rangeGap: 3   
  }); 
  
  
  var childrenQuery = new Serendip.QueryFacet({
      id: "ChildrenQuery", // Must be unique for all filters/facets. Used in the url.
      selected: true, // If it is initially displayed
      name: "Children", // This is the name in Solr schema
      activeHeader: "Children", // The value used when displaying active facets
      header: "Filter by children2", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30, // Facets that can be shown by by clicking "show more" link
  });    
  
  
  childrenQuery.addQuery({header: "0 til 2", query: "[0 TO 2]"})
  childrenQuery.addQuery({header: "3 til 5", query: "[3 TO 5]"})
  
  serendip.addFacet(childrenQuery);
    
  var dateFacet = new Serendip.DateFacet({
      id: "Birthdate",
      selected: true,
      name: "Birthdate",
      activeHeader: "Birthdate",
      header: "Filter by birthdate",

      minFacetsToDisplay: 5,
      maxFacetsToDisplay: 10,

      dateStart: "NOW/YEAR-100YEARS", // Uses Solr/Lucene constants
      dateEnd: "NOW/YEAR+1YEAR",
      dateGap: "+10YEAR",

      dateFormat: "yyyy", // Look in documentation for all available formats
      sortDir: "desc", // Or 'asc' for ascending
      
      getFormattedValue : function(value){ // Override how dates are formatted
        //var from = convertIsoDate(value.from, this.dateFormat);
       // var to = convertIsoDate(value.to, this.dateFormat);
        
        var from = Serendip.Utils.formatISODate(value.from, this.dateFormat);
        var to = Serendip.Utils.formatISODate(value.to, this.dateFormat);        
        return  from + " - " + to;
      }
  });
  
  
  countyFacet.addSubFacet(dateFacet);
  cityFacet.addSubFacet(countyFacet);
  

  serendip.addFacet(childrenFacet);
  
  // Date facet
  //serendip.addFacet(dateFacet);  
  */
 
   serendip.addFacet(cityFacet);
});