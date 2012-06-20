
$(document).ready(function(){

	var facets = [];
	
	/*
    Here you can add more facets
	*/
  
  // Example simple facet / filter
  facets.push(new Serendip.Facet({
      id: "name", // Must be unique for all filters/facets
      selected: true, // If it is initially displayed
      name: "name_opf_s", // This is the name in Solr schema
      activeHeader: "Name", // The header used when displaying active facets
      header: "Filter by name", // The header used when displaying available facets
      minFacetsToDisplay: 5, // Facets shown
      maxFacetsToDisplay: 30 // Facets that can be shown by by clicking "show more" link
  }));

  // Date facet [dynamic range]
  facets.push(new Serendip.DateFacet({
      id: "date",
      selected: true,
      name: "date_opf_d",
      activeHeader: "Date",
      header: "Filter by date",

      minFacetsToDisplay: 5,
      maxFacetsToDisplay: 10,

      dateStart: "NOW/YEAR-10YEARS", // Uses Solr/Lucene constants
      dateEnd: "NOW/YEAR+1YEAR",
      dateGap: "+1MONTH",

      dateFormat: "mmmm yyyy", // Look in documentation for all available formats
      sortDir: "desc" // Or 'asc' for ascending
  }));
	
	serendip.facets = facets;
});