Serendip.FacetsRenderActive = (function(serendip){
    var my = {};
    
    _facetsCore = null;
    
    init(serendip);

    function init(serendip) {
        serendip.on("init.facets.core", function(facetsCore) {
            _facetsCore = facetsCore;
        });

        serendip.on("render", function(data) {
            var activeFacets = createActiveFacets();
            serendip.trigger("render.facets.active", activeFacets);
        });
    };

    function createActiveFacets() {
        var activeFacetData = [];

        var queries = _facetsCore.getActiveFacetsQueriesMap();
        var facetMap = _facetsCore.getActiveFacetsMap();

        for (var id in queries) {
            var facetQuery = queries[id];
            var facet = facetMap[id];

            // Skip non-active facets
            if (facetQuery.values.length == 0)
                continue;

            for (var i = 0; i < facetQuery.values.length; i++) {
                var val = facetQuery.values[i];

                var data = facet.processActive(val);
                activeFacetData.push(data);
            }
        }

        return activeFacetData;
    };
    
    return my;
}(serendip));
