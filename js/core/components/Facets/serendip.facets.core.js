Serendip.Facet = Serendip.Class.extend({
    facetType: "text",
    name: null,
    activeHeader: null,
    header: null,
    minFacetsToDisplay: null,
    maxFacetsToDisplay: null
});

/* Note: Range facets not supported yet in 1.4 */
Serendip.RangeFacet = Serendip.Facet.extend({
    facetType: "range",
    rangeStart: null,
    rangeEnd: null,
    rangeGap: null
});

Serendip.QueryFacet = Serendip.Facet.extend({
    facetType: "query",
    queries: null
});


Serendip.DateFacet = Serendip.Facet.extend({
    facetType: "date",
    dateStart: null,
    dateEnd: null,
    dateGap: null,
    dateFormat: null,
    sortDir: "asc",
    
    getFormattedValue : function(value){
        var from = convertIsoDate(value.from, this.dateFormat);
        var to = convertIsoDate(value.to, this.dateFormat);
        return  from + " - " + to;
    }
});



Serendip.FacetsCore = Serendip.Class.extend({
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
        
        this.serendip = serendip;
        this.facetIdToFacetMap = [];

        for (var k in this.facets) {
            var facet = this.facets[k];
            this.facetIdToFacetMap[facet.id] = facet;
        }

        this.serendip.on("facet.remove", function(facet) {
            self.handleFacetClick(facet.id, facet.value, false);
        });
        
        this.serendip.on("facet.add", function(facet) {
            self.handleFacetClick(facet.id, facet.value, true);
        });        
    },

    initFromQueryStr : function(queryStr) {
        this.buildActiveFacetQueries(queryStr);
    },

    buildActiveFacetQueries : function(queryStr) {
        var facetsFilters = this.parseFacets(queryStr, this.facets);

        this.activeFacetQueries = new Object();
        for (var i = 0; i < facetsFilters.length; i++) {
            var id = facetsFilters[i].id;
            this.activeFacetQueries[id] = facetsFilters[i];
        }
    },

    getActiveFacetsQuery : function() {
        var facetQueryArr = [];

        for (var id in this.activeFacetQueries) {

            var facetConfig = this.facetIdToFacetMap[id];
            var facet = this.activeFacetQueries[id];

            var query = "";
            var paramName = "fq={!tag=" + id + "}" + facetConfig.name;

            if (facet.values.length > 0) {
                query = paramName + ":(";

                for (var i = 0; i < facet.values.length; i++) {

                    var value = encodeURIComponent(facet.values[i]);

                    if (facetConfig.facetType == "text") {
                        query += "\"" + value + "\" ";
                    } else if (facetConfig.facetType == "date") {
                        query += "[" + value + "] ";
                    }
                }

                if (facetConfig.facetType == "query") {
                    var index = facet.values.length - 1;
                    var value = facet.values[index];
                    query += value;
                }

                query += ")";

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
            var name = facet.name;
            var type = facet.facetType;

            if (type == "text") {
                query += "facet.field={!ex=" + facet.id + "}" + name;

            } else if (type == "range") {
                query += "facet.range={!ex=" + facet.id + "}" + name;
                var datekey = "&f." + name + ".facet.range";
                query += datekey + ".start=" + encodeURIComponent(facet.rangeStart);
                query += datekey + ".end=" + encodeURIComponent(facet.rangeEnd);
                query += datekey + ".gap=" + encodeURIComponent(facet.rangeGap);

            } else if (type == "query") {
                var len = facet.queries.length;
                for (var k = 0; k < len; k++) {
                    var facetQuery = facet.queries[k];
                    query += "facet.query={!ex=" + facet.id + " key=" + facet.id + "range[" + k + "]}" + name + ":" + facetQuery.query;

                    if (k < len - 1) {
                        query += "&";
                    }
                }
            } else if (type == "date") {
                query += "facet.date={!ex=" + facets[i].id + "}" + name;
                var datekey = "&f." + name + ".facet.date";
                query += datekey + ".start=" + encodeURIComponent(facets[i].dateStart);
                query += datekey + ".end=" + encodeURIComponent(facets[i].dateEnd);
                query += datekey + ".gap=" + encodeURIComponent(facets[i].dateGap);
            }

            if (i < facets.length - 1)
                query = query + "&";
        }

        return query;
    },

    parseFacets : function(queryStr, configFacets) {

        var facets = [];
        for (var i = 0; i < configFacets.length; i++) {
            var configFacet = configFacets[i];

            var paramName = "fq={!tag=" + configFacet.id + "}";

            if (queryStr.indexOf(paramName) > 0) {
                var querySplit = queryStr.split(paramName);
                var value = querySplit[1];

                if (value.indexOf("&") > 0)
                    value = value.split("&")[0];

                var facetArr = "";
                if (value.indexOf(":(") > 0)
                    facetArr = value.split(":(");
                else
                    facetArr = value.split(":[");

                var facet = new Object();

                facet.id = configFacet.id;
                facet.name = facetArr[0];

                facet.query = paramName + value;

                if (value.indexOf(":(") > 0) {
                    facet.values = [];

                    var facetArrValues = facetArr[1].substring(0, facetArr[1].length - 1);
                    facetArrValues = facetArrValues.trim();

                    var vals = "";

                    if (configFacet.facetType == "text") {
                        vals = facetArrValues.split(/\"\s/);

                        for (var k = 0; k < vals.length; k++) {
                            var val = vals[k].replace(/\"/g, "").trim();
                            facet.values.push(val);
                        }
                    } else if (configFacet.facetType == "query") {

                        facet.values.push(facetArrValues.trim());

                    } else if (configFacet.facetType == "date") {
                        vals = facetArrValues.split("]");

                        for (var k = 0; k < vals.length; k++) {
                            var val = vals[k].replace(/\[/g, "");
                            val = val.replace(/]/g, "").trim();

                            if (val.length > 0)
                                facet.values.push(val);
                        }
                    }

                } else {
                    facet.value = facetArr[1].substring(0, facetArr[1].length - 1);
                }

                facets.push(facet);
            }

        }

        return facets;
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
    },

    convertFacetFieldValue : function(facet, value) {
        var converted = value;

        if (facet.id == "contenttype") {
            converted = this.convertContentTypeFacetValue(value);
        }

        return converted;
    },

    convertContentTypeFacetValue : function(value) {
        var convertedValue = value;

        value = value.toLowerCase();
        var convertionList = this.getFacetContentTypeConvertions();

        for (var key in convertionList) {
            if (value.indexOf(key) > -1) {
                convertedValue = convertionList[key];
                break;
            }
        }

        return convertedValue;
    },

    getFacetContentTypeConvertions : function() {
        var list = new Object();

        list["text/html"] = "Html";
        list["pdf"] = "PDF";
        list["text/plain"] = "Text";
        list["application/msword"] = "Word";

        return list;
    }
}); 