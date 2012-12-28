Serendip.InactiveFacetsView = (function(serendip, view, prototype){
    var my = {};
    
    serendip.on("render.facets.inactive", function(facets, visibleFacets) {
        my.render(visibleFacets);
        my.bindEvents();
        
        serendip.trigger("render.inactivefacets.done", facets);
    });     
    
    my.filterByFacet = function(id, value){
        serendip.trigger("facet.add", {id: id, value: value});      
    };
    
    my.search = function(){
        serendip.search();
    };
    
    my.bindEvents = function() {
        // Implementations must override this method
    };
    
    my.render = function(visibleFacets){
        // Implementations must override this method
    };    
    
    return my;
});
