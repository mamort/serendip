Serendip.FacetsRenderActive = (function(serendip){
    var my = {};
    
    var _facetsCore = null;
    
    init();

    function init() {
        serendip.on("init.facets.core", function(facetsCore) {
            _facetsCore = facetsCore;
        });

        serendip.on("render", function() {
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
