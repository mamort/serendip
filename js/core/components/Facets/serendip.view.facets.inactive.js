Serendip.InactiveFacetsView = (function(serendip, view, prototype){
    var my = {};
    
    var maxFacetsToDisplay = 5;
    var showMoreFacetsView = null;
    
    Serendip.ShowMoreFacetsView(serendip, view, prototype);
    
    serendip.on("render.facets.inactive", function(facets, visibleFacets) {
        var html = renderAllFacets(visibleFacets);
        view.html(html);
        
        serendip.trigger("render.facets.showmore", facets);
        bindEvents();
    });     

    function bindEvents() {
        view.find(".facetRow a").off('click').on('click', function() {
            var facet = $(this);

            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");
            var isActive = facet.attr("active");

            serendip.trigger("facet.add", {id: id, value: value});
            serendip.search();

            // Return false to avoid the a:href executing
            return false;
        });
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
