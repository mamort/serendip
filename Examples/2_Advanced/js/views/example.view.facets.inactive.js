Example.InactiveFacetsView = (function(serendip, view, prototype){
    var my = Serendip.InactiveFacetsView(serendip, view, prototype);
    
    my.bindEvents = function() {
        view.find(".facetRow a").off('click').on('click', function() {
            var facet = $(this);

            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");

            my.filter(id, value);

            // Return false to avoid the a:href executing
            return false;
        });
    };

    my.render = function(facets){
        var html = renderAllFacets(facets);
        view.html(html);        
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
