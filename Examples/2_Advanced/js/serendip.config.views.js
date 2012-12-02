$(document).ready(function() {

    /*
     Potentially you can modify this file, but be careful if you do so.
     You can:
     - Remove a view that you do not need
     - Add your own view that is implemented like the others in js/core/components
     */
    Serendip.SearchView(serendip, $("#SearchView"));
    Serendip.SortingView(serendip, $(".view"));
    Serendip.ResultPrPageView(serendip, $("#ResultsPrPage"));
    Serendip.ResultView(serendip, $("#ResultView"), $("#Results_Prototype_TableView"));
    Serendip.ResultInfoView(serendip, $("#ResultInfoView"), $("#ResultInfo_Prototype"));
    Serendip.InProgressView(serendip, $("#ResultsInProgressView"));
    Serendip.PagerView(serendip, $("#PagerView"), $("#Pager_Prototype"));
    Serendip.FacetsView(serendip, $("#Facets_Theme"), $("#Prototypes"));
});

