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
        
        this.serendip.on("views.init.done", function(){
            self.serendip.trigger("init.facets.core", self);
        });
        
        this.serendip.on("initFromQueryStr", function(queryStr, paramsMap){
            self.activeFacetQueries = new Object();
            
            for (var i = 0; i < self.facets.length; i++) {
                var facet = self.facets[i];
                var key = facet.id + "_param";
                if(paramsMap[key]){
                    var values = paramsMap[key];
                    
                    facetQuery = new Object();
                    facetQuery.id = facet.id;
                    facetQuery.values = values.split(",");
                    
                    self.activeFacetQueries[facet.id] = facetQuery;
                }
            }
            

        });                 
        
        this.serendip.on("saveInQueryStr", function(save){
            var query = "";
            for (var id in self.activeFacetQueries) {

                var facetConfig = self.facetIdToFacetMap[id];
                var facet = self.activeFacetQueries[id];
                var values = facet.values;
                
                if(values && values.length > 0){
                    save(id, values.join(","), 6);
                }   
            }
        });  
        
        this.serendip.on("buildRequest", function(save){    
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

            if (i < facets.length - 1){
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