$(document).ready(function() {

    /*
     Potentially you can modify this file, but be careful if you do so.
     You can:
     - Remove a view that you do not need
     - Add your own view that is implemented like the others in js/core/components
     */

    serendip.addView(new Serendip.SearchView({
        view: $("#SearchView")
    }));

    serendip.addView(new Serendip.ResultInfoView({
        view: $("#ResultInfoView"),
        prototype: $("#ResultInfo_Prototype")
    }));

    serendip.addView(new Serendip.ResultPrPageView({
        view: $("#ResultsPrPage")
    }));

    serendip.addView(new Serendip.SortingView({
        view: $(".view")
    }));

    serendip.addView(new Serendip.PagerView({
        view : $("#PagerView"),
        prototype : $("#Pager_Prototype"),
        windowSize : 5,
        pages : 10
    }));

    serendip.addView(new Serendip.ResultView({
        view : $("#ResultView"),
        prototype : $("#Results_Prototype_TableView"),
        resultsToDisplay : 5
    }));

    serendip.addView(new Serendip.InProgressView({
        view : $("#ResultsInProgressView"),
    }));

    var facetView = new Serendip.FacetsView({
        view: $("#Facets_Theme"),
        prototypes: $("#Prototypes"),

        maxFacetsToDisplay : 5
    });
    
    serendip.addView(facetView);
});

