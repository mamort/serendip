Serendip.Facets = Serendip.Class.extend({
    activeFacetQueries : new Object(),
    facetIdToFacetMap : null,
    facets : null,
    serendip : null,

    getActiveFacetsQueriesMap : function() {
        return this.activeFacetQueries;
    },

    getActiveFacetsMap : function() {
        return this.facetIdToFacetMap;
    },

    init : function(serendip) {
        var self = this;

        this.facets = serendip.facets;

        this.serendip = serendip;
        this.facetIdToFacetMap = [];

        for (var k in this.facets) {
            var facet = this.facets[k];
            this.facetIdToFacetMap[facet.id] = facet;
        }

        this.serendip.on("views.init.done", function() {
            self.serendip.trigger("init.facets.core", self);
        });

        this.serendip.on("initFromQueryStr", function(queryStr, paramsMap) {
            self.activeFacetQueries = new Object();

            for (var i = 0; i < self.facets.length; i++) {
                var facet = self.facets[i];
                var key = facet.id + "_param";
                if (paramsMap[key]) {
                    var values = paramsMap[key];

                    facetQuery = new Object();
                    facetQuery.id = facet.id;
                    facetQuery.values = values.split(",");

                    self.activeFacetQueries[facet.id] = facetQuery;
                }
            }

        });

        this.serendip.on("saveInQueryStr", function(save) {
            var query = "";
            for (var id in self.activeFacetQueries) {

                var facetConfig = self.facetIdToFacetMap[id];
                var facet = self.activeFacetQueries[id];
                var values = facet.values;

                if (values && values.length > 0) {
                    save(id, values.join(","), 6);
                }
            }
        });

        this.serendip.on("buildRequest", function(save) {
            var query = self.getFacetsAsQueryString(self.facets);
            save("&facet=true&" + query);

            var query = self.getActiveFacetsQuery();
            save("&" + query);
        });

        this.serendip.on("facet.remove", function(facet) {
            self.handleFacetClick(facet.id, facet.value, false);
        });

        this.serendip.on("facet.add", function(facet) {
            self.handleFacetClick(facet.id, facet.value, true);
        });
    },

    getActiveFacetsQuery : function() {
        var facetQueryArr = [];

        for (var id in this.activeFacetQueries) {

            var facet = this.facetIdToFacetMap[id];
            var facetQuery = this.activeFacetQueries[id];

            if (facetQuery.values.length > 0) {
                var query = facet.getActiveQuery(facetQuery.values);
                facetQueryArr.push(query);
            }
        }

        if (facetQueryArr.length > 0)
            return "&" + facetQueryArr.join("&");
        else
            return "";
    },

    getFacetsAsQueryString : function(facets) {
        var query = "";

        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];

            query += facet.getQuery();
            if (i < facets.length - 1) {
                query = query + "&";
            }

        }

        return query;
    },

    handleFacetClick : function(id, value, isActive) {
        value = decodeURIComponent(value);

        var facet = this.facetIdToFacetMap[id];
        var facetQuery = this.activeFacetQueries[id];

        if (!facetQuery) {
            facetQuery = new Object();
            facetQuery.id = facet.id;
            facetQuery.values = [];
        }

        if (isActive) {
            facetQuery.values.push(value);
        } else {

            var vals = [];

            for (var i = 0; i < facetQuery.values.length; i++) {
                if (facetQuery.values[i] != value) {
                    vals.push(facetQuery.values[i]);
                }
            }

            facetQuery.values = vals;
        }

        this.activeFacetQueries[id] = facetQuery;
    }
});
