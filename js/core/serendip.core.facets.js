Serendip.Facets = (function(serendip){
    var my = {};
    
    var activeFacetQueries = {};
    var facetIdToFacetMap = null;
    var facets = null;
    
    serendip.on("views.init", function() {
        init();
    });
    
    my.getActiveFacetsQueriesMap = function() {
        return activeFacetQueries;
    };

    my.getActiveFacetsMap = function() {
        return facetIdToFacetMap;
    };

    function init() {
        facets = serendip.facets;

        facetIdToFacetMap = [];

        for (var k in facets) {
            var facet = facets[k];
            facetIdToFacetMap[facet.id] = facet;
        }

        serendip.on("views.init.done", function() {
            serendip.trigger("init.facets.core", my);
        });

        serendip.on("initFromQueryStr", function(queryStr, paramsMap) {
            activeFacetQueries = {};

            for (var i = 0; i < facets.length; i++) {
                var theFacet = facets[i];
                var key = theFacet.id + "";
                if (paramsMap[key]) {
                    var values = paramsMap[key];

                    var facetQuery = {};
                    facetQuery.id = theFacet.id;
                    facetQuery.values = values.split(",");

                    activeFacetQueries[theFacet.id] = facetQuery;
                }
            }

        });

        serendip.on("saveInQueryStr", function(save) {
            for (var id in activeFacetQueries) {
                var activeFacet = activeFacetQueries[id];
                var values = activeFacet.values;

                if (values && values.length > 0) {
                    save(id, values.join(","), 6);
                }
            }
        });

        serendip.on("buildRequest", function(save) {
            var query = getFacetsAsQueryString();
            save("&facet=true&" + query);

            var activeQuery = getActiveFacetsQuery();
            save("&" + activeQuery);
        });

        serendip.on("facet.remove", function(removedFacet) {
            handleFacetClick(removedFacet.id, removedFacet.value, false);
        });

        serendip.on("facet.add", function(addedFacet) {
            handleFacetClick(addedFacet.id, addedFacet.value, true);
        });
    };

    function getActiveFacetsQuery() {
        var facetQueryArr = [];

        for (var id in activeFacetQueries) {

            var facet = facetIdToFacetMap[id];
            var facetQuery = activeFacetQueries[id];

            if (facetQuery.values.length > 0) {
                var query = facet.getActiveQuery(facetQuery.values);
                facetQueryArr.push(query);
            }
        }

        if (facetQueryArr.length > 0)
            return "&" + facetQueryArr.join("&");
        else
            return "";
    };

    function getFacetsAsQueryString() {
        var query = "";

        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];

            query += facet.getQuery();
            if (i < facets.length - 1) {
                query = query + "&";
            }

        }

        return query;
    };

    function handleFacetClick(id, value, isActive) {
        value = decodeURIComponent(value);

        var facet = facetIdToFacetMap[id];
        var facetQuery = activeFacetQueries[id];

        if (!facetQuery) {
            facetQuery = {};
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

        activeFacetQueries[id] = facetQuery;
    };
    
    return my;
}(serendip));
