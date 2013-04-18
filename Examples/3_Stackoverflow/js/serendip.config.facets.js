    /*
    Here you can add more facets
    If a facet is not displayed it MIGHT be because there were NO matching values in the data
    */
  
  // Example simple facet / filter
  var tagsFacet = Serendip.Facet(serendip);
  tagsFacet.id = "Tags"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  tagsFacet.selected = true; // If it is initially displayed
  tagsFacet.name = "PostTag"; // This is the name in Solr schema
  tagsFacet.activeHeader = "Tags"; // The header used when displaying active facets
  tagsFacet.header = "Filter by tags"; // The header used when displaying available facets
  tagsFacet.minFacetsToDisplay = 5; // Facets shown
  tagsFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link
  tagsFacet.sort = "index";
  tagsFacet.prefix = "asp";
  
  var answerFacet = Serendip.RangeFacet(serendip);
  answerFacet.id = "Answers"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  answerFacet.selected = true; // If it is initially displayed
  answerFacet.name = "PostAnswerCount"; // This is the name in Solr schema
  answerFacet.activeHeader = "Answers"; // The header used when displaying active facets
  answerFacet.header = "Filter by answers count"; // The header used when displaying available facets
  answerFacet.minFacetsToDisplay = 5; // Facets shown
  answerFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link  
  answerFacet.rangeStart = 0;
  answerFacet.rangeEnd = 200;
  answerFacet.rangeGap = 10;
  
  var creationDateFacet = Serendip.DateFacet(serendip);
  creationDateFacet.id = "CreationDate"; // Must be unique for all filters/facets. Used to identify the facet in the url.
  creationDateFacet.selected = true; // If it is initially displayed
  creationDateFacet.name = "PostCreationDate"; // This is the name in Solr schema
  creationDateFacet.activeHeader = "Creation date"; // The header used when displaying active facets
  creationDateFacet.header = "Filter by creation date"; // The header used when displaying available facets
  creationDateFacet.minFacetsToDisplay = 5; // Facets shown
  creationDateFacet.maxFacetsToDisplay = 30; // Facets that can be shown by by clicking "show more" link  
  creationDateFacet.dateStart = "NOW/YEAR-100YEARS"; // Uses Solr/Lucene constants
  creationDateFacet.dateEnd = "NOW/YEAR+1YEAR";
  creationDateFacet.dateGap = "+1YEAR";
  creationDateFacet.dateFormat = "yyyy"; // Look in documentation for all available formats
  creationDateFacet.sortDir = "desc"; // Or 'asc' for ascending
  
serendip.addFacet(creationDateFacet);
serendip.addFacet(tagsFacet);
serendip.addFacet(answerFacet);