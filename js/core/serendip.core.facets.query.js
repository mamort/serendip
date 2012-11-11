Serendip.QueryFacet = Serendip.Facet.extend({
    facetType : "query",
    queries : [],
    
    addQuery : function(query){
        this.queries.push(query);  
    },

    getQuery : function() {
        var query = "";
        var len = this.queries.length;
        for (var k = 0; k < len; k++) {
            var facetQuery = this.queries[k];
            query += "facet.query={!ex=" + this.id + " key=" + this.id + "range[" + k + "]}" + this.name + ":" + facetQuery.query;

            if (k < len - 1) {
                query += "&";
            }
        }

        return query;
    },
    
    getFacetValue : function(value){
       return value.value;
    }, 
    
    getFormattedValue : function(value) {
        return value.formattedValue;
    },       
    
    getActiveQueryValues : function(values){
        var index = values.length - 1;
        var value = values[index];
        return value;
    },      

    process : function(data) {
        var facetqueries = data.facet_counts.facet_queries;
        var facetValues = [];

        for (var k = 0; k < this.queries.length; k++) {
            var query = this.queries[k];
            var id = this.id + "range[" + k + "]";
            var count = facetqueries[id];

            facetValues.push({
                formattedValue : query.header,
                value : query.query
            });

            facetValues.push(count);
        }

        return facetValues;
    },

    processActive : function(value) {

        var formattedValue = value;
        for (var k in this.queries) {
            var query = this.queries[k];

            if (query.query == value) {
                formattedValue = query.header;
            }
        }

        var encodedValue = encodeURIComponent(value);
        return this.processActiveField(encodedValue, formattedValue);
    }
});
