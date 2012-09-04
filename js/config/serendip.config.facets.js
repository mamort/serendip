
$(document).ready(function(){

	var facets = [];
	
	/*
    Here you can add more facets
	If a facet is not displayed it MIGHT be because there were NO matching values in the data
	*/
  
  // Example simple facet / filter
  facets.push(new Serendip.Facet({
      id: "City", // Must be unique for all filters/facets
      selected: true, // If it is initially displayed
      name: "City", // This is the name in Solr schema
      activeHeader: "City", // The header used when displaying active facets
      header: "Filter by city", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30 // Facets that can be shown by by clicking "show more" link
  }));
  
  facets.push(new Serendip.Facet({
      id: "County", // Must be unique for all filters/facets
      selected: true, // If it is initially displayed
      name: "County", // This is the name in Solr schema
      activeHeader: "County", // The header used when displaying active facets
      header: "Filter by county", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30 // Facets that can be shown by by clicking "show more" link
  }));  
  
  // Date facet
  facets.push(new Serendip.DateFacet({
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
      sortDir: "desc" // Or 'asc' for ascending
  }));  

	serendip.facets = facets;
});