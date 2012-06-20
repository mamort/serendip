
$(document).ready(function(){

    /*
      Potentially you can modify this file, but be careful if you do so.
      You can:
        - Remove a view that you do not need
        - Add your own view that is implemented like the others in js/core/components
    */

    serendip.addView(new Serendip.SearchView({
            searchFieldSelector: "#queryInput",
            searchButtonSelector: "#searchbutton"
        })
    );
	
    serendip.addView(new Serendip.ResultInfoView({
            selector: "#ResultBar_Theme",
            prototypeSelector: "#ResultInfo_Prototype"
        })
    );
    
    serendip.addView(new Serendip.ResultPrPageView({
            selector: "#ResultsPrPage",
            prototypeSelector: "#ResultsPrPage_Prototype"
        })
    );
	
    serendip.addView(new Serendip.SortingView({
            selector: "#queryInput",
            prototypeSelector: "#searchbutton"
        })
    );

    serendip.addView(new Serendip.PagerView({
            selector: "#PagerView",
            prototypeSelector: "#Pager_Prototype",
            windowSize: 5,
            pages: 10
        })
    );

    serendip.addView(new Serendip.ResultView({
            selector: "#ResultView",
            prototypeSelector: "#Results_Prototype_TableView",
            inProgressSelector: "#ResultsInProgress_Theme",
            resultsToDisplay: 5
        })
    );
    
    var facets = serendip.facets;
	
    var facetCore = new Serendip.FacetsCore({
        facets: facets
    });
            
    var activeFacetView = new Serendip.ActiveFacetsView({
        configuredFacets: facets,
        
        activeFacetsSelector: "#ActiveFacets_Theme",
        noActiveFacetsSelector: "#NoActiveFacets_Theme",
        activeFacetsPrototype: "#ActiveFacets_Prototype",
        facetsRemoveSelector: "span.remove",
        
        facetRowPrototypeSelector: "#FacetRow_Prototype",

        maxFacetsToDisplay: 5
    });
        
    var facetView = new Serendip.FacetsView({
        configuredFacets: facets,
        
        inactiveFacetsSelector: "#InactiveFacets_Theme",
        facetsInProgressSelector: "#facetsInProgress",
        facetViewSelector: "#Facets_Theme",
        
        facetRowPrototypeSelector: "#FacetRow_Prototype",

        maxFacetsToDisplay: 5
    });
        
    activeFacetView.facetCore = facetCore;
    facetView.facetCore = facetCore;
    
    serendip.addView(activeFacetView);
    serendip.addView(facetView);    
});

