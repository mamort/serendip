Serendip.QueryFacet = (function (serendip) {
    var my = Serendip.Facet(serendip);
    
    my.facetType = "query";
    var queries = [];
    
    my.addQuery = function(query){
        queries.push(query);  
    };

    my.getQuery = function() {
        var query = "";
        var len = queries.length;
        for (var k = 0; k < len; k++) {
            var facetQuery = queries[k];
            query += "facet.query={!ex=" + my.id + " key=" + my.id + "range[" + k + "]}" + my.name + ":" + facetQuery.query;

            if (k < len - 1) {
                query += "&";
            }
        }

        return query;
    };
    
    my.getFacetValue = function(value){
       return value.value;
    };
    
    my.getFormattedValue = function(value) {
        return value.formattedValue;
    };      
    
    my.getActiveQueryValues = function(values){
        var index = values.length - 1;
        var value = values[index];
        return value;
    };      

    my.process = function(data) {
        var facetqueries = data.facet_counts.facet_queries;
        var facetValues = [];

        for (var k = 0; k < queries.length; k++) {
            var query = queries[k];
            var id = my.id + "range[" + k + "]";
            var count = facetqueries[id];

            facetValues.push({
                formattedValue : query.header,
                value : query.query
            });

            facetValues.push(count);
        }

        return facetValues;
    };

    my.processActive = function(value) {

        var formattedValue = value;
        for (var k in queries) {
            var query = queries[k];

            if (query.query == value) {
                formattedValue = query.header;
            }
        }

        var encodedValue = encodeURIComponent(value);
        return processActiveField(encodedValue, formattedValue);
    };
    
    return my;
});
