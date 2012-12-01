Serendip.ActiveFacetsView = (function(serendip, view, prototype){
    var my = {};
    
    var inactiveElement = null;
    
    serendip.on("views.init", function(){
        init();    
    });
    
    serendip.on("render.facets.active", function(activeFacets){
        renderActiveFacets(activeFacets);
        bindEvents();
    }); 

    function init() {
        inactiveElement = view.find(".inactive");
        inactiveElement.hide();                  
    };

    function bindEvents() {
        var self = this;

        view.find("span.remove").off('click').on('click', function() {
            var facet = $(this).parent().find("a");
            triggerFacetClick(facet);

            // Return false to avoid the a:href executing
            return false;
        });

        view.find("a").off('click').on('click', function() {
            triggerFacetClick($(this));

            // Return false to avoid the a:href executing
            return false;
        });
    };
    
    function triggerFacetClick(facet) {
        var id = facet.attr("facetname");
        var value = facet.attr("facetvalue");

        serendip.trigger("facet.remove", {id : id, value : value});
        serendip.search();
    };

    function renderActiveFacets(activeFacets) {
        renderActiveFacet(activeFacets);

        if (activeFacets.length == 0) {
            view.html(inactiveElement.html());
        }
    };
    
    function renderActiveFacet(facetFields) {
        if (facetFields && facetFields.length > 0) {
            serendip.trigger("render.view", view, prototype, {"activeFacet" : facetFields});
        } else {
            view.html("");
        }
    };
    
    return my;
});
