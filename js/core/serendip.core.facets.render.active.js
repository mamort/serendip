Serendip.FacetsRenderActive = Serendip.Class.extend({
    serendip : null,
    facetsCore : null,

    init : function(serendip) {
        var self = this;

        this.serendip = serendip;

        this.serendip.on("init.facets.core", function(facetsCore) {
            self.facetsCore = facetsCore;
        });

        this.serendip.on("render", function(data) {
            var activeFacets = self.createActiveFacets();
            self.serendip.trigger("render.facets.active", activeFacets);
        });
    },

    createActiveFacets : function() {
        var activeFacetData = [];

        var queries = this.facetsCore.getActiveFacetsQueriesMap();
        var facetMap = this.facetsCore.getActiveFacetsMap();

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
    }
});
