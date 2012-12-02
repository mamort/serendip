Serendip.InactiveFacetsView = (function(serendip, view, prototype){
    var my = {};
    
    var showMoreFacetsView = null;
    
    Serendip.ShowMoreFacetsView(serendip, view, prototype);
    
    serendip.on("render.facets.inactive", function(facets, visibleFacets) {
        my.render(visibleFacets);
        
        serendip.trigger("render.facets.showmore", facets);
        my.bindEvents();
    });     
    
    my.filter = function(id, value){
        serendip.trigger("facet.add", {id: id, value: value});
        serendip.search();
    };

    my.bindEvents = function() {
        // Implementations must override this method
    };
    
    my.render = function(){
        // Implementations must override this method
    };    
    
    function renderAllFacets(facets){
        var facetHtmlRows = [];
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var html = renderFacet(data.facet, data.values);
            facetHtmlRows.push(html);
        }

        return facetHtmlRows.join("");
    };

    function renderFacet(facet, facetFieldsData) {
        if (facetFieldsData == "")
            return "";

        var facets = serendip.facets;

        var facetData = {
            "facetName" : facet.id,
            "facetHeader" : facet.header
        };

        var facetRowData = {
            "facetRow" : facetFieldsData
        };

        var facetsElement = prototype.clone();
        facetsElement = facetsElement.find(".Placeholder").autoRender(facetData);
        
        var facetValues = facetsElement.find(".FacetValues");
        facetValues.autoRender(facetRowData);

        return facetsElement.html();
    };
    
    return my;
});
