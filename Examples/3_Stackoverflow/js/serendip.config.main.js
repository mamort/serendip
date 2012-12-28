
// Add the url to you solr server
serendip.setSolrUrl("http://localhost:8080/solr/Core1/select");

serendip.addQueryParam("defType", "edismax");
serendip.addQueryParam("qf", "title_text^2 body_text");

// Add more available fields
// name: specifies name of field in Solr schema
// id: unique identifier for field
// isEnabled: If true data for the field will be returned
// You will want to keep name and id short if you want to support older browsers because some browsers (IE 7-) do not support arbitrarily long urls
serendip.addFieldConfig({ name: "id", id: "Id", header: "ID", isEnabled: false });
serendip.addFieldConfig({ name: "PostTitle", id: "Title", header: "Title", isEnabled: true, decodeContent: true });
serendip.addFieldConfig({ name: "PostBody", id: "Body", header: "Body", isEnabled: true, decodeContent: true });
serendip.addFieldConfig({ name: "PostTag", id: "Tag", header: "Tag", isEnabled: true, isMultivalue: true, separator: ",", decodeContent: true });
serendip.addFieldConfig({ name: "PostAnswerCount", id: "AnswerCount", header: "Answers", isEnabled: true, defaultValue: 0 });
serendip.addFieldConfig({ name: "PostFavoriteCount", id: "VoteCount", header: "Votes", isEnabled: true, defaultValue: 0 });
serendip.addFieldConfig({ name: "PostViewCount", id: "ViewCount", header: "Views", isEnabled: true, defaultValue: 0 });
serendip.addFieldConfig({ name: "PostCreationDate", id: "CreationDate", header: "Creationdate", isEnabled: true, isDate: true, dateFormat: "dd.mm.yyyy"});

serendip.enableAllFields(true);


$(document).ready(function(){

    // Views
    Example.SearchView(serendip, $("#SearchView"));
    Example.SortingView(serendip, $("#SortingView"));
    Example.ResultPrPageView(serendip, $("#ResultsPrPage"));
    Example.ResultView(serendip, $("#ResultView"), $("#Results_Prototype_TableView"));
    Example.ResultInfoView(serendip, $("#ResultInfoView"), $("#ResultInfo_Prototype"));
    Example.InProgressView(serendip, $("#ResultsInProgressView"));
    Example.PagerView(serendip, $("#PagerView"), $("#Pager_Prototype"));
    Example.FacetsView(serendip, $("#Facets_Theme"));
    Example.InactiveFacetsView(serendip, $("#InactiveFacets_Theme"), $("#FacetRow_Prototype"));
    Example.ActiveFacetsView(serendip, $("#ActiveFacets_Theme"), $("#ActiveFacets_Prototype"));
    Example.InactiveFacetsShowMoreFacetsView(serendip, $("#InactiveFacets_Theme"), $("#FacetRow_Prototype"));

    serendip.init();    
    $("#queryInput").focus();
});
   