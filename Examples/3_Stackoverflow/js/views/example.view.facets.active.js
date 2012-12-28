Example.ActiveFacetsView = (function(serendip, view, prototype){
    var my = Serendip.ActiveFacetsView(serendip, view, prototype);
     
    var _inactiveElement = null; 
     
    serendip.on("views.init", function(){
        _inactiveElement = view.find(".inactive");
        _inactiveElement.hide();       
    });   
    
    my.render = function(activeFacets){
        renderActiveFacets(activeFacets);
    };      
    
    my.bindEvents = function() {
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

        my.handleFacetClick(id, value);
    };        
    
    function renderActiveFacets(activeFacets) {
        renderActiveFacet(activeFacets);

        if (activeFacets.length == 0) {
            view.html(_inactiveElement.html());
        }
    };
    
    function renderActiveFacet(facetFields) {
        if (facetFields && facetFields.length > 0) {
            Example.TemplateHelper.render(view, prototype, {"activeFacet" : facetFields});
        } else {
            view.html("");
        }
    };    
     
    return my;
});
