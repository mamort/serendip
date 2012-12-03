Serendip.ActiveFacetsView = (function(serendip, view, prototype){
    var my = {};
    
    var inactiveElement = null;
        
    serendip.on("render.facets.active", function(activeFacets){
        my.render(activeFacets);
        my.bindEvents();
    }); 

    function init() {
        inactiveElement = view.find(".inactive");
        inactiveElement.hide();                  
    };
    
    my.render = function(activeFacets){
        // Implementations must override this method
    };

    my.bindEvents = function() {
        // Implementations must override this method
    };
    
    my.handleFacetClick = function(id, value) {
        serendip.trigger("facet.remove", {id : id, value : value});
        serendip.search();
    };
    
    return my;
});
